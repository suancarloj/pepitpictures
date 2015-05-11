(function (module) {
  'use strict';

  function PictureViewerController($scope, picturefactory) {
    var vm = $scope;
    vm.currentPicture = '';
    vm.currentPictureIndex = 0;

    picturefactory.getAllPictures().then(function (response) {
      vm.pictures = response.data.data;
      vm.currentPicture = 'uploads/' + vm.pictures.pictures[vm.currentPictureIndex].name;
      console.log(vm.pictures);
    })
    .catch(function (err) {
      console.log(err);
    });

    vm.nextPicture = function () {
      changePicture(1);
    };
    vm.previousPicture = function () {
      changePicture(-1);
    };

    function changePicture(i) {
      var size = vm.pictures.pictures.length;
      vm.currentPictureIndex += i;

      if (vm.currentPictureIndex % size < 0) {
        vm.currentPictureIndex += size;
      }

      if (vm.currentPictureIndex >= size ) {
        vm.currentPictureIndex %= size;
      }

      vm.currentPicture = 'uploads/' + vm.pictures.pictures[vm.currentPictureIndex].name;
    }

    vm.toggleStarPicture = function () {
      var index = vm.currentPictureIndex;
      var data = {
        setID: vm.pictures._id,
        pictureID: vm.pictures.pictures[index]._id,
        stared: vm.pictures.pictures[index].stared ? false : true
      };

      console.log(vm.pictures.pictures[index]);


      picturefactory.starPicture(data).then(function (response) {
        console.log(response);
        if (response.data.data._id) {
          vm.pictures.pictures[index].stared = data.stared;
          console.log(vm.pictures.pictures[index]);
        }
      })
      .catch(function (err) {
        if (err) {
          console.log(err);
        }
      });
    };
  }

  PictureViewerController.$inject = ['$scope', 'picturefactory'];

  module.controller('PictureViewerController', PictureViewerController);

}(angular.module('PictureViewer')));
