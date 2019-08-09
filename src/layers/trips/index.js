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
          getPath: d => d.segments,
          getColor: d => d.mode === 'driving' ? [239, 126, 35] : [85, 181, 238],
          opacity: 0.6,
          widthMinPixels: 2,
          rounded: true,
          trailLength: 75,
          currentTime: current_time
        })
      ]      
    }    
  }

  static getMapOptions() {    
    return {
      center: {lat: 37.791250, lng: -122.407463},
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
   
    // Build the set of trips and get directions between endpoints 
    places.forEach(async (place, index) => {
      const origin = [
        place.geometry.location.lat(),
        place.geometry.location.lng()
      ];
      for (let j = index + 1; j < places.length; j++) {
        const dest = [
          places[j].geometry.location.lat(),
          places[j].geometry.location.lng()
        ];
        const trip = this.getDirections(google_map.api, origin, dest);
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
      radius: '2000',
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
  async getDirections (api, origin, dest) {
    const base_uri = 'http://localhost:1337/directions';
    const qs = `origin_lat=${origin[0]}&origin_lng=${origin[1]}
                &dest_lat=${dest[0]}&dest_lng=${dest[1]}`;
    let request = fetch(`${base_uri}?${qs}`)
    let response = await request;
    response = await response.json();
    return response;
    // const directionsService = new api.DirectionsService();
    // let directions = new Promise((resolve, reject) => {
    //   directionsService.route(OPTIONS, (response, status) => {
    //     if (status === 'OK') {
    //       let duration = response.routes[0].legs[0].duration.value;
    //       let route = response.routes[0].legs[0].steps;
    //       route = this.formatRoute(route);
    //       resolve(route);
    //     }
    //     // Handle rate limiting from Directions Service if we hit it
    //     if (status === 'OVER_QUERY_LIMIT') {         
    //       this.getRoute(directionsService, OPTIONS);
    //     }        
    //   });
    // });
    // return directions;
  }

  // Formats Directions Service response to be TripsLayer-friendly
  // formatRoute(route) {
  //   let timestamp = 0;
  //   route = route.map(step => {
  //     let formatted_step = [
  //         step.start_location.lng(),
  //         step.start_location.lat(),
  //         timestamp
  //     ]
  //     timestamp += step.duration.value
  //     return formatted_step;
  //   });          
  //   return route;
  // }
}