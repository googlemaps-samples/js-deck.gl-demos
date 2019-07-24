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
 
import {TripsLayer} from '@deck.gl/geo-layers';
import * as GoogleMapsClient from '@google/maps';


export class TripsLayerExample {
  constructor() {}
  static getLayers(google_map) {
    const builder = new TripsBuilder();
    const trips = builder.getTrips(google_map.api, this.getMapOptions());
    return [
      new TripsLayer({
        id: 'trips-layer',
        data: trips,
        getPath: d => d.segments,
        getColor: [253, 128, 93],
        opacity: 0.7,
        widthMinPixels: 2,
        rounded: true,
        trailLength: 100,
        currentTime: 0
      })
    ]
  }
  static getMapOptions() {
    return {
      center: {lat: 40.757870, lng: -73.985625},
      zoom: 16
    }
  }
  static getMetadata() {
    return {
      name: 'Trips Layer',
      thumbnail: 'trips.png'
    }
  }
}

class TripsBuilder {
  constructor() {
    
  }
  
  getPlaces(api, map_options) {
    console.log(google)
    const places_service = new api.places.PlacesService(map);
    const OPTIONS = {
      location: new google.maps.LatLng(map_options.center),
      radius: '1600',
      type: ['restaurant']
    };
    let places_request = new Promise((resolve, reject) => {
      places_service.nearbySearch(OPTIONS, (res, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          reject(status);
        }
        console.log(res)
        resolve(res)
      });
    });
    return places_request;
  }

  async getTrips(api, map_options) {
    let places = await this.getPlaces(api, map_options);
    let trips = [];
    for (let i = 0; i < places.length; i++) {      
      const START = {place_id: places[i].place_id};
      // const START = places[i].geometry.location.lat() + ',' + places[i].geometry.location.lng();
      for (let j = i+1; j < places.length; j++) {
        const END = {place_id: places[j].place_id};
        // const END = places[j].geometry.location.lat() + ',' + places[j].geometry.location.lng();      
        const DIRECTIONS = this.getDirections(api, START, END);
        trips.push(DIRECTIONS);  
      }
    }
    trips = await Promise.all(trips);
    return trips;
  }

  async getDirections (api, start, end) {
    // const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    const OPTIONS = {
      origin: new api.LatLng(start[0], start[1]),
      destination: new api.LatLng(end[0], end[1]),
      travelMode: 'DRIVING'
    }
    // const request_url = `https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${end}&key=${GOOGLE_MAPS_API_KEY}`
    // const result = await fetch(request_url, {mode: 'no-cors'});

    // // result.then((s)=>{console.log(s)}).catch(e=> console.log('catch'+e))
    // result = await result.json();
    // console.log(result)

    // result = result.routes[0].legs[0];
    let service = new api.DirectionsService();
    let request = new Promise((resolve, reject) => {
      service.route(OPTIONS, (res, status) => {
        console.log(res)
      })
    })
let t = await request;

    // let segments = this.buildSegments(result.start_location, result.steps)
    // let directions = {
    //   duration: result.duration.value,
    //   segments: segments
    // }
    // return directions;
  }

  buildSegments(start_coords, steps) {
    segments = [];
    let timestamp = 0;
    segments.push([start_coords.lng, start_coords.lat, timestamp]);
    steps.forEach(step => {
      timestamp += step.duration.value;
      segments.push([step.end_location.lng, step.end_location.lat, timestamp]);    
    });
    return segments;
  }
}

// class tripRoutes {
//   constructor() {}
  

  

//   let current_time = 0;
//   function render() {
//     overlay.setProps({layers: });
//     current_time += 1;  
//     requestAnimationFrame(render)
//   }

  
// }