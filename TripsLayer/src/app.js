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
import {map_styles} from './map_styles';
import {GoogleMapsOverlay} from '@deck.gl/google-maps';
import {TripsLayer} from '@deck.gl/geo-layers';

/* SET YOU APIR KEY HERE OR IN GoogleMapsAPIKey ENV VAR */
const YOUR_API_KEY = '',
      MAP_CENTER = {lat: 37.787732, lng: -122.403436};

let places_lib,
    directions_svc,
    deckgl_overlay,
    chunks = [],
    timers = [];

/*
 * Demo of using chunking to build composite TripsLayers that render directions 
 * generated with the Maps JS API directions services between endpoints generated
 * the Maps JS API Places library.
 */

async function run(overlay) {
  await init(); // do all our Google Maps and deck.gl overlay setup
  genTrips(); // start generating chunks
  renderTripsLayers(); // render chunks into TripsLayers recursively
}

function renderTripsLayers () {
  let layers = [];
  console.log(chunks)
  // create layer from any chunks that have been generated
  chunks.forEach((chunk, index) => {        
    let current_time = timers[index];
    if (current_time > chunk.runtime) current_time = 0;
    const layer = new TripsLayer({
      id: 'trips-layer-' + index,
      data: chunk.data,
      getPath: d => d.route,  
      getColor: d => d.mode === 'DRIVING' ? [239, 126, 35] : [16, 188, 219],      
      opacity: 0.7,
      widthMinPixels: 2,
      rounded: true,
      trailLength: 100,
      currentTime: current_time
    });
    layers.push(layer);      
    current_time++;
    timers[index] = current_time;
  });
  deckgl_overlay.setProps({layers: layers}); 
  requestAnimationFrame(renderTripsLayers); // re-render layer with next timestamp
}

// Init the base map and deck.gl GoogleMapsOverlay, then add the layer
async function init() {
  await loadScript();
  const MAP = new google.maps.Map(document.getElementById('map'), {
          center: MAP_CENTER,
          zoom: 15,
          styles: map_styles
        });        
  deckgl_overlay = new GoogleMapsOverlay();
  deckgl_overlay.setMap(MAP);
  places_lib = new google.maps.places.PlacesService(MAP);
  directions_svc = new google.maps.DirectionsService();
}

async function genTrips() {
  let trips = genTripsChunk();
  let next = await trips.next();    
  while (!next.done){    
    chunks.push(next.value);
    console.log(chunks)
    timers.push(0);
    next = await trips.next();
  }
}

// Generates the trips in chunks so we don't 
// have to wait for all calls to complete
async function *genTripsChunk() {    
  const places = await getPlaces();
  const endpoints = getTripsEndpoints(places);    
  
  // generate the trips in sets of 5
  while (endpoints.length > 0) {
    let chunk = endpoints.splice(0, 5);      
    let chunk_runtime = 0;
    chunk = chunk.map(async(trip) => {
      const mode = trip.mode;
      trip = await getDirections(trip); 
      const duration = trip.duration.value;        
      const route = trip.steps;
      trip = {
        duration: duration,
        route: formatRoute(route),
        mode: mode
      }
      // Set the total layer runtime to equal longest trip in set
      if (duration > chunk_runtime) chunk_runtime = duration;
      return trip
    });      
    chunk = await Promise.all(chunk);
    chunk = {
      data: chunk,
      runtime: chunk_runtime
    }
    yield chunk;
  }
}

// Gets Places around the map center to use as trip endpoints
async function getPlaces() {    
  const options = {
    location: new google.maps.LatLng(MAP_CENTER),
    radius: '2000',
    type: ['restaurant']
  };
  const places_request = new Promise((resolve, reject) => {
    places_lib.nearbySearch(options, (res, status) => {
      if (status === 'OK') {
        resolve(res);
      }
      reject(status);        
    });
  });
  const places = await places_request;    
  return places;
}

// Gets Directions to define the trip route
async function getDirections (trip) {
  const options = {
    origin: new google.maps.LatLng(trip.origin.lat, trip.origin.lng),
    destination: new google.maps.LatLng(trip.dest.lat, trip.dest.lng),
    travelMode: trip.mode
  }    
  const directions = new Promise((resolve, reject) => {
    const id = setInterval(() => {
      directions_svc.route(options, (response, status) => {
        if (status === 'OK') {      
          clearInterval(id);                     
          resolve(response.routes[0].legs[0]);
        }          
      });        
    }, 1000);
  });
  return directions;
}

/* utils */
function getTripsEndpoints (places) {
  let endpoints = [];
  // Build the set of trips and get directions between endpoints 
  places.forEach(async (place, index) => {      
    const origin = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    };
    for (let j = index + 1; j < places.length; j++) {
      const dest = {
        lat: places[j].geometry.location.lat(),
        lng: places[j].geometry.location.lng()
      };        
      const mode = (Math.random() >= 0.5 ? 'DRIVING': 'WALKING');        
      endpoints.push({origin: origin, dest: dest, mode: mode});
    }
  });
  // shuffle the array so trips render randomly around the map
  endpoints = shuffleArr(endpoints);
  return endpoints;
}

function formatRoute(route) {
  let timestamp = 0;
  route = route.map(step => {
    let formatted_step = [
        step.start_location.lng(),
        step.start_location.lat(),
        timestamp
    ]
    timestamp += step.duration.value
    return formatted_step;
  });              
  return route;
}

function shuffleArr(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * arr.length);
    const val = arr[i];
    arr[i] = arr[j];
    arr[j] = val;
  }
  return arr;
}

// Load the Google Maps Platform JS API async
function loadScript() {  
  const GOOGLE_MAPS_API_KEY = YOUR_API_KEY || process.env.GoogleMapsAPIKey,
        GOOGLE_MAPS_API_URI = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`,
        HEAD = document.querySelector('head'),
        SCRIPT = document.createElement('script');

  SCRIPT.type = 'text/javascript';
  SCRIPT.src = GOOGLE_MAPS_API_URI;
  HEAD.appendChild(SCRIPT);
  return new Promise(resolve => {
    SCRIPT.onload = resolve;
  });
}

run();