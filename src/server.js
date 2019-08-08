const path = require('path');
const express = require('express');
const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GoogleMapsAPIKey,
  Promise: Promise
});

const app = express();      
app.listen(process.env.PORT || 8080);
app.use(express.static(path.join(__dirname, '../dist')));
app.use('/img', express.static(path.join(__dirname, '/ui/img')));

app.get('/', (req, res) => {       
  res.sendFile(path.join(__dirname, '/ui/index.html'));      
});  
  
app.get('/directions', async(req, res) => {
  const OPTIONS = {
    origin: { placeId: req.query.start },
    destination: { placeId: req.query.end },
    travelMode: (Math.random() >= 0.5 ? 'driving': 'bicycling')
  }
  
  let request = googleMapsClient.directions(OPTIONS).asPromise();
  let result = await request;

  result = result.json.routes[0].legs[0];
console.log(result)
  let directions = response.routes[0].legs[0].steps;
  directions = formatRoute(route);
  
  res.set('Access-Control-Allow-Origin', '*')
  res.json(directions);
});
  
  
// Formats Directions Service response to be TripsLayer-friendly
function formatRoute(route) {
  let timestamp = 0;
  route = route.map(step => {
    let formatted_step = [
        step.start_location.lng(),
        step.start_location.lat(),
        timestamp
    ]
    timestamp += step.duration.value
    return formatted_step;
  });          
  return route;
}
