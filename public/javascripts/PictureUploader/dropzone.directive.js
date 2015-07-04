(function (module) {
  'use strict';

  function ppDropzone(Config, countPictures) {
    return {
      restrict: 'E',
      scope: {
        computerID: '=computer'
      },
      controller: 'PictureUploaderController as pu',
      templateUrl: 'templates/pu.dropzone.html',
      link: {
        pre: function (scope, el, attrs) {
          scope.pu.createNewPictureSet(scope.computerID);
        },
        post: function (scope, el, attrs) {
          var options = {
            url: 'http://127.0.0.1:3000',
            paramName: "img", // The name that will be used to transfer the file
            parallelUploads: 20,
            previewsContainer: false,
            maxFilesize: 50, // MB
            acceptedFiles: "image/*,.jpg",
            init: function() {
              this.on("processing", function(file) {
                var url = Config.action.replace(':computerID', scope.computerID).replace(':set', scope.pu.currentPictureSet._id);
                this.options.url = url;
              });
            }
          };

          var dropzone = new Dropzone(el.children().children().children()[0], options);
        }
      }
    };
  }

  ppDropzone.$inject = ['Config', 'countPicturesFilter'];

  module.directive('ppDropzone', ppDropzone);
}(angular.module('PictureUploader')));
