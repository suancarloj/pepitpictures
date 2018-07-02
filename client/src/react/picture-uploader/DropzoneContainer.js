import React, { Component } from 'react';
import Dz from 'react-dropzone';
import styled from 'styled-components';

const overlayStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  padding: '2.5em 0',
  background: 'rgba(0,0,0,0.5)',
  textAlign: 'center',
  color: '#fff'
};

const Dropzone = styled(Dz)`
  height: 100%;
  position: relative;
`;

const Content = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

class DropzoneContainer extends Component {
  state = {
    accept: '',
    files: [],
    dropzoneActive: false
  };

  onDragEnter = () => {
    this.setState({
      dropzoneActive: true
    });
  }

  onDragLeave = () => {
    this.setState({
      dropzoneActive: false
    });
  }

  onDrop = (files) => {
    this.setState({
      files,
      dropzoneActive: false
    });
    this.props.onDrop(files);
  }

  applyMimeTypes = (event) => {
    this.setState({
      accept: event.target.value
    });
  }

  render() {
    const { accept, files, dropzoneActive } = this.state;
    return (
      <Dropzone
        disableClick
        accept={accept}
        onDrop={this.onDrop}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
      >
        { dropzoneActive && <div style={overlayStyle}>Drop files...</div> }
        <Content>
          {this.props.children}
          {/* <h1>My awesome app</h1>
          <label htmlFor="mimetypes">Enter mime types you want to accept: </label>
          <input
            type="text"
            id="mimetypes"
            onChange={this.applyMimeTypes}
          />

          <h2>Dropped files</h2>
          <ul>
            {
              files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
            }
          </ul> */}

        </Content>
      </Dropzone>
    );
  }
}

export default DropzoneContainer;
