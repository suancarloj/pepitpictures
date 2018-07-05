export default {
  apiBasePath: 'http://192.168.0.130:9000/',
  numberOfComputer: 4,
  uploadUrl: 'uploads/',
  pvUrl: 'pictures/computer-',
  action: 'upload/computer-:computerId?set=:set',
  isNewSetAvailable: 'pictures/fetch-new?computerId=:computerId&createdAt=:createdAt',
  pvStarPicture: 'pictures/',
  getPictureSetId: 'pictures',
  lastTenSets: 'pictures/computer-:computerId/all',
  createShFile: 'pictures/:setId/create-sh-file',
  publish: 'pictures/:setId/publish',
};
