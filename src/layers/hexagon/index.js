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

import {HexagonLayer} from '@deck.gl/aggregation-layers';

const COLOR_RANGE = [   
  [196, 255, 255],
  [116, 255, 255],
  [72, 189, 150],  
  [0, 171, 152],
  [63, 141, 90],  
  [47, 142, 34]
];

// source: Los Angeles Open Data
// https://data.lacity.org/A-Prosperous-City/Listing-of-Active-Businesses/6rrh-rzua
const query = '$limit=150000&$WHERE=location_1 IS NOT NULL';
const active_businesses = `https://data.lacity.org/resource/6rrh-rzua.json?${query}`;

export class HexagonLayerExample {
  constructor() {}
	static *getLayers() {
    return [
      new HexagonLayer({
        id: 'heatmap',
        colorDomain: [0,50],
        colorRange: COLOR_RANGE,
        data: active_businesses,
        elevationRange: [0, 300],
        elevationScale: 250,
        extruded: true,
        radius: 100,
        getPosition: d => [+d.location_1.longitude, +d.location_1.latitude],
        opacity: 0.2,        
        upperPercentile: 50,
        coverage: 0.8
      })
    ]
  }
  static getMapOptions() {
    return {
      center: {lat: 34.068739, lng: -118.323170},
      zoom: 13
    }
  }
  static getMetadata() {
    return {
      name: 'Arc Layer',
      thumbnail: 'hex.png'
    }
  }
}