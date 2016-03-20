var express = require('express');
var router = express.Router();
var PictureSet = require('../stores/picture-set.store');


router.post('/:computerID', processImageUpload);

function processImageUpload(req, res, next) {
  if (!req.params.computerID) {
    return next(new Error('Erreur dans l’url, il faut un identifiant pour le pc.'));
  }

  if (!req.query.set) {
    return next(new Error('Erreur dans l’url, identifiant du set manquant'));
  }

  var picture = {
    originalName: req.files.img.originalname,
    name: req.files.img.name
  };

  var update = {
    $addToSet: {
      pictures: picture
    }
  };

  PictureSet.findByIdAndUpdate(req.query.set, update)
    .then(set => {
      if (!set) {
        console.log('no set affected');
      }

      console.log(res.io)

      return res.json({ status: "success", data: { message: "File saved!" } });
    })
    .catch(err => next(new Error('Set non trouvé.')));
}

module.exports = router;
