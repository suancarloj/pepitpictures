const kue = require('kue');
const sendCustomerPicturesEmail = require('./workers/send-customer-pictures-email');
const uploadPictures = require('./workers/upload-pictures');
const jobTypes = require('../common/job-types');
const queue = kue.createQueue();
const storages = require('./infrastructure/storages');
storages.PicturesStorage.init();

queue.on('error', function(err) {
  console.log('Oops... ', err);
});

queue.process(jobTypes.sendCustomerPicturesEmail, sendCustomerPicturesEmail);
queue.process(jobTypes.uploadPictures, uploadPictures);

process.once('SIGTERM', function(sig) {
  queue.shutdown(5000, function(err) {
    console.log('Kue shutdown: ', err || '');
    process.exit(0);
  });
});

process.once('uncaughtException', function(err) {
  console.error('Something bad happened: ', err);
  queue.shutdown(1000, function(err2) {
    console.error('Kue shutdown result: ', err2 || 'OK');
    process.exit(0);
  });
});
