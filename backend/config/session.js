/**
 * Session Configuration
 * (sails.config.session)
 *
 * Use the settings below to configure session integration in your app.
 * (for additional recommended settings, see `config/env/production.js`)
 *
 * For all available options, see:
 * https://sailsjs.com/config/session
 */

module.exports.session = {
  name: "pc.sid",
  secret: process.env.SESSION_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
    domain: process.env.COOKIE_DOMAIN,
  },
  saveUninitialized: false,
  resave: false,
  adapter: "connect-mongo",
  url: process.env.MONGODB_URL,
  collection: "Session",
}
