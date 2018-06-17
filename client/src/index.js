import angular from 'angular';

import 'angular/angular-csp.css';
import CoreModule from './angular/common/Core';
import PictureUploaderModule from './angular/picture-uploader/PictureUploader';

angular.module('PictureUploader', [
  CoreModule,
  PictureUploaderModule,
]);

angular.bootstrap(document, ['PictureUploader'], { strictDi: true });

