function PictureViewerController(PictureViewerFactory, Config, $interval, $location) {
  let vm = this;

  vm.currentPictureIndex = 0;
  vm.staredCount = 0;
  vm.showSelected = false;
  vm.pictureBaseUrl = Config.apiBasePath + Config.uploadUrl;
  vm.showSelectedPictures = false;
  vm.computerId = $location.$$absUrl.match(/\d$/)[0];

  vm.selectedPictures = [];

  function setStaredCount() {
    vm.selectedPictures = vm.set.pictures.filter(p => p.stared);
    vm.staredCount = vm.selectedPictures.length;
  }

  function updatePictures() {
    PictureViewerFactory.getAllPictures().then((response) => {
      let oldId = vm.set ? vm.set._id : -1;
      const { data } = response.data;
      vm.set = data;

      if (data._id && (oldId !== data._id) && vm.set.pictures.length > 0) {
        vm.currentPictureIndex = 0;
      }

      setStaredCount();
    }).catch((err) => {
      console.log(err);
    });
  }

  function changePicture(i) {
    const size = !vm.showSelectedPictures ? vm.set.pictures.length : vm.selectedPictures.length;
    vm.currentPictureIndex += i;

    if (vm.currentPictureIndex % size < 0) {
      vm.currentPictureIndex += size;
    }

    if (vm.currentPictureIndex >= size) {
      vm.currentPictureIndex %= size;
    }

    if (!vm.showSelectedPictures) {
      vm.imgUrl = Config.uploadUrl + vm.set.pictures[vm.currentPictureIndex].name;
    } else {
      vm.imgUrl = Config.uploadUrl + vm.selectedPictures[vm.currentPictureIndex].name;
    }
  }

  updatePictures();
  $interval(updatePictures, 10000);

  vm.nextPicture = () => {
    changePicture(1);
  };
  vm.previousPicture = () => {
    changePicture(-1);
  };

  vm.toggleStarPicture = () => {
    let index = vm.currentPictureIndex;

    if (vm.showSelectedPictures) {
      vm.set.pictures.forEach((p, i) => {
        if (p._id === vm.selectedPictures[vm.currentPictureIndex]._id) {
          index = i;
        }
      });
    }

    const data = {
      setID: vm.set._id,
      pictureID: vm.set.pictures[index]._id
    };

    if (vm.set.pictures[index].stared) {
      // remove from stared array
      const indexToRemove = vm.selectedPictures.indexOf(vm.set.pictures[index]);

      if (indexToRemove >= 0) {
        vm.selectedPictures.splice(indexToRemove, 1);

        vm.currentPictureIndex = vm.currentPictureIndex > 0 ? vm.currentPictureIndex--: 0;
      }
      data.stared = false;
    } else {
      // add to stared array
      vm.selectedPictures.push(vm.set.pictures[index]);
      data.stared = true;
    }

    PictureViewerFactory.starPicture(data).then((response) => {
      if (response.data.data._id) {
        vm.set.pictures[index].stared = data.stared;
        setStaredCount();
        if (!vm.staredCount) {
          vm.toggleSelectedPictures()
        }
      }
    }).catch((err) => {
      if (err) {
        console.log(err);
      }
    });
  };

  vm.resetStaredCount = () => {
    vm.set.pictures.forEach((p) => {
      if (p.stared) {
        let data = {
          setID: vm.set._id,
          pictureID: p._id,
          stared: false
        };
        PictureViewerFactory.starPicture(data).then((response) => {
          if (response.data.data._id) {
            p.stared = data.stared;
            setStaredCount();
          }
        }).catch((err) => {
          if (err) {
            console.log(err);
          }
        });
      }
    });
  };

  vm.getPrice = () => {
    let price = 0;
    if (vm.staredCount === 1) {
      price = 15;
    } else if (vm.staredCount >= 2 && vm.staredCount <= 3) {
      price = 33;
    } else if (vm.staredCount > 3) {
      price = 40;
    }

    return price;
  };

  vm.toggleSelectedPictures = () => {
    if (!vm.selectedPictures.length && !vm.showSelectedPictures) {
      vm.selectedPictures = vm.set.pictures.filter(p => p.stared);
    }
    vm.showSelectedPictures = !vm.showSelectedPictures;
    vm.currentPictureIndex = 0;
  };
}

PictureViewerController.$inject = ['PictureViewerFactory', 'Config', '$interval', '$location'];

export default PictureViewerController;
