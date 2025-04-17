if (localStorage.theme === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

import React, { StrictMode } from 'react';   
import { createRoot } from 'react-dom/client'; 
import './index.css';  
import App from './App.jsx'; 

const rootElement = document.getElementById('root');  
const root = createRoot(rootElement);  

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
