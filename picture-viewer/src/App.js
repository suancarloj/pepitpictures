import React from 'react';
import { Router } from '@reach/router';
import { Viewer } from './pages/view/Viewer';

function App() {
  return (
    <Router id="router">
      <Viewer path="/view/:computerId" />
    </Router>
  );
}

export default App;
