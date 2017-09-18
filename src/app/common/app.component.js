/**
 * @ngdoc directive
 * @module common
 * @name app
 *
 *
 * @description
 * This is the common app component. It is the parent state for any other 
 * states including the weather state and it loads in the template file.
 * The default redirect state is 'weather.past' .
 **/
angular
.module('common')
.component('app', {
    templateUrl: './app.html',
    controller: 'AppController',
    bindings: {
    }
})
.config(function ($stateProvider) {
    $stateProvider
    .state('app', {
        url: '/app',
        redirectTo: 'weather.past',
        component: 'app',
    });
});