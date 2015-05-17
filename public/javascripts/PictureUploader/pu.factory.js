(function (module) {
  'strict';

  function pictureuploadfactory($http, $location, Config) {

    function getNewPictureSet(id) {
      var url = 'http://localhost:3000/picture-set/computer-' + id;
      return $http.put(url);
    }

    function getLastTenSets(id) {
      var url = Config.lastTenSets.replace(':computerID', id);
      return $http.get(url);
    }

    function createShFile(id) {
      var url = Config.createShFile.replace(':setID', id);
      return $http.put(url);
    }


    this.getNewPictureSet = getNewPictureSet;
    this.getLastTenSets = getLastTenSets;

  }

  pictureuploadfactory.$inject = ['$http', '$location', 'Config'];

  module.service('pictureuploadfactory', pictureuploadfactory);

}(angular.module('PictureUploader')));
