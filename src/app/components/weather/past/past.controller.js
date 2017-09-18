function PastController(WeatherService, $state, $q, $window) {
    let ctrl = this;

    /**
     * @ngdoc method (Lifecycle Hook)
     * @name PastController#$onInit
     *
     * @description
     * Initialize weather data and other config variables in Controller.
     * Set attributes to empty strings, 0, or null and prompt for location data.
     */
    ctrl.$onInit = () => {
        Materialize.toast("Getting forecast", 5000);

        ctrl.error = null;

        ctrl.weather = {
            summary: '',
            icon: '',
            iconString: '',
            date: [],
            tempHighFarenheight: 0,
            tempLowFarenheight: 0,
            tempHighCelcius: 0,
            tempLowCelcius: 0,
            precipProb: 0,
            humidity: 0,
            windSpeed: 0,
        };
        ctrl.weatherData = [];
        ctrl.celcius = false;

        ctrl.geolocation = true;
        ctrl.zip = '';

        if ($window.navigator.geolocation) {
            $window.navigator.geolocation.getCurrentPosition(function (success) {
                ctrl.getLastWeekWeather(success);
            }, function (failure) {
                Materialize.toast("Geolocation not supported by browser", 5000);
                ctrl.geolocation = false;
            });
        } else {
          Materialize.toast("Geolocation not supported by browser", 5000);
          ctrl.geolocation = false;
        }
    };

    /**
     * @ngdoc method
     * @name PastController#getLastWeekWeather
     *
     * @description
     * Get last week's weather data in chronological order.
     */
    ctrl.getLastWeekWeather = (position) => {
        ctrl.weatherData = [];

        let chain = $q.when();
        for (let i = 5; i >= -1; i--) {
            chain = chain.then(() => {
                return WeatherService.getLastWeekWeather(position.coords, i)
                    .then(res => {
                        if (res.data) {
                            ctrl.weather.summary = res.data.daily.data[0].summary;
                            ctrl.weather.icon = res.data.daily.data[0].icon;
                            ctrl.weather.iconString = ctrl.weather.icon.split("-").join(" ");
                            ctrl.weather.date = new Date(res.data.daily.data[0].time * 1000).toDateString().split(" ");
                            ctrl.weather.tempHighFarenheight = Math.floor(res.data.daily.data[0].apparentTemperatureHigh);
                            ctrl.weather.tempLowFarenheight = Math.floor(res.data.daily.data[0].apparentTemperatureLow);
                            ctrl.weather.tempHighCelcius = Math.round((ctrl.weather.tempHighFarenheight - 32) * (5/9));
                            ctrl.weather.tempLowCelcius = Math.round((ctrl.weather.tempLowFarenheight - 32) * (5/9));
                            ctrl.weather.precipProb = res.data.daily.data[0].precipProbability * 100;
                            ctrl.weather.humidity = res.data.daily.data[0].humidity * 100;
                            ctrl.weather.windSpeed = Math.round(res.data.daily.data[0].windSpeed);

                            ctrl.weatherData.push(ctrl.weather);
                        }
                    })
                    .catch(res => {
                        ctrl.error = true;

                        if (res.data)
                            Materialize.toast(res.data.message, 5000);
                    });
            });
        }

        if (!ctrl.error)
            Materialize.toast("Forecast loaded", 5000);
    };

    /**
     * @ngdoc method (Lifecycle Hook)
     * @name PastController#$onChanges
     *
     * @description
     * Copy the entire zip in the Controller
     * into itself, whenever there are changes.
     */
    ctrl.$onChanges = function (changes) {
        if (changes.zip) {
            ctrl.zip = angular.copy(ctrl.zip);
        }
    };


    /**
     * @ngdoc method
     * @name PastController#submitForm
     *
     * @description
     * Submit the form and get the User's latitude and longitude for the weather data.
     */
    ctrl.submitForm = () => {
        return WeatherService.getLatLong(ctrl.zip)
            .then(res => {
                return res.data;
            })
            .then(location => {
                ctrl.getLastWeekWeather({
                    coords: {
                        latitude: location.lat,
                        longitude: location.lng
                    }
                });
            })
            .catch(res => {
                if (res.data)
                    Materialize.toast(res.data.message, 5000);
            });
    };
}

/**
 * @ngdoc controller
 * @module components.weather
 * @name PastController
 *
 * @description
 * Stick the above function in as the Controller.
 * This will serve as the Controller for the past component.
 * It handles communication with the back-end to get the past week's weather data.
 */
angular
.module('components.weather')
.controller('PastController', PastController);