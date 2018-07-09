const nodemailer = require('nodemailer');
const config = require('config');
const Promise = require('bluebird');

let smtpConfig = {
  host: 'ssl0.ovh.net',
  port: 465,
  secure: true, // upgrade later with STARTTLS
  auth: config.email.credentials,
};

const smtpTransport = nodemailer.createTransport(smtpConfig, {
  from: '"Pepitpictures.com" info@pepitpictures.com',
  subject: 'Vos photos Pepit!',
});

const transporter = Promise.promisifyAll(smtpTransport);

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

module.exports = transporter;
