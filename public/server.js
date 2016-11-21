const EXPRESS = require('express');
const CHALK = require('chalk');
const CORS = require('cors');
const Colorizer = require('colorizer');
const rgbHex = require('rgb-hex');

const SERVER = EXPRESS();
const PORT = process.env.PORT || 3000;

SERVER.use(CORS());

SERVER.get('/', function (request, response) {
  if (request.query.hasOwnProperty('color')) {
    let query = request.query.color.toLowerCase().replace(/(?:\s|%20)/g, '')
    let color;
    let hsl = false;
    try {
      if (/^hsl\(\d{1,3},\d{1,3}%,\d{1,3}%\)$/.test(query)) {
        query = query.replace(/^hsl\((\d{1,3}),(\d{1,3})%,(\d{1,3})%\)$/, '$1,$2,$3');
        query = query.split(',').map(numbers => +numbers);
        hsl = true;
      }
      if (/^rgb/.test(query)) {
        query = rgbHex(query);
      }
      color = Colorizer(query, hsl);
      color = color.to('hex');
      response.send(`#${color}`);
    } catch (error) {
      response.send('Invalid color');
    }
  } else {
    response.send('Invalid color');
  }
});

SERVER.listen(PORT, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(CHALK.cyan(`Server is up on port: ${PORT}`));
    // open("http://localhost:" + PORT);
  }
});
