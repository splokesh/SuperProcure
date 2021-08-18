const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;

const bcrypt = require("bcrypt");

// const { NotFound, NotAuthenticated } = require("../api/util/errors");
// const Constants = require("../api/util/helper/constants");
// const StatusConstants = require("../api/util/helper/status");

passport.serializeUser((user, cb) => {
	cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
	User.findOne(
		{
			id,
		},
		(err, user) => {
			cb(err, user);
		},
	);
});

passport.use(
	new LocalStrategy(
		{
			usernameField: "email",
			passportField: "password",
			passReqToCallback: true,
		},
		async (req, email, password, done) => {
			try {
				const UserCollection = User.getDatastore().manager.collection(
					User.tableName,
				);

				const userExist = await UserCollection.aggregate(
					[
						{ $match: { email } },
						{
							$lookup: {
								from: "Organization",
								foreignField: "_id",
								localField: "org",
								as: "org",
							},
						},
					],
					{ collation: { locale: "en", strength: 2 } },
				).toArray();

				if (!userExist.length) return done(new NotFound("User Not Found"));

				if (userExist.length > 1)
					return done(
						new NotAuthenticated("something went wrong!.please contact admin"),
					);
				const user = userExist[0];

				// eslint-disable-next-line prefer-destructuring
				user.org = user.org[0];
				user.id = user._id.toString();
				const { recaptchaToken } = req.body;
				if (user.status === "DISABLED")
					return done(new NotAuthenticated("User has been disabled"));
				const { loginData: { failedLoginAttempts = 0 } = {} } = user;
				const checkCaptcha = failedLoginAttempts >= 3;
				if (user.loginData && checkCaptcha && !recaptchaToken) {
					// return done(null, null, { type: Constants.G_CAPTCHA_NOT_FOUND });
					const { body, transKey } = StatusConstants.gcaptchaFailed;
					return done(
						new NotAuthenticated("Invalid captcha", body, {
							transKey,
						}),
					);
				}
				if (checkCaptcha) {
					const captchares = await sails.helpers.verifyCaptcha.with({
						token: recaptchaToken,
					});
					if (!captchares) {
						const { body, transKey } = StatusConstants.gcaptchaFailed;
						return done(
							new NotAuthenticated("Invalid captcha", body, {
								transKey,
							}),
						);
					}
				}

				return bcrypt.compare(password, user.password, (error, res) => {
					if (error) return done(error);
					if (!res)
						return done(null, user, {
							type: Constants.INVALID_CREDENTIALS,
						});
					// eslint-disable-next-line no-param-reassign
					delete user.password;
					// eslint-disable-next-line no-param-reassign
					user.name = `${user.firstName} ${user.lastName}`;
					return done(null, user, { type: Constants.LOGIN_SUCCESS });
				});
			} catch (err) {
				done(err);
			}
		},
	),
);
