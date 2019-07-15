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
import {ArcLayerExample} from './arc-layer';

class GoogleMapWithDeckGL {

  constructor(api_key) {
    // Set your Google Maps API key here or via environment variable
    this.api_key = api_key || process.env.GOOGLE_MAPS_API_KEY;
    this.overlay = this.initMapWithOverlay();
  }

  // Load the Google Maps Platform JS API
  loadScript() {
    const GOOGLE_MAPS_API_URL = `https://maps.googleapis.com/maps/api/js?key=${this.api_key}`;
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = GOOGLE_MAPS_API_URL;
    const head = document.querySelector('head');
    head.appendChild(script);
    return new Promise(resolve => {
      script.onload = resolve;
    });
  }

  // Init the base map with Deck.gl overlay
  async initMapWithOverlay() {
    await this.loadScript();
    const map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.760306, lng: -73.982302},
      zoom: 15,
      styles: MAP_STYLES
    });
    const overlay = new GoogleMapsOverlay();
    overlay.setMap(map);
    return overlay;
   }
  
}

let test = new GoogleMapWithDeckGL();
