var express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var AdmZip = require('adm-zip');
var PictureSet = require('../stores/picture-set.store');
var AWS = require('aws-sdk')
var credentialAWS = require('../configs/aws.json');
var s3 = new AWS.S3(credentialAWS)
var Promise = require('bluebird')
var readFile = Promise.promisify(require("fs").readFile);
var path = require('path')
var nodemailer = require('nodemailer');
var emailConfig = require('../configs/email.json');
// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport(emailConfig);
var firebase = require("firebase");
// Initialize the app with a service account, granting admin privileges
firebase.initializeApp({
  databaseURL: "https://pepitpictures.firebaseio.com",
  serviceAccount: path.resolve(__dirname, "../pepitpictures-d34aac0d76b1.json")
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = firebase.database();


/* GET home page. */
router
  .get('/', fileUploaderView)
  .get('/view/:computerID', viewPictures)
  .get('/picture-set/download/:setID', downloadSet)
  .put('/picture-set/create-sh-file/:setID', createShFile)
  .put('/picture-set/:computerID', createNewPictureSet)
  .put('/picture-set/:setID/set-email', saveEmailPictureSet)
  .get('/picture-set/:computerID/all', getAllPictureSet)
  .get('/pictures/fetchNew', isNewPictureSetAvailable)
  .get('/pictures/:computerID', getAllPictures)
  .put('/pictures/:setID/:pictureID', starPicture)
  .get('/email', emails)
  .post('/email/send-multi', sendEmailForIds)

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

function saveEmailPictureSet(req, res,next) {
  var search = {
    _id: new ObjectId(req.params.setID)
  }
  var update = { $set: { email: req.body.email }}

  PictureSet.update(search, update).exec()
    .then((numAffectedRow) => {
      res.json({ status: 'success', data: 'ok'})
    })
    .catch(next)
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

  var update = { $set: { 'pictures.$.stared': req.body.stared } };
  console.log(search, update)
  PictureSet.update(search, update).exec()
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

function emails(req, res, next) {
  var sent = req.query.sent === 'true'
  PictureSet.find({ email: { $exists: true }, emailSent: sent }).select({ pictures: 0, __v: 0  }).sort({ createdAt : -1}).lean().exec()
    .then((sets) => {
      res.json({ status: 'success', data: sets })
    })
    .catch(next)
}

function sendEmailForIds (req, res, next) {
  console.log('Start of send emails')
  PictureSet.find({ _id: { $in: req.body.ids } }).exec()
    .then((sets) => {
      //console.log('SETS',sets)
      
      return Promise.map(sets, (s) => {
        const pictures = s.pictures.filter((p) => p.stared)

        return Promise.map(pictures, (picture) => {
            console.log('Saving image into aws s3')
            return readFile(path.resolve(__dirname, `../public/uploads/${picture.name}`))
              .then((imgBuffer) => uploadImageToS3(picture.name, imgBuffer, s.email))
              .then((info) => {
                console.log('image saved into s3: ', picture.name)
                picture.url = info.Location
                return info
              })
          })
          .then((results) => {
            //console.log('AWS', results)

            var ref = db.ref(`pictures`);
            ref.child(new Buffer(s.email).toString('base64'))
              .set(s.pictures.filter(p => p.stared).map(p => p.url), function(error) {
              if (error) {
                console.error("Data could not be saved." + error);
              } else {
                console.log("Data saved successfully.");
              }
            })
            s.filesUploaded = true
            //console.log('BEFORE SAVE: ', s)
            console.log('files uploaded!')
            return s.save()
          })
          .then((s) => {
            //console.log(s)
            console.log('sending emails')
            return sendEmail(s.email)
              .then((info) => {
                console.log('email sent!')
                s.emailSent = true

                return s.save()
              })
          })
      })
        .then(() => {
          console.log('done!')
          res.json({ status: 'success', data: 'ok' })
        })
        .catch(err => {
          console.error(err)
        })
    })
}

function uploadImageToS3 (key, imgStream, email) {
  var params = {
    Bucket: 'pepitpictures',
    Key: key,
    Body: imgStream,
    ACL: 'public-read',
    Metadata: { email },
    ContentType: 'image/jpeg'
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      return err ? reject(err) : resolve(data)
    });
  })
}

function sendEmail(email) {
  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: '"Pepitpictures.com" <info@pepitpictures.com>', // sender address
    to: 'juan@pinch.eu', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world 🐴', // plaintext body
    html: '<b>Hello world 🐴</b>' // html body
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function(error, info){
      if(error){
        console.error(error);
        return reject(error);
      }
      console.log('Message sent: ' + info.response);
      return resolve(info);
    });
  })
}



module.exports = router;
