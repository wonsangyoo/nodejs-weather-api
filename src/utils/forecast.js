const request = require('request');

const forecast = (latitude, longtitude, callback) => {
  const url =
    'http://api.weatherstack.com/current?access_key=36a43779d111ee92472820c7d080fcb6&query=' +
    latitude +
    ',' +
    longtitude;
  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback('Unable to connect to location services!', undefined);
    } else if (body.success === false) {
      callback('Unable to find location. Try another search.', undefined);
    } else {
      callback(
        undefined,
        body.location.name +
          ' is ' +
          body.current.weather_descriptions[0] +
          '. It is currently ' +
          body.current.temperature +
          ' degrees out, and it feels like ' +
          body.current.feelslike +
          ' degrees out.'
      );
    }
  });
};

module.exports = forecast;
