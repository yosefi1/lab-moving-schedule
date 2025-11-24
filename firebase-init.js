// Firebase initialization
// This file initializes Firebase using the config from firebase-config.js

(function() {
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max
    
    // Wait for both Firebase SDK and config to load, then initialize
    function tryInitialize() {
        attempts++;
        
        // Check if Firebase SDK is loaded
        if (typeof firebase === 'undefined') {
            if (attempts < maxAttempts) {
                setTimeout(tryInitialize, 100);
                return;
            } else {
                console.error('Firebase SDK not loaded!');
                if (window.onFirebaseReady) window.onFirebaseReady(false);
                return;
            }
        }
        
        // Check if config is loaded
        if (typeof firebaseConfig === 'undefined' || !firebaseConfig) {
            if (attempts < maxAttempts) {
                setTimeout(tryInitialize, 100);
                return;
            } else {
                console.error('Firebase config not found!');
                if (window.onFirebaseReady) window.onFirebaseReady(false);
                return;
            }
        }
        
        // Both are loaded, initialize
        try {
            // Check if already initialized
            if (firebase.apps.length > 0) {
                console.log('Firebase already initialized');
                window.db = firebase.firestore();
                if (window.onFirebaseReady) window.onFirebaseReady(true);
                return;
            }
            
            // Initialize Firebase
            firebase.initializeApp(firebaseConfig);
            window.db = firebase.firestore();
            console.log('✅ Firebase connected!');
            if (window.onFirebaseReady) window.onFirebaseReady(true);
        } catch (error) {
            console.error('Error initializing Firebase:', error);
            if (window.onFirebaseReady) window.onFirebaseReady(false);
        }
    }
    
    // Start trying after a short delay to let scripts load
    setTimeout(tryInitialize, 200);
    
    // Fallback timeout
    setTimeout(() => {
        if (!window.db && window.onFirebaseReady) {
            console.warn('Firebase initialization timeout');
            if (window.onFirebaseReady) window.onFirebaseReady(false);
        }
    }, 5000);
})();

