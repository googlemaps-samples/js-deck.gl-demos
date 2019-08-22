import {map_styles} from './map_styles';
import {GoogleMapsOverlay} from '@deck.gl/google-maps';
import {ScatterplotLayer} from '@deck.gl/layers';

/* SET YOU APIR KEY HERE OR IN GoogleMapsAPIKey ENV VAR */
const YOUR_API_KEY = '';

/*
 * Demo of ArcLayer that renders Chicago taxi trips 
 * between neighborhood centroid origin and destination points
 *
 * Datasource: Chicago Data Portal
 * https://data.cityofchicago.org/Transportation/Taxi-Trips/wrvz-psew
 */
function getScatterplotLayers() {
  const DATA_URI = {
    trees: 'https://data.cityofnewyork.us/resource/5rq2-4hqu.json',
    parking_meters: 'https://data.cityofnewyork.us/resource/xx9u-e8wf.json'
  };
  const QS = {
    trees: '?$limit=65000&&boroname=Manhattan',
    parking_meters: '?$limit=15000'
  };
  const SCATTERPLOT_LAYERS = [
    new ScatterplotLayer({
      id: 'scatterplot-tree-layer',
      data: DATA_URI.trees + QS.trees,
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
      data: DATA_URI.parking_meters + QS.parking_meters,
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

  return SCATTERPLOT_LAYERS;
}

// Init the base map and deck.gl GoogleMapsOverlay, then add the layer
async function init() {
  await loadScript();
  const MAP = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.760306, lng: -73.982302},
    zoom: 15,
    styles: map_styles
  });

  const SCATTERPLOT_LAYERS = getScatterplotLayers();

  const overlay = new GoogleMapsOverlay({
    layers: SCATTERPLOT_LAYERS
  });
  overlay.setMap(MAP);
}

// Load the Google Maps Platform JS API async
function loadScript() {  
  const GOOGLE_MAPS_API_KEY = YOUR_API_KEY || process.env.GoogleMapsAPIKey,
        GOOGLE_MAPS_API_URI = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`,
        HEAD = document.querySelector('head'),
        SCRIPT = document.createElement('script');

  SCRIPT.type = 'text/javascript';
  SCRIPT.src = GOOGLE_MAPS_API_URI;
  HEAD.appendChild(SCRIPT);
  return new Promise(resolve => {
    SCRIPT.onload = resolve;
  });
}

init();