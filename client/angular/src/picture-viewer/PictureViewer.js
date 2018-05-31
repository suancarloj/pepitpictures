import angular from 'angular';
import PictureViewerController from './PictureViewerController';
import PictureViewerFactory from './PictureViewerFactory';

export default angular
  .module('PictureViewer', ['Core'])
  .controller('PictureViewerController', PictureViewerController)
  .factory('PictureViewerFactory', PictureViewerFactory)
  .name;

