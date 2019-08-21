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

// Set your api key in GoogleMapsAPIKey env var
const path = require('path');
const express = require('express');

// Google Maps Node.js utility library: https://goo.gle/maps-node-util
const googlemaps_client = require('@google/maps').createClient({
  key: process.env.GoogleMapsAPIKey,
  Promise: Promise
});

// Setup local webserver
const app = express();      
app.listen(process.env.PORT || 1337);
app.use(express.static(path.join(__dirname, '../dist')));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.get('/', (req, res) => {       
  res.sendFile(path.join(__dirname, '/index.html'));
});