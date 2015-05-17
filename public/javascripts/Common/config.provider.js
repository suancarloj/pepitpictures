(function (module) {
  'use strict';

  module.constant('Config', {
    numberOfComputer: 4,
    uploadUrl: 'uploads/',
    pvUrl: 'pictures/computer-',
    action: '/upload/computer-:computerID?set=:set',
    isNewSetAvailable: 'pictures/fetchNew?computerID=:computerID&createdAt=:createdAt',
    pvStarPicture: 'http://localhost:3000/pictures/',
    lastTenSets: 'picture-set/computer-:computerID/all',
    createShFile: 'picture-set/create-sh-file/:setID'
  });

}(angular.module('Core')));
