/**
 *
 * @ngdoc module
 * @name components
 *
 * @requires components.weather
 *
 * @description
 * This is the components module. It imports all of our non common modules.
 * These modules are tailor made to specific areas of the app (e.g. weather forecasts).
 *
 **/

angular
.module('components', [
    'components.weather',
]);