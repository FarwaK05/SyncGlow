import React from 'react'; // It's good practice to import React
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <-- 1. IMPORT THIS
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* <-- 2. WRAP YOUR APP IN THIS */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)