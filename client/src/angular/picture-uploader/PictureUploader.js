import angular from 'angular';
import Core from '../common/Core';
import countPicturesFilter from './CountFilter';
import DropzoneDirective from './DropzoneDirective';
import PictureUploaderController from './PictureUploaderController';
import PictureUploaderFactory from './PictureUploaderFactory';
import ReactDirective from '../ReactDirective';
import ReactComponent from '../../react/index';

export default angular
  .module('foo', [Core])
  .filter('countPictures', countPicturesFilter)
  .directive('ppDropzone', DropzoneDirective)
  .directive(
    'reactDirective',
    ['$timeout', ReactDirective(ReactComponent, 'test-root', {
      pictureSetId: '@pictureSetId',
      computerId: '@computerId',
    })]
  )
  .controller('PictureUploaderController', PictureUploaderController)
  .factory('PictureUploaderFactory', PictureUploaderFactory)
  .name;
