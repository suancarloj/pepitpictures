import PictureUploaderController from './PictureUploaderController';

function DropzoneDirective(Config) {
  return {
    restrict: 'E',
    scope: {
      computerID: '=computer',
    },
    controller: PictureUploaderController,
    controllerAs: 'pu',
    template: require('./pu.dropzone.html'),
    link: {
      pre(scope) {
        scope.pu.createNewPictureSet(scope.computerID);
      },
      post(scope, el) {
        // const options = {
        //   url: 'http://127.0.0.1:3000',
        //   paramName: 'img', // The name that will be used to transfer the file
        //   parallelUploads: 20,
        //   previewsContainer: false,
        //   maxFilesize: 50, // MB
        //   acceptedFiles: 'image/*,.jpg',
        //   init() {
        //     this.on('processing', () => {
        //       const url = Config.action
        //         .replace(':computerId', scope.computerID)
        //         .replace(':set', scope.pu.currentPictureSet._id);
        //       this.options.url = Config.apiBasePath + url;
        //     });
        //   },
        // };

        // const dropzone = new Dropzone(el.children().children().children()[0], options);
      },
    },
  };
}

DropzoneDirective.$inject = ['Config'];


export default DropzoneDirective;
