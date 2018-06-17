const S3Proxy = require('./S3Proxy');
const toArray = require('stream-to-array');
const errors = require('../../../common/domain/model/errors');

let instance = null;
let s3ProxyInstance = null;

function PicturesStorage() {
  if (!instance) {
    instance = this;
  }

  return instance;
}

function validateS3Init() {
  if (!s3ProxyInstance) {
    throw new errors.ApiError('No S3 Proxy, did you call init() on the PicturesStorage?');
  }
}

PicturesStorage.prototype.init = function init() {
  s3ProxyInstance = new S3Proxy('i.pepitpictures.com', false);
};

PicturesStorage.prototype.downloadStream = function downloadStream(key) {
  validateS3Init();

  return s3ProxyInstance.objectExists(key)
    .then((exists) => {
      if (!exists) {
        throw new errors.NotFoundError(`Could not find asset ${key}`);
      }
    })
    .then(() => s3ProxyInstance.getObject(key).createReadStream());
};

PicturesStorage.prototype.downloadBase64 = function downloadBase64(key) {
  validateS3Init();

  return s3ProxyInstance.objectExists(key)
    .then((exists) => {
      if (!exists) {
        throw new errors.NotFoundError(`Could not find asset ${key}`);
      }
    })
    .then(() => s3ProxyInstance.getObject(key).createReadStream())
    .then(stream => toArray(stream))
    .then(array => Buffer.concat(array).toString('base64'));
};

PicturesStorage.prototype.uploadStream = function uploadStream(key, stream) {
  validateS3Init();

  return s3ProxyInstance.objectExists(key)
    .then((exists) => {
      if (exists) {
        throw new errors.ValidationError(`Assert ${PicturesStorage} already exist on storage`);
      }

      return s3ProxyInstance.putObject(key, stream);
    });
};

module.exports = new PicturesStorage();
