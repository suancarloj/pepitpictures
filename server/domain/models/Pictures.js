const mongoose = require('mongoose');
const Picture = require('./Picture');

const Schema = mongoose.Schema;

const Pictures = new Schema(
  {
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
    pictures: [PictureSchema.schema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pictures', Pictures);
