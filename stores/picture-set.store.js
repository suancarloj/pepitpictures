var mongoose = require('mongoose');
mongoose.Promise = require('bluebird').Promise;
var store = require('./mongoose_store');
var db = store.getDB('main');

var PictureSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  stared: {
    type: Boolean,
    default: false
  },
  url: {
    type: String
  }
});

var PictureSetSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  computerId: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  emailSent: {
    type: Boolean,
    default: false
  },
  filesUploaded: {
    type: Boolean,
    default: false
  },
  pictures: [PictureSchema]
});

module.exports = db.model('PictureSet', PictureSetSchema);
