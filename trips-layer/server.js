/*
 * Copyright 2019 Google LLC

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 *  https://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
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