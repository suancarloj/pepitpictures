import React from 'react';

export function Navbar(props) {
  return (
    <footer className="page-footer grey lighten-5">
      <div className="row">
        <div className="col s4 center-align">
          <button
            className="btn btn-large waves-effect waves-light btn-disabled"
            onClick={props.prev}
            disabled={!props.pictureCount || (props.showStared && props.staredCount === 1)}
          >
            Back
            <i className="mdi-navigation-arrow-back left" />
          </button>
        </div>
        <div className="col s2 center-align">
          <button
            className="btn btn-large waves-effect waves-light red lighten-2"
            onClick={props.toggleStarPicture}
            disabled={!props.pictureCount}
          >
            {props.staredCount}
            <i
              className={
                props.stared ? 'mdi-action-favorite left' : 'mdi-action-favorite-outline left'
              }
            />
          </button>
        </div>
        <div className="col s2 center-align">
          <button
            className="btn btn-large waves-effect waves-light"
            onClick={props.toggleShowStared}
            disabled={!props.pictureCount}
          >
            {props.showStared ? 'All pictures' : 'Selected'}
          </button>
        </div>
        <div className="col s4 center-align">
          <button
            className="btn btn-large waves-effect waves-light"
            onClick={props.next}
            disabled={!props.pictureCount || (props.showStared && props.staredCount === 1)}
          >
            Next
            <i className="mdi-navigation-arrow-forward right" />
          </button>
        </div>
      </div>
    </footer>
  );
}
