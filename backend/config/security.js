/**
 * Security Settings
 * (sails.config.security)
 *
 * These settings affect aspects of your app's security, such
 * as how it deals with cross-origin requests (CORS) and which
 * routes require a CSRF token to be included with the request.
 *
 * For an overview of how Sails handles security, see:
 * https://sailsjs.com/documentation/concepts/security
 *
 * For additional options and more information, see:
 * https://sailsjs.com/config/security
 */

module.exports.security = {
  cors: {
    allRoutes: true,
    allowOrigins: process.env.ALLOW_ORIGINS.split(","),
    allowRequestHeaders: ["Authorization", "Content-Type", "X-CSRF-Token"],
    allowResponseHeaders: [
      "Authorization",
      "X-CSRF-Token",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Credentials",
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Accept-Charset",
      "Accept-Encoding",
    ],
    allowCredentials: true, // Allows cookies to be send along the request
    allowRequestMethods: "GET, POST, PATCH, DELETE, OPTIONS, HEAD",
  },
};
