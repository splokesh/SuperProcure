const bcrypt = require("bcrypt");

exports.hashPassword = async (pwd) => {
	return bcrypt.hashSync(pwd, bcrypt.genSaltSync(10));
};
