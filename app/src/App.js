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
      json: null
    };
  }

  componentDidMount() {
    if (!this.state.id) {
      this.setState({ error: 'error-missing-id' });
      return ;
    }

    fetch(`https://i.pepitpictures.com/img/${this.state.id}/collection.json`)
      .then(res => res.json())
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        this.setState({ error: 'error-fetching-collection' });
      })
  }

  render() {
    return (
      <Layout>
        {/* <ImageViewer

        /> */}
      </Layout>
    );
  }
}

export default App;
