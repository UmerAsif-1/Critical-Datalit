import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AppProvider } from './context/AppContext'; // <-- import the provider

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <AppProvider> {/* <-- wrap App with AppProvider */}
      <App />
    </AppProvider>
  </React.StrictMode>
);

// Optional: performance logging
reportWebVitals();``