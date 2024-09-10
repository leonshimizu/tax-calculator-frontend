// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Main from './App';  // Importing Main (which wraps App in a Router)
import reportWebVitals from './reportWebVitals';
import './api/axios';  // Import the axios setup to initialize interceptors

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
