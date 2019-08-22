# Maps JS API with deck.gl Example App

This example app shows how you can use the Maps Javascript API with the [Deck.gl](https://deck.gl) OSS framework to render high-quality 3D data visualizations on top of Google Maps.

<p align="center"><img src="https://github.com/googlemaps/deck.gl-demos/raw/master/img/demoapp.png" /></p>

## Running the demo

To see the demo running live, go to https://goo.gle/deckgl-demos. Please be patient while the data loads for each layers. In some cases, hundreds of thousands of data points are being fetched over http.

To run it on localhost, do the following:

1. Download the repo.

2. Set your [API key](https://developers.google.com/maps/documentation/javascript/get-api-key) in a `GoogleMapsAPIKey` environment variable or at the top of `app.js` in the `GOOGLE_MAPS_API_KEY` constant.

3. Run `npm install` to download dependencies.

4. Run `npm start`.

Your browser will open to `http://localhost:8080`.

### The demo won't run!

Make sure that your API key is valid and doesn't have any restrictions that would prevent it making calls to the Maps JS API, Directions API, or Places API on localhost.

Also, the URIs for some of the city open data sources sometimes change. We try to keep them updated but if you find them out of date a quick search of one of the datasources below can get you an updated URI to plug into the demo.

## Project structure

There are three main pieces to this project, all located in `/src`:

- The `/example-layers` directory is where all the different layer types and their accompanying logic are defined. Each layer is handled in the correspondingly named directory.

- `GoogleMapsWithDeckGL.js` is where the logic for instantiating the Google base map and applying the deck.gl overlay to it happens.

- `app.js` supplies the logic for the UI of the example app.

Primarily what you'll want to look at is `/example-layers` and `GoogleMapsWithDeckGL`, which are the pieces that show how deck.gl support works with the Maps JS API.

## Documentation & resources

- [This example app running live](https://goo.gle/deckgl-demos)
- [Google Maps JS API docs](https://developers.google.com/maps/documentation/javascript/)
- [`GoogleMapsOverlay` deck.gl submodule docs](https://deck.gl/#/documentation/submodule-api-reference/deckgl-google-maps/overview)
- [deck.gl docs](https://deck.gl/#/documentation/overview/introduction)

## Datasources

This demo uses a mix of open data from different cities, and Google Maps Platform APIs

### Open data

- [Chicago Data Portal](https://data.cityofchicago.org/)
- [Los Angeles Open Data](https://data.lacity.org/)
- [NYC Open Data](https://data.cityofnewyork.us/)

### Google Maps Platform

- [Maps JS API directions service](https://developers.google.com/maps/documentation/javascript/directions)
- [Maps JS API Places library](https://developers.google.com/maps/documentation/javascript/places)