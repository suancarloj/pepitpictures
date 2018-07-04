import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DropzoneContainer from './pages/picture-uploader/DropzoneContainer';
import { createNewPictureCollection, uploadPicture } from './services/pictures';
import ScreenHandler from './pages/picture-uploader/ScreenHandler';
import PictureList from './pages/picture-uploader/PictureList';

class App extends Component {
  static propTypes = {
    computerId: PropTypes.string.isRequired,
    // pictureSetId: PropTypes.string.isRequired,
    // publish: PropTypes.func.isRequired,
    // createNewPictureSet: PropTypes.func.isRequired,
    // pictureCollection: PropTypes.arrayOf(
    //   PropTypes.shape({
    //     computerId: PropTypes.string.isRequired,
    //     createdAt: PropTypes.string.isRequired,
    //     updatedAt: PropTypes.string,
    //     pictures: PropTypes.arrayOf(
    //       PropTypes.shape({
    //         stared: PropTypes.bool,
    //         _id: PropTypes.string,
    //         originalName: PropTypes.string,
    //         name: PropTypes.string,
    //         thumbnail: PropTypes.string,
    //         thumbnailHeight: PropTypes.number,
    //         thumbnailWidth: PropTypes.number,
    //       })
    //     ).isRequired,
    //   })
    // ),
  };

  state = {
    files: [],
    pictureSetId: ''
  };

  componentDidMount() {
    this.handleCreateNewPictureCollection();
  }

  handleCreateNewPictureCollection = () => {
    createNewPictureCollection(this.props.computerId)
      .then(collection => {
        this.setState({ pictureSetId: collection.data._id })
      });
  }

  handleDrop = (files) => {
    const { computerId } = this.props;
    const { pictureSetId } = this.state;
    this.setState({ files });
    const promises = files.map((file) => uploadPicture(file, computerId, pictureSetId));

    Promise.all(promises).then(() => {
      console.log('done');
    });
  };

  render() {
    const { computerId } = this.props;
    return (
      <DropzoneContainer onDrop={this.handleDrop}>
        <ScreenHandler
          computerId={this.props.computerId}
          createNewPictureSet={this.handleCreateNewPictureCollection}
          pictureSetId={this.state.pictureSetId}
        />
        <PictureList computerId={computerId} pictureSetId={this.state.pictureSetId}/>
      </DropzoneContainer>
    );
  }
}

export default App;
