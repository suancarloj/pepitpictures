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

    function isNewSetAvailable(data) {
      var url = Config.isNewSetAvailable.replace(':computerID', data.computerId)
        .replace(':createdAt', data.createdAt);
      return $http.get(url);
    }


    this.getAllPictures = getPicturesFromServer;
    this.starPicture = starPicture;
    this.isNewSetAvailable = isNewSetAvailable;
  }

  picturefactory.$inject = ['$http', '$location', 'Config'];

  module.service('picturefactory', picturefactory);

}(angular.module('PictureViewer')));
