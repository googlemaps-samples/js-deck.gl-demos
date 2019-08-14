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
 
import {layers} from './layers';
import {GoogleMapWithDeckGL} from './google_map';

// Builds the demo UI
class App {
  constructor() {
    console.log(process.env)
    this.GoogleMapWithDeckGL = new GoogleMapWithDeckGL();
    this.animation_frames = [];
    this.init();
    this.selected;
  }

  async init() {    
    const selected_layer = layers[0];
    const map_options = selected_layer.getMapOptions();
    this.buildMenu();
    await this.GoogleMapWithDeckGL.initMapWithOverlay(map_options);
    this.changeExample(selected_layer);  
  }

  buildMenu() {
    const menu_div = document.getElementById('menu');  
    layers.forEach((layer, index) => {
      const layer_metadata = layer.getMetadata();
      const button = document.createElement('button');
      const label = document.createElement('div');
      label.classList.add('label');
      label.innerText = layer_metadata.name;
      button.style.backgroundImage = `url("./img/${layer_metadata.thumbnail}")`;      
      button.onclick = (() => {                 
        this.selected.classList.remove('selected');    
        this.selected = button;
        this.selected.classList.add('selected');
        this.changeExample(layer);
      }).bind(this, layer);
      button.appendChild(label);
      menu_div.appendChild(button);
      if (index === 0) {
        this.selected = button;
        this.selected.classList.add('selected');
      }
    })    
  }

  changeExample(selected_layer) {
    let layers = selected_layer.getLayers(this.GoogleMapWithDeckGL);
    const map_options = selected_layer.getMapOptions();    
    this.setLayer(layers);  
    this.GoogleMapWithDeckGL.setMap(map_options);
  }

  
  // Changes the Deck.gl layer applied to GoogleMapsOverlay
  setLayer(layers) {    
    // Interrupt currently animated layer
    this.animation_frames.forEach(frame_id =>cancelAnimationFrame(frame_id));    
    let next = layers.next();    
    if (next.value){
      this.GoogleMapWithDeckGL.setLayer(next.value)
      if (!next.done){
        const id = requestAnimationFrame((() => {
            this.setLayer(layers)
          }).bind(this, layers));
        this.animation_frames.push(id)
      }
    }
  }  
}

const app = new App();