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
  static *getLayers(google_map) {
    let layers = [];
    const builder = new TripsBuilder(google_map);
    let trips = builder.getTrips(this.getMapOptions());
    let next = trips.next();
    console.log(next)    
    let current_time = 0;
    while (!next.done) {        
      let layer = new TripsLayer({
        id: 'trips-layer',
        data: next.value,
        getPath: d => d,
        getColor: [253, 128, 93],
        opacity: 0.7,
        widthMinPixels: 2,
        rounded: true,
        trailLength: 100,
        currentTime: current_time
      });
      layers.push(layer);
      current_time++;
      next = trips.next();
      yield []
    }

    // for (let i = 1; i <= 300; i++) {
    //   yield [
        
    //   ]      
    // }    
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
  constructor(google_map) {    
    this.map = google_map.map
    this.maps_js_api = google_map.api;
    this.places_service = new this.maps_js_api.places.PlacesService(google_map.map);
    this.directions_service = new this.maps_js_api.DirectionsService();    
  }
  
  async *getTrips(map_options) {
    let trips = [];
    let places = await this.getPlaces(map_options.center);
    places = places.slice(0,6);

    for(let i = 0; i< places.length; i++) {
      const START = places[i].place_id;
      for (let j = i + 1; j < places.length; j++) {
        const END = places[j].place_id;
        const trip = this.getDirections(START, END);
        // if (trip.duration > trips.duration) {
        //   trips.duration = trip.duration;
        // }
        trips.push(trip);
        
        if (trips.length === 10) {
          trips = await Promise.all(trips);
          yield trips;
          trips = [];
        }
      }
    };    
  }

  async getPlaces(center) {    
    const OPTIONS = {
      location: new this.maps_js_api.LatLng(center),
      radius: '1600',
      type: ['restaurant']
    };
    const places_request = new Promise((resolve, reject) => {
      this.places_service.nearbySearch(OPTIONS, (res, status) => {
        if (status === 'OK') {
          resolve(res);
        }
        reject(status);        
      });
    });
    const places = await places_request;
    return places;
  }

  async getDirections (start, end) {
    const OPTIONS = {
      origin: { placeId: start },
      destination: { placeId: end },
      travelMode: 'DRIVING'
    }    
    let directions = new Promise((resolve, reject) => {
      this.directions_service.route(OPTIONS, (response, status) => {
        if (status === 'OK') {
          let duration = response.routes[0].legs[0].duration.value;
          let route = response.routes[0].legs[0].steps;
          route = this.formatRoute(route);
          resolve(route);
        }
        if (status === 'OVER_QUERY_LIMIT') {         
          this.getDirections(start, end);
        }        
      });
    });
    directions = await directions;
    return directions;
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