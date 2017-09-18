/**
 * @ngdoc directive
 * @name past
 * @module components.weather
 *
 * @description
 * This is the past component within the components.weather module.
 * It includes configuration for the past state '/past' which is under the 'weather' state.
 * 
 * Any non-matching routes will redirect to 'weather/past'.
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