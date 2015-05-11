var mongoose = require('mongoose');
var Configurator = require('../modules/configurator');
var logger = require('../modules/logger');

var configuration = Configurator.load('mongo_stores');

var databases = {};

Object.keys(configuration).forEach(function (db_name){
  var db = mongoose.createConnection(configuration[db_name].uri);
  databases[db_name] = db;
  db.on('error', function(){
    logger.error(db_name + ' MongoDB connection error ');
  });
  db.once('open', function (callback) {
    logger.trace(db_name + ' MongoDB connected');
  });

});

exports.close = function() {
  Object.keys(databases).forEach(function (db_name){
    databases[db_name].close(function () {
      logger.trace(db_name + ' MongoDB connection closed');
    });
  });
};


function closeDB(){
    // db.close(function () {
    //     logger.trace(connection_name + ' MongoDB connection closed');
    // });
}

// process.on('SIGINT', closeDB);
// process.on('SIGTERM', closeDB);
//process.on('exit', closeDB);

exports.getDB = function (db_name) {
  return databases[db_name];
};
