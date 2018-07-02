const kue = require('kue');
const debug = require('debug')('worker:upload-pictures');
const queue = kue.createQueue();
const fs = require('fs');
const path = require('path');
const stringToStream = require('string-to-stream');
const storages = require('../infrastructure/storages');

function uploadPicture(pictureSetId, picture, idx) {
  const picturePath = path.resolve(__dirname, '../../server/public/uploads', picture.name);
  const awsKey = `img/${pictureSetId}/pepitpicture-${idx}.jpg`;

  debug(`uploading picture ${picture.name}: ${picturePath} - ${awsKey}`);

  const stream = fs.createReadStream(picturePath);
  return storages.PicturesStorage.uploadStream(awsKey, stream);
}

function uploadThumbnail(pictureSetId, picture, idx) {
  const thumnailPath = path.resolve(__dirname, '../../server/public/uploads', picture.thumbnail);
  const awsKey = `img/${pictureSetId}/pepitpicture-${idx}-tbn.jpg`;

  debug(`uploading thumbnail ${picture.thumbnail}: ${thumnailPath} - ${awsKey}`);

  const stream = fs.createReadStream(thumnailPath);
  return storages.PicturesStorage.uploadStream(awsKey, stream);
}

function uploadJson(picturesDoc) {
  const { pictureSetId, pictures } = picturesDoc;
  debug(`uploading json for ${pictureSetId} with ${pictures.length} pictures`);
  const awsKey = `img/${pictureSetId}/collection.json`;
  return storages.PicturesStorage.uploadStream(
    awsKey,
    stringToStream(JSON.stringify(picturesDoc, null, 2))
  );
}

function sendMail(to, pictureSetId) {
  debug(`sending email to ${to} for picture set ${pictureSetId}`);
  const job = queue
    .create('send-customer-pictures-email', {
      title: `send pictures(${pictureSetId}) email to: ${to}`,
      to,
      pictureSetId,
    })
    .priority('high')
    .attempts(5)
    .backoff({ type: 'exponential' })
    .save();
}

module.exports = function uploadPictures(job, done) {
  const { pictures, pictureSetId, email } = job.data;
  const len = pictures.length;
  
  if (len === 0) {
    return done();
  }

  function next(i) {
    const picture = pictures[i]; // pretend we did a query on this slide id ;)
    job.log(`uploading ${picture.name} picture into ${pictureSetId}`);
    debug(`uploading picture ${i + 1} of ${len} from ${pictureSetId}`);
    uploadPicture(pictureSetId, picture, i)
      .then(() => uploadThumbnail(pictureSetId, picture, i))
      .then(() => {
        job.progress(i, len, { nextPicture: i == len ? 'done' : picture.name });
        if (i <= len - 2) {
          return next(i + 1);
        }
        return uploadJson(job.data).then(() => sendMail(email, pictureSetId));
      })
      .then(() => done())
      .catch((err) => {
        console.log(err);
        if (err) return done(err);
      });
  }
  
  next(0);
};
