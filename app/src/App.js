import React, { Component } from 'react';
import qs from 'qs';
import Layout from './components/layout/Layout';
import ImageViewer from './pages/image-viewer/ImageViewer';
import Promise from 'bluebird';
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import styled from 'styled-components';

const DownloadAllButton = styled.button`
  background-color: rgb(30, 179, 188);
  border-radius: 3px;
  border-style: none;
  color: #fff;
  font-size: 16px;
  height: 48px;
  padding: 16px 40px;
  text-transform: uppercase;
  &:hover {
    opacity: 1.1;
  }
  &:disabled {
    background-color: rgba(0, 0, 0, 0.05);
    color: #000;
    text-transform: none;
  }
`;

const Separator = styled.hr`
  border-style: none;
  border-bottom: 1px solid rgb(240, 240, 240);
  max-width: 800px;
`;

const DownloadButtonContainer = styled.div`
  margin: 40px auto 80px;
  text-align: center;
`;

const ImageViewerContainer = styled.div`
  border: 1px solid rgb(221, 221, 221);
  display: block;
  min-height: 1px;
  overflow: auto;
  width: 100%;
`;

class App extends Component {
  constructor() {
    super();
    const { id = null } = qs.parse(window.location.search, { ignoreQueryPrefix: true });
    this.state = {
      counter: 0,
      downloading: false,
      error: null,
      id,
      pictures: null,
    };
  }

  componentDidMount() {
    if (!this.state.id) {
      this.setState({ error: 'error-missing-id' });
      return;
    }

    const basePath = `https://i.pepitpictures.com/img/${this.state.id}`;

    fetch(`${basePath}/collection.json`)
      .then((res) => res.json())
      .then((json = {}) => {
        const pictures = json.pictures.map((picture, idx) => {
          return {
            src: `${basePath}/pepitpicture-${idx}.jpg`,
            thumbnail: `${basePath}/pepitpicture-${idx}-tbn.jpg`,
            thumbnailHeight: picture.thumbnailHeight,
            thumbnailWidth: picture.thumbnailWidth,
            caption: <a href={`${basePath}/pepitpicture-${idx}.jpg`} download style={{ color: "#fff" }}>DOWNLOAD</a>
          };
        });
        this.setState({ pictures });
      })
      .catch((err) => {
        this.setState({ error: 'error-fetching-collection' });
      });
  }

  handleSaveAll = () => {
    this.setState({ downloading: true });
    const zip = new JSZip();
    const promises = this.state.pictures.map((picture, idx) => {
      return fetch(picture.src)
        .then((response) => {
          if (response.status === 200 || response.status === 0) {
            return response.blob();
          } else {
            return Promise.reject(new Error(response.statusText));
          }
        })
        .then((blb) => {
          this.setState({ counter: this.state.counter + 1 });
          return blb;
        })
        .then((obj) => {
          return zip.file(`pepitpicture-${idx}.jpg`, obj);
        })
        .catch((err) => {
          this.setState({ error: 'error-fetching-image-for-zip' });
        });
    });

    Promise.all(promises).then(() => {
      zip.generateAsync({ type: 'blob' }).then((content) => {
        FileSaver.saveAs(content, 'pepitpictures-com-marseillan-jet.zip');
      });
    });
  };

  render() {
    const pictureCount = (this.state.pictures && this.state.pictures.length) || '';
    return (
      <Layout>
        <ImageViewerContainer>
          {this.state.pictures && <ImageViewer images={this.state.pictures} />}
        </ImageViewerContainer>
        <Separator />
        <DownloadButtonContainer>
          <DownloadAllButton
            type="button"
            disabled={this.state.downloading}
            onClick={this.handleSaveAll}
          >
            {!this.state.downloading
              ? `Save all ${pictureCount} pictures`
              : `Please be patient while we prepare your zip file...(${
                  this.state.counter
                } ready out of ${pictureCount} pictures)`}
          </DownloadAllButton>
        </DownloadButtonContainer>
      </Layout>
    );
  }
}

export default App;
