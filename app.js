const PORT = process.env.PORT || 3000;

const seleniumController = require('./controller/selenium.js');

const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end(seleniumController.render());
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
