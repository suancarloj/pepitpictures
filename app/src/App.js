import React, { Component } from 'react';
import qs from 'qs';
import Layout from './components/layout/Layout';
import styled from 'styled-components';

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

const ImageContainer = styled.div`
  box-sizing: border-box;
  padding: 10px;
  position: relative;
  text-align: center;
  svg {
    left: calc(50% - 15px);
    position: absolute;
    top: calc(50% - 15px);
  }
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
      pictures: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
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
          };
        });
        this.setState({ pictures });
      })
      .catch((err) => {
        this.setState({ error: 'error-fetching-collection' });
      });
  }

  render() {
    const pictureCount = (this.state.pictures && this.state.pictures.length) || '';
    return (
      <Layout>
        <ImageViewerContainer>
          {this.state.pictures &&
            this.state.pictures.map((picture, idx) => {
              return (
                <ImageContainer>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30px"
                    height="30px"
                    viewBox="0 0 512 512"
                  >
                    <path
                      d="M504 256c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zM212 140v116h-70.9c-10.7 0-16.1 13-8.5 20.5l114.9 114.3c4.7 4.7 12.2 4.7 16.9 0l114.9-114.3c7.6-7.6 2.2-20.5-8.5-20.5H300V140c0-6.6-5.4-12-12-12h-64c-6.6 0-12 5.4-12 12z"
                      fill="rgb(30, 179, 188)"
                    />
                  </svg>
                  <a
                    href={`https://i.pepitpictures.com/img/${
                      this.state.id
                    }/pepitpicture-${idx}.jpg`}
                    download
                    style={{ color: '#fff' }}
                  >
                    <img
                      src={picture.thumbnail}
                      alt=""
                      width={picture.thumbnailWidth + 'px'}
                      height={picture.thumbnailHeight + 'px'}
                    />
                  </a>
                </ImageContainer>
              );
            })}
        </ImageViewerContainer>
        <Separator />
      </Layout>
    );
  }
}

export default App;
