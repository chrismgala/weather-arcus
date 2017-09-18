/**
 *
 * @ngdoc module
 * @name common
 *
 * @requires ui.router
 * @requires angular-loading-bar
 * @requires ngMessages
 * @requires ui.materialize
 * @requires ngAnimate
 *
 * @description
 * This is the common module. It includes a run method that imports all necessary modules
 * and configures the angular-loading-bar for any activity with the back-end or state transitions.
 *
 **/
angular
    .module('common', [
        'ui.router',
        'angular-loading-bar',
        'ngMessages',
        'ui.materialize',
        'ngAnimate'
    ])
    .run(function ($transitions, cfpLoadingBar) {
        $transitions.onStart({}, cfpLoadingBar.start);
        $transitions.onSuccess({}, cfpLoadingBar.complete);
    });