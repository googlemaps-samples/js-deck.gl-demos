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
 
/* global document, google */
import {GoogleMapsOverlay} from '@deck.gl/google-maps';
import {GeoJsonLayer, ScatterplotLayer} from '@deck.gl/layers';
import {TripsLayer} from '@deck.gl/geo-layers';

let map;
let overlay;
let trips;

// Set your Google Maps API key here or via environment variable
const GOOGLE_MAPS_API_KEY = process.env.GoogleMapsAPIKey; // eslint-disable-line
const GOOGLE_MAPS_API_URL = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
const MAP_CENTER = {lat: 40.757870, lng: -73.985625};
const MAP_STYLES = [
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#263c3f"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6b9a76"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#38414e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#212a37"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9ca5b3"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#1f2835"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#f3d19c"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2f3948"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#515c6d"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  }
];

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