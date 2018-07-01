import React, { Component } from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';

class PictureList extends Component {
  static defaultProps = {
    pictureCollection: [],
  }
  render() {
    return (
      <div className="card-reveal">
        <span className="card-title grey-text text-darken-4">
          PC {this.props.computerId}
          <i className="mdi-navigation-close right" />
        </span>
        <ul className="collection">
          {this.props.pictureCollection.map((collection, idx) => {
            const starredCount = collection.pictures.filter(p => p.starred).length;
            const date = format(collection.createdAt, 'HH:mm DD-MM-YYYY')
            return (
              <li className="collection-item" key={idx}>
                <div>
                  {date} {collection.email} {`(${starredCount} / ${collection.pictures.length})`}
                  <a
                    href={`pictures/${this.props.pictureSetId}/download`}
                    download
                    className="secondary-content"
                  >
                    <i className="mdi-file-file-download" />
                  </a>
                  <a href="" onClick={this.props.publish} className="secondary-content">
                    <i className="mdi-content-send" />
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

PictureList.propTypes = {};

export default PictureList;
