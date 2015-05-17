(function (module) {
  'use strict';

  function PictureViewerController(picturefactory, Config, $interval) {
    var vm = this;
    vm.currentPicture = '';
    vm.currentPictureIndex = 0;
    vm.staredCount = 0;


    updatePictures();
    $interval(updatePictures, 10000);

    vm.nextPicture = function () {
      changePicture(1);
    };
    vm.previousPicture = function () {
      changePicture(-1);
    };

    function updatePictures() {
      picturefactory.getAllPictures().then(function (response) {
        var oldId = vm.pictures ? vm.pictures._id : -1;
        var oldIndex = vm.currentPictureIndex;
        var data = response.data.data;
        vm.pictures = data;

        if (data._id && (oldId !== data._id) && vm.pictures.pictures.length > 0) {
          vm.currentPictureIndex = 0;
          vm.currentPicture = Config.uploadUrl + vm.pictures.pictures[vm.currentPictureIndex].name;
        }

        setStaredCount();
      })
      .catch(function (err) {
        console.log(err);
      });
    }

    function changePicture(i) {
      var size = vm.pictures.pictures.length;
      vm.currentPictureIndex += i;

      if (vm.currentPictureIndex % size < 0) {
        vm.currentPictureIndex += size;
      }

      if (vm.currentPictureIndex >= size ) {
        vm.currentPictureIndex %= size;
      }

      vm.currentPicture = Config.uploadUrl + vm.pictures.pictures[vm.currentPictureIndex].name || '';
    }



    vm.toggleStarPicture = function () {
      var index = vm.currentPictureIndex;
      var data = {
        setID: vm.pictures._id,
        pictureID: vm.pictures.pictures[index]._id,
        stared: vm.pictures.pictures[index].stared ? false : true
      };

      picturefactory.starPicture(data).then(function (response) {
        if (response.data.data._id) {
          vm.pictures.pictures[index].stared = data.stared;
          setStaredCount();
        }
      })
      .catch(function (err) {
        if (err) {
          console.log(err);
        }
      });
    };

    vm.resetStaredCount = function () {
      vm.pictures.pictures.forEach(function (p) {
        if (p.stared) {
          var data = {
            setID: vm.pictures._id,
            pictureID: p._id,
            stared: false
          };
          picturefactory.starPicture(data).then(function (response) {
            if (response.data.data._id) {
              p.stared = data.stared;
              setStaredCount();
            }
          })
          .catch(function (err) {
            if (err) {
              console.log(err);
            }
          });
        }
      });
    };

    vm.getPrice = function () {
      var price = 0;
      if (vm.staredCount === 1) {
        price = 15;
      } else if (vm.staredCount >= 2 && vm.staredCount <= 3) {
        price = 33;
      } else if (vm.staredCount > 3) {
        price = 40;
      }

      return price;
    };

    function setStaredCount() {
      vm.staredCount = 0;
      vm.pictures.pictures.forEach(function (p) {
        if (p.stared) {
          vm.staredCount++;
        }
      });
    }
  }

  PictureViewerController.$inject = ['picturefactory', 'Config', '$interval'];

  module.controller('PictureViewerController', PictureViewerController);

}(angular.module('PictureViewer')));
