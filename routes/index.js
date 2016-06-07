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
    to: email, // list of receivers
    subject: 'Pepitpictures.com : téléchargez vos photos', // Subject line
    text: `
H=C3=A9! Vos images sont dispo!

Vous avez re=C3=A7u vos photos!=20
Elles sont disponibles sur le site pepitpictures.com =
<http://pepitpictures.com/> dans la rubrique r=C3=A9cup=C3=A9rez vos =
photos.

Il vous suffira de taper l=E2=80=99adresse mail =C3=A0 laquelle vous =
avez re=C3=A7u cet e-mail pour t=C3=A9l=C3=A9charger vos Images en toute =
s=C3=A9curit=C3=A9.
=C3=80 tr=C3=A8s bient=C3=B4t,
Le team Pepit
pepitpictures.com
06 34 31 60 33`, // plaintext body
    html: `<html><head><meta http-equiv=3D"Content-Type" content=3D"text/html =
charset=3Dutf-8"></head><body style=3D"word-wrap: break-word; =
-webkit-nbsp-mode: space; -webkit-line-break: after-white-space;" =
class=3D""><font face=3D"Lobster" size=3D"4" class=3D"">H=C3=A9! Vos =
images sont dispo!</font><div class=3D""><br class=3D""><div =
class=3D""><font face=3D"Open Sans" size=3D"2" class=3D"">Vous avez =
re=C3=A7u vos photos!&nbsp;</font></div><div class=3D""><font face=3D"Open=
 Sans" size=3D"2" class=3D"">Elles sont disponibles sur le site<font =
color=3D"#7f7f7f" class=3D"">&nbsp;</font><a =
href=3D"http://pepitpictures.com" style=3D"color: rgb(127, 127, 127);" =
class=3D"">pepitpictures.com</a><font color=3D"#7f7f7f" =
class=3D"">&nbsp;</font>dans la rubrique<font color=3D"#7f7f7f" =
class=3D""> r</font><span style=3D"color: rgb(127, 127, 127);" =
class=3D"">=C3=A9cup=C3=A9rez vos photos.</span></font></div><div =
class=3D""><font face=3D"Open Sans" size=3D"2" class=3D""><br =
class=3D""></font></div><div class=3D""><font face=3D"Open Sans" =
size=3D"2" class=3D"">Il vous suffira de taper l=E2=80=99adresse mail =C3=A0=
 laquelle vous avez re=C3=A7u cet e-mail pour t=C3=A9l=C3=A9charger vos =
Images en toute s=C3=A9curit=C3=A9.<br class=3D""></font><div =
class=3D""><font face=3D"Open Sans" size=3D"2" class=3D"">=C3=80 tr=C3=A8s=
 bient=C3=B4t,</font></div><div class=3D""><font face=3D"Lobster" =
size=3D"7" class=3D"">Le team Pepit</font></div><div =
apple-content-edited=3D"true" class=3D""><div style=3D"color: rgb(0, 0, =
0); letter-spacing: normal; orphans: auto; text-align: start; =
text-indent: 0px; text-transform: none; white-space: normal; widows: =
auto; word-spacing: 0px; -webkit-text-stroke-width: 0px; word-wrap: =
break-word; -webkit-nbsp-mode: space; -webkit-line-break: =
after-white-space;" class=3D""><div style=3D"letter-spacing: normal; =
orphans: auto; text-align: start; text-indent: 0px; text-transform: =
none; white-space: normal; widows: auto; word-spacing: 0px; =
-webkit-text-stroke-width: 0px; word-wrap: break-word; =
-webkit-nbsp-mode: space; -webkit-line-break: after-white-space;" =
class=3D""><font color=3D"#7f7f7f" face=3D"Open Sans" size=3D"4" =
class=3D"">&nbsp;<a href=3D"http://pepitpictures.com" =
class=3D"">pepitpictures.com</a></font></div><div style=3D"letter-spacing:=
 normal; orphans: auto; text-align: start; text-indent: 0px; =
text-transform: none; white-space: normal; widows: auto; word-spacing: =
0px; -webkit-text-stroke-width: 0px; word-wrap: break-word; =
-webkit-nbsp-mode: space; -webkit-line-break: after-white-space;" =
class=3D""><span style=3D"color: rgb(127, 127, 127);" class=3D""><font =
face=3D"Open Sans" size=3D"4" class=3D"">&nbsp;06 34 31 60 =
33</font></span></div><div style=3D"letter-spacing: normal; orphans: =
auto; text-align: start; text-indent: 0px; text-transform: none; =
white-space: normal; widows: auto; word-spacing: 0px; =
-webkit-text-stroke-width: 0px; word-wrap: break-word; =
-webkit-nbsp-mode: space; -webkit-line-break: after-white-space;" =
class=3D""><br class=3D""><br class=3D""><br class=3D""><br class=3D""><br=
 class=3D""></div></div>
</div>
<br class=3D""></div></div></body></html>` // html body
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
