function PictureViewerFactory($http, $location, Config) {
  const set = [];
  return {
    getAllPictures() {
      const url = Config.apiBasePath + Config.pvUrl + $location.$$absUrl.match(/\d$/)[0];
      return $http.get(url);
    },
    starPicture(data) {
      const url = `${Config.apiBasePath}${Config.pvStarPicture}${data.setID}/${
        data.pictureID
      }?stared=${data.stared}`;
      return $http.put(url);
    },
    isNewSetAvailable(data) {
      const url =
        Config.apiBasePath +
        Config.isNewSetAvailable
          .replace(':computerId', data.computerId)
          .replace(':createdAt', data.createdAt);
      return $http.get(url);
    },
    set,
  };
}

PictureViewerFactory.$inject = ['$http', '$location', 'Config'];

export default PictureViewerFactory;
