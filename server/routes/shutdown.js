
const express = require('express');
const router = express.Router();
const sudo = require('sudo-js');
const config = require('config');

sudo.setPassword(config.sudoPassword);

router.get('/', (req, res, next) => {
  sudo.exec(['shutdown', 'now'], function(err, pid, result) {
    console.log(result);
  });
});

module.exports = router;