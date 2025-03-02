// Donation tracking service

// Mock API for tracking donations
const API_ENDPOINT = 'https://api.example.com/donations';

/**
 * Track an internal donation made through our application
 * @param {Object} donationData - Donation information
 * @returns {Promise} - Promise resolving to the tracked donation
 */
const trackInternalDonation = async (donationData) => {
  // In a real app, this would make an API call to our backend
  console.log('Tracking internal donation:', donationData);
  
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...donationData,
        id: `internal-${Date.now()}`,
        status: 'confirmed',
        timestamp: Date.now()
      });
    }, 500);
  });
};

/**
 * Generate a unique tracking ID for external donations
 * @returns {string} - Unique tracking ID
 */
const generateTrackingId = () => {
  return `ext-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
};

/**
 * Track when a user clicks to visit an external charity website
 * @param {Object} clickData - Information about the click
 * @returns {Promise} - Promise resolving to the tracking information
 */
const trackExternalDonation = async (clickData) => {
  // Generate a unique tracking ID for this potential donation
  const trackingId = generateTrackingId();
  
  // Create UTM parameters for tracking
  const utmParams = new URLSearchParams({
    utm_source: 'last_10_nights_app',
    utm_medium: 'referral',
    utm_campaign: 'ramadan_giving',
    utm_content: clickData.charityId,
    tracking_id: trackingId
  }).toString();
  
  // Construct the tracked URL with UTM parameters
  const trackedUrl = `${clickData.destinationUrl}${clickData.destinationUrl.includes('?') ? '&' : '?'}${utmParams}`;
  
  // Store the pending donation in localStorage with the tracking ID
  const pendingDonation = {
    trackingId,
    charityId: clickData.charityId,
    charityName: clickData.charityName,
    region: clickData.region,
    timestamp: Date.now(),
    status: 'pending',
    referrerUrl: clickData.referrerUrl,
    destinationUrl: clickData.destinationUrl,
    trackedUrl
  };
  
  // In a real app, we would also send this to our backend
  console.log('Tracking external donation click:', pendingDonation);
  
  // Store in localStorage for demo purposes
  const pendingDonations = JSON.parse(localStorage.getItem('pendingDonations') || '[]');
  pendingDonations.push(pendingDonation);
  localStorage.setItem('pendingDonations', JSON.stringify(pendingDonations));
  
  return {
    ...pendingDonation,
    trackedUrl // Return the tracked URL so we can redirect the user to it
  };
};

/**
 * Register webhook endpoints with external charity platforms
 * In a real app, this would be done on the backend during app setup
 * @returns {Promise} - Promise resolving to registration status
 */
const registerWebhooks = async () => {
  // This is a mock function - in a real app, this would be handled by the backend
  console.log('Registering webhooks with charity platforms');
  
  // Simulate API call to register webhooks
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 'success',
        message: 'Webhooks registered successfully',
        endpoints: [
          {
            charity: 'Islamic Relief',
            endpoint: 'https://api.example.com/webhooks/islamic-relief'
          },
          {
            charity: 'Muslim Aid',
            endpoint: 'https://api.example.com/webhooks/muslim-aid'
          }
          // More endpoints would be registered for each charity
        ]
      });
    }, 300);
  });
};

/**
 * Process a webhook callback from an external charity platform
 * In a real app, this would be an API endpoint on our backend
 * @param {Object} webhookData - Data received from the charity's webhook
 * @returns {Promise} - Promise resolving to the processed donation
 */
const processWebhookCallback = async (webhookData) => {
  console.log('Processing webhook callback:', webhookData);
  
  // Validate the webhook data
  if (!webhookData.trackingId || !webhookData.amount) {
    throw new Error('Invalid webhook data: missing required fields');
  }
  
  // In a real app, we would verify the webhook signature here
  
  // Find the pending donation with this tracking ID
  const pendingDonations = JSON.parse(localStorage.getItem('pendingDonations') || '[]');
  const pendingDonationIndex = pendingDonations.findIndex(
    donation => donation.trackingId === webhookData.trackingId
  );
  
  if (pendingDonationIndex === -1) {
    throw new Error(`No pending donation found with tracking ID: ${webhookData.trackingId}`);
  }
  
  // Update the pending donation with the confirmed information
  const pendingDonation = pendingDonations[pendingDonationIndex];
  const confirmedDonation = {
    ...pendingDonation,
    amount: webhookData.amount,
    status: 'confirmed',
    donorEmail: webhookData.donorEmail || pendingDonation.donorEmail || 'anonymous@example.com',
    confirmationTimestamp: Date.now(),
    transactionId: webhookData.transactionId || `tx-${Date.now()}`,
    isExternal: true
  };
  
  // Remove the pending donation and update localStorage
  pendingDonations.splice(pendingDonationIndex, 1);
  localStorage.setItem('pendingDonations', JSON.stringify(pendingDonations));
  
  // Store the confirmed donation in localStorage
  const confirmedDonations = JSON.parse(localStorage.getItem('confirmedExternalDonations') || '[]');
  confirmedDonations.push(confirmedDonation);
  localStorage.setItem('confirmedExternalDonations', JSON.stringify(confirmedDonations));
  
  return confirmedDonation;
};

/**
 * Simulate a webhook callback from an external charity platform
 * This is for demo purposes only - in a real app, this would come from the charity's system
 * @param {Object} simulatedData - Simulated donation data
 */
const simulateWebhookCallback = (simulatedData) => {
  // Get pending donations
  const pendingDonations = JSON.parse(localStorage.getItem('pendingDonations') || '[]');
  
  if (pendingDonations.length === 0) {
    console.log('No pending donations to confirm');
    return;
  }
  
  // Pick a random pending donation
  const randomIndex = Math.floor(Math.random() * pendingDonations.length);
  const pendingDonation = pendingDonations[randomIndex];
  
  // Create webhook data with the tracking ID from the pending donation
  const webhookData = {
    trackingId: pendingDonation.trackingId,
    charityId: simulatedData.charityId || pendingDonation.charityId,
    charityName: simulatedData.charityName || pendingDonation.charityName,
    amount: simulatedData.amount,
    region: simulatedData.region || pendingDonation.region,
    timestamp: simulatedData.timestamp || Date.now(),
    donorEmail: simulatedData.donorEmail || 'external-donor@example.com',
    transactionId: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
  };
  
  // Simulate a delay before processing the webhook (as if it came from an external system)
  setTimeout(() => {
    console.log('Received webhook callback:', webhookData);
    
    // Process the webhook
    processWebhookCallback(webhookData)
      .then(confirmedDonation => {
        // Dispatch a custom event that our DonationContext can listen for
        const event = new CustomEvent('externalDonationConfirmed', { 
          detail: confirmedDonation 
        });
        window.dispatchEvent(event);
      })
      .catch(error => {
        console.error('Error processing webhook:', error);
      });
  }, 2000 + Math.random() * 3000); // Random delay between 2-5 seconds
};

/**
 * Get all pending external donations
 * @returns {Array} - Array of pending donations
 */
const getPendingDonations = () => {
  return JSON.parse(localStorage.getItem('pendingDonations') || '[]');
};

/**
 * Get all confirmed external donations
 * @returns {Array} - Array of confirmed external donations
 */
const getConfirmedExternalDonations = () => {
  return JSON.parse(localStorage.getItem('confirmedExternalDonations') || '[]');
};

export {
  trackInternalDonation,
  trackExternalDonation,
  registerWebhooks,
  processWebhookCallback,
  simulateWebhookCallback,
  getPendingDonations,
  getConfirmedExternalDonations
};
