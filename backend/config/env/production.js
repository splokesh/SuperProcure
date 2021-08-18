module.exports = {

  port: 5000,
  log: {
    level: "verbose",
  },
  migrate: "safe",
  LOG_QUERIES: true,

  datastores: {
    default: {
      url: process.env.MONGODB_URL,
    },
  },
};