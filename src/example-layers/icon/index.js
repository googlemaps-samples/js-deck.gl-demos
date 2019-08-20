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

import {ArcLayer} from '@deck.gl/layers';

// source: Chicago Data Portal https://data.cityofchicago.org/Transportation/Taxi-Trips/wrvz-psew
const businesses =
  'https://data.seattle.gov/resource/wnbq-64tb.json';

// Remove incomplete datapoints from the result set
const query = '?$limit=25000&$where=pickup_centroid_latitude%20is%20not%20null%20AND%20dropoff_centroid_latitude%20is%20not%20null';

export class ArcLayerExample {
  constructor() {}
	static async *getLayers() {
    return [
      new IconLayer({
          id: 'icon-layer',
          data: businesses,
          //pickable: true,
          iconMapping: '/static/icon-layer/location-icon-mapping.json',
          iconAtlas: '/static/icon-layer/location-icon-atlas.png',
          getIcon: d => 'marker',
          getPosition: d => d.coordinates,
          getSize: 100,
          sizeUnits: 'meters',
          //sizeScale: 1,
          sizeMinPixels: 8,
          sizeMaxPixels: 256
      })
    ]
  }
  static getMapOptions() {
    return {
      center: {lat: 41.932875, lng: -87.761911},
      zoom: 12
    }
  }
  static getMetadata() {
    return {
      name: 'icon',
      thumbnail: 'arc.png'
    }
  }
}