import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, NavLink, Route } from 'react-router-dom';
import App from './App';
import EmailStatusTable from './pages/email-status/EmailStatusTable';
import { basePath } from './services/pictures';
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
  <BrowserRouter>
    <div className="grid-container">
      <div className="sidebar">
        <NavLink to="/">
          <img src="/images/logo.png" alt="logo" />
        </NavLink>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingBottom: '20px',
            flex: 1,
          }}
        >
          <NavLink to="/pictures/email-status">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              width="20px"
              height="20px"
            >
              <path
                d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v40.805c-22.422 18.259-58.168 46.651-134.587 106.49-16.841 13.247-50.201 45.072-73.413 44.701-23.208.375-56.579-31.459-73.413-44.701C106.18 199.465 70.425 171.067 48 152.805V112h416zM48 400V214.398c22.914 18.251 55.409 43.862 104.938 82.646 21.857 17.205 60.134 55.186 103.062 54.955 42.717.231 80.509-37.199 103.053-54.947 49.528-38.783 82.032-64.401 104.947-82.653V400H48z"
                fill="#fff"
              />
            </svg>
          </NavLink>
          <a href={`${basePath}/shutdown`} target="_blank">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 1000 1000"
              width="20px"
              height="20px"
            >
              <path
                d="M764,152.1c30.9,22,58.3,46.8,82.4,74.6c24,27.8,44.6,57.8,61.8,90.1c17.2,32.3,30.2,66.4,39.1,102.4c8.9,36,13.4,72.6,13.4,109.6c0,63.8-12.2,123.7-36.5,179.6c-24.4,55.9-57.3,104.7-98.8,146.2c-41.5,41.5-90.2,74.5-146.2,98.8C623.2,977.8,563.3,990,499.5,990c-63.1,0-122.7-12.2-178.6-36.5c-55.9-24.4-104.8-57.3-146.7-98.8c-41.9-41.5-74.8-90.2-98.8-146.2c-24-55.9-36-115.8-36-179.6c0-36.4,4.3-72.1,12.9-107.1c8.6-35,20.8-68.3,36.5-99.9c15.8-31.6,35.3-61.1,58.7-88.5c23.3-27.5,49.4-52.2,78.2-74.1c15.1-11,31.4-15.1,48.9-12.4c17.5,2.7,31.7,11.3,42.7,25.7c11,14.4,15.1,30.5,12.4,48.4c-2.7,17.8-11.3,32.3-25.7,43.2c-43.2,31.6-76.4,70.3-99.3,116.3c-23,46-34.5,95.4-34.5,148.2c0,45.3,8.6,88,25.7,128.2c17.2,40.1,40.7,75.1,70.5,105c29.9,29.9,64.9,53.5,105,71c40.1,17.5,82.9,26.3,128.2,26.3c45.3,0,88-8.7,128.2-26.3c40.1-17.5,75.1-41.2,105-71s53.5-64.9,71-105c17.5-40.1,26.3-82.9,26.3-128.2c0-53.5-12.4-104.1-37.1-151.8c-24.7-47.7-59.4-87-104-117.9c-15.1-10.3-24.2-24.4-27.3-42.2c-3.1-17.8,0.5-34.3,10.8-49.4c10.3-14.4,24.4-23.2,42.2-26.2C732.5,138.2,748.9,141.8,764,152.1L764,152.1z M499.5,531.9c-17.8,0-33.1-6.3-45.8-19c-12.7-12.7-19-28-19-45.8V75.9c0-17.8,6.3-33.3,19-46.3c12.7-13,28-19.6,45.8-19.6c18.5,0,34.1,6.5,46.8,19.6c12.7,13,19,28.5,19,46.3v391.2c0,17.8-6.3,33.1-19,45.8C533.6,525.6,518,531.9,499.5,531.9L499.5,531.9z"
                fill="#fff"
              />
            </svg>
          </a>
        </div>
      </div>

      <Route path="/" render={Screens} />
      <Route exact path="/pictures/email-status" component={EmailStatusTable} />
    </div>
  </BrowserRouter>
);
ReactDOM.render(<AppShell />, reactRoot);
