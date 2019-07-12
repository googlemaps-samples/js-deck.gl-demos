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
import {GeoJsonLayer, ScatterplotLayer} from '@deck.gl/layers';

// source: NYC Open Data https://data.cityofnewyork.us/Environment/2015-Street-Tree-Census-Tree-Data/pi5s-9p35
const TREES =
  'https://data.cityofnewyork.us/resource/5rq2-4hqu.json?$limit=65000&&boroname=Manhattan';

const METERS = 'https://data.cityofnewyork.us/resource/92q3-8jse.json?$limit=15000';

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
    center: {lat: 40.760306, lng: -73.982302},
    zoom: 15,
    styles: MAP_STYLES
  });

  const overlay = new GoogleMapsOverlay({
    layers: [
      new ScatterplotLayer({
        id: 'scatterplot-tree-layer',
        data: TREES,
        opacity: 0.8,
        stroked: true,
        filled: true,
        radiusScale: 6,
        radiusMinPixels: 1,
        radiusMaxPixels: 100,
        lineWidthMinPixels: 1,
        getPosition: d => d.the_geom.coordinates,
        getFillColor: d => [51, 255, 60],
        getLineColor: d => [0, 0, 0]      
      }),
      new ScatterplotLayer({
        id: 'scatterplot-meter-layer',
        data: METERS,
        opacity: 0.8,
        stroked: true,
        filled: true,
        radiusScale: 6,
        radiusMinPixels: 1,
        radiusMaxPixels: 100,
        lineWidthMinPixels: 1,
        getPosition: d => d.the_geom.coordinates,
        getFillColor: d => [255, 51, 224],
        getLineColor: d => [0, 0, 0]      
      })
    ]
  });
  overlay.setMap(map);
});
