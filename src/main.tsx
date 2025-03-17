import { UsersPage } from './modules/Users';
import ReactDOM from 'react-dom/client';
import React from 'react';
import './index.css';
import Learning from './modules/learning/learning';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Learning />
  </React.StrictMode>
);
