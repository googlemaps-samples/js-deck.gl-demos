import {GoogleMapWithDeckGL} from './app.js';
import {layers} from './layers';

async function initMap() {
	let selected_layer = layers[0];
	let map_options = selected_layer.getMapOptions();
	let google_map = new GoogleMapWithDeckGL();
  await google_map.initMapWithOverlay(map_options);
	changeExample(google_map, selected_layer);  
  return google_map;
}

function buildMenu(google_map) {
	const menu_div = document.getElementById('menu');  
  layers.forEach(layer => {
    const layer_metadata = layer.getMetadata();
		const button = document.createElement('button');    
    const thumbnail = document.createElement('img');
    thumbnail.src = './img/' + layer_metadata.thumbnail;
    button.onclick = function() {
      changeExample(google_map, layer)
    };
    button.appendChild(thumbnail);
    menu_div.appendChild(button);
	})		
}

function changeExample(google_map, selected_layer) {
  let layers = selected_layer.getLayers(google_map);
  const map_options = selected_layer.getMapOptions();  
  setMap(google_map, map_options);
  requestAnimationFrame(function() {
    setLayer(google_map, layers);
  })
}

function setLayer(google_map, layers) {
  let next = layers.next();
  if (next.value){

  google_map.setLayer(next.value)

  if (!next.done){
    requestAnimationFrame(function() {setLayer(google_map, layers)});
  }
}
}

function setMap(google_map, map_options) {  
  google_map.map.setCenter(map_options.center);
  google_map.map.setZoom(map_options.zoom);    
}

async function run() {
  const google_map = await initMap();
  buildMenu(google_map);
}
run();
