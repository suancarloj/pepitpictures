const debug = require('debug')('infrastructure:mongo');

const connect = function connect(mongoose, connectionString) {
  mongoose.connect(connectionString, {
    useMongoClient: true,
    reconnectTries: Number.MAX_VALUE,
  });

  // CONNECTION EVENTS
  // When successfully connected
  mongoose.connection.on('connected', () => {
    debug('Connected to mongodb');
  });

  // If the connection throws an error
  mongoose.connection.on('error', (err) => {
    debug('MongoDb error', err);
  });

  // When the connection is disconnected
  mongoose.connection.on('disconnected', (err) => {
    const runningIntegrationTests = !!process.env.NODE_ENV;
    if (!runningIntegrationTests) { debug('MongoDb disconnected', err); }
  });
};

module.exports = connect;
