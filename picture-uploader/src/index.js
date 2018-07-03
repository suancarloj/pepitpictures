import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import App from './App';
import EmailStatusTable from './pages/email-status/EmailStatusTable';
const reactRoot = document.getElementById('root');

const Screens = () => (
  <div className="grid-screens">
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
  </div>
);
const AppShell = () => (
  <div className="grid-container">
    <div className="sidebar">
      <a href="/">
        <img src="/images/logo.png" alt="logo" />
      </a>
      <a href="/pictures/email-status">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20px" height="20px">
          <path
            d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v40.805c-22.422 18.259-58.168 46.651-134.587 106.49-16.841 13.247-50.201 45.072-73.413 44.701-23.208.375-56.579-31.459-73.413-44.701C106.18 199.465 70.425 171.067 48 152.805V112h416zM48 400V214.398c22.914 18.251 55.409 43.862 104.938 82.646 21.857 17.205 60.134 55.186 103.062 54.955 42.717.231 80.509-37.199 103.053-54.947 49.528-38.783 82.032-64.401 104.947-82.653V400H48z"
            fill="#fff"
          />
        </svg>
      </a>
    </div>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Screens} />
        <Route exact path="/pictures/email-status" component={EmailStatusTable} />
      </Switch>
    </BrowserRouter>
  </div>
);
ReactDOM.render(<AppShell />, reactRoot);
