function WeatherService($http, $q) {
    /**
     * Global functions exposed to the 'weather' component
     **/

    /**
     * @ngdoc method
     * @methodOf components.weather.WeatherService
     * @name getLastWeekWeather
     * @description Logs a member in through a dedicated Express route.
     *
     * @param {Object} location The location Object containing latitude and longitude.
     * @param {Object} day The number of days before that the User wants weather for.
     * @returns {Promise} An HTTP response Promise.
     **/
    this.getLastWeekWeather = (location, day) => {
        return $http.get(`/weather/${location.latitude}/${location.longitude}/${day}`);
    };

    /**
     * @ngdoc method
     * @methodOf components.weather.WeatherService
     * @name getLatLong
     * @description Logs a member in through a dedicated Express route.
     *
     * @param {String} zip The zip code of the User.
     * @returns {Promise} An HTTP response Promise.
     **/
    this.getLatLong = (zip) => {
        return $http.get(`/location/${zip}`);
    };
}

/**
 * @ngdoc service
 * @name WeatherService
 * @module components.weather
 *
 * @description
 * Provides HTTP methods for our authentication methods.
 */
angular
.module('components.weather')
.service('WeatherService', WeatherService);