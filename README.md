# weather-arcus

## Demo

Visit https://weather-arcus.appspot.com/weather/past.

## Run locally

1. Clone the project:

        git clone https://github.com/chrismgala/weather-arcus.git

1. Change directory into the project folder:

        cd weather-arcus

1. Install dependencies:

        npm install

1. Install gulp:

        npm install -g gulp
        
1. Create your own API keys for:

      Dark Sky (https://darksky.net/dev/register)
      Google Maps Geocoding (https://developers.google.com/maps/documentation/geocoding/start)

      Insert these API keys into the config.js as:
      DARK_SKY_API_KEY: '<API_KEY>'
      GOOGLE_MAPS_GEOCODING_API_KEY: '<API_KEY>'
        
1. Build and start server:

        gulp

1. View the app at the automatically opened tab (http://localhost:5000).
