import angular from 'angular';
import Core from '../common/Core';
import countPicturesFilter from './CountFilter';
import DropzoneDirective from './DropzoneDirective';
import PictureUploaderController from './PictureUploaderController';
import PictureUploaderFactory from './PictureUploaderFactory';
import ReactDirective from '../ReactDirective';
import App from '../../react/App';

export default angular
  .module('foo', [Core])
  .filter('countPictures', countPicturesFilter)
  .directive('ppDropzone', DropzoneDirective)
  // .directive(
  //   'reactDirective',
  //   ['$timeout', ReactDirective(ReactComponent, 'test-root-', {
  //     pictureSetId: '@pictureSetId',
  //     computerId: '@computerId',
  //     createNewPictureSet: '&createNewPictureSet',
  //   })]
  // )
  .directive(
    'reactPictureList',
    ['$timeout', ReactDirective(App, 'picture-list-root-', {
      computerId: '@computerId',
      createNewPictureSet: '&createNewPictureSet',
      pictureCollection: '=pictureCollection',
      pictureSetId: '@pictureSetId',
      publish: '&publish',
    }, '[pictureSetId, pictureCollection]')]
  )
  .controller('PictureUploaderController', PictureUploaderController)
  .factory('PictureUploaderFactory', PictureUploaderFactory)
  .name;
