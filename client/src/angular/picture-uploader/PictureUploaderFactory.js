function pictureUploaderFactory($http, $location, Config) {
  return {
    getNewPictureSet(id) {
      const url = `${Config.apiBasePath}${Config.getPictureSetId}`;
      return $http.post(url, { computerId: `computer-${id}` });
    },
    getLastTenSets(id) {
      const url = Config.lastTenSets.replace(':computerId', id);
      return $http.get(`${Config.apiBasePath}${url}`);
    },
    createShFile(setId) {
      const url = Config.createShFile.replace(':setId', setId);
      return $http.put(`${Config.apiBasePath}${url}`);
    },
    publish(setId) {
      const url = Config.publish.replace(':setId', setId);
      return $http.put(`${Config.apiBasePath}${url}`);
    },
  };
}

pictureUploaderFactory.$inject = ['$http', '$location', 'Config'];

export default pictureUploaderFactory;
