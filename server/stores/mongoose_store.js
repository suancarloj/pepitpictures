const mongoose = require('mongoose');
const Configurator = require('../modules/configurator');
const debug = require('debug')('mongodb:configuration')
const config = require('config');
const configuration = config.get('mongo');

const databases = {};

Object.keys(configuration).forEach(function (db_name){
  const db = mongoose.createConnection(configuration[db_name].uri);
  databases[db_name] = db;
  db.on('error', function(){
    debug(db_name + ' MongoDB connection error ');
  });
  db.once('open', function (callback) {
    debug(db_name + ' MongoDB connected');
  });

});

exports.close = function() {
  Object.keys(databases).forEach(function (db_name){
    databases[db_name].close(function () {
      debug(db_name + ' MongoDB connection closed');
    });
  });
};

exports.getDB = function (db_name) {
  return databases[db_name];
};
