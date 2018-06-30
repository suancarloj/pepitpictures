const express = require('express');
const router = express.Router();
const PictureSet = require('../stores/picture-set.store');
const debug = require('debug')('api:upload');
const path = require('path');
const sharp = require('sharp');
const multer = require('multer');
const crypto = require('crypto');

function getFilename (req, file, cb) {
  crypto.pseudoRandomBytes(16, function (err, raw) {
    cb(err, err ? undefined : raw.toString('hex') + '.jpg')
  })
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, '../public/uploads/'))
  },
  filename: getFilename,
});

const upload = multer({
  storage,
});
router.post('/:computerID', upload.single('img'), (req, res, next) => {
  if (!req.params.computerID) {
    return next(new Error('Erreur dans l’url, il faut un identifiant pour le pc.'));
  }

  if (!req.query.set) {
    return next(new Error('Erreur dans l’url, identifiant du set manquant'));
  }

  debug(`img destination path ${req.file.path}`);
  const thumbnailName = `tbn_${req.file.filename.toLowerCase()}`;
  const thumbnailPath = path.resolve(__dirname, '../public/uploads', thumbnailName);
  sharp(req.file.path)
    .resize(320)
    .toFile(thumbnailPath)
    .then((info) => {
      debug(`thumbnail width x height: ${info.width} x ${info.height}`);
      const update = {
        $addToSet: {
          pictures: {
            originalName: req.file.originalname,
            name: req.file.filename,
            thumbnail: thumbnailName,
            thumbnailHeight: info.height,
            thumbnailWidth: info.width,
          },
        },
      };
      return PictureSet.findByIdAndUpdate(req.query.set, update);
    })
    .then((set) => {
      if (!set) {
        console.log('no set affected');
      }
      return;
    })
    .then(() => {})
    .then(() => {
      res.json({ status: 'success', data: { message: 'File saved!' } });
    })
    .catch((err) => {
      debug(`err: ${err}`);
      if (err) {
        return next(new Error('Set non trouvé.'));
      }
    });
});

module.exports = router;
