(function (module) {
  'strict';

  function picturefactory($http, $location, Config) {

    function getPicturesFromServer() {
      var url = Config.pvUrl + $location.$$absUrl.match(/\d$/)[0];
      return $http.get(url);
    }

    function starPicture(data) {
      var url = Config.pvStarPicture + data.setID + '/' + data.pictureID + '?stared=' + data.stared;
      return $http.put(url);
    }

    this.getAllPictures = getPicturesFromServer;
    this.starPicture = starPicture;
  }

  picturefactory.$inject = ['$http', '$location', 'Config'];

  module.service('picturefactory', picturefactory);

}(angular.module('PictureViewer')));
