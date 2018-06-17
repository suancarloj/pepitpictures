const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Picture = new mongoose.Schema({
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

module.exports = mongoose.model('Picture', Picture);


