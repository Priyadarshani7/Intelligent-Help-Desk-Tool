import React, { StrictMode } from 'react';   // Import React and StrictMode
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom
import './index.css';  // Import Tailwind CSS
import App from './App.jsx';  // Import App component

// Correct usage of createRoot and StrictMode
const rootElement = document.getElementById('root');  // Get the root div
const root = createRoot(rootElement);  // Create the root for rendering

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
