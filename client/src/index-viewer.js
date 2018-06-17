import angular from 'angular';

import 'angular/angular-csp.css';
import CoreModule from './angular/common/Core';
import PictureViewerModule from './angular/picture-viewer/PictureViewer';

angular.module('PictureUploader', [
  CoreModule,
  PictureViewerModule,
]);

angular.bootstrap(document, ['PictureViewer'], { strictDi: true });

