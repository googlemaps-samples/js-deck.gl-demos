# Google Maps JS API / deck.gl Example Apps

This repo contains example apps that show how to use the [Google Maps Platform JS API](https://developers.google.com/maps/documentation/javascript/) with the [deck.gl](http://deck.gl) data visualization framework.

If this is your first time looking at these examples, start with the [Demo App](https://github.com/googlemaps/deck.gl-demos/tree/master/DemoApp), which shows all of the different layers we currently have examples for in a single UI. This repo also has simplified standalone examples for each layer individually, which are less complex and easier to parse than the Demo App.

<p align="center"><img src="https://github.com/googlemaps/deck.gl-demos/raw/master/DemoApp/src/img/screenshot.png" /></p>

## What is deck.gl?

deck.gl uses a layer-based approach to render WebGL-accelerated data visualizations on top of the Google Maps base map. [Custom overlay](https://developers.google.com/maps/documentation/javascript/customoverlays) support in the Maps JS API is used to sync the layers movement of the underlying map, including panning and zooming.

To learn more about how the deck.gl and Google Maps Platform teams worked together to add support for deck.gl to the Maps JS API base map, check out this post on the [vis.gl blog](https://medium.com/vis-gl/using-deck-gl-with-google-maps-9c868d18e3cd).

## Running the example apps

All of the apps are built to be served locally using [webpack devserver](https://webpack.js.org/configuration/dev-server/). For instructions on running one of the apps, see its README file.

## Documentation & resources

- [Google Maps JS API docs](https://developers.google.com/maps/documentation/javascript/)
- [`GoogleMapsOverlay` deck.gl submodule docs](https://deck.gl/#/documentation/submodule-api-reference/deckgl-google-maps/overview)
- [deck.gl docs](https://deck.gl/#/documentation/overview/introduction)