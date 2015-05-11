(function (module) {
  'use strict';

  function PictureUploaderController($scope, pufactory) {
    var vm = $scope;
    vm.pc1 = {
      currentPictureSet : {}
    };

    vm.createNewPictureSet = function (id) {
      pufactory.getNewPictureSet(id).then(function (response) {
        var data = response.data.data;
        vm['pc'+ id].currentPictureSet = data;
        Dropzone.options['computer' + id].url = '/upload/computer-' + id + '?set=' + data._id;
      })
      .catch(function (err) {
        if (err) {
          console.log(err);
        }
      });
    };
  }

  PictureUploaderController.$inject = ['$scope', 'pictureuploadfactory'];

  module.controller('PictureUploaderController', PictureUploaderController);

}(angular.module('PictureUploader')));
