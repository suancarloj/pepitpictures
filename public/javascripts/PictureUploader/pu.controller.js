(function (module) {
  'use strict';

  function PictureUploaderController($scope, pufactory, Config) {
    var vm = this;

    vm.createNewPictureSet = function (id) {
      pufactory.getNewPictureSet(id).then(function (response) {
        var data = response.data.data;
        vm['pc'+ id].currentPictureSet = data;
        vm['pc'+ id].currentPictureSet.text = data._id.substr(10);
        getLastTenSets(id);
      })
      .catch(function (err) {
        if (err) {
          console.log(err);
        }
      });
    };

    function getLastTenSets(id) {
      pufactory.getLastTenSets(id).then(function (response) {
        vm['pc'+ id].sets = response.data.data;
      })
      .catch(function (err) {
        if (err) {
          console.log(err);
        }
      });
    }

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
