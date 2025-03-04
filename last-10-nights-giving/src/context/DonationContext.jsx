import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  trackInternalDonation, 
  trackExternalDonation, 
  registerWebhooks,
  getPendingDonations,
  getConfirmedExternalDonations
} from '../services/donationService';
import { initializeReminderService, addScheduledDonation } from '../services/reminderService';
import { 
  initializeStorage, 
  loadDonationData, 
  saveDonationData 
} from '../services/dataStorage';

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
  const [lastUpdated, setLastUpdated] = useState(Date.now());
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

  // Load donation data from file storage on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Initialize storage
        await initializeStorage();
        
        // Load donation data from file
        const data = await loadDonationData();
        
        if (data) {
          setDonationHistory(data.donationHistory || []);
          setPendingDonations(data.pendingDonations || []);
          setTotalDonations(data.totalDonations || 0);
          setNightlyDonations(data.nightlyDonations || nightlyDonations);
          setLastUpdated(data.lastUpdated || Date.now());
        }
      } catch (error) {
        console.error('Error loading donation data:', error);
        
        // Fallback to localStorage if file storage fails
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
      }
    };
    
    loadData();
    
    // Register webhook event listener
    window.addEventListener('externalDonationConfirmed', handleExternalDonationConfirmed);
    
    // Register webhooks with charity platforms (in a real app)
    registerWebhooks().then(result => {
      console.log('Webhooks registered:', result);
    });
    
    // Initialize the reminder service
    initializeReminderService();
    
    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('externalDonationConfirmed', handleExternalDonationConfirmed);
    };
  }, []);

  // Save donation data to file storage whenever it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await saveDonationData({
          donationHistory,
          pendingDonations,
          totalDonations,
          nightlyDonations,
          lastUpdated: Date.now()
        });
        
        // Update last updated timestamp
        setLastUpdated(Date.now());
        
        // Also save to localStorage as a backup
        localStorage.setItem('donationHistory', JSON.stringify(donationHistory));
      } catch (error) {
        console.error('Error saving donation data:', error);
      }
    };
    
    // Only save if we have donation history (avoid saving empty data on initial load)
    if (donationHistory.length > 0) {
      saveData();
    }
  }, [donationHistory, pendingDonations, totalDonations, nightlyDonations]);

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
      
      // If this is a scheduled donation, add it to the reminder service
      if (newDonation.isScheduled) {
        addScheduledDonation(newDonation);
      }
      
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
    
    console.log('External donation confirmed and added to history:', newDonation);
  };

  // Reset all donation data (admin function)
  const resetDonations = async () => {
    setTotalDonations(0);
    setDonationHistory([]);
    setNightlyDonations({
      21: 0, 22: 0, 23: 0, 24: 0, 25: 0,
      26: 0, 27: 0, 28: 0, 29: 0, 30: 0
    });
    
    // Clear localStorage backup
    localStorage.removeItem('donationHistory');
    localStorage.removeItem('pendingDonations');
    localStorage.removeItem('confirmedExternalDonations');
    
    // Reset file storage
    try {
      await saveDonationData({
        donationHistory: [],
        pendingDonations: [],
        totalDonations: 0,
        nightlyDonations: {
          21: 0, 22: 0, 23: 0, 24: 0, 25: 0,
          26: 0, 27: 0, 28: 0, 29: 0, 30: 0
        },
        lastUpdated: Date.now()
      });
    } catch (error) {
      console.error('Error resetting donation data:', error);
    }
  };

  // Context value
  const value = {
    totalDonations,
    donationHistory,
    nightlyDonations,
    pendingDonations,
    lastUpdated,
    addDonation,
    trackExternalDonation: trackExternalDonationClick,
    resetDonations
  };

  return (
    <DonationContext.Provider value={value}>
      {children}
    </DonationContext.Provider>
  );
};

export default DonationContext;
