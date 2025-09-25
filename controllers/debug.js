// const path = require('path');

const debug = (req, res) => {
  const debugInfo = {
    status: 'OK',
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
    appStatus: 'Running',
    errorLogs: []
  };
  res.json(debugInfo);
};

module.exports = {debug};
