(function (module) {
  'use strict';

  function PictureUploaderController($scope, pufactory, Config) {
    var vm = this;

    vm.createNewPictureSet = function (id) {
      pufactory.getNewPictureSet(id).then(function (response) {
        var data = response.data.data;
        vm['pc'+ id].currentPictureSet = data;
        vm['pc'+ id].currentPictureSet.text = data._id.substr(10);
      })
      .catch(function (err) {
        if (err) {
          console.log(err);
        }
      });
    };

    function init() {
      for (var i = 1; i <= Config.numberOfComputer; i++) {
        vm['pc' + i] = { currentPictureSet: {}};
        vm.createNewPictureSet(i);
      }
    }

    init();
  }

  PictureUploaderController.$inject = ['$scope', 'pictureuploadfactory', 'Config'];

  module.controller('PictureUploaderController', PictureUploaderController);

}(angular.module('PictureUploader')));
