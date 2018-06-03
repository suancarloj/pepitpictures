function pictureUploaderFactory($http, $location, Config) {
  return {
    getNewPictureSet(id) {
      const url = `${Config.apiBasePath}${Config.getPictureSetId}`;
      return $http.post(url, { computerId: id });
    },
    getLastTenSets(id) {
      const url = Config.lastTenSets.replace(':computerID', id);
      return $http.get(`${Config.apiBasePath}${url}`);
    },
    createShFile(setID) {
      const url = Config.createShFile.replace(':setID', setID);
      return $http.put(`${Config.apiBasePath}${url}`);
    },
  };
}

pictureUploaderFactory.$inject = ['$http', '$location', 'Config'];

export default pictureUploaderFactory;
