import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import App from './react/App';
const reactRoot = document.getElementById('root');

const Screens = () => (
  <Fragment>
    <div className="computer-1">
      <App computerId="1" />
    </div>
    <div className="computer-2">
      <App computerId="2" />
    </div>
    <div className="computer-3">
      <App computerId="3" />
    </div>
    <div className="computer-4">
      <App computerId="4" />
    </div>
  </Fragment>
)

ReactDOM.render(
  <BrowserRouter>
    <div className="grid-container">
      <div className="sidebar">
        <img src="/images/logo.png" alt="logo" />
        <a href="/pictures/email-status"><img src="/images/logo.png" alt="logo" /></a>
      </div>
      <Route path="/" component={Screens}/>
      <Route path="/pictures/email-status" component={() => <div>Hello</div>}/>
    </div>
  </BrowserRouter>,
  reactRoot
);
