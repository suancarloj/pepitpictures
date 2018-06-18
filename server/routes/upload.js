const express = require('express');
const router = express.Router();
const PictureSet = require('../stores/picture-set.store');
const debug = require('debug')('api:upload');
const path = require('path');
const sharp = require('sharp');

router.post('/:computerID', (req, res, next) => {
  if (!req.params.computerID) {
    return next(new Error('Erreur dans l’url, il faut un identifiant pour le pc.'));
  }

  if (!req.query.set) {
    return next(new Error('Erreur dans l’url, identifiant du set manquant'));
  }

  debug(`img destination path ${req.files.img.path}`);
  const thumbnailName = `tbn_${req.files.img.name.toLowerCase()}`;
  const update = {
    $addToSet: {
      pictures: {
        originalName: req.files.img.originalname,
        name: req.files.img.name,
        thumbnail: thumbnailName,
      },
    },
  };

  PictureSet.findByIdAndUpdate(req.query.set, update)
    .then((set) => {
      if (!set) {
        console.log('no set affected');
      }
      return;
    })
    .then(() => {
      const thumbnailPath = path.resolve(__dirname, '../public/uploads', thumbnailName);
      return sharp(req.files.img.path)
        .resize(320)
        .toFile(thumbnailPath);
    })
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
