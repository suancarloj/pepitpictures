const exec = require('child_process').exec;
const express = require('express');
const router = express.Router();
// Create shutdown function
function shutdown(callback) {
  exec('shutdown now', (error, stdout, stderr) =>{ callback({ error, stderr }, stdout); });
}


router.get('/', (req, res, next) => {
  shutdown((err, output) => {
    console.log(err, output);
    res.json({})
  });
});

module.exports = router;