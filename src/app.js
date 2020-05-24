const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather',
    name: 'Wonsang Yoo',
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Me',
    name: 'Wonsang Yoo',
  });
});

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term',
    });
  }
  console.log(req.query);
  res.send({
    products: [],
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    helpText: 'akarws@gmail.com',
    title: 'Help',
    name: 'Wonsang Yoo',
  });
});

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'You must provide an address',
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longtitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(latitude, longtitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }
        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );

  // res.send({
  //   forecast: 'It is snowing',
  //   location: 'Philadelphia',
  //   address: req.query.address,
  // });
});

app.get('/help/*', (req, res) => {
  // res.send('Help article not found');
  res.render('404', {
    title: '404',
    name: 'Wonsang Yoo',
    errorMessage: 'Help Article Not Found',
  });
});

// 404 - match anything that hasn't been matched so far
app.get('*', (req, res) => {
  // res.send('My 404 page');
  res.render('404', {
    title: '404',
    name: 'Wonsang Yoo',
    errorMessage: 'Page Not Found',
  });
});

app.listen(port, () => {
  console.log('Server is up on port' + port);
});
