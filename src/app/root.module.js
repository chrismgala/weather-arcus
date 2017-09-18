let root =
    angular.module('root', [
        'common',
        'components',
        'templates',
    ]);

root.config(['$locationProvider',
    '$compileProvider',
    function ($locationProvider, $compileProvider) {
        $locationProvider.html5Mode(true);
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(blob|https):/);
    }
]);