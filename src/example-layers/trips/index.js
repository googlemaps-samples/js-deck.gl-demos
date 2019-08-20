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
    const builder = new TripsBuilder(google_map, this.getMapOptions());    
    let i = 0;
    builder.genTrips();
    
    while (i < 5000) {
      let layers = [];
      const chunks = builder.getChunks();
      chunks.forEach((chunk, index) => {  
        const current_time = builder.getCurrentTime(index);
        const layer = new TripsLayer({
          id: 'trips-layer-' + index,
          data: chunk,          
          getPath: d => d.route,  
          getColor: d => d.mode === 'DRIVING' ? [239, 126, 35] : [16, 188, 219],      
          opacity: 0.7,
          widthMinPixels: 2,
          rounded: true,
          trailLength: 100,
          currentTime: current_time
        })
        layers.push(layer);
      })
      i++
      console.log(layers)
      yield layers;      
    }
  }

  static getMapOptions() {    
    return {
      center: {lat: 37.791250, lng: -122.407463},
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
    this.chunks = [];
    this.current_time = [];
  }

  async genTrips(map_options) {
    let trips = this.genTripsChunks(this.map_options);
    let next = await trips.next();    
    while (!next.done){
      this.chunks.push(next.value);
      this.current_time.push(0)
      next = await trips.next();
    }
  }

  async *genTripsChunks(map_options) {
    
    let places = await this.getPlaces();
    let endpoints = this.getTripsEndpoints(places);
    let trips = [];

    while (endpoints.length > 0) {
      let chunk = endpoints.splice(0, 10);      
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
        return trip
      });      
      chunk = await Promise.all(chunk);   
      yield chunk;
    }
  }

  // Gets Places around the map center to use as trip endpoints
  async getPlaces() {    
    const center = this.map_options.center;
    const places_service = new this.google_map.api.places.PlacesService(this.google_map.map);    
    const options = {
      location: new this.google_map.api.LatLng(center),
      radius: '3000',
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
    let directions = new Promise((resolve, reject) => {
      let directions_service = this.directions_service;
      let id = setInterval(() => {
        directions_service.route(options, function x(response, status){
          if (status === 'OK') {      
            clearInterval(id);                     
            resolve(response.routes[0].legs[0]);
          }          
        });        
      }, 1000)
      
    
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
    return endpoints;
  }

  getCurrentTime(index) {
    return this.current_time[index]++;
  }

  getChunks() {
    return this.chunks;
  } 

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
}