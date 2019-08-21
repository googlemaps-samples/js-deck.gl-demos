# Maps JS API with deck.gl Example App

This example app shows how you can use the Maps Javascript API with the [Deck.gl](https://deck.gl) OSS framework to render high-quality 3D data visualizations on top of Google Maps.

<p align="center"><img src="https://github.com/googlemaps/deckgl-demos/tree/master/img/screenshot.png" /></p>

## What is deck.gl?

deck.gl uses a layer-based approach to render WebGL-accelerated data visualizations on top of the Google Maps base map. [Custom overlay](https://developers.google.com/maps/documentation/javascript/customoverlays) support in the Maps JS API is used to sync the layers movement of the underlying map, including panning and zooming.

To learn more about how the deck.gl and Google Maps Platform teams worked together to add support for deck.gl to the Maps JS API base map, check out this post on the [vis.gl blog](https://medium.com/vis-gl/using-deck-gl-with-google-maps-9c868d18e3cd).

## Running the demo

To see the demo running live, go to https://goo.gle/deckgl-demos. Please be patient while the data loads for each layers. In some cases, hundreds of thousands of data points are being fetched over http.

To run it on localhost, do the following:

1. Download the repo.

2. Set your API key either in a `GoogleMapsAPIKey` environment variable, or in `/src/GoogleMapsAPIKey.js`.

3. Run `npm install` to download dependencies.

4. Run `npm start`.

Your browser will open to `http://localhost:8080`.

### The demo won't run!

Make sure that your API key is valid and doesn't have any restrictions that would prevent it making calls to the Maps JS API, Directions API, or Places API on localhost.

## Project structure

There are three main pieces to this project, all located in `/src`:

- The `/example-layers` directory is where all the different layer types and their accompanying logic are defined. Each layer is handled in the correspondingly named directory.

- `GoogleMapsWithDeckGL.js` is where the logic for instantiating the Google base map and applying the deck.gl overlay to it happens.

- `app.js` supplies the logic for the UI of the example app.

Primarily what you'll want to look at is `/example-layers` and `GoogleMapsWithDeckGL`, which are the pieces that show how deck.gl support works with the Maps JS API.

## Documentation & Resources

- [This example app running live](https://goo.gle/deckgl-demos)
- [Google Maps JS API docs](https://developers.google.com/maps/documentation/javascript/)
- [`GoogleMapsOverlay` deck.gl submodule docs](https://deck.gl/#/documentation/submodule-api-reference/deckgl-google-maps/overview)
- [deck.gl docs](https://deck.gl/#/documentation/overview/introduction)
- [Places library in the Maps JS API docs]()