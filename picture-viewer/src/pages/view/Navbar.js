import React from 'react';

export function Navbar(props) {
  return (
    <footer className="page-footer grey lighten-5">
      <div className="row">
        <div className="col s4 center-align">
          <button
            className="btn btn-large waves-effect waves-light btn-disabled"
            onClick={props.prev}
            data-ng-disabled="!vm.set.pictures.length || (vm.showSelectedPictures && vm.staredCount === 1)"
          >
            Back
            <i className="mdi-navigation-arrow-back left" />
          </button>
        </div>
        <div className="col s2 center-align">
          <button
            className="btn btn-large waves-effect waves-light red lighten-2"
            onClick={props.toggleStarPicture}
            data-ng-disabled="!vm.set.pictures.length"
          >
            {props.staredCount}
            <i
              className={props.stared ? 'mdi-action-favorite left' : 'mdi-action-favorite-outline left'}
              data-ng-show="(!vm.showSelectedPictures && vm.set.pictures[vm.currentPictureIndex].stared) ||
                            ( vm.showSelectedPictures && vm.selectedPictures[vm.currentPictureIndex].stared)"
            />
            <i
              className="mdi-action-favorite-outline left"
              data-ng-show="(!vm.showSelectedPictures && !vm.set.pictures[vm.currentPictureIndex].stared) ||
                            (vm.showSelectedPictures && !vm.selectedPictures[vm.currentPictureIndex].stared)"
            />
          </button>
        </div>
        <div className="col s2 center-align">
          <button
            className="btn btn-large waves-effect waves-light"
            onClick={props.toggleShowStared}
            data-ng-disabled="!vm.selectedPictures.length"
          >
            {props.showStared ? 'All pictures' : 'Selected'}
          </button>
        </div>
        <div className="col s4 center-align">
          <button
            className="btn btn-large waves-effect waves-light"
            onClick={props.next}
            data-ng-disabled="!vm.set.pictures.length || (vm.showSelectedPictures && vm.staredCount === 1)"
          >
            Next
            <i className="mdi-navigation-arrow-forward right" />
          </button>
        </div>
      </div>
    </footer>
  );
}
