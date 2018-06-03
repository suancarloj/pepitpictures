import angular from 'angular';
import PictureViewerController from './PictureViewerController';
import PictureViewerFactory from './PictureViewerFactory';
import ReactDirective from '../ReactDirective';
import Email from '../../react/picture-viewer/Email';

export default angular
  .module('PictureViewer', ['Core'])
  .controller('PictureViewerController', PictureViewerController)
  .factory('PictureViewerFactory', PictureViewerFactory)
  .directive(
    'reactDirective',
    ['$timeout', ReactDirective(Email, 'viewer-root-', {
      pictureSetId: '@pictureSetId',
      computerId: '@computerId',
    })]
  )
  .name;

