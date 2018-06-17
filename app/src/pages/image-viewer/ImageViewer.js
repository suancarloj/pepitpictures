import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Gallery from 'react-grid-gallery';

class ImageViewer extends Component {
  render() {
    return (
      <Gallery images={this.props.images} />
    );
  }
}

ImageViewer.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape({
    src: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    thumbnailWidth: PropTypes.number,
    thumbnailHeight: PropTypes.number,
    isSelected: PropTypes.bool,
  })).isRequired,
};

export default ImageViewer;