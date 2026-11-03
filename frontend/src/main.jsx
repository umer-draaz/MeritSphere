import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { ProfileProvider } from './context/ProfileContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './styles/theme.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <ProfileProvider>
          <App />
        </ProfileProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);
