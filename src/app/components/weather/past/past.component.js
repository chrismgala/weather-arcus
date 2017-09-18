/**
 * @ngdoc directive
 * @name past
 * @module components
 *
 * @requires WeatherService
 *
 * @description
 * This is the past component within the components module.
 * It includes configuration for the docs state'/past'.
 **/
angular
.module('components.weather')
.component('past', {
    templateUrl: './past.html',
    controller: 'PastController',
})
.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('weather', {
        redirectTo: 'weather.past',
        url: '/weather',
        template: '<div ui-view></div>'
    })
    .state('weather.past', {
        url: '/past',
        component: 'past',
        resolve: {
            title: ['$rootScope',
                function ($rootScope) {
                    $rootScope.title = "Past Week";
                }
            ],
        }
    });

    $urlRouterProvider.otherwise('/weather/past');
});