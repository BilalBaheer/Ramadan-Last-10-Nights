import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the donation context
const DonationContext = createContext();

// Custom hook to use the donation context
export const useDonations = () => useContext(DonationContext);

// Provider component
export const DonationProvider = ({ children }) => {
  // Initialize total donations
  const [totalDonations, setTotalDonations] = useState(() => {
    // Try to get from localStorage
    const saved = localStorage.getItem('totalDonations');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Initialize nightly breakdown
  const [nightlyBreakdown, setNightlyBreakdown] = useState(() => {
    // Try to get from localStorage
    const saved = localStorage.getItem('nightlyBreakdown');
    return saved ? JSON.parse(saved) : [
      { night: 21, amount: 0, target: 10000 },
      { night: 22, amount: 0, target: 10000 },
      { night: 23, amount: 0, target: 10000 },
      { night: 24, amount: 0, target: 10000 },
      { night: 25, amount: 0, target: 10000 },
      { night: 26, amount: 0, target: 10000 },
      { night: 27, amount: 0, target: 10000 },
      { night: 28, amount: 0, target: 10000 },
      { night: 29, amount: 0, target: 10000 },
      { night: 30, amount: 0, target: 10000 },
    ];
  });

  // Track donation history
  const [donationHistory, setDonationHistory] = useState(() => {
    const saved = localStorage.getItem('donationHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('totalDonations', totalDonations);
    localStorage.setItem('nightlyBreakdown', JSON.stringify(nightlyBreakdown));
    localStorage.setItem('donationHistory', JSON.stringify(donationHistory));
  }, [totalDonations, nightlyBreakdown, donationHistory]);

  // Function to add a new donation
  const addDonation = (donation) => {
    // Update total donations
    setTotalDonations(prev => prev + parseInt(donation.amount, 10));
    
    // Add to donation history
    const newDonation = {
      ...donation,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };
    setDonationHistory(prev => [newDonation, ...prev]);
    
    // Update nightly breakdown based on current date
    // For scheduled donations, we'll distribute them across the nights
    if (donation.isScheduled) {
      // For scheduled donations, distribute evenly across all nights
      const amountPerNight = parseInt(donation.amount, 10) / 10;
      setNightlyBreakdown(prev => 
        prev.map(night => ({
          ...night,
          amount: night.amount + amountPerNight
        }))
      );
    } else {
      // For one-time donations, add to the current night
      // Determine which night of Ramadan it is based on current date
      const today = new Date();
      const ramadanStart = new Date('2025-03-13'); // First day of Ramadan 2025
      const daysSinceRamadanStart = Math.floor((today - ramadanStart) / (1000 * 60 * 60 * 24));
      const currentNight = Math.min(Math.max(daysSinceRamadanStart + 1, 21), 30);
      
      setNightlyBreakdown(prev => 
        prev.map(night => ({
          ...night,
          amount: night.night === currentNight 
            ? night.amount + parseInt(donation.amount, 10)
            : night.amount
        }))
      );
    }
  };

  // Function to reset all donation data (for testing)
  const resetDonations = () => {
    setTotalDonations(0);
    setNightlyBreakdown([
      { night: 21, amount: 0, target: 10000 },
      { night: 22, amount: 0, target: 10000 },
      { night: 23, amount: 0, target: 10000 },
      { night: 24, amount: 0, target: 10000 },
      { night: 25, amount: 0, target: 10000 },
      { night: 26, amount: 0, target: 10000 },
      { night: 27, amount: 0, target: 10000 },
      { night: 28, amount: 0, target: 10000 },
      { night: 29, amount: 0, target: 10000 },
      { night: 30, amount: 0, target: 10000 },
    ]);
    setDonationHistory([]);
    localStorage.removeItem('totalDonations');
    localStorage.removeItem('nightlyBreakdown');
    localStorage.removeItem('donationHistory');
  };

  return (
    <DonationContext.Provider 
      value={{ 
        totalDonations, 
        nightlyBreakdown, 
        donationHistory,
        addDonation,
        resetDonations
      }}
    >
      {children}
    </DonationContext.Provider>
  );
};
