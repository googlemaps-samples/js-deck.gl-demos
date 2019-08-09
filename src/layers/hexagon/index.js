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

import {HexagonLayer} from '@deck.gl/layers';

const COLOR_RANGE = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78]
];

export class ArcLayerExample {
  constructor() {}
	static *getLayers() {
    return [
      new HexagonLayer({
        id: 'heatmap',
        colorRange: COLOR_RANGE,
        data,
        elevationRange: [0, 1000],
        elevationScale: 250,
        extruded: true,
        getPosition: d => d,
        opacity: 1,
        ...options
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
      name: 'Arc Layer',
      thumbnail: 'arc.png'
    }
  }
}