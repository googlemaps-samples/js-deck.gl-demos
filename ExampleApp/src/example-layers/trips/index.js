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
  static async *getLayers(google_map) {        
    // start generating trips from Places API & Directions API
    const tripsBuilder = new TripsBuilder(google_map, this.getMapOptions());    
    let render_count = 0; // number of times to iterate and render layers
    
    while (render_count < 5000) {      
      // check if a new chunk is available to render new layer
      const chunks = tripsBuilder.getChunks();
      let layers = [];

      chunks.forEach((chunk, index) => {        
        let current_time = tripsBuilder.getCurrentTime(index);
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
        tripsBuilder.setCurrentTime(index, current_time);
      });
      
      render_count++;
      yield layers;      
    }
  }

  static getMapOptions() {    
    return {
      center: {lat: 37.787732, lng: -122.403436},
      zoom: 15
    }
  }
  static getMetadata() {
    return {
      name: 'trips',
      thumbnail: 'trips.png'
    }
  }
}

class TripsBuilder {
  constructor(google_map, map_options) {
    this.google_map = google_map;
    this.map_options = map_options;
    this.directions_service = new google_map.api.DirectionsService();
    this.places_service = new google_map.api.places.PlacesService(google_map.map);
    this.chunks = [];
    this.current_time = [];
    this.genTrips();
  }

  async genTrips() {
    let trips = this.genTripsChunk(this.map_options);
    let next = await trips.next();    
    while (!next.done){
      this.chunks.push(next.value);
      this.current_time.push(0);
      next = await trips.next();
    }
  }

  // Generates the trips in chunks so we don't 
  // have to wait for all calls to complete
  async *genTripsChunk() {    
    const places = await this.getPlaces();
    const endpoints = this.getTripsEndpoints(places);    
    
    // generate the trips in sets of 5
    while (endpoints.length > 0) {
      let chunk = endpoints.splice(0, 5);      
      let chunk_runtime = 0;
      chunk = chunk.map(async(trip) => {
        const mode = trip.mode;
        trip = await this.getDirections(trip); 
        const duration = trip.duration.value;        
        const route = trip.steps;
        trip = {
          duration: duration,
          route: this.formatRoute(route),
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
  async getPlaces() {    
    const center = this.map_options.center;
    const places_service = this.places_service;    
    const options = {
      location: new this.google_map.api.LatLng(center),
      radius: '2000',
      type: ['restaurant']
    };
    const places_request = new Promise((resolve, reject) => {
      places_service.nearbySearch(options, (res, status) => {
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
  async getDirections (trip) {
    const options = {
      origin: new this.google_map.api.LatLng(trip.origin.lat, trip.origin.lng),
      destination: new this.google_map.api.LatLng(trip.dest.lat, trip.dest.lng),
      travelMode: trip.mode
    }    
    const directions = new Promise((resolve, reject) => {
      const directions_service = this.directions_service;
      const id = setInterval(() => {
        directions_service.route(options, (response, status) => {
          if (status === 'OK') {      
            clearInterval(id);                     
            resolve(response.routes[0].legs[0]);
          }
        });        
      }, 1000);      
    });
    return directions;
  }

  /* Utils */
  getTripsEndpoints (places) {
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
    endpoints = this.shuffleArr(endpoints);
    return endpoints;
  }

  /* accessors/mutators */
  getCurrentTime(index) {
    return this.current_time[index];
  }

  setCurrentTime(index, timestamp) {
    this.current_time[index] = timestamp;
  }

  getChunks() {
    return this.chunks;
  } 

  /* utils */
  formatRoute(route) {
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

  shuffleArr(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * arr.length);
      const val = arr[i];
      arr[i] = arr[j];
      arr[j] = val;
    }
    return arr;
  }
}
