(function (module) {
  'use strict';

  function ppNavbar() {
    return {
      restrict: 'E',
      templateUrl: 'templates/navbar.html'
    };
  }

  ppNavbar.$inject = [];

  module.directive('ppNavbar', ppNavbar);
}(angular.module('Core')));
