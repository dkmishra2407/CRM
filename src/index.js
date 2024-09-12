import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { CartProvider } from './Context/card.context';
import { PageProvider } from './Context/page-context';
ReactDOM.render(
  <React.StrictMode>
    <PageProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </PageProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
