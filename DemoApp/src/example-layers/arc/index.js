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

/*
 * Demo of ArcLayer that renders Chicago taxi trips 
 * between neighborhood centroid origin and destination points
 *
 * Datasource: Chicago Data Portal
 * https://data.cityofchicago.org/Transportation/Taxi-Trips/wrvz-psew
 */
export class ArcLayerExample {
  constructor() {}
	static async *getLayers() {   
    const data_uri = 'https://data.cityofchicago.org/resource/wrvz-psew.json',
          qs = '?$LIMIT=25000&$WHERE=pickup_centroid_latitude IS NOT NULL AND dropoff_centroid_latitude IS NOT NULL';
    
    const layers = [
      new ArcLayer({
        id: 'arcs',
        data: data_uri + qs,
        getSourcePosition: f => [f.pickup_centroid_longitude, f.pickup_centroid_latitude],
        getTargetPosition: f => [f.dropoff_centroid_longitude, f.dropoff_centroid_latitude],
        getSourceColor: [0, 128, 200],
        getTargetColor: [255, 101, 101],
        getWidth: 0.5
    	})
    ];

    return layers;
  }
  static getMapOptions() {
    return {
      center: {lat: 41.932875, lng: -87.761911},
      zoom: 12
    }
  }
  static getMetadata() {
    return {
      name: 'arc',
      thumbnail: 'arc.png'
    }
  }
}