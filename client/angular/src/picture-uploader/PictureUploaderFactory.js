function pictureUploaderFactory($http, $location, Config) {
  return {
    getNewPictureSet(id) {
      const url = Config.getPictureSetId.replace(':id', id);
      return $http.put(url);
    },
    getLastTenSets(id) {
      const url = Config.lastTenSets.replace(':computerID', id);
      return $http.get(url);
    },
    createShFile(setID) {
      const url = Config.createShFile.replace(':setID', setID);
      return $http.put(url);
    },
  };
}

pictureUploaderFactory.$inject = ['$http', '$location', 'Config'];

export default pictureUploaderFactory;
