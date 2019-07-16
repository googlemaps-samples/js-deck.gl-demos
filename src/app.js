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
 
import {MAP_STYLES} from './map_styles';
import {GoogleMapsOverlay} from '@deck.gl/google-maps';
import {EXAMPLE_LAYERS} from './layers';
import {ArcLayer} from '@deck.gl/layers';
export class GoogleMapWithDeckGL {

  constructor() {
    // Set your Google Maps API key here or via environment variable
    this.map;
    this.overlay;
  }

  // Load the Google Maps Platform JS API
  loadScript() {
    const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    const GOOGLE_MAPS_API_URL = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    const head = document.querySelector('head');
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = GOOGLE_MAPS_API_URL;    
    head.appendChild(script);
    return new Promise(resolve => {
      script.onload = resolve;
    });
  }

  // Init the base map with Deck.gl overlay
  async initMapWithOverlay(options) {
    await this.loadScript();
    this.overlay = new GoogleMapsOverlay({layers: [
      new ArcLayer({
        id: 'arcs',
        data: 'https://data.cityofchicago.org/resource/wrvz-psew.json?$limit=25000',
        getSourcePosition: f => [f.pickup_centroid_longitude, f.pickup_centroid_latitude],
        getTargetPosition: f => [f.dropoff_centroid_longitude, f.dropoff_centroid_latitude],
        getSourceColor: [0, 128, 200],
        getTargetColor: [255, 101, 101],
        getWidth: 0.5
      })
    ]});    
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: options.center,
      zoom: options.zoom,
      styles: MAP_STYLES
    });    
    
    this.overlay.setMap(this.map);    
  }

  setLayer(deckgl_layers) {
    this.overlay.setProps({layers: deckgl_layers});
  }
}