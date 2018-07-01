import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DropzoneContainer from './picture-uploader/DropzoneContainer';
import { uploadPicture } from './services/pictures';
import ScreenHandler from './picture-uploader/ScreenHandler';

class App extends Component {
  static propTypes = {
    computerId: PropTypes.string.isRequired,
    pictureSetId: PropTypes.string.isRequired,
    publish: PropTypes.func.isRequired,
    createNewPictureSet: PropTypes.func.isRequired,
    pictureCollection: PropTypes.arrayOf(
      PropTypes.shape({
        computerId: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        updatedAt: PropTypes.string,
        pictures: PropTypes.arrayOf(
          PropTypes.shape({
            stared: PropTypes.bool,
            _id: PropTypes.string,
            originalName: PropTypes.string,
            name: PropTypes.string,
            thumbnail: PropTypes.string,
            thumbnailHeight: PropTypes.number,
            thumbnailWidth: PropTypes.number,
          })
        ).isRequired,
      })
    ),
  };

  state = {
    files: [],
  };

  handleDrop = (files) => {
    const { computerId, pictureSetId } = this.props;
    this.setState({ files });
    const promises = files.map((file) => uploadPicture(file, computerId, pictureSetId));

    Promise.all(promises).then(() => {
      console.log('done');
    });
  };

  render() {
    const { files } = this.state;
    const { computerId, pictureSetId } = this.props;
    return (
      <DropzoneContainer onDrop={this.handleDrop}>
        <ScreenHandler
          computerId={this.props.computerId}
          createNewPictureSet={this.props.createNewPictureSet}
          pictureSetId={this.props.pictureSetId}
        />
        <ul>
          {files.map((f) => (
            <li key={f.name}>
              {f.name} - {f.size} bytes
            </li>
          ))}
        </ul>
      </DropzoneContainer>
    );
  }
}



export default App;
