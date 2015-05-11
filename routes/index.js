var express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;

var PictureSet = require('../stores/picture-set.store');

/* GET home page. */
router.get('/', fileUploaderView);
router.get('/view/:computerID', viewPictures);
router.put('/picture-set/:computerID', createNewPictureSet);
router.get('/pictures/:computerID', getAllPictures);
router.put('/pictures/:setID/:pictureID', starPicture);

function fileUploaderView(req, res, next) {
  res.render('index', { title: 'Express' });
}

function viewPictures(req, res, next) {
  res.render('viewer');
}

function createNewPictureSet(req, res, next) {
  if (!req.params.computerID) {
    return next(new Error('Erreur lors de la création d’un set, paramètre manquant dans l’url'));
  }

  var processCreate = function (err, set) {
    if (err) {
      return next(new Error('Erreur lors de la sauvegarde d’un set dans la collection.'));
    }

    return res.json({ status: "success", data: set});
  };

  PictureSet.create({ computerId: req.params.computerID }, processCreate);
}

function getAllPictures (req, res, next) {
  if (!req.params.computerID) {
    return next(new Error('Erreur lors de la récupération des images, paramètre manquant dans l’url (computer-id)'));
  }

  var processPictureSet = function (err, set) {
    if (err) {
      return next(err);
    }

    return res.json({ status: "success", data: set[0]});
  };

  var query = PictureSet
    .find({ computerId: req.params.computerID })
    .sort({ createdAt : -1}).limit(1);

  query.exec(processPictureSet);
}

function starPicture(req, res, next) {
  var search = {
    _id: new ObjectId(req.params.setID),
    'pictures._id': new ObjectId(req.params.pictureID)
  };

  var update = { $set: { 'pictures.$.stared': (req.query.stared === 'true') } };

  var processUpdate = function (err, numAffectedRow) {
    if (err) {
      return next(err);
    }
    var data = {};

    if (numAffectedRow.nModified > 0) {
      data._id = req.params.setID;
      data.pictures = {
        _id: req.params.pictureID
      };
    }

    return res.json({ status: 'success', data: data});
  };

  PictureSet.update(search, update, processUpdate);
}

module.exports = router;
