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

import {MAP_STYLES} from '../map_styles';
import {GoogleMapsOverlay} from '@deck.gl/google-maps';
import {ArcLayer} from '@deck.gl/layers';

// source: Chicago Data Portal https://data.cityofchicago.org/Transportation/Taxi-Trips/wrvz-psew
const TAXI_RIDES =
  'https://data.cityofchicago.org/resource/wrvz-psew.json?$limit=25000';

export const ArcLayerExample = new ArcLayer({
  id: 'arcs',
  data: TAXI_RIDES,
  // dataTransform: d => d.features.filter(f => f.properties.scalerank < 4),
  getSourcePosition: f => [f.pickup_centroid_longitude, f.pickup_centroid_latitude],
  getTargetPosition: f => [f.dropoff_centroid_longitude, f.dropoff_centroid_latitude],
  getSourceColor: [0, 128, 200],
  getTargetColor: [255, 101, 101],
  getWidth: 0.5
});
