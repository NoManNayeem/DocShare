// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';

// Global styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// Core App
import App from './App';
import { AuthProvider } from './context/AuthContext';
import reportWebVitals from './reportWebVitals';

// Create root and render app
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// Performance metrics (optional)
reportWebVitals();
