// Firebase initialization
// This file initializes Firebase using the config from firebase-config.js

(function() {
    // Wait for firebase-config.js to load, then initialize
    function tryInitialize() {
        if (typeof firebaseConfig !== 'undefined' && firebaseConfig) {
            try {
                // Initialize Firebase
                firebase.initializeApp(firebaseConfig);
                window.db = firebase.firestore();
                console.log('✅ Firebase connected!');
                if (window.onFirebaseReady) window.onFirebaseReady(true);
            } catch (error) {
                console.error('Error initializing Firebase:', error);
                if (window.onFirebaseReady) window.onFirebaseReady(false);
            }
        } else {
            // Config not loaded yet, try again
            setTimeout(tryInitialize, 100);
        }
    }
    
    // Start trying after a short delay to let scripts load
    setTimeout(() => {
        if (typeof firebaseConfig === 'undefined') {
            console.log('Firebase config not found. App will use localStorage as fallback.');
            if (window.onFirebaseReady) window.onFirebaseReady(false);
        } else {
            tryInitialize();
        }
    }, 500);
    
    // Fallback timeout
    setTimeout(() => {
        if (!window.db && window.onFirebaseReady) {
            window.onFirebaseReady(false);
        }
    }, 2000);
})();

