/* ========================================
   ASTRA - Firebase Configuration
   Authentication + Firestore Database
   ======================================== */

// -------------------- 
// Firebase Configuration
// -------------------- 
// IMPORTANT: Replace these with your actual Firebase project credentials
const firebaseConfig = {
    apiKey: "AIzaSyBBmZzqXKR8AM6W3NR-7k6JQj4KLxIMDBo",
    authDomain: "astra-fd9a6.firebaseapp.com",
    projectId: "astra-fd9a6",
    storageBucket: "astra-fd9a6.firebasestorage.app",
    messagingSenderId: "972525920210",
    appId: "1:972525920210:web:26a000903fa8649ac9f20b"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Services
const auth = firebase.auth();
const db = firebase.firestore();

// -------------------- 
// Translation Helper
// -------------------- 
// Safely calls the global getText function from translations.js
function t(key, defaultText) {
    if (typeof getText === 'function') {
        return getText(key) || defaultText;
    }
    return defaultText;
}

// -------------------- 
// Authentication State
// -------------------- 
let currentUser = null;

// Auth State Observer
auth.onAuthStateChanged((user) => {
    currentUser = user;
    
    if (user) {
        console.log("✅ User logged in:", user.email || "Anonymous");
        onUserLoggedIn(user);
        
        // Dispatch custom event for app.js to catch
        document.dispatchEvent(new Event('userLoggedIn'));
    } else {
        console.log("❌ User logged out");
        onUserLoggedOut();
    }
});

// -------------------- 
// Auth UI Updates
// -------------------- 
function onUserLoggedIn(user) {
    const userLoggedIn = document.getElementById('userLoggedIn');
    const userLoggedOut = document.getElementById('userLoggedOut');
    const userName = document.getElementById('userName');
    const userInitial = document.getElementById('userInitial');
    
    if (userLoggedIn && userLoggedOut) {
        userLoggedIn.classList.remove('hidden');
        userLoggedOut.classList.add('hidden');
        
        // Set user name and initial
        const displayName = user.displayName || user.email?.split('@')[0] || t('role_astronaut', 'Astronaut');
        if (userName) userName.textContent = displayName;
        if (userInitial) userInitial.textContent = displayName.charAt(0).toUpperCase();
    }
    
    // Load user data
    loadUserProfile(user.uid);
    
    // Subscribe to crew alerts
    subscribeToCrewAlerts();
    
    // Update user online status
    updateOnlineStatus(true);
}

function onUserLoggedOut() {
    const userLoggedIn = document.getElementById('userLoggedIn');
    const userLoggedOut = document.getElementById('userLoggedOut');
    
    if (userLoggedIn && userLoggedOut) {
        userLoggedIn.classList.add('hidden');
        userLoggedOut.classList.remove('hidden');
    }
    
    // Redirect to login if on protected page
    const protectedPages = ['crew.html', 'games.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        window.location.href = 'login.html';
    }
}

// -------------------- 
// Sign Up with Email
// -------------------- 
async function signUp(email, password, displayName) {
    try {
        showAuthLoader(true);
        
        // Create user
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Update display name
        await user.updateProfile({
            displayName: displayName
        });
        
        // Create user profile in Firestore
        await createUserProfile(user.uid, {
            displayName: displayName,
            email: email,
            role: 'Astronaut',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            stressLevel: 'low',
            stressScore: 0,
            lastCheckIn: null,
            checksToday: 0,
            isOnline: true
        });
        
        showToast('success', t('toast_welcome', 'Welcome aboard!'), t('toast_signup_success', 'Account created successfully'));
        
        // Redirect to home
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        
        return { success: true, user };
        
    } catch (error) {
        console.error("Sign up error:", error);
        showToast('error', t('toast_signup_failed', 'Sign Up Failed'), getAuthErrorMessage(error.code));
        return { success: false, error: error.message };
        
    } finally {
        showAuthLoader(false);
    }
}

// -------------------- 
// Sign In with Email
// -------------------- 
async function signIn(email, password) {
    try {
        showAuthLoader(true);
        
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        
        showToast('success', t('toast_welcome_back', 'Welcome back!'), t('toast_login_success', 'Logged in successfully'));
        
        // Update last login
        await updateUserProfile(userCredential.user.uid, {
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
            isOnline: true
        });
        
        // Redirect to home
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        
        return { success: true, user: userCredential.user };
        
    } catch (error) {
        console.error("Sign in error:", error);
        showToast('error', t('toast_login_failed', 'Login Failed'), getAuthErrorMessage(error.code));
        return { success: false, error: error.message };
        
    } finally {
        showAuthLoader(false);
    }
}

// -------------------- 
// Anonymous Sign In
// -------------------- 
async function signInAnonymously() {
    try {
        showAuthLoader(true);
        
        const userCredential = await auth.signInAnonymously();
        const user = userCredential.user;
        
        // Generate random astronaut name
        const astronautNames = [
            'Nova', 'Orion', 'Luna', 'Atlas', 'Stella', 
            'Cosmos', 'Nebula', 'Quasar', 'Vega', 'Phoenix'
        ];
        const randomName = astronautNames[Math.floor(Math.random() * astronautNames.length)];
        const displayName = `Astronaut ${randomName}`;
        
        // Create profile for anonymous user
        await createUserProfile(user.uid, {
            displayName: displayName,
            email: null,
            role: 'Guest Astronaut',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            stressLevel: 'low',
            stressScore: 0,
            lastCheckIn: null,
            checksToday: 0,
            isOnline: true,
            isAnonymous: true
        });
        
        // Use translation with replacement
        const welcomeMsg = t('toast_anon_login_success', 'Signed in as {name}').replace('{name}', displayName);
        showToast('success', t('toast_welcome', 'Welcome!'), welcomeMsg);
        
        // Redirect to home
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        
        return { success: true, user };
        
    } catch (error) {
        console.error("Anonymous sign in error:", error);
        showToast('error', t('toast_login_failed', 'Login Failed'), getAuthErrorMessage(error.code));
        return { success: false, error: error.message };
        
    } finally {
        showAuthLoader(false);
    }
}

// -------------------- 
// Logout
// -------------------- 
async function logout() {
    try {
        // Update online status before logging out
        if (currentUser) {
            await updateUserProfile(currentUser.uid, {
                isOnline: false,
                lastSeen: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        await auth.signOut();
        showToast('success', t('toast_logged_out', 'Logged Out'), t('toast_logout_msg', 'See you soon, Astronaut!'));
        
        // Redirect to login
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 500);
        
    } catch (error) {
        console.error("Logout error:", error);
        showToast('error', t('toast_error', 'Error'), t('toast_logout_failed', 'Failed to logout'));
    }
}

// -------------------- 
// Password Reset
// -------------------- 
async function resetPassword(email) {
    try {
        await auth.sendPasswordResetEmail(email);
        showToast('success', t('toast_email_sent', 'Email Sent'), t('toast_reset_msg', 'Check your inbox for password reset link'));
        return { success: true };
        
    } catch (error) {
        console.error("Password reset error:", error);
        showToast('error', t('toast_error', 'Error'), getAuthErrorMessage(error.code));
        return { success: false, error: error.message };
    }
}

// -------------------- 
// User Profile CRUD
// -------------------- 

// Create user profile
async function createUserProfile(userId, profileData) {
    try {
        await db.collection('users').doc(userId).set(profileData, { merge: true });
        console.log("✅ User profile created");
        return { success: true };
        
    } catch (error) {
        console.error("Error creating profile:", error);
        return { success: false, error: error.message };
    }
}

// Load user profile
async function loadUserProfile(userId) {
    try {
        const doc = await db.collection('users').doc(userId).get();
        
        if (doc.exists) {
            const profile = doc.data();
            console.log("📋 Profile loaded:", profile);
            
            // Update UI with profile data
            updateProfileUI(profile);
            
            return { success: true, profile };
        } else {
            console.log("No profile found, creating one...");
            
            // Create default profile
            const defaultProfile = {
                displayName: currentUser.displayName || currentUser.email?.split('@')[0] || t('role_astronaut', 'Astronaut'),
                email: currentUser.email,
                role: 'Astronaut',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                stressLevel: 'low',
                stressScore: 0,
                lastCheckIn: null,
                checksToday: 0,
                isOnline: true
            };
            
            await createUserProfile(userId, defaultProfile);
            return { success: true, profile: defaultProfile };
        }
        
    } catch (error) {
        console.error("Error loading profile:", error);
        return { success: false, error: error.message };
    }
}

// Update user profile
async function updateUserProfile(userId, updates) {
    try {
        await db.collection('users').doc(userId).update(updates);
        console.log("✅ Profile updated");
        return { success: true };
        
    } catch (error) {
        console.error("Error updating profile:", error);
        return { success: false, error: error.message };
    }
}

// Update profile UI elements
function updateProfileUI(profile) {
    // Update stats on home page
    const lastCheckTime = document.getElementById('lastCheckTime');
    const checksToday = document.getElementById('checksToday');
    const avgStress = document.getElementById('avgStress');
    
    if (lastCheckTime && profile.lastCheckIn) {
        const date = profile.lastCheckIn.toDate();
        lastCheckTime.textContent = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    if (checksToday) {
        checksToday.textContent = profile.checksToday || 0;
    }
    
    if (avgStress) {
        // Translate the mood level
        const levelKey = `mood_${profile.stressLevel || 'low'}`; // e.g., mood_low, mood_high
        avgStress.textContent = t(levelKey, capitalizeFirst(profile.stressLevel || 'low'));
    }
}

// -------------------- 
// Stress Data Functions
// -------------------- 

// Save stress check result
async function saveStressCheck(stressData) {
    if (!currentUser) {
        console.error("No user logged in");
        return { success: false, error: "Not authenticated" };
    }
    
    try {
        const userId = currentUser.uid;
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        
        // Save to stress history collection
        await db.collection('users').doc(userId)
            .collection('stressHistory').add({
                ...stressData,
                timestamp: timestamp
            });
        
        // Update user's current stress level
        await db.collection('users').doc(userId).update({
            stressLevel: stressData.level,
            stressScore: stressData.score,
            lastCheckIn: timestamp,
            checksToday: firebase.firestore.FieldValue.increment(1)
        });
        
        // If high stress, create alert for crew
        if (stressData.level === 'high') {
            await createCrewAlert(userId, stressData);
        }
        
        console.log("✅ Stress check saved");
        return { success: true };
        
    } catch (error) {
        console.error("Error saving stress check:", error);
        return { success: false, error: error.message };
    }
}

// Create crew alert for high stress
async function createCrewAlert(userId, stressData) {
    try {
        // Get user's display name
        const userDoc = await db.collection('users').doc(userId).get();
        const userName = userDoc.exists ? userDoc.data().displayName : t('crew_member', 'A crew member');
        
        // Use translated message template
        const alertMsg = t('alert_msg_generated', '{name} is experiencing high stress and may need support.').replace('{name}', userName);

        await db.collection('crewAlerts').add({
            userId: userId,
            userName: userName,
            stressLevel: stressData.level,
            stressScore: stressData.score,
            message: alertMsg,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            isRead: false,
            isActive: true
        });
        
        console.log("🚨 Crew alert created");
        
    } catch (error) {
        console.error("Error creating crew alert:", error);
    }
}

// Get stress history (Updated to support variable limits)
async function getStressHistory(limit = 10) {
    if (!currentUser) return { success: false, data: [] };
    
    try {
        const snapshot = await db.collection('users').doc(currentUser.uid)
            .collection('stressHistory')
            .orderBy('timestamp', 'desc')
            .limit(limit)
            .get();
        
        const history = [];
        snapshot.forEach(doc => {
            history.push({ id: doc.id, ...doc.data() });
        });
        
        return { success: true, data: history };
        
    } catch (error) {
        console.error("Error getting stress history:", error);
        return { success: false, data: [] };
    }
}

// NEW: Get stress history by date range (e.g., last 7 days)
async function getStressHistoryByDate(days = 7) {
    if (!currentUser) return { success: false, data: [] };
    
    try {
        const date = new Date();
        date.setDate(date.getDate() - days);
        const timestamp = firebase.firestore.Timestamp.fromDate(date);

        const snapshot = await db.collection('users').doc(currentUser.uid)
            .collection('stressHistory')
            .where('timestamp', '>', timestamp)
            .orderBy('timestamp', 'desc')
            .get();
        
        const history = [];
        snapshot.forEach(doc => {
            history.push({ id: doc.id, ...doc.data() });
        });
        
        return { success: true, data: history };
        
    } catch (error) {
        console.error("Error getting weekly stress history:", error);
        return { success: false, data: [] };
    }
}

// -------------------- 
// Crew Functions
// -------------------- 

// Get all crew members
async function getCrewMembers() {
    try {
        const snapshot = await db.collection('users')
            .where('isOnline', '==', true)
            .get();
        
        const crew = [];
        snapshot.forEach(doc => {
            if (doc.id !== currentUser?.uid) { // Exclude current user
                crew.push({ id: doc.id, ...doc.data() });
            }
        });
        
        return { success: true, data: crew };
        
    } catch (error) {
        console.error("Error getting crew:", error);
        return { success: false, data: [] };
    }
}

// Get all crew (including offline)
async function getAllCrew() {
    try {
        const snapshot = await db.collection('users').get();
        
        const crew = [];
        snapshot.forEach(doc => {
            crew.push({ id: doc.id, ...doc.data() });
        });
        
        return { success: true, data: crew };
        
    } catch (error) {
        console.error("Error getting all crew:", error);
        return { success: false, data: [] };
    }
}

// Subscribe to crew status updates (real-time)
function subscribeToCrewUpdates(callback) {
    return db.collection('users').onSnapshot((snapshot) => {
        const crew = [];
        snapshot.forEach(doc => {
            crew.push({ id: doc.id, ...doc.data() });
        });
        callback(crew);
    }, (error) => {
        console.error("Crew subscription error:", error);
    });
}

// Subscribe to crew alerts (real-time)
function subscribeToCrewAlerts() {
    if (!currentUser) return;
    
    db.collection('crewAlerts')
        .where('isActive', '==', true)
        .orderBy('timestamp', 'desc')
        .limit(5)
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const alert = change.doc.data();
                    
                    // Don't show alert for own stress
                    if (alert.userId !== currentUser.uid) {
                        showCrewAlertNotification(alert);
                    }
                }
            });
        }, (error) => {
            console.error("Alert subscription error:", error);
        });
}

// Show crew alert notification
function showCrewAlertNotification(alert) {
    const crewAlertPreview = document.getElementById('crewAlertPreview');
    const crewAlertText = document.getElementById('crewAlertText');
    
    if (crewAlertPreview && crewAlertText) {
        crewAlertText.textContent = alert.message;
        crewAlertPreview.classList.remove('hidden');
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            crewAlertPreview.classList.add('hidden');
        }, 10000);
    }
    
    // Also show toast
    showToast('warning', t('toast_crew_alert', 'Crew Alert'), alert.message);
}

// Update online status
async function updateOnlineStatus(isOnline) {
    if (!currentUser) return;
    
    try {
        await db.collection('users').doc(currentUser.uid).update({
            isOnline: isOnline,
            lastSeen: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error("Error updating online status:", error);
    }
}

// Get online crew count
async function getOnlineCrewCount() {
    try {
        const snapshot = await db.collection('users')
            .where('isOnline', '==', true)
            .get();
        
        return snapshot.size;
        
    } catch (error) {
        console.error("Error getting online count:", error);
        return 0;
    }
}

// -------------------- 
// Recommendations Log
// -------------------- 

// Save recommendation
async function saveRecommendation(recommendation) {
    if (!currentUser) return;
    
    try {
        await db.collection('users').doc(currentUser.uid)
            .collection('recommendations').add({
                ...recommendation,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        
    } catch (error) {
        console.error("Error saving recommendation:", error);
    }
}

// -------------------- 
// Game Activity Log
// -------------------- 

// Log game activity
async function logGameActivity(gameType, duration, score = null) {
    if (!currentUser) return;
    
    try {
        await db.collection('users').doc(currentUser.uid)
            .collection('gameActivity').add({
                gameType: gameType,
                duration: duration,
                score: score,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        
        console.log("🎮 Game activity logged");
        
    } catch (error) {
        console.error("Error logging game activity:", error);
    }
}

// -------------------- 
// Chat History
// -------------------- 

// Save chat message
async function saveChatMessage(message, sender) {
    if (!currentUser) return;
    
    try {
        await db.collection('users').doc(currentUser.uid)
            .collection('chatHistory').add({
                message: message,
                sender: sender, // 'user' or 'astra'
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        
    } catch (error) {
        console.error("Error saving chat message:", error);
    }
}

// Get recent chat history
async function getChatHistory(limit = 20) {
    if (!currentUser) return [];
    
    try {
        const snapshot = await db.collection('users').doc(currentUser.uid)
            .collection('chatHistory')
            .orderBy('timestamp', 'desc')
            .limit(limit)
            .get();
        
        const messages = [];
        snapshot.forEach(doc => {
            messages.push({ id: doc.id, ...doc.data() });
        });
        
        return messages.reverse(); // Return in chronological order
        
    } catch (error) {
        console.error("Error getting chat history:", error);
        return [];
    }
}

// -------------------- 
// Helper Functions
// -------------------- 

// Get friendly auth error messages with Translations
function getAuthErrorMessage(errorCode) {
    const errorKeyMap = {
        'auth/email-already-in-use': 'auth_email_in_use',
        'auth/invalid-email': 'auth_invalid_email',
        'auth/operation-not-allowed': 'auth_operation_not_allowed',
        'auth/weak-password': 'auth_weak_password',
        'auth/user-disabled': 'auth_user_disabled',
        'auth/user-not-found': 'auth_user_not_found',
        'auth/wrong-password': 'auth_wrong_password',
        'auth/too-many-requests': 'auth_too_many_requests',
        'auth/network-request-failed': 'auth_network_error'
    };
    
    const key = errorKeyMap[errorCode];
    if (key) {
        return t(key, 'Authentication Error');
    }
    
    return t('auth_unknown_error', 'An error occurred. Please try again');
}

// Capitalize first letter
function capitalizeFirst(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Show auth loader
function showAuthLoader(show) {
    const loader = document.getElementById('authLoader');
    const btnText = document.getElementById('authBtnText');
    
    // Also handle specific form loaders
    const loginLoader = document.getElementById('loginLoader');
    const loginBtnText = document.getElementById('loginBtnText');
    const signupLoader = document.getElementById('signupLoader');
    const signupBtnText = document.getElementById('signupBtnText');
    
    if (loader && btnText) {
        if (show) {
            loader.classList.remove('hidden');
            btnText.classList.add('hidden');
        } else {
            loader.classList.add('hidden');
            btnText.classList.remove('hidden');
        }
    }
}

// -------------------- 
// Toast Notifications
// -------------------- 
function showToast(type, title, message) {
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toastIcon');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    
    if (!toast) return;
    
    // Set icon and colors based on type
    const icons = {
        success: { bg: 'bg-green-500/20', color: 'text-green-400', icon: '✓' },
        error: { bg: 'bg-red-500/20', color: 'text-red-400', icon: '✕' },
        warning: { bg: 'bg-yellow-500/20', color: 'text-yellow-400', icon: '⚠' },
        info: { bg: 'bg-cyan-500/20', color: 'text-cyan-400', icon: 'ℹ' }
    };
    
    const iconStyle = icons[type] || icons.info;
    
    toastIcon.className = `w-8 h-8 rounded-full flex items-center justify-center ${iconStyle.bg} ${iconStyle.color}`;
    toastIcon.textContent = iconStyle.icon;
    toastTitle.textContent = title;
    toastTitle.className = `font-bold text-sm ${iconStyle.color}`;
    toastMessage.textContent = message;
    
    // Show toast
    toast.classList.remove('hidden');
    
    // Auto hide after 4 seconds
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 4000);
}

// -------------------- 
// Page Visibility Handler
// -------------------- 
document.addEventListener('visibilitychange', () => {
    if (currentUser) {
        if (document.visibilityState === 'hidden') {
            updateOnlineStatus(false);
        } else {
            updateOnlineStatus(true);
        }
    }
});

// -------------------- 
// Before Unload Handler
// -------------------- 
window.addEventListener('beforeunload', () => {
    if (currentUser) {
        // Use sendBeacon for reliable offline status update
        const data = JSON.stringify({
            userId: currentUser.uid,
            isOnline: false
        });
        
        // Note: This won't work directly with Firestore
        // but we've already set up visibilitychange handler
    }
});

// -------------------- 
// Initialize Online Crew Count
// -------------------- 
async function initializeCrewCount() {
    const crewOnlineElement = document.getElementById('crewOnline');
    if (crewOnlineElement) {
        const count = await getOnlineCrewCount();
        crewOnlineElement.textContent = count;
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize crew count after a short delay to ensure auth is ready
    setTimeout(initializeCrewCount, 1500);
});