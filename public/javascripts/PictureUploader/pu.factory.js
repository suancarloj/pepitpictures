(function (module) {
  'use strict';

  function pictureuploadfactory($http, $location, Config) {

    function getNewPictureSet(id) {
      var url = 'http://localhost:3000/picture-set/computer-' + id;
      return $http.put(url);
    }

    function getLastTenSets(id) {
      var url = Config.lastTenSets.replace(':computerID', id);
      return $http.get(url);
    }

    function createShFile(setID) {
      var url = Config.createShFile.replace(':setID', setID);
      return $http.put(url);
    }

    return {
      getNewPictureSet: getNewPictureSet,
      getLastTenSets: getLastTenSets,
      createShFile: createShFile
    };
  }

  pictureuploadfactory.$inject = ['$http', '$location', 'Config'];

  module.factory('pictureuploadfactory', pictureuploadfactory);

}(angular.module('PictureUploader')));
