const aws = require('aws-sdk');
const mime = require('mime');
const debug = require('debug')('s3-proxy');
const toArray = require('stream-to-array');
const config = require('config');

aws.config.setPromisesDependency(require('bluebird'));

function getS3Config() {
  const env = getEnvironment();
  const awsConfig = {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
    region: config.aws.region,
    // required for encrypted s3 upload
    // supposed not needed for SDK after May 2016 (depending of region), but aws-sdk@2.7.21 stills needs it
    signatureVersion: 'v4',
  };

  if (env === 'local') {
    debug('Using fake-s3');
    awsConfig.endpoint = 'http://localhost:4569'; // using fake-s3 if local
    awsConfig.accessKeyId = 'accessKeyId';
    awsConfig.secretAccessKey = 'secretAccessKey';
    awsConfig.region = 'my_secret_region';
  } else {
    // Validate env keys
    if (!awsConfig.accessKeyId) {
      debug('Missing env AWS_ACCESS_KEY_ID');
    }

    if (!awsConfig.secretAccessKey) {
      debug('Missing env AWS_SECRET_ACCESS_KEY');
    }

    if (!awsConfig.region) {
      debug('Missing env AWS_DEFAULT_REGION');
    }
  }

  return awsConfig;
}

function getEnvironment() {
  return config.env || 'local';
}

function S3Proxy(bucket, applyEnv = true, serverSideEncryption, ssekmsKeyId) {
  const env = getEnvironment();
  // Connection to the correct bucket, depending on the environment
  // using applyEnv due to assets bucket, env is not used. Need a proper
  // use of environment when we make a service document.
  this.bucket = applyEnv ? `${env}-${bucket}` : bucket;

  this.serverSideEncryption = serverSideEncryption;
  this.ssekmsKeyId = ssekmsKeyId;

  this.s3 = new aws.S3(getS3Config());
}

S3Proxy.prototype.getObject = function getObject(key) {
  debug(`Download object ${key} from ${this.bucket}`);

  return this.s3.getObject({
    Bucket: this.bucket,
    Key: key,
  });
};

S3Proxy.prototype.objectExists = function objectExists(key) {
  debug(`Check if object exists ${key} from ${this.bucket}`);

  return this.s3.headObject({
    Bucket: this.bucket,
    Key: key,
  })
  .promise()
  .then(() => true)
  .catch((err) => {
    if (err.code === 'NotFound') {
      return false;
    }

    throw err;
  });
};

S3Proxy.prototype.listObjects = function listObjects() {
  debug(`List objects from ${this.bucket}`);

  return this.s3.listObjects({
    Bucket: this.bucket,
  })
  .promise();
};

S3Proxy.prototype.getMetadata = function getMetadata(key) {
  debug(`Get object metadata ${key} from ${this.bucket}`);

  return this.s3.headObject({
    Bucket: this.bucket,
    Key: key,
  })
  .promise();
};

S3Proxy.prototype.putObject = function putObject(key, stream, metadata = {}) {
  debug(`Upload object ${key} to ${this.bucket}`);

  // We cannot upload non file-stream in S3. The hack is to convert the stream into a buffer and upload it
  return toArray(stream)
    .then((array) => {
      const uploadConfig = {
        Bucket: this.bucket,
        Key: key,
        Body: Buffer.concat(array),
        Metadata: metadata,
        ContentType: mime.getType(key),
      };

      if (this.serverSideEncryption) {
        uploadConfig.ServerSideEncryption = this.serverSideEncryption;
        uploadConfig.SSEKMSKeyId = this.ssekmsKeyId;
      }

      return this.s3.putObject(uploadConfig)
        .promise()
        .then((data) => {
          debug(`Uploaded object ${key} to ${this.bucket} -> ${JSON.stringify(data, 4, null)}`);
        });
    });
};

module.exports = S3Proxy;
