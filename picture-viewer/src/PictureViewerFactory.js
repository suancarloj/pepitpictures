function PictureViewerFactory($http, $location, Config) {
  const set = [];
  return {
    getAllPictures() {
      const url = Config.apiBasePath + Config.pvUrl + $location.$$absUrl.match(/\d/g).pop();
      return $http.get(url);
    },
    starPicture(data) {
      const url = `${Config.apiBasePath}${Config.pvStarPicture}${data.setID}/${
        data.pictureID
      }?stared=${data.stared}`;
      return $http.put(url);
    },
    set,
  };
}

PictureViewerFactory.$inject = ['$http', '$location', 'Config'];

export default PictureViewerFactory;
