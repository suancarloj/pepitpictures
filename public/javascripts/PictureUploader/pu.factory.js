(function (module) {
  'strict';

  function pictureuploadfactory($http, $location, Config) {

    function getNewPictureSet(id) {
      var url = 'http://localhost:3000/picture-set/computer-' + id;
      return $http.put(url);
    }


    this.getNewPictureSet = getNewPictureSet;

  }

  pictureuploadfactory.$inject = ['$http', '$location'];

  module.service('pictureuploadfactory', pictureuploadfactory);

}(angular.module('PictureUploader')));
