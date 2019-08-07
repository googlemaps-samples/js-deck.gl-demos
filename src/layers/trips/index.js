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
    const builder = new TripsBuilder();
    let trips = builder.getTrips(google_map, this.getMapOptions());    

    // Limit how long the demo runs
    for (let current_time = 0; current_time <= 1000; current_time++) {
      yield [
        new TripsLayer({
          id: 'trips-layer',
          data: trips,
          getPath: d => d,
          getColor: [253, 128, 93],
          opacity: 0.7,
          widthMinPixels: 2,
          rounded: true,
          trailLength: 100,
          currentTime: current_time
        })
      ]      
    }    
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
  constructor() {}

  // Builds trips using Places Library for endpoints and Directions Service for segments
  async getTrips(google_map, map_options) {
    let trips = [];
    let places = await this.getPlaces(google_map.api, google_map.map, map_options.center);
  
    // Limit number of places so we don't hit rate limiting on directions
    places = places.slice(0,5);
        
    // Build the set of trips 
    places.forEach(async (place, index) => {
      const START = place.place_id;
      for (let j = index + 1; j < places.length; j++) {
        const END = places[j].place_id;
        const trip = this.getDirections(google_map.api, START, END);
        trips.push(trip);
      }
    });
    trips = await Promise.all(trips);
    return trips;
  }

  // Gets Places around the map center to use as trip endpoints
  async getPlaces(api, map, center) {
    const places_service = new api.places.PlacesService(map);
    const OPTIONS = {
      location: new api.LatLng(center),
      radius: '1600',
      type: ['restaurant']
    };
    const places_request = new Promise((resolve, reject) => {
      places_service.nearbySearch(OPTIONS, (res, status) => {
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
  async getDirections (api, start, end) {
    const OPTIONS = {
      origin: { placeId: start },
      destination: { placeId: end },
      travelMode: 'DRIVING'
    }
    const directionsService = new api.DirectionsService();
    let directions = new Promise((resolve, reject) => {
      directionsService.route(OPTIONS, (response, status) => {
        if (status === 'OK') {
          let duration = response.routes[0].legs[0].duration.value;
          let route = response.routes[0].legs[0].steps;
          route = this.formatRoute(route);
          resolve(route);
        }
        // Handle rate limiting from Directions Service if we hit it
        if (status === 'OVER_QUERY_LIMIT') {         
          this.getRoute(directionsService, OPTIONS);
        }        
      });
    });
    return directions;
  }

  // Formats Directions Service response to be TripsLayer-friendly
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