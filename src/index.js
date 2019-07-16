import {GoogleMapWithDeckGL} from './app.js';
import {layers} from './layers';
async function initMap() {
	let selected_layer = layers[0];
	let map_options = selected_layer.getMapOptions();
	let google_map = new GoogleMapWithDeckGL();
	await google_map.initMapWithOverlay(map_options);
	google_map.overlay.setProps({layers: selected_layer.getLayers()})  
}

function buildMenu() {
	layers.forEach(layer => {
		console.log(layer)
	})		
}

initMap();
buildMenu()
