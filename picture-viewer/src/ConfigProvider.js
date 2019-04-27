export default {
  // apiBasePath: 'http://192.168.0.130:9000/',
  apiBasePath: 'http://localhost:3333/',
  numberOfComputer: 4,
  uploadUrl: 'uploads/',
  pvUrl: 'pictures/computer-',
  action: 'upload/computer-:computerId?set=:set',
  pvStarPicture: 'pictures/',
  getPictureSetId: 'pictures',
  lastTenSets: 'pictures/computer-:computerId/all',
  createShFile: 'pictures/:setId/create-sh-file',
  publish: 'pictures/:setId/publish',
};
