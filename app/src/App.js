import React, { Component } from 'react';
import qs from 'qs';
import Layout from './components/layout/Layout';
import ImageViewer from './pages/image-viewer/ImageViewer';

class App extends Component {
  constructor() {
    super();
    const { id = null } = qs.parse(window.location.search, { ignoreQueryPrefix: true });
    this.state = {
      error: null,
      id,
      pictures: null
    };
  }

  componentDidMount() {
    if (!this.state.id) {
      this.setState({ error: 'error-missing-id' });
      return ;
    }

    const basePath = `https://i.pepitpictures.com/img/${this.state.id}`;

    fetch(`${basePath}/collection.json`)
      .then(res => res.json())
      .then((json = {}) => {
        const pictures = json.pictures.map((picture, idx) => {
          return {
            src: `${basePath}/pepitpicture-${idx}.jpg`,
            thumbnail : `${basePath}/pepitpicture-${idx}-tbn.jpg`,
            thumbnailHeight: picture.thumbnailHeight,
            thumbnailWidth: picture.thumbnailWidth,
          }
        });
        this.setState({ pictures });
      })
      .catch(err => {
        this.setState({ error: 'error-fetching-collection' });
      })
  }

  render() {
    return (
      <Layout>
        {this.state.pictures && (
          <ImageViewer
            images={this.state.pictures}
          />
        )}
      </Layout>
    );
  }
}

export default App;
