(function (module) {
  'use strict';

  module.constant('Config', {
    numberOfComputer: 4,
    uploadUrl: 'uploads/',
    action: '/upload/computer-:computerID?set=:set'
  });

}(angular.module('Core')));
