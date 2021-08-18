/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * (for additional recommended settings, see `config/env/production.js`)
 *
 * For more information on configuration, check out:
 * https://sailsjs.com/config/http
 */

module.exports.http = {

  /****************************************************************************
  *                                                                           *
  * Sails/Express middleware to run for every HTTP request.                   *
  * (Only applies to HTTP requests -- not virtual WebSocket requests.)        *
  *                                                                           *
  * https://sailsjs.com/documentation/concepts/middleware                     *
  *                                                                           *
  ****************************************************************************/

  middleware: {

    /***************************************************************************
    *                                                                          *
    * The order in which middleware should be run for HTTP requests.           *
    * (This Sails app's routes are handled by the "router" middleware below.)  *
    *                                                                          *
    ***************************************************************************/

    order: [
      "cookieParser",
      "session",
      "passportInit",
      "passportSession",
      "bodyParser",
      "compress",
      "poweredBy",
      "router",
      "www",
      "favicon",
    ],

    poweredBy: false,

    bodyParser: (function _configureBodyParser() {
      const skipper = require("skipper");
      const middlewareFn = skipper({ strict: true, limit: "50mb" });
      return middlewareFn;
    })(),

    passportInit: (function () {
      return require("passport").initialize();
    })(),

    // eslint-disable-next-line func-names
    passportSession: (function () {
      return require("passport").session();
    })(),
  },

};
