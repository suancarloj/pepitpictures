(function (module) {
  'use strict';

  function PictureUploaderController($scope, pufactory, Config) {
    var vm = this;

    vm.createNewPictureSet = function (id) {
      pufactory.getNewPictureSet(id).then(function (response) {
        var data = response.data.data;
        vm.currentPictureSet = data;
        vm.currentPictureSet.text = data._id.substr(10);
        getLastTenSets(id);
      })
      .catch(function (err) {
        if (err) {
          console.log(err);
        }
      });
    };

    vm.pushToRasp = function (setID) {
      pufactory.createShFile(setID).then(function (response) {
        console.log(response.data.data);
      })
      .catch(function (err) {
        if (err) {
          console.log(err);
        }
      });
    };

    function getLastTenSets(id) {
      pufactory.getLastTenSets(id).then(function (response) {
        vm.sets = response.data.data;
      })
      .catch(function (err) {
        if (err) {
          console.log(err);
        }
      });
    }

  }

  PictureUploaderController.$inject = ['$scope', 'pictureuploadfactory', 'Config'];

  module.controller('PictureUploaderController', PictureUploaderController);

}(angular.module('PictureUploader')));
