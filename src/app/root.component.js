/**
 * @ngdoc directive
 * @name root
 * @module root
 *
 * @description
 * This is the root component which loads in the template file.
 **/

let root = {
    templateUrl: './root.html'
};

angular
.module('root')
.component('root', root);