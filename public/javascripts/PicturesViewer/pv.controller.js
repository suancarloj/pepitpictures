(function (module) {
  'use strict';

  function PictureViewerController(picturefactory, Config, $interval) {
    var vm = this;
    vm.currentPictureIndex = 0;
    vm.staredCount = 0;
    vm.showSelected = false;
    vm.pictureBaseUrl = Config.uploadUrl;
    vm.showSelectedPictures = false;

    vm.selectedPictures = [];

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
        var oldId = vm.set ? vm.set._id : -1;
        var data = response.data.data;
        vm.set = data;

        if (data._id && (oldId !== data._id) && vm.set.pictures.length > 0) {
          vm.currentPictureIndex = 0;
        }

        setStaredCount();
      })
      .catch(function (err) {
        console.log(err);
      });
    }

    function changePicture(i) {
      var size = !vm.showSelectedPictures ? vm.set.pictures.length : vm.selectedPictures.length;
      vm.currentPictureIndex += i;

      if (vm.currentPictureIndex % size < 0) {
        vm.currentPictureIndex += size;
      }

      if (vm.currentPictureIndex >= size ) {
        vm.currentPictureIndex %= size;
      }

      if (!vm.showSelectedPictures) {
        vm.imgUrl = Config.uploadUrl + vm.set.pictures[vm.currentPictureIndex].name;
      } else {
        vm.imgUrl = Config.uploadUrl + vm.selectedPictures[vm.currentPictureIndex].name;
      }
    }



    vm.toggleStarPicture = function () {
      var index = vm.currentPictureIndex;

      if (vm.showSelectedPictures) {
        vm.set.pictures.forEach(function (p, i) {
          if (p._id === vm.selectedPictures[vm.currentPictureIndex]._id) {
            index = i;
          }
        });
      }

      var data = {
        setID: vm.set._id,
        pictureID: vm.set.pictures[index]._id
      };

      if (vm.set.pictures[index].stared) {
        //remove from stared array
        var indexToRemove = vm.selectedPictures.indexOf(vm.set.pictures[index]);

        if (indexToRemove >= 0) {
          vm.selectedPictures.splice(indexToRemove, 1);

          vm.currentPictureIndex = vm.currentPictureIndex > 0 ? vm.currentPictureIndex--: 0;
        }
        data.stared = false;
      } else {
        //add to stared array
        vm.selectedPictures.push(vm.set.pictures[index]);
        data.stared = true;
      }

      picturefactory.starPicture(data).then(function (response) {
        if (response.data.data._id) {
          vm.set.pictures[index].stared = data.stared;
          setStaredCount();
          if (!vm.staredCount) {
            vm.toggleSelectedPictures()
          }
        }
      })
      .catch(function (err) {
        if (err) {
          console.log(err);
        }
      });
    };

    vm.resetStaredCount = function () {
      vm.set.pictures.forEach(function (p) {
        if (p.stared) {
          var data = {
            setID: vm.set._id,
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

    vm.toggleSelectedPictures = function () {
      if (!vm.selectedPictures.length && !vm.showSelectedPictures) {
        vm.selectedPictures = vm.set.pictures.filter(p => p.stared);
      }
      vm.showSelectedPictures = !vm.showSelectedPictures;
      vm.currentPictureIndex = 0;
    };

    function setStaredCount() {
      vm.selectedPictures = vm.set.pictures.filter(p => p.stared);
      vm.staredCount = vm.selectedPictures.length;
    }
  }

  PictureViewerController.$inject = ['picturefactory', 'Config', '$interval'];

  module.controller('PictureViewerController', PictureViewerController);

}(angular.module('PictureViewer')));
