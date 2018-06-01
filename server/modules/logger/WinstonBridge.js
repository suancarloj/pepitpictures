/**
 *
 * @authors Ismael Gorissen,
 *          Julien Biezemans
 * @company EASAPP
 * @license Commercial
 */

var util = require('util');
var DevnullTransports = require('devnull/transports');

/**
 *
 * @param logger
 * @param options
 * @constructor
 */
function WinstonBridge(logger, options) {
    DevnullTransports.transport.apply(this, arguments);

    // set the correct name
    this.name = 'WinstonBridge';
    this.winstonLogger = options.logger;
}

// Inherit from DevnullTransports class
util.inherits(WinstonBridge, DevnullTransports.transport);

/**
 * Write a message on the console.
 *
 * @param type
 * @param namespace
 * @param args
 * @returns {WinstonBridge}
 */
WinstonBridge.prototype.write = function write(type, namespace, args) {
    var levelMap = {
        alert: 'error',
        critical: 'error',
        error: 'error',
        warning: 'warn',
        metric: 'info',
        notice: 'info',
        info: 'info',
        log: 'debug',
        debug: 'debug'
    };
    type = levelMap[type];
    this.winstonLogger[type]('(' + namespace.join('/') + ') ' + args.join(' '));
    return this;
};

/**
 *
 */
WinstonBridge.prototype.close = function close() {
};

module.exports = WinstonBridge;