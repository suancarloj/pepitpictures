import angular from 'angular';
import Core from '../common/Core';
import countPicturesFilter from './CountFilter';
import DropzoneDirective from './DropzoneDirective';
import PictureUploaderController from './PictureUploaderController';
import PictureUploaderFactory from './PictureUploaderFactory';

export default angular
  .module('foo', [Core])
  .filter('countPictures', countPicturesFilter)
  .directive('ppDropzone', DropzoneDirective)
  .controller('PictureUploaderController', PictureUploaderController)
  .factory('PictureUploaderFactory', PictureUploaderFactory)
  .name;

