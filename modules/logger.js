/**
 *
 * @authors Ismael Gorissen,
 *          Julien Biezemans
 * @company EASAPP
 * @license Commercial
 */

var winston = require('winston');
var path = require('path');
var moment = require('moment');
var DevnullTransports = require('devnull/transports');
var Configurator = require('./configurator');
var WinstonBridge = require('./logger/WinstonBridge');

require('winston-loggly');

var configuration = Configurator.load('logger');
var transports = [];
var levels = {
  data: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  trace: 5
};
var colors = {
  data: 'grey',
  debug: 'cyan',
  info: 'green',
  warn: 'yellow',
  error: 'red',
  trace: 'magenta'
};
var logger = null;


// grabbing the script name
var proc_name = path.basename(process.argv[1]).split('.')[0];

configuration.transports.forEach(function (transportConfig) {
  var Ctor = getTransportConstructor(transportConfig.type);
  var options = transportConfig.options;
  if (transportConfig.type === 'File' && !options.filename)
    options.filename = path.join(__dirname, '..', 'logs', "pepitpictures" + '.log');

  if (options.timestamp){
    options.timestamp = function() {
      var src = transportConfig.type === 'File' ? (': ' + proc_name) : '';
      return moment().format('DD-MM-YY HH[h]mm ss.SS') + src;
    };
  }

  var transport = new Ctor(transportConfig.options);
  transports.push(transport);

});

logger = new winston.Logger({
  transports: transports,
  levels: levels,
  colors: colors
});

if (typeof logger.transports.loggly === "object") {
  logger.transports.loggly.client.config = {};

  Object.defineProperty(logger.transports.loggly.client.config, 'inputUrl', {
    value: 'https://logs-01.loggly.com/inputs/',
    enumerable: true,
    configurable: true
  });
}

logger.attachDevnullLogger = function (devnullLogger) {
  devnullLogger.remove(DevnullTransports.stream);
  devnullLogger.use(WinstonBridge, { logger: logger });
};

function getTransportConstructor(type) {
  var ctor = winston.transports[type];

  if (!ctor)
    throw new Error('Unknown logger type "' + type + '"');

  return ctor;
}

module.exports = logger;
