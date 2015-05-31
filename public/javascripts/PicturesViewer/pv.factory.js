(function (module) {
  'use strict';

  function picturefactory($http, $location, Config) {

    var set = [];

    function getPicturesFromServer() {
      var url = Config.pvUrl + $location.$$absUrl.match(/\d$/)[0];
      return $http.get(url);
    }

    function starPicture(data) {
      var url = Config.pvStarPicture + data.setID + '/' + data.pictureID + '?stared=' + data.stared;
      return $http.get(url);
    }

    function isNewSetAvailable(data) {
      var url = Config.isNewSetAvailable.replace(':computerID', data.computerId)
        .replace(':createdAt', data.createdAt);
      return $http.get(url);
    }

    return {
      getAllPictures: getPicturesFromServer,
      starPicture: starPicture,
      isNewSetAvailable: isNewSetAvailable,
      set: set
    };
  }

  picturefactory.$inject = ['$http', '$location', 'Config'];

  module.factory('picturefactory', picturefactory);

}(angular.module('PictureViewer')));
