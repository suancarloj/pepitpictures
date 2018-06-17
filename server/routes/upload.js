var express = require('express');
var router = express.Router();
var PictureSet = require('../stores/picture-set.store');


/* GET users listing. */
router.post('/:computerID', processImageUpload);

function processImageUpload(req, res, next) {
  if (!req.params.computerID) {
    return next(new Error('Erreur dans l’url, il faut un identifiant pour le pc.'));
  }

  if (!req.query.set) {
    return next(new Error('Erreur dans l’url, identifiant du set manquant'));
  }

  var processAddPictureToSet = function (err, set) {
    if (err) {
      return next(new Error('Set non trouvé.'));
    }

    if (!set) {
      console.log('no set affected');
    }

    res.json({ status: "success", data: { message: "File saved!" } });
  };

  var picture = {
    originalName: req.files.img.originalname,
    name: req.files.img.name
  };

  var update = {
    $addToSet: {
      pictures: picture
    }
  };

  PictureSet.findByIdAndUpdate(req.query.set, update , processAddPictureToSet);
}

module.exports = router;
