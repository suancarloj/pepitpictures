(function (module) {
  'use strict';

  function ppDropzone(Config) {
    return {
      restrict: 'E',
      scope: {
        computerID: '=computer',
        set: '=',
        createNewPictureSet: '&createNew',
        sets: '='
      },
      templateUrl: 'templates/pu.dropzone.html',
      link: {
        post: function (scope, el, attrs) {
          var options = {
            url: Config.action.replace(':computerID', scope.computerID).replace(':set', scope.set._id),
            paramName: "img", // The name that will be used to transfer the file
            parallelUploads: 20,
            previewsContainer: false,
            maxFilesize: 50, // MB
            acceptedFiles: "image/*,.jpg",
            init: function() {
              this.on("processing", function(file) {
                var url = Config.action.replace(':computerID', scope.computerID).replace(':set', scope.set._id);
                console.log( url );
                this.options.url = url;
              });
            }
          };

          var dropzone = new Dropzone(el.children().children().children()[0], options);
        }
      }
    };
  }

  ppDropzone.$inject = ['Config'];

  module.directive('ppDropzone', ppDropzone);
}(angular.module('PictureUploader')));
