export default {
  apiBasePath: 'http://localhost:9000/',
  numberOfComputer: 4,
  uploadUrl: 'uploads/',
  pvUrl: 'pictures/computer-',
  action: 'upload/computer-:computerID?set=:set',
  isNewSetAvailable: 'pictures/fetchNew?computerID=:computerID&createdAt=:createdAt',
  pvStarPicture: 'pictures/',
  getPictureSetId: 'pictures',
  lastTenSets: 'picture-set/computer-:computerID/all',
  createShFile: 'picture-set/create-sh-file/:setID',
};
