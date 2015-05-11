/**
 *
 * @authors Ismael Gorissen,
 *          Julien Biezemans
 * @company EASAPP
 * @license Commercial
 */

var path = require('path');

var CONFIG_FILES_PATH = path.join(__dirname, '..', 'configs');

var cache = {};

/**
 * Load a configuration file.
 *
 * @param filename
 * @returns {*}
 */
exports.load = function (filename) {
  if (!cache[filename]) {
    var filepath = path.join(CONFIG_FILES_PATH, filename + '.json');
    cache[filename] = require(filepath);
    if (!cache[filename]) {
      var err = new Error('Configuration file "' + filename + '" seems to be missing');
      throw err;
    }
  }

  return cache[filename];
};
