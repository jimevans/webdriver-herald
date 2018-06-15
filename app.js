const PORT = process.env.PORT || 3000;

const seleniumController = require('./controller/selenium.js');
const wptController = require('./controller/wpt.js');

const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end(seleniumController.render('current'));
});

app.get('/selenium', (req, res) => {
  res.redirect('/selenium/current');
});

app.get('/wpt', (req, res) => {
  res.redirect('/wpt/current');
});

app.get('/selenium/:runId', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end(seleniumController.render(req.params['runId']));
});

app.get('/wpt/:runId', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(wptController.render(req.params['runId']));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
