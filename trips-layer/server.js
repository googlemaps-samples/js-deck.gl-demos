const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GoogleMapsAPIKey,
  Promise: Promise
});
const express = require('express');
const app = express();
app.listen(process.env.PORT || 1337);

app.use(express.static(__dirname + '/dist'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/directions', async(req, res) => {
  const START = req.query.start.split(',');
  const END = req.query.end.split(',');
  const OPTIONS = {
    origin: START,
    destination: END,
    mode: 'driving'
  }
  let request = googleMapsClient.directions(OPTIONS).asPromise();
  let result = await request;
  result = result.json.routes[0].legs[0];
  let segments = buildSegments(result.start_location, result.steps)
  let directions = {
    duration: result.duration.value,
    segments: segments
  }
  res.set('Access-Control-Allow-Origin', '*')
  res.json(directions);
});

function buildSegments(start_coords, steps) {
  segments = [];
  let timestamp = 0;
  segments.push([start_coords.lng, start_coords.lat, timestamp]);
  steps.forEach(step => {
    timestamp += step.duration.value;
    segments.push([step.end_location.lng, step.end_location.lat, timestamp]);    
  });
  return segments;
}