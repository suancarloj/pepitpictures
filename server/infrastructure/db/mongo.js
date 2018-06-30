const debug = require('debug')('infrastructure:mongo');
const mongoose = require('mongoose');
const config = require('config');

const connectWithRetry = function() {
  return mongoose.connect(config.mongo, function(err) {
    if (err) {
      console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
      setTimeout(connectWithRetry, 5000);
    }
  });
};
connectWithRetry();
