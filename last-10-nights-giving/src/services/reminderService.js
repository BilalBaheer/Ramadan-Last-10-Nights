// Reminder service for scheduled donations

import { sendDonationConfirmationEmail, sendNightlyReminderEmail, clearSentEmails } from './emailService';

// Ramadan 2025 dates (estimated)
// Last 10 nights start around March 22, 2025 (21st night of Ramadan)
const RAMADAN_LAST_10_NIGHTS = {
  21: new Date('March 22, 2025'),
  22: new Date('March 23, 2025'),
  23: new Date('March 24, 2025'),
  24: new Date('March 25, 2025'),
  25: new Date('March 26, 2025'),
  26: new Date('March 27, 2025'),
  27: new Date('March 28, 2025'), // Potential Laylatul Qadr
  28: new Date('March 29, 2025'),
  29: new Date('March 30, 2025'),
  30: new Date('March 31, 2025')
};

// Store scheduled timers to avoid duplicates
const scheduledTimers = {};

// For demo purposes, use a shorter timeframe to test reminder scheduling
// This will schedule reminders minutes apart instead of days apart
const USE_DEMO_MODE = true; // Set to false for production
const DEMO_INTERVAL_MINUTES = 5; // 5 minutes between reminders in demo mode

// Track which reminders have already been processed
const processedReminders = new Set();

/**
 * Initialize the reminder service
 * This sets up the scheduled reminders for all donations
 */
const initializeReminderService = () => {
  console.log('Initializing reminder service');
  
  // Clear any existing email tracking
  clearSentEmails();
  
  // Get scheduled donations from localStorage
  const donationHistory = JSON.parse(localStorage.getItem('donationHistory') || '[]');
  const scheduledDonations = donationHistory.filter(donation => donation.isScheduled);
  
  if (scheduledDonations.length === 0) {
    console.log('No scheduled donations found');
    return;
  }
  
  console.log(`Found ${scheduledDonations.length} scheduled donations`);
  
  // Clear any existing timers
  Object.values(scheduledTimers).forEach(timer => clearTimeout(timer));
  Object.keys(scheduledTimers).forEach(key => delete scheduledTimers[key]);
  
  // Clear processed reminders tracking
  processedReminders.clear();
  
  // Set up reminders for each scheduled donation
  scheduledDonations.forEach(donation => {
    // Only send confirmation email during initialization if it's a new donation
    // (within the last minute)
    const isNewDonation = (Date.now() - donation.timestamp) < 60000;
    if (isNewDonation) {
      sendDonationConfirmationEmail(donation)
        .then(() => console.log('Confirmation email sent for new donation'))
        .catch(err => console.error('Error sending confirmation email:', err));
    }
    
    scheduleReminders(donation);
  });
};

/**
 * Schedule reminders for a donation
 * @param {Object} donation - The scheduled donation
 */
const scheduleReminders = (donation) => {
  if (!donation.isScheduled || !donation.scheduledTime) {
    console.log('Donation is not scheduled or missing scheduled time');
    return;
  }
  
  console.log(`Setting up reminders for donation to ${donation.charityName}`);
  
  // Get the scheduled time components
  const [hours, minutes] = donation.scheduledTime.split(':').map(Number);
  
  // Schedule reminders for each of the last 10 nights
  let nightIndex = 0;
  Object.entries(RAMADAN_LAST_10_NIGHTS).forEach(([night, date]) => {
    // Create a unique ID for this reminder
    const reminderId = `${donation.id || Date.now()}_night_${night}`;
    
    // Skip if this reminder has already been processed
    if (processedReminders.has(reminderId)) {
      console.log(`Reminder for night ${night} already processed, skipping`);
      return;
    }
    
    let reminderTime;
    
    if (USE_DEMO_MODE) {
      // For demo/testing: Schedule reminders a few minutes apart
      reminderTime = new Date();
      reminderTime.setMinutes(reminderTime.getMinutes() + ((nightIndex + 1) * DEMO_INTERVAL_MINUTES));
      nightIndex++;
    } else {
      // Real implementation: Use actual Ramadan dates
      reminderTime = new Date(date);
      reminderTime.setHours(hours, minutes, 0, 0);
    }
    
    // Calculate milliseconds until the reminder time
    const now = new Date();
    const timeUntilReminder = reminderTime - now;
    
    // Only schedule if the reminder time is in the future
    if (timeUntilReminder > 0) {
      console.log(`Scheduling reminder for night ${night} at ${reminderTime.toLocaleString()}, in ${Math.round(timeUntilReminder / 60000)} minutes`);
      
      // Clear any existing timer with the same ID
      if (scheduledTimers[reminderId]) {
        clearTimeout(scheduledTimers[reminderId]);
        delete scheduledTimers[reminderId];
      }
      
      // Schedule the reminder
      scheduledTimers[reminderId] = setTimeout(() => {
        console.log(`Sending reminder for night ${night} to ${donation.email}`);
        
        // Mark this reminder as processed
        processedReminders.add(reminderId);
        
        sendNightlyReminderEmail(donation, night)
          .then(() => {
            console.log(`Night ${night} reminder sent successfully`);
            // Remove the timer from our tracking object once it's fired
            delete scheduledTimers[reminderId];
          })
          .catch(error => console.error(`Error sending night ${night} reminder:`, error));
      }, timeUntilReminder);
      
      console.log(`Reminder scheduled for ${reminderTime.toLocaleString()}, in ${Math.round(timeUntilReminder / 60000)} minutes`);
    } else {
      console.log(`Reminder time for night ${night} has already passed`);
    }
  });
  
  console.log(`Reminders scheduled for donation to ${donation.charityName}`);
  console.log(`Active timers: ${Object.keys(scheduledTimers).length}`);
};

/**
 * Add a new scheduled donation to the reminder service
 * @param {Object} donation - The newly scheduled donation
 */
const addScheduledDonation = (donation) => {
  if (!donation.isScheduled) return;
  
  console.log(`Adding new scheduled donation to reminder service: ${donation.charityName}`);
  
  // Send confirmation email immediately for new donations
  sendDonationConfirmationEmail(donation)
    .then(() => console.log('Confirmation email sent for new donation'))
    .catch(err => console.error('Error sending confirmation email:', err));
  
  // Schedule the nightly reminders
  scheduleReminders(donation);
};

/**
 * Reset the reminder service for testing
 * Clears all scheduled timers and email tracking
 */
const resetReminderService = () => {
  // Clear all scheduled timers
  Object.values(scheduledTimers).forEach(timer => clearTimeout(timer));
  Object.keys(scheduledTimers).forEach(key => delete scheduledTimers[key]);
  
  // Clear processed reminders tracking
  processedReminders.clear();
  
  // Clear sent email tracking
  clearSentEmails();
  
  console.log('Reminder service reset');
};

export {
  initializeReminderService,
  addScheduledDonation,
  resetReminderService
};
