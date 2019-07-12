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
import {TripsLayer} from '@deck.gl/geo-layers';

let map;
let overlay;
let trips;

// Set your Google Maps API key here or via environment variable
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_PLATFORM_API_KEY; // eslint-disable-line
const GOOGLE_MAPS_API_URL = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_PLATFORM_API_KEY}&libraries=places`;
const MAP_CENTER = {lat: 40.757870, lng: -73.985625};


async function getPlaces(places_service) {
  
  const OPTIONS = {
    location: new google.maps.LatLng(MAP_CENTER),
    radius: '1600',
    type: ['restaurant']
  };
  let places_request = new Promise((resolve, reject) => {
    places_service.nearbySearch(OPTIONS, (res, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        reject(status);
      }
      resolve(res)
    });
  });
  return places_request;
}

async function getTrips(places) {
  let trips = [];
  for (let i = 0; i < places.length; i++) {
    const START = places[i].geometry.location.lat() + ',' + places[i].geometry.location.lng();
    for (let j = i+1; j<places.length; j++) {
      const END = places[j].geometry.location.lat() + ',' + places[j].geometry.location.lng();      
      const DIRECTIONS = getDirections(START, END);
      trips.push(DIRECTIONS);  
    }
  }
  trips = await Promise.all(trips);
  return trips;
}

async function getDirections (start, end) {
  let request = fetch(`http://localhost:1337/directions?start=${start}&end=${end}`)
  let response = await request;
  response = await response.json();
  return response;
}

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
let current_time = 0;
function render() {
  overlay.setProps({layers: [
    new TripsLayer({
      id: 'trips-layer',
      data: trips,
      getPath: d => d.segments,
      getColor: [253, 128, 93],
      opacity: 0.7,
      widthMinPixels: 2,
      rounded: true,
      trailLength: 100,
      currentTime: current_time
    })
  ]});
  current_time += 1;  
  requestAnimationFrame(render)
}

(async() => {
  await loadScript(GOOGLE_MAPS_API_URL);  
  map = new google.maps.Map(document.getElementById('map'), {
    center: MAP_CENTER,
    zoom: 16,
    styles: MAP_STYLES
  });
  const PLACES_SERVICE = new google.maps.places.PlacesService(map);
  const PLACES = await getPlaces(PLACES_SERVICE);
  trips = await getTrips(PLACES);
  overlay = new GoogleMapsOverlay();
  overlay.setMap(map);  
  render();
})();