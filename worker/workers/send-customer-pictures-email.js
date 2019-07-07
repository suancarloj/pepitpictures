const debug = require('debug')('worker:send-customer-pictures-email');
const Validator = require('better-validator');
const ObjectId = require('mongoose').Types.ObjectId;
const emailTransporter = require('../infrastructure/email');
const emailTemplate = require('./emailTemplate');
const Pictures = require('../../server/stores/picture-set.store');
const getText = (id) => `
  Bonjour,

  Voici le lien de téléchargement de vos photos.
  https://i.pepitpictures.com?id=${id}
  N’hésitez pas à nous identifier sur les réseaux sociaux #PepitPictures.com et #Marseillanjet

  En espérant que nous ayons passé d’agréables instants..

  À très bientôt,

  Le Team Pepit
  06  34  31  60  33
  pepitpictures.com
`;

module.exports = function sendEmail(job, done) {
  const email = job.data.to;
  const validator = new Validator();
  const search = {
    _id: new ObjectId(job.data.pictureSetId),
  };
  if (
    !validator(email)
      .isString()
      .isEmail()
  ) {
    Pictures.update(
      search,
      { $set: { emailSent: 'INVALID_EMAIL', emailJobId: job.id } },
      { new: true }
    );
    return done(new Error('invalid to address'));
  }

  const options = {
    to: email,
    text: getText(job.data.pictureSetId),
    html: emailTemplate(job.data.pictureSetId),
  };

  emailTransporter
    .sendMail(options)
    .then((info) => {
      debug(`email sent: ${info.response}`);
      return Pictures.update(
        search,
        { $set: { emailSent: 'SENT', emailJobId: job.id } },
        { new: true }
      );
    })
    .then((res) => done)
    .catch((err) => {
      console.log('error sending email', err);
      done(err);
    });
};
