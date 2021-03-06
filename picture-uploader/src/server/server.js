const express = require('express');
const path = require('path');
const logger = require('morgan');

const app = express();

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '../../build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});

app.listen(3001, () => {
  console.log('listening on port: ', 3001);
});
