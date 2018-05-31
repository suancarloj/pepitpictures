import angular from 'angular';

import 'angular/angular-csp.css';
import './index.scss';
import CoreModule from './common/Core';
import PictureUploaderModule from './picture-uploader/PictureUploader';

angular.module('PictureUploader', [
  CoreModule,
  PictureUploaderModule,
]);

angular.bootstrap(document, ['PictureUploader'], { strictDi: true });

