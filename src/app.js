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

export class GoogleMapWithDeckGL {

  constructor() {
    // Set your Google Maps API key here or via environment variable    
    this.api;
    this.map;
    this.overlay;
  }

  // Load the Google Maps Platform JS API
  loadScript() {
    const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    const GOOGLE_MAPS_API_URL = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
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
    this.api = google.maps;
    this.overlay = new GoogleMapsOverlay();    
    this.map = new this.api.Map(document.getElementById('map'), {
      center: options.center,
      zoom: options.zoom,
      styles: MAP_STYLES
    });    
    this.overlay.setMap(this.map);    
  }

  setLayer(deckgl_layers) {
    console.log(deckgl_layers)
    this.overlay.setProps({layers: deckgl_layers});
  }
}