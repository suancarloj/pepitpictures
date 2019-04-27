const express = require('express');
const router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;
const AdmZip = require('adm-zip');
const kue = require('kue');
const validator = require('validator');
const queue = kue.createQueue();
const PictureSet = require('../stores/picture-set.store');
const jobTypes = require('../../common/job-types');
const PicturesService = require('../services/picturesService');

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

router.put('/pictures/:pictureSetId/set-email', (req, res, next) =>
  PicturesService.updateEmail(req.params.pictureSetId, req.body.email)
    .then((set) => res.json({ status: 'success', data: set }))
    .catch((err) => next(err))
);

router.put('/pictures/:pictureSetId/publish', (req, res, next) => {
  const { pictureSetId } = req.params;
  const search = {
    _id: new ObjectId(pictureSetId),
  };
  PictureSet.findOne(search)
    .lean()
    .then((pictureSet) => {
      if (!validator.isEmail(pictureSet.email)) {
        throw new Error('Invalid email');
      }
      const staredPictures = pictureSet.pictures.filter((p) => p.stared);
      const pictures =
        staredPictures.length > 0 && staredPictures.length <= 3
          ? staredPictures
          : pictureSet.pictures;
      const jobData = {
        title: `upload pictures (${pictures.length}) for client: ${pictureSet.email}`,
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
          const search = {
            _id: new ObjectId(pictureSetId),
          };
          PictureSet.update(search, { $set: { pictureJobId: job.id, emailSent: 'PENDING' } }).then(
            () => {
              res.json({ status: 'success' });
            }
          );
        });
    })
    .catch((err) => {
      console.error('Error when publishing:', err);
      PictureSet.update(search, { $set: { emailSent: 'ERROR' } }).then(() => {
        res.status(400).json({ error: err });
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

router.get('/pictures', (req, res, next) => {
  const query = {
    'pictures.0': { $exists: true },
  };
  if (req.query.filter) {
    if (req.query.filter === 'email-only') {
      query.email = { $ne: null };
    } else {
      query.email = { $regex: new RegExp(req.query.filter, 'i') };
    }
  }

  if (req.query.computer) {
    query.computerId = req.query.computer;
  }

  PictureSet.paginate(query, {
    sort: { createdAt: -1 },
    offset: Number(req.query.page) || 0,
    limit: Number(req.query.limit) || 10,
  })
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => {
      if (err) {
        return next(err);
      }
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
