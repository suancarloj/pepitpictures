const exec = require('child_process').exec;
const express = require('express');
const router = express.Router();
// Create shutdown function
function shutdown(callback) {
  exec('shutdown now', (error, stdout, stderr) =>{ callback(stdout); });
}


router.get('/shutdown', (req, res, next) => {
  shutdown((output) => {
    console.log(output);
    res.json({})
  });
});

module.exports = router;