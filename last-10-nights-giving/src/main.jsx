import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { DonationProvider } from './context/DonationContext.jsx';
import { initializeReminderService } from './services/reminderService.js';
import { initializeEmailService } from './services/emailService.js';

// Initialize services
initializeEmailService();
initializeReminderService();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DonationProvider>
      <App />
    </DonationProvider>
  </React.StrictMode>,
)
