// Email service for sending notifications and confirmations
import emailjs from 'emailjs-com';

// EmailJS configuration
const EMAILJS_USER_ID = 'wfhj9VyHSzh-Nm5wG'; 
const EMAILJS_SERVICE_ID = 'service_x6teb4m'; 
const EMAILJS_CONFIRMATION_TEMPLATE_ID = 'template_8fw5vta'; 
const EMAILJS_REMINDER_TEMPLATE_ID = 'template_s44n7ce';

// Track emails that have been sent to prevent duplicates
const sentEmails = {};

/**
 * Send a confirmation email when a donation is scheduled
 * @param {Object} donationData - Information about the scheduled donation
 * @returns {Promise} - Promise resolving to the email sending result
 */
const sendDonationConfirmationEmail = async (donationData) => {
  console.log('Sending donation confirmation email to:', donationData.email);
  
  // Create a unique ID for this confirmation email
  const emailId = `confirmation_${donationData.id || Date.now()}`;
  
  // Check if this confirmation email has already been sent
  if (sentEmails[emailId]) {
    console.log('Confirmation email already sent, skipping');
    return sentEmails[emailId];
  }
  
  // Format the donation amount for display
  const dailyAmount = (donationData.amount / 10).toFixed(2);
  const totalAmount = donationData.amount.toFixed(2);
  
  // Prepare the template parameters
  const templateParams = {
    to_email: donationData.email,
    to_name: donationData.email.split('@')[0], // Use the part before @ as name if no name provided
    charity_name: donationData.charityName,
    daily_amount: dailyAmount,
    total_amount: totalAmount,
    reminder_time: formatTime(donationData.scheduledTime)
  };
  
  try {
    console.log('Sending confirmation email with params:', JSON.stringify(templateParams));
    
    // Send the email using EmailJS
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_CONFIRMATION_TEMPLATE_ID,
      templateParams,
      EMAILJS_USER_ID
    );
    
    console.log('Confirmation email sent successfully:', response);
    
    // Store the response to prevent duplicate sends
    sentEmails[emailId] = response;
    
    return response;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
};

/**
 * Send a nightly reminder email for scheduled donations
 * @param {Object} donationData - Information about the scheduled donation
 * @param {number} nightNumber - The night number (21-30)
 * @returns {Promise} - Promise resolving to the email sending result
 */
const sendNightlyReminderEmail = async (donationData, nightNumber) => {
  console.log(`Sending night ${nightNumber} reminder email to:`, donationData.email);
  
  // Create a unique ID for this reminder email
  const emailId = `reminder_${donationData.id}_night_${nightNumber}`;
  
  // Check if this reminder email has already been sent
  if (sentEmails[emailId]) {
    console.log(`Night ${nightNumber} reminder already sent, skipping`);
    return sentEmails[emailId];
  }
  
  // Format the donation amount for display
  const dailyAmount = (donationData.amount / 10).toFixed(2);
  
  // Prepare the template parameters
  const templateParams = {
    to_email: donationData.email,
    to_name: donationData.email.split('@')[0], // Use the part before @ as name if no name provided
    charity_name: donationData.charityName,
    amount: dailyAmount,
    night_number: nightNumber
  };
  
  try {
    console.log('Sending reminder email with params:', JSON.stringify(templateParams));
    
    // Send the email using EmailJS
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_REMINDER_TEMPLATE_ID,
      templateParams,
      EMAILJS_USER_ID
    );
    
    console.log('Reminder email sent successfully:', response);
    
    // Store the response to prevent duplicate sends
    sentEmails[emailId] = response;
    
    return response;
  } catch (error) {
    console.error('Error sending reminder email:', error);
    throw error;
  }
};

/**
 * Format time from 24-hour format to 12-hour format
 * @param {string} time24 - Time in 24-hour format (HH:MM)
 * @returns {string} - Time in 12-hour format (HH:MM AM/PM)
 */
const formatTime = (time24) => {
  if (!time24) return '';
  
  const [hours24, minutes] = time24.split(':');
  let hours12 = parseInt(hours24, 10) % 12;
  hours12 = hours12 === 0 ? 12 : hours12; // Convert 0 to 12 for 12 AM
  const ampm = parseInt(hours24, 10) >= 12 ? 'PM' : 'AM';
  
  return `${hours12}:${minutes} ${ampm}`;
};

/**
 * Clear sent email tracking
 * Useful for testing
 */
const clearSentEmails = () => {
  Object.keys(sentEmails).forEach(key => delete sentEmails[key]);
  console.log('Cleared sent email tracking');
};

// Initialize EmailJS
const initializeEmailService = () => {
  console.log('Initializing email service');
  emailjs.init(EMAILJS_USER_ID);
};

export {
  sendDonationConfirmationEmail,
  sendNightlyReminderEmail,
  initializeEmailService,
  clearSentEmails
};
