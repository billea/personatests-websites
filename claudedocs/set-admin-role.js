/**
 * Admin Role Setup Script
 *
 * This script is used to manually set admin role for the first admin user.
 * Run this script in the browser console while logged in as the user who should become admin.
 *
 * Instructions:
 * 1. Sign in to the website with your account
 * 2. Open browser developer tools (F12)
 * 3. Go to Console tab
 * 4. Copy and paste this entire script
 * 5. Press Enter to execute
 *
 * The script will automatically set your current user as admin.
 */

(async function setAdminRole() {
  try {
    // Check if Firebase auth is available
    if (typeof window === 'undefined' || !window.firebase) {
      console.error('❌ Firebase not available. Make sure you are on the website and logged in.');
      return;
    }

    // Get current user
    const auth = window.firebase.auth();
    const user = auth.currentUser;

    if (!user) {
      console.error('❌ No user logged in. Please sign in first and try again.');
      return;
    }

    console.log('🔍 Current user:', user.email, user.uid);

    // Get Firestore instance
    const firestore = window.firebase.firestore();

    // Set admin role
    const userRef = firestore.collection('users').doc(user.uid);

    await userRef.set({
      role: 'admin'
    }, { merge: true });

    console.log('✅ Admin role set successfully for user:', user.email);
    console.log('🔄 Please refresh the page to see admin features.');

    // Optional: Refresh the page
    const shouldRefresh = confirm('Admin role set successfully! Refresh the page now to see admin features?');
    if (shouldRefresh) {
      window.location.reload();
    }

  } catch (error) {
    console.error('❌ Error setting admin role:', error);
    console.log('💡 Make sure you are logged in and have internet connection.');
  }
})();

/**
 * Alternative method using the admin function from firestore.ts
 *
 * If the above doesn't work, try this in the console:
 *
 * ```javascript
 * // Import the function
 * import { setUserAdminRole, isUserAdmin } from '/src/lib/firestore.js';
 *
 * // Get current user ID (replace with actual user ID)
 * const userId = firebase.auth().currentUser.uid;
 *
 * // Set admin role
 * await setUserAdminRole(userId);
 *
 * // Verify admin role
 * const isAdmin = await isUserAdmin(userId);
 * console.log('Is admin:', isAdmin);
 * ```
 */