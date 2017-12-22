import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles';
import App from './App';
import './App.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
, document.getElementById('root'));
registerServiceWorker();
