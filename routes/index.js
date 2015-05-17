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

  var processFind = function (err, set) {
    if (err) {
      return next(err);
    }

    var stared = [];

    set.pictures.forEach(function (p) {
      if (p.stared) {
        stared.push(p.originalName);
      }
    });

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
  };

  PictureSet.findById(req.params.setID, processFind);
}

function createShFile(req, res, next) {
  if (!req.params.setID) {
    return next(new Error('Erreur lors de la récupération des images, paramètre manquant dans l’url (computer-id)'));
  }

  var processFind = function (err, set) {
    if (err) {
      return next(err);
    }

    var stared = [];

    set.pictures.forEach(function (p) {
      if (p.stared) {
        stared.push(p);
      }
    });

    if (stared.length > 3) {
      return res.json({ status: 'success', data: set });
    }

    return res.status(500).json({ status: 'fail', data: set});
  };

  PictureSet.findById(req.params.setID, processFind);
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

function getAllPictureSet (req, res, next) {
  if (!req.params.computerID) {
    return next(new Error('Erreur lors de la récupération des images, paramètre manquant dans l’url (computer-id)'));
  }

  var processPictureSet = function (err, set) {
    if (err) {
      return next(err);
    }

    return res.json({ status: "success", data: set});
  };

  var query = PictureSet
    .find({ computerId: req.params.computerID, 'pictures.0': { $exists: true } })
    .sort({ createdAt : -1})
    .limit(10);

  query.exec(processPictureSet);
}

function isNewPictureSetAvailable(req, res, next) {

  var search = {
    computerId: req.query.computerID,
    createdAt: {
      $gt: new Date(req.query.createdAt)
    }
  };

  var processFind = function (err, set) {
    if (err) {
      return next(err);
    }

    return res.json({ status: 'success', data: set });
  };

  PictureSet.findOne(search, processFind);
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
