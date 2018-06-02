var mongoose = require('mongoose');
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
    type: String,
    required: false
  },
  pictures: [PictureSchema]
});

module.exports = db.model('PictureSet', PictureSetSchema);
