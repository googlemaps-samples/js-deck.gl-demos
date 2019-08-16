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

// Set your api key in src/GoogleMapsAPIKey or GoogleMapsAPIKey env var
const googlemaps_api_key = require('./GoogleMapsAPIKey');
const path = require('path');
const express = require('express');

// Google Maps Node.js utility library: https://goo.gle/maps-node-util
const googlemaps_client = require('@google/maps').createClient({
  key: googlemaps_api_key || process.env.GoogleMapsAPIKey,
  Promise: Promise
});

// Setup local webserver
const app = express();      
app.listen(process.env.PORT || 1337);
app.use(express.static(path.join(__dirname, '../dist')));
app.use('/img', express.static(path.join(__dirname, '../img')));
app.get('/', (req, res) => {       
  res.sendFile(path.join(__dirname, '/index.html'));      
});  

// Get route details from the Directions API
app.get('/directions', async(req, res) => {
  const options = {
    origin: [+req.query.origin_lat, +req.query.origin_lng],
    destination: [+req.query.dest_lat, +req.query.dest_lng],
    mode: (Math.random() >= 0.5 ? 'driving': 'walking')
  }
  let response = await googlemaps_client.directions(options).asPromise();  
  let directions = response.json.routes[0].legs[0];
  let duration = directions.duration.value;
  directions = directions.steps;
  directions = formatDirections(directions);
  directions = {
    duration: duration,
    segments: directions,
    mode: options.mode
  }
  // Add CORS header
  res.set('Access-Control-Allow-Origin', '*')
  res.json(directions);
});
  
  
// Formats Directions Service response to be TripsLayer-friendly
function formatDirections(directions) {
  let timestamp = 0;
  directions = directions.map(step => {
    const formatted_step = [
        step.start_location.lng,
        step.start_location.lat,
        timestamp
    ]
    timestamp += step.duration.value
    return formatted_step;
  });          
  return directions;
}
