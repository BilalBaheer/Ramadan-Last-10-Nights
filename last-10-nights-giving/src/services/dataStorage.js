// Simple data storage service using IndexedDB for browser persistence

/**
 * Initialize the IndexedDB database
 */
export const initializeStorage = async () => {
  return new Promise((resolve, reject) => {
    // Check if IndexedDB is supported
    if (!window.indexedDB) {
      console.error("Your browser doesn't support IndexedDB. Falling back to localStorage.");
      resolve(false);
      return;
    }

    // Open (or create) the database
    const request = window.indexedDB.open("DonationDatabase", 1);

    request.onerror = (event) => {
      console.error("Error opening IndexedDB:", event.target.error);
      reject(event.target.error);
    };

    // This is called if the database doesn't exist or needs to be upgraded
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create an object store for our donation data
      // The keyPath specifies the property that makes each object unique
      if (!db.objectStoreNames.contains('donationData')) {
        db.createObjectStore('donationData', { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      console.log("IndexedDB initialized successfully");
      resolve(true);
    };
  });
};

/**
 * Load donation data from IndexedDB
 */
export const loadDonationData = async () => {
  return new Promise((resolve, reject) => {
    try {
      // If IndexedDB is not supported, fall back to localStorage
      if (!window.indexedDB) {
        const localData = localStorage.getItem('donationData');
        resolve(localData ? JSON.parse(localData) : getDefaultData());
        return;
      }

      const request = window.indexedDB.open("DonationDatabase", 1);

      request.onerror = (event) => {
        console.error("Error opening IndexedDB:", event.target.error);
        // Fall back to localStorage
        const localData = localStorage.getItem('donationData');
        resolve(localData ? JSON.parse(localData) : getDefaultData());
      };

      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['donationData'], 'readonly');
        const objectStore = transaction.objectStore('donationData');
        
        // Get the main donation data object with ID 'main'
        const getRequest = objectStore.get('main');
        
        getRequest.onerror = (event) => {
          console.error("Error getting donation data:", event.target.error);
          resolve(getDefaultData());
        };
        
        getRequest.onsuccess = (event) => {
          const data = event.target.result;
          if (data) {
            resolve(data);
          } else {
            // If no data exists yet, return default data
            resolve(getDefaultData());
          }
        };
      };
    } catch (error) {
      console.error("Error in loadDonationData:", error);
      resolve(getDefaultData());
    }
  });
};

/**
 * Save donation data to IndexedDB
 */
export const saveDonationData = async (donationData) => {
  return new Promise((resolve, reject) => {
    try {
      // Always save to localStorage as a backup
      const dataToSave = {
        ...donationData,
        id: 'main', // Use a fixed ID for our single data object
        lastUpdated: Date.now()
      };
      
      localStorage.setItem('donationData', JSON.stringify(dataToSave));
      
      // If IndexedDB is not supported, we're done
      if (!window.indexedDB) {
        resolve(true);
        return;
      }

      const request = window.indexedDB.open("DonationDatabase", 1);

      request.onerror = (event) => {
        console.error("Error opening IndexedDB:", event.target.error);
        reject(event.target.error);
      };

      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['donationData'], 'readwrite');
        const objectStore = transaction.objectStore('donationData');
        
        // Put will add if the key doesn't exist, or update if it does
        const putRequest = objectStore.put(dataToSave);
        
        putRequest.onerror = (event) => {
          console.error("Error saving donation data:", event.target.error);
          reject(event.target.error);
        };
        
        putRequest.onsuccess = (event) => {
          console.log("Donation data saved successfully");
          resolve(true);
        };
      };
    } catch (error) {
      console.error("Error in saveDonationData:", error);
      reject(error);
    }
  });
};

/**
 * Get the timestamp of when the donation data was last updated
 */
export const getLastUpdatedTime = async () => {
  try {
    const data = await loadDonationData();
    return data.lastUpdated || Date.now();
  } catch (error) {
    console.error('Error getting last updated time:', error);
    return Date.now();
  }
};

/**
 * Get default data structure for new installations
 */
const getDefaultData = () => {
  return {
    id: 'main',
    donationHistory: [],
    pendingDonations: [],
    confirmedExternalDonations: [],
    totalDonations: 0,
    nightlyDonations: {
      21: 0, 22: 0, 23: 0, 24: 0, 25: 0,
      26: 0, 27: 0, 28: 0, 29: 0, 30: 0
    },
    lastUpdated: Date.now()
  };
};
