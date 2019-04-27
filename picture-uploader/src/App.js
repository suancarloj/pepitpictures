import React, { Component } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import DropzoneContainer from './pages/picture-uploader/DropzoneContainer';
import { createNewPictureCollection, uploadPicture } from './services/pictures';
import ScreenHandler from './pages/picture-uploader/ScreenHandler';
import PictureList from './pages/picture-uploader/PictureList';
import { basePath } from './services/pictures';

class App extends Component {
  static propTypes = {
    computerId: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.socket = io.connect(`${basePath}?room=computer-${props.computerId}`);
    this.state = {
      files: [],
      pictureSetId: '',
    };
  }

  componentDidMount() {
    this.handleCreateNewPictureCollection();
  }

  handleCreateNewPictureCollection = () => {
    createNewPictureCollection(this.props.computerId).then((collection) => {
      const pictureSetId = collection.data._id;
      this.setState({ pictureSetId });
      this.socket.emit('fetch-fresh-data', pictureSetId);
    });
  };

  handleDrop = (files) => {
    const { computerId } = this.props;
    const { pictureSetId } = this.state;
    this.setState({ files });
    const promises = files.map((file) => uploadPicture(file, computerId, pictureSetId));

    Promise.all(promises).then(() => {
      this.socket.emit('fetch-fresh-data', pictureSetId);
      console.log('upload files done');
    });
  };

  render() {
    const { computerId } = this.props;
    return (
      <DropzoneContainer onDrop={this.handleDrop}>
        <ScreenHandler
          socket={this.socket}
          computerId={this.props.computerId}
          createNewPictureSet={this.handleCreateNewPictureCollection}
          pictureSetId={this.state.pictureSetId}
        />
        <PictureList computerId={computerId} pictureSetId={this.state.pictureSetId} />
      </DropzoneContainer>
    );
  }
}

export default App;
