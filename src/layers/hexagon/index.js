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
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78]
];
const base_uri = 'https://data.lacity.org/resource/6rrh-rzua.json';
const query = '$limit=100000&$WHERE=location_1 IS NOT NULL';
const data = `${base_uri}?${query}`;

export class HexagonLayerExample {
  constructor() {}
	static *getLayers() {
    return [
      new HexagonLayer({
        id: 'heatmap',
        data,
        colorRange: [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78]
],
        elevationRange: [0, 1000],
        elevationScale: 100,
        extruded: true,
        getPosition: d => [+d.location_1.longitude, +d.location_1.latitude],
        opacity: 1,
        radius: 50,
        lowerPercentile: 50
      })
    ]
  }
  static getMapOptions() {
    return {
      center: {lat: 34.051724, lng: -118.244023},
      zoom: 7
    }
  }
  static getMetadata() {
    return {
      name: 'Arc Layer',
      thumbnail: 'arc.png'
    }
  }
}