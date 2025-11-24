// Firebase initialization
// This file initializes Firebase using the config from firebase-config.js

(function() {
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max
    
    console.log('🔥 Firebase init script loaded');
    
    // Wait for both Firebase SDK and config to load, then initialize
    function tryInitialize() {
        attempts++;
        console.log(`🔄 Firebase init attempt ${attempts}/${maxAttempts}`);
        
        // Check if Firebase SDK is loaded
        if (typeof firebase === 'undefined') {
            console.log('⏳ Waiting for Firebase SDK...');
            if (attempts < maxAttempts) {
                setTimeout(tryInitialize, 100);
                return;
            } else {
                console.error('❌ Firebase SDK not loaded after', maxAttempts, 'attempts!');
                if (window.onFirebaseReady) window.onFirebaseReady(false);
                return;
            }
        }
        
        console.log('✅ Firebase SDK loaded');
        
        // Check if config is loaded
        if (typeof firebaseConfig === 'undefined' || !firebaseConfig) {
            console.log('⏳ Waiting for Firebase config...');
            if (attempts < maxAttempts) {
                setTimeout(tryInitialize, 100);
                return;
            } else {
                console.error('❌ Firebase config not found after', maxAttempts, 'attempts!');
                console.log('firebaseConfig type:', typeof firebaseConfig);
                if (window.onFirebaseReady) window.onFirebaseReady(false);
                return;
            }
        }
        
        console.log('✅ Firebase config loaded:', firebaseConfig.projectId);
        
        // Both are loaded, initialize
        try {
            // Check if already initialized
            if (firebase.apps && firebase.apps.length > 0) {
                console.log('ℹ️ Firebase already initialized');
                window.db = firebase.firestore();
                if (window.onFirebaseReady) window.onFirebaseReady(true);
                return;
            }
            
            console.log('🚀 Initializing Firebase...');
            // Initialize Firebase
            firebase.initializeApp(firebaseConfig);
            window.db = firebase.firestore();
            console.log('✅ Firebase connected! Database:', window.db ? 'OK' : 'FAILED');
            
            // Test connection
            if (window.db) {
                console.log('✅ Firestore initialized successfully');
                if (window.onFirebaseReady) window.onFirebaseReady(true);
            } else {
                console.error('❌ Firestore initialization failed');
                if (window.onFirebaseReady) window.onFirebaseReady(false);
            }
        } catch (error) {
            console.error('❌ Error initializing Firebase:', error);
            console.error('Error details:', error.message, error.stack);
            if (window.onFirebaseReady) window.onFirebaseReady(false);
        }
    }
    
    // Start trying after a short delay to let scripts load
    setTimeout(tryInitialize, 200);
    
    // Fallback timeout
    setTimeout(() => {
        if (!window.db && window.onFirebaseReady) {
            console.warn('⏰ Firebase initialization timeout after 5 seconds');
            console.log('window.db:', window.db);
            console.log('firebase:', typeof firebase);
            console.log('firebaseConfig:', typeof firebaseConfig);
            if (window.onFirebaseReady) window.onFirebaseReady(false);
        }
    }, 5000);
})();

