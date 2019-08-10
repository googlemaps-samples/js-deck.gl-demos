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
  [212, 255, 198],
  [0, 171, 152],
  [73, 169, 0],
  [90, 168, 115],
  [66, 179, 246],
  [72, 107, 217]
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
        radius: 75,
        getPosition: d => [+d.location_1.longitude, +d.location_1.latitude],
        opacity: 0.3,        
        upperPercentile: 50
      })
    ]
  }
  static getMapOptions() {
    return {
      center: {lat: 34.051724, lng: -118.244023},
      zoom: 11
    }
  }
  static getMetadata() {
    return {
      name: 'Arc Layer',
      thumbnail: 'arc.png'
    }
  }
}