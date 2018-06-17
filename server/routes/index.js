const express = require('express');
const router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;
const AdmZip = require('adm-zip');
const kue = require('kue');
const queue = kue.createQueue();
const PictureSet = require('../stores/picture-set.store');
const jobTypes = require('../../common/job-types');

router.get('/pictures/:setId/download', (req, res, next) => {
  if (!req.params.setId) {
    return next(
      new Error(
        'Erreur lors de la récupération des images, paramètre manquant dans l’url (computer-id)'
      )
    );
  }

  PictureSet.findById(req.params.setId)
    .then((set) => {
      var stared = set.pictures.filter((p) => p.stared).map((p) => p.originalName);
      return res.json(stared);
    })
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });
});

router.put('/pictures/:setId/create-sh-file', (req, res, next) => {
  if (!req.params.setId) {
    return next(
      new Error(
        'Erreur lors de la récupération des images, paramètre manquant dans l’url (computer-id)'
      )
    );
  }

  PictureSet.findById(req.params.setId)
    .then((set) => {
      var stared = set.pictures.filter((p) => p.stared);
      return stared.length > 3
        ? res.json({ status: 'success', data: set })
        : res.status(500).json({ status: 'fail', data: set });
    })
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });
});

router.put('/pictures/:pictureSetId/set-email', (req, res, next) => {
  if (!req.params.pictureSetId) {
    return next(new Error('Erreur lors de la création d’un set, paramètre manquant dans l’url'));
  }

  const update = { email: req.body.email };
  const search = { _id: new ObjectId(req.params.pictureSetId) };

  PictureSet.update(search, update, (err, set) => {
    res.json({ status: 'success', data: set });
  });
});

router.put('/pictures/:pictureSetId/publish', (req, res, next) => {
  const { pictureSetId } = req.params;
  PictureSet.findOne({ _id: new ObjectId(pictureSetId) }).lean().then((pictureSet) => {
    const staredPictures = pictureSet.pictures.filter(p => p.stared);
    const pictures = staredPictures.length < 3 ? staredPictures : pictureSet.pictures;
    const jobData = {
      title: `upload pictures (${staredPictures.length}) for client: ${pictureSet.email}`,
      pictureSetId,
      pictures,
      email: pictureSet.email,
    };

    const job = queue
      .create(jobTypes.uploadPictures, jobData)
      .priority('normal')
      .attempts(5)
      .backoff({ type: 'exponential' })
      .save((err) => {
        if (err) {
          console.log('error creating job', job.id, err);
          res.status(500).json({ status: 'error', errors: err });
        }

        res.json({ status: 'success' });
      });
  });
});

router.post('/pictures', (req, res, next) => {
  if (!req.body.computerId) {
    return next(new Error('Erreur lors de la création d’un set, paramètre manquant dans l’url'));
  }

  PictureSet.create({ computerId: req.body.computerId })
    .then((set) => res.json({ status: 'success', data: set }))
    .catch((err) => {
      if (err) {
        return next(new Error('Erreur lors de la sauvegarde d’un set dans la collection.'));
      }
    });
});

router.get('/pictures/:computerId/all', (req, res, next) => {
  if (!req.params.computerId) {
    return next(
      new Error(
        'Erreur lors de la récupération des images, paramètre manquant dans l’url (computer-id)'
      )
    );
  }

  var query = PictureSet.find({
    computerId: req.params.computerId,
    'pictures.0': { $exists: true },
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .exec((err, set) => {
      if (err) {
        return next(err);
      }
      return res.json({ status: 'success', data: set });
    });
});

router.get('/pictures/fetch-new', (req, res, next) => {
  var search = {
    computerId: req.query.computerId,
    createdAt: {
      $gt: new Date(req.query.createdAt),
    },
  };

  PictureSet.findOne(search)
    .then((set) => res.json({ status: 'success', data: set }))
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });
});

router.get('/pictures/:computerId', (req, res, next) => {
  if (!req.params.computerId) {
    return next(
      new Error(
        'Erreur lors de la récupération des images, paramètre manquant dans l’url (computer-id)'
      )
    );
  }

  var query = PictureSet.find({ computerId: req.params.computerId })
    .sort({ createdAt: -1 })
    .limit(1)
    .exec((err, set) => {
      if (err) {
        return next(err);
      }

      return res.json({ status: 'success', data: set[0] });
    });
});

router.put('/pictures/:setId/:pictureId', (req, res, next) => {
  var search = {
    _id: new ObjectId(req.params.setId),
    'pictures._id': new ObjectId(req.params.pictureId),
  };

  var update = { $set: { 'pictures.$.stared': req.query.stared === 'true' } };

  PictureSet.update(search, update)
    .then((numAffectedRow) => {
      var data = {};

      if (numAffectedRow.nModified > 0) {
        data._id = req.params.setId;
        data.pictures = {
          _id: req.params.pictureId,
        };
      }

      return res.json({ status: 'success', data });
    })
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });
});

module.exports = router;
