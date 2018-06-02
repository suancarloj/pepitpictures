function PictureUploaderController($scope, pufactory) {
  const vm = this;

  function getLastTenSets(id) {
    pufactory.getLastTenSets(id).then((response) => {
      vm.sets = response.data.data;
    }).catch((err) => {
      if (err) {
        console.log(err);
      }
    });
  }

  vm.createNewPictureSet = (id) => {
    pufactory.getNewPictureSet(id).then((response) => {
      const { data } = response.data;
      vm.currentPictureSet = data;
      vm.currentPictureSet.text = data._id.substr(10);
      getLastTenSets(id);
    }).catch((err) => {
      if (err) {
        console.log(err);
      }
    });
  };

  vm.pushToRasp = (setID) => {
    pufactory.createShFile(setID).then((response) => {
      console.log(response.data.data);
    }).catch((err) => {
      if (err) {
        console.log(err);
      }
    });
  };
}

PictureUploaderController.$inject = ['$scope', 'PictureUploaderFactory'];

export default PictureUploaderController;
