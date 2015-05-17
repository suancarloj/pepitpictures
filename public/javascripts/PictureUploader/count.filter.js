(function (module) {
  'use strict';

  function countPictures() {
    return function (pictures) {
      var count = 0;

      pictures.pictures.forEach(function (p) {
        if (p.stared) {
          count++;
        }
      });

      return count;
    };
  }

  module.filter('countPictures', countPictures);
}(angular.module('PictureUploader')));
