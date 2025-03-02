import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  trackInternalDonation, 
  trackExternalDonation, 
  registerWebhooks,
  getPendingDonations,
  getConfirmedExternalDonations
} from '../services/donationService';

// Create the donation context
const DonationContext = createContext();

// Custom hook to use the donation context
export const useDonations = () => useContext(DonationContext);

// Provider component
export const DonationProvider = ({ children }) => {
  // State for donation data
  const [totalDonations, setTotalDonations] = useState(0);
  const [donationHistory, setDonationHistory] = useState([]);
  const [pendingDonations, setPendingDonations] = useState([]);
  const [nightlyDonations, setNightlyDonations] = useState({
    21: 0,
    22: 0,
    23: 0,
    24: 0,
    25: 0,
    26: 0,
    27: 0,
    28: 0,
    29: 0,
    30: 0
  });

  // Load donation data from localStorage on component mount
  useEffect(() => {
    const savedDonations = localStorage.getItem('donationHistory');
    if (savedDonations) {
      const parsedDonations = JSON.parse(savedDonations);
      setDonationHistory(parsedDonations);
      
      // Calculate total donations
      const total = parsedDonations.reduce((sum, donation) => sum + donation.amount, 0);
      setTotalDonations(total);
      
      // Calculate nightly breakdown
      const nightlyBreakdown = { ...nightlyDonations };
      parsedDonations.forEach(donation => {
        const date = new Date(donation.timestamp);
        const day = date.getDate();
        if (day >= 21 && day <= 30) {
          nightlyBreakdown[day] = (nightlyBreakdown[day] || 0) + donation.amount;
        }
      });
      setNightlyDonations(nightlyBreakdown);
    }
    
    // Load pending donations
    const pendingDons = getPendingDonations();
    setPendingDonations(pendingDons);
    
    // Register webhook event listener
    window.addEventListener('externalDonationConfirmed', handleExternalDonationConfirmed);
    
    // Register webhooks with charity platforms (in a real app)
    registerWebhooks().then(result => {
      console.log('Webhooks registered:', result);
    });
    
    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('externalDonationConfirmed', handleExternalDonationConfirmed);
    };
  }, []);

  // Add a new donation
  const addDonation = async (donationData) => {
    try {
      // Track the donation via our service
      const trackedDonation = await trackInternalDonation(donationData);
      
      // Create donation object
      const newDonation = {
        id: trackedDonation.id || `donation_${Date.now()}`,
        amount: donationData.amount,
        charityId: donationData.charityId,
        charityName: donationData.charityName,
        timestamp: Date.now(),
        email: donationData.email,
        isScheduled: donationData.isScheduled || false,
        scheduledTime: donationData.scheduledTime || null,
        region: donationData.region || 'General',
        isExternal: false
      };
      
      // Update state
      const updatedHistory = [...donationHistory, newDonation];
      setDonationHistory(updatedHistory);
      setTotalDonations(totalDonations + newDonation.amount);
      
      // Update nightly breakdown
      const date = new Date(newDonation.timestamp);
      const day = date.getDate();
      if (day >= 21 && day <= 30) {
        const updatedNightlyDonations = { ...nightlyDonations };
        updatedNightlyDonations[day] = (updatedNightlyDonations[day] || 0) + newDonation.amount;
        setNightlyDonations(updatedNightlyDonations);
      }
      
      // Save to localStorage
      localStorage.setItem('donationHistory', JSON.stringify(updatedHistory));
      
      return newDonation;
    } catch (error) {
      console.error('Error adding donation:', error);
      throw error;
    }
  };

  // Track an external donation click
  const trackExternalDonationClick = async (clickData) => {
    try {
      // Track the external donation click via our service
      const trackingResult = await trackExternalDonation(clickData);
      
      // Update pending donations state
      const updatedPendingDonations = [...pendingDonations, trackingResult];
      setPendingDonations(updatedPendingDonations);
      
      return trackingResult;
    } catch (error) {
      console.error('Error tracking external donation click:', error);
      throw error;
    }
  };

  // Handle external donation confirmed event
  const handleExternalDonationConfirmed = (event) => {
    const confirmedDonation = event.detail;
    
    if (!confirmedDonation || !confirmedDonation.amount) {
      console.error('Invalid confirmed donation data:', confirmedDonation);
      return;
    }
    
    // Create donation object
    const newDonation = {
      id: confirmedDonation.transactionId || `ext_donation_${Date.now()}`,
      amount: confirmedDonation.amount,
      charityId: confirmedDonation.charityId,
      charityName: confirmedDonation.charityName,
      timestamp: confirmedDonation.timestamp || Date.now(),
      email: confirmedDonation.donorEmail || 'anonymous@example.com',
      isScheduled: false,
      region: confirmedDonation.region || 'General',
      isExternal: true,
      externalSource: confirmedDonation.destinationUrl
    };
    
    // Update state
    const updatedHistory = [...donationHistory, newDonation];
    setDonationHistory(updatedHistory);
    setTotalDonations(totalDonations + newDonation.amount);
    
    // Update nightly breakdown
    const date = new Date(newDonation.timestamp);
    const day = date.getDate();
    if (day >= 21 && day <= 30) {
      const updatedNightlyDonations = { ...nightlyDonations };
      updatedNightlyDonations[day] = (updatedNightlyDonations[day] || 0) + newDonation.amount;
      setNightlyDonations(updatedNightlyDonations);
    }
    
    // Update pending donations
    const updatedPendingDonations = pendingDonations.filter(
      donation => donation.trackingId !== confirmedDonation.trackingId
    );
    setPendingDonations(updatedPendingDonations);
    
    // Save to localStorage
    localStorage.setItem('donationHistory', JSON.stringify(updatedHistory));
    
    console.log('External donation confirmed and added to history:', newDonation);
  };

  // Load confirmed external donations from localStorage
  useEffect(() => {
    const confirmedExternalDonations = getConfirmedExternalDonations();
    
    // Add any confirmed external donations that aren't already in the history
    if (confirmedExternalDonations.length > 0) {
      const existingIds = new Set(donationHistory.map(d => d.id));
      
      const newExternalDonations = confirmedExternalDonations
        .filter(donation => !existingIds.has(donation.transactionId))
        .map(donation => ({
          id: donation.transactionId || `ext_donation_${Date.now()}`,
          amount: donation.amount,
          charityId: donation.charityId,
          charityName: donation.charityName,
          timestamp: donation.timestamp || Date.now(),
          email: donation.donorEmail || 'anonymous@example.com',
          isScheduled: false,
          region: donation.region || 'General',
          isExternal: true,
          externalSource: donation.destinationUrl
        }));
      
      if (newExternalDonations.length > 0) {
        const updatedHistory = [...donationHistory, ...newExternalDonations];
        setDonationHistory(updatedHistory);
        
        // Update total donations
        const additionalTotal = newExternalDonations.reduce((sum, donation) => sum + donation.amount, 0);
        setTotalDonations(totalDonations + additionalTotal);
        
        // Update nightly breakdown
        const updatedNightlyDonations = { ...nightlyDonations };
        newExternalDonations.forEach(donation => {
          const date = new Date(donation.timestamp);
          const day = date.getDate();
          if (day >= 21 && day <= 30) {
            updatedNightlyDonations[day] = (updatedNightlyDonations[day] || 0) + donation.amount;
          }
        });
        setNightlyDonations(updatedNightlyDonations);
        
        // Save to localStorage
        localStorage.setItem('donationHistory', JSON.stringify(updatedHistory));
      }
    }
  }, []);

  // Refresh pending donations periodically
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      const freshPendingDonations = getPendingDonations();
      setPendingDonations(freshPendingDonations);
    }, 10000); // Refresh every 10 seconds
    
    return () => clearInterval(refreshInterval);
  }, []);

  // Context value
  const value = {
    totalDonations,
    donationHistory,
    nightlyDonations,
    pendingDonations,
    addDonation,
    trackExternalDonation: trackExternalDonationClick
  };

  return (
    <DonationContext.Provider value={value}>
      {children}
    </DonationContext.Provider>
  );
};

export default DonationContext;
