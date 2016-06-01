var express = require('express');
var router = express.Router();
var PictureSet = require('../stores/picture-set.store');


router.post('/:computerID', processImageUpload);

function processImageUpload(req, res, next) {
  if (!req.params.computerID) {
    console.log('no computer id')
    return next(new Error('Erreur dans l’url, il faut un identifiant pour le pc.'));
  }

  if (!req.query.set) {
    console.log('no req query')
    return next(new Error('Erreur dans l’url, identifiant du set manquant'));
  }

  var pictures = Array.isArray(req.files.img) ? req.files.img : [req.files.img];

  pictures.map(file => ({
    originalName: file.originalname,
    name: file.name
  }));

  var update = {
    $addToSet: {
      pictures: {
        $each: pictures
      }
    }
  };

  //console.log('update: ', JSON.stringify(update, null, 2))

  PictureSet.findByIdAndUpdate(req.query.set, update, { new: true})
    .then(set => {
      if (!set) {
        console.log('no set affected');
      }

      console.log(set)

      res.io.emit('action', { type: 'NEW_SET', payload: set } );

      return res.json({ status: "success", data: { message: "File saved!" } });
    })
    .catch(err => next(new Error('Set non trouvé.')));
}

module.exports = router;
