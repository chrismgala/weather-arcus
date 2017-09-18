/**
 * @ngdoc directive
 * @module common
 * @name app
 *
 *
 * @description
 * This is the common app Component. It is the parent state for all auth states.
 * The default redirect state is 'home' .
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