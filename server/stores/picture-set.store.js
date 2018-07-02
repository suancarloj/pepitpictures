const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const PictureSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  thumbnailHeight: {
    type: Number,
    required: true,
  },
  thumbnailWidth: {
    type: Number,
    required: true,
  },
  stared: {
    type: Boolean,
    default: false,
  },
});

const PictureSetSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  computerId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  pictures: [PictureSchema],
}, {
  timestamps: true,
});

PictureSetSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('PictureSet', PictureSetSchema);
