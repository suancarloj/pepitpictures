var express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var AdmZip = require('adm-zip');
var PictureSet = require('../stores/picture-set.store');

/* GET home page. */
router
  .get('/', fileUploaderView)
  .get('/view/:computerID', viewPictures)
  .get('/picture-set/download/:setID', downloadSet)
  .put('/picture-set/create-sh-file/:setID', createShFile)
  .put('/picture-set/:computerID', createNewPictureSet)
  .get('/picture-set/:computerID/all', getAllPictureSet)
  .get('/pictures/fetchNew', isNewPictureSetAvailable)
  .get('/pictures/:computerID', getAllPictures)
  .put('/pictures/:setID/:pictureID', starPicture);

function fileUploaderView(req, res, next) {
  res.render('index', { title: 'Express' });
}

function viewPictures(req, res, next) {
  res.render('viewer');
}

function downloadSet(req, res, next) {
  if (!req.params.setID) {
    return next(new Error('Erreur lors de la récupération des images, paramètre manquant dans l’url (computer-id)'));
  }

  PictureSet.findById(req.params.setID, processFind).exec()
    .then(set => {
      var stared = set.pictures.filter(p => p.stared).map(p => p.originalName);

      // if (stared.length > 0 && stared.length <=3) {
      //   zip = new AdmZip();
      //
      //   stared.forEach(function (s) {
      //     zip.addLocalFile('public/uploads/' + s.name);
      //   });
      //
      //   return res.type('zip').send(new Buffer(zip.toBuffer(), 'binary'));
      // }

      //return res.status(500).json({ status: 'fail', data: set});
      return res.json(stared);
    });
}

function createShFile(req, res, next) {
  if (!req.params.setID) {
    return next(new Error('Erreur lors de la récupération des images, paramètre manquant dans l’url (computer-id)'));
  }

  PictureSet.findById(req.params.setID)
    .then(set => {
      const stared = set.pictures.filter(p => p.stared);

      if (stared.length > 3) {
        return res.json({ status: 'success', data: set });
      }

      return res.status(500).json({ status: 'fail', data: set });
    })
    .catch(next);
}

function createNewPictureSet(req, res, next) {
  if (!req.params.computerID) {
    return next(new Error('Erreur lors de la création d’un set, paramètre manquant dans l’url'));
  }

  PictureSet.create({ computerId: req.params.computerID })
    .then(set => res.json({ status: "success", data: set}))
    .catch(err => next(new Error('Erreur lors de la sauvegarde d’un set dans la collection.')));
}

function getAllPictures (req, res, next) {
  if (!req.params.computerID) {
    return next(new Error('Erreur lors de la récupération des images, paramètre manquant dans l’url (computer-id)'));
  }

  PictureSet.find({ computerId: req.params.computerID }).sort({ createdAt : -1}).limit(1).exec()
    .then(set => {
      return res.json({ status: "success", data: set[0]});
    })
    .catch(next);
}

function getAllPictureSet (req, res, next) {
  if (!req.params.computerID) {
    return next(new Error('Erreur lors de la récupération des images, paramètre manquant dans l’url (computer-id)'));
  }
  const query = { computerId: req.params.computerID, 'pictures.0': { $exists: true } }
  PictureSet.find(query).sort({ createdAt : -1}).limit(10).exec()
    .then(set => {
      return res.json({ status: "success", data: set});
    })
    .catch(next);
}

function isNewPictureSetAvailable(req, res, next) {
  var search = {
    computerId: req.query.computerID,
    createdAt: {
      $gt: new Date(req.query.createdAt)
    }
  };

  PictureSet.findOne(search, processFind).exec()
    .then(set => {
      return res.json({ status: 'success', data: set })
    })
    .catch(next);
}

function starPicture(req, res, next) {
  var search = {
    _id: new ObjectId(req.params.setID),
    'pictures._id': new ObjectId(req.params.pictureID)
  };

  var update = { $set: { 'pictures.$.stared': (req.query.stared === 'true') } };

  PictureSet.update(search, update, processUpdate).exec()
    .then(numAffectedRow => {
      var data = {};

      if (numAffectedRow.nModified > 0) {
        data._id = req.params.setID;
        data.pictures = {
          _id: req.params.pictureID
        };
      }

      return res.json({ status: 'success', data: data});
    })
    .catch(next);
}

module.exports = router;
