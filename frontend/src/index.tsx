import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AppProvider } from './context/AppContext';
import { AccessibilityProvider } from './context/AccessibilityContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <AppProvider>
      <AccessibilityProvider>
        <App />
      </AccessibilityProvider>
    </AppProvider>
  </React.StrictMode>
);


reportWebVitals();