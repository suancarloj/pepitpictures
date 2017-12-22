(function (module) {
  'use strict';

  function ppFooter() {
    return {
      retrict: 'E',
      templateUrl: 'templates/footer.html'
    };
  }

  ppFooter.$inject = [];

  module.directive('ppFooter', ppFooter);
}(angular.module('Core')));
