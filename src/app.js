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
 
import {examples} from './example-layers';
import {GoogleMapWithDeckGL} from './GoogleMapWithDeckGL';

// Builds the demo UI
class App {
  constructor() {
    this.GoogleMapWithDeckGL = new GoogleMapWithDeckGL();
    this.animation_frames = [];
    this.init();
    this.selected_button;
  }

  async init() {    
    const default_example = examples[0];
    const map_options = default_example.getMapOptions();    
    await this.GoogleMapWithDeckGL.initMapWithOverlay(map_options);    
    this.buildMenu();
    this.changeExample(default_example);  
  }

  buildMenu() {
    const menu = document.getElementById('menu');  
    // remove the menu when the map is being dragged
    this.GoogleMapWithDeckGL.map.addListener('dragstart', () => {      
      menu.classList.add('fade');
    });    
    this.GoogleMapWithDeckGL.map.addListener('dragend', () => {
      menu.classList.remove('fade');
    });
    // add the available layers to the menu
    examples.forEach((example, index) => {
      const example_metadata = example.getMetadata();
      const button = document.createElement('button');
      const label = document.createElement('div');
      label.classList.add('label');
      label.innerText = example_metadata.name;
      button.style.backgroundImage = `url("./img/${example_metadata.thumbnail}")`;      
      // style the selected layer in menu
      button.onclick = (() => {                 
        this.selected_button.classList.remove('selected');    
        this.selected_button = button;
        this.selected_button.classList.add('selected');
        this.changeExample(example);
      }).bind(this, example);
      button.appendChild(label);
      menu.appendChild(button);
      if (index === 0) {
        this.selected_button = button;
        this.selected_button.classList.add('selected');
      }      
    });
  }

  changeExample(example) {
    let layers = example.getLayers(this.GoogleMapWithDeckGL);
    const map_options = example.getMapOptions();    
    // short timeout so map load doesn't jank menu css transitions
    setTimeout(()=>{
      this.setLayer(layers);  
      this.GoogleMapWithDeckGL.setMap(map_options);
    },100)
    
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