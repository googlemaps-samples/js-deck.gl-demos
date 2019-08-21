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
 
import {ScatterplotLayer} from '@deck.gl/layers';

/*
 * Demo of ScatterplotLayer that renders composite 
 * layers of Manhattan street tree and parking meter geocodes
 *
 * Datasource: NYC Open Data 
 * https://data.cityofnewyork.us/Environment/2015-Street-Tree-Census-Tree-Data/pi5s-9p35
 * https://data.cityofnewyork.us/Transportation/Parking-Meters-GPS-Coordinates-and-Status/5jsj-cq4s
 */
export class ScatterplotLayerExample {
  constructor() {}
  static async *getLayers() {    
    const data_uri = {
      trees: 'https://data.cityofnewyork.us/resource/5rq2-4hqu.json',
      parking_meters: 'https://data.cityofnewyork.us/resource/xx9u-e8wf.json'
    };
    const qs = {
      trees: '?$limit=65000&&boroname=Manhattan',
      parking_meters: '?$limit=15000'
    };
    const layers = [
      new ScatterplotLayer({
        id: 'scatterplot-tree-layer',
        data: data_uri.trees + qs.trees,
        getPosition: d => d.the_geom.coordinates,
        getFillColor: d => [51, 255, 60],
        getLineColor: d => [0, 0, 0],
        opacity: 0.8,
        stroked: true,
        filled: true,
        radiusScale: 6,
        radiusMinPixels: 1,
        radiusMaxPixels: 100,
        lineWidthMinPixels: 1      
      }),
      new ScatterplotLayer({
        id: 'scatterplot-meter-layer',
        data: data_uri.parking_meters + qs.parking_meters,
        getPosition: d => d.the_geom.coordinates,
        getFillColor: d=> [255, 51, 224],
        getLineColor: d => [0, 0, 0],
        opacity: 0.8,
        stroked: true,
        filled: true,
        radiusScale: 6,
        radiusMinPixels: 1,
        radiusMaxPixels: 100,
        lineWidthMinPixels: 1,        
      })
    ];

    return layers;
  }
  static getMapOptions() {
    return {
      center: {lat: 40.760306, lng: -73.982302},
      zoom: 15
    }
  }
  static getMetadata() {
    return {
      name: 'scatterplot',
      thumbnail: 'scatterplot.png'
    }
  }
}
