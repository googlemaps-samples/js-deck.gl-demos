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

import {MAP_STYLES} from '../map_styles';
import {GoogleMapsOverlay} from '@deck.gl/google-maps';
import {ArcLayer} from '@deck.gl/layers';

// source: Chicago Data Portal https://data.cityofchicago.org/Transportation/Taxi-Trips/wrvz-psew
const TAXI_RIDES =
  'https://data.cityofchicago.org/resource/wrvz-psew.json?$limit=25000';

// Set your Google Maps API key here or via environment variable
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_PLATFORM_API_KEY; // eslint-disable-line
const GOOGLE_MAPS_API_URL = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_PLATFORM_API_KEY}`;

function loadScript(url) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  const head = document.querySelector('head');
  head.appendChild(script);
  return new Promise(resolve => {
    script.onload = resolve;
  });
}

loadScript(GOOGLE_MAPS_API_URL).then(() => {
  const map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 41.932875, lng: -87.761911},
    zoom: 12,
    styles: MAP_STYLES
  });

  const overlay = new GoogleMapsOverlay({
    layers: [
      new ArcLayer({
        id: 'arcs',
        data: TAXI_RIDES,
        // dataTransform: d => d.features.filter(f => f.properties.scalerank < 4),
        getSourcePosition: f => [f.pickup_centroid_longitude, f.pickup_centroid_latitude],
        getTargetPosition: f => [f.dropoff_centroid_longitude, f.dropoff_centroid_latitude],
        getSourceColor: [0, 128, 200],
        getTargetColor: [255, 101, 101],
        getWidth: 0.5
      }),
    ]
  });
  overlay.setMap(map);
});
