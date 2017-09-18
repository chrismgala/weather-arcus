/**
 *
 * @ngdoc module
 * @name root
 *
 * @requires common
 * @requires components
 * @requires templates
 *
 * @description
 *
 * This is the root module. 
 * It is the parent of all other modules and is placed in the index.html.
 * It configures the URL styling to HTML5 mode to avoid hashes in the URL '#'.
 *
 **/

let root =
    angular.module('root', [
        'common',
        'components',
        'templates',
    ]);

root.config(['$locationProvider',
    '$compileProvider',
    function ($locationProvider) {
        $locationProvider.html5Mode(true);
    }
]);