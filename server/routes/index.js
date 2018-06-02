var express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var AdmZip = require('adm-zip');
var PictureSet = require('../stores/picture-set.store');

/* GET home page. */
router
  .get('/', (req, res, next) => res.render('index', { title: 'Express' }))
  .get('/view/:computerID', (req, res, next) => res.render('viewer'))
  .get('/picture-set/download/:setID', (req, res, next) => {
    if (!req.params.setID) {
      return next(new Error('Erreur lors de la récupération des images, paramètre manquant dans l’url (computer-id)'));
    }
  
    PictureSet.findById(req.params.setID)
      .then((set) => {
        var stared = set.pictures.filter(p => p.stared)
          .map(p =>p.originalName);
        return res.json(stared);
      }).catch((err) => {
        if (err) {
          return next(err);
        }
      });
  })
  .put('/picture-set/create-sh-file/:setID', (req, res, next) =>{
    if (!req.params.setID) {
      return next(new Error('Erreur lors de la récupération des images, paramètre manquant dans l’url (computer-id)'));
    }
  
    PictureSet.findById(req.params.setID)
      .then((set) => {
        var stared = set.pictures.filter(p => p.stared);
        return stared.length > 3
        ? res.json({ status: 'success', data: set })
        : res.status(500).json({ status: 'fail', data: set});
      }).catch((err) => {
        if (err) {
          return next(err);
        }
      });
  })
  .put('/picture-set/:pictureSetId/set-email', (req, res, next) => {
    if (!req.params.pictureSetId) {
      return next(new Error('Erreur lors de la création d’un set, paramètre manquant dans l’url'));
    }
  
    var update = { email: req.body.email };
    var search = { _id: new ObjectId(req.params.pictureSetId) };
  
    PictureSet.update(search, update, (err, set) => {
      res.json({ status: "success", data: set})
    });
  })
  .put('/picture-set/:computerID', (req, res, next) => {
    if (!req.params.computerID) {
      return next(new Error('Erreur lors de la création d’un set, paramètre manquant dans l’url'));
    }
  
    PictureSet.create({ computerId: req.params.computerID })
      .then((set) => res.json({ status: "success", data: set}))
      .catch((err) => {
        if (err) {
          return next(new Error('Erreur lors de la sauvegarde d’un set dans la collection.'));
        }
      });
  })
  .get('/picture-set/:computerID/all', (req, res, next) => {
    if (!req.params.computerID) {
      return next(new Error('Erreur lors de la récupération des images, paramètre manquant dans l’url (computer-id)'));
    }
  
    var query = PictureSet
      .find({ computerId: req.params.computerID, 'pictures.0': { $exists: true } })
      .sort({ createdAt : -1})
      .limit(10)
      .exec((err, set) => {
        if (err) {
          return next(err);
        }
        return res.json({ status: "success", data: set});
      });
  })
  .get('/pictures/fetchNew', (req, res, next) =>{
    var search = {
      computerId: req.query.computerID,
      createdAt: {
        $gt: new Date(req.query.createdAt)
      }
    };
  
    PictureSet.findOne(search)
      .then((set) => res.json({ status: 'success', data: set }))
      .catch((err) => {
        if (err) {
          return next(err);
        }
      });
  })
  .get('/pictures/:computerID', (req, res, next) => {
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
  })
  .put('/pictures/:setID/:pictureID', (req, res, next) => {
    var search = {
      _id: new ObjectId(req.params.setID),
      'pictures._id': new ObjectId(req.params.pictureID)
    };
  
    var update = { $set: { 'pictures.$.stared': (req.query.stared === 'true') } };
  
    PictureSet.update(search, update)
      .then((numAffectedRow) => {
        var data = {};
  
        if (numAffectedRow.nModified > 0) {
          data._id = req.params.setID;
          data.pictures = {
            _id: req.params.pictureID
          };
        }
    
        return res.json({ status: 'success', data: data});
      }).catch((err) => {
        if (err) {
          return next(err);
        }
      });
  });

module.exports = router;
