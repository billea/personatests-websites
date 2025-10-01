/**
 * Admin Setup Script for admin@personatests.com
 *
 * This script sets up admin@personatests.com as the admin user
 * Run this in browser console on your website
 */

(async function setupAdminEmail() {
  const ADMIN_EMAIL = 'admin@personatests.com';

  try {
    console.log('🚀 Setting up admin access for:', ADMIN_EMAIL);

    // Check if Firebase is available
    if (typeof window === 'undefined' || !window.firebase) {
      console.error('❌ Firebase not available. Make sure you are on the website.');
      return;
    }

    // Get Firebase instances
    const auth = window.firebase.auth();
    const firestore = window.firebase.firestore();

    // Method 1: If user is logged in as admin@personatests.com
    const currentUser = auth.currentUser;
    if (currentUser && currentUser.email === ADMIN_EMAIL) {
      console.log('✅ You are logged in as admin email. Setting admin role...');

      const userRef = firestore.collection('users').doc(currentUser.uid);
      await userRef.set({
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName || 'Admin',
        role: 'admin',
        createdAt: window.firebase.firestore.Timestamp.now(),
        preferredLanguage: 'en'
      }, { merge: true });

      console.log('🎉 Admin role set successfully!');

      // Initialize default language configurations
      console.log('🌐 Setting up default language configurations...');
      try {
        const languageConfigsRef = firestore.collection('languageConfigs');
        const existingConfigs = await languageConfigsRef.get();

        if (existingConfigs.empty) {
          const batch = firestore.batch();
          const defaultLanguages = [
            {
              code: 'en',
              name: 'English',
              flag: '🇺🇸',
              isEnabled: true,
              isDefault: true,
              completionPercentage: 100,
              lastUpdated: window.firebase.firestore.Timestamp.now()
            },
            {
              code: 'ko',
              name: '한국어',
              flag: '🇰🇷',
              isEnabled: false,
              isDefault: false,
              completionPercentage: 95,
              lastUpdated: window.firebase.firestore.Timestamp.now()
            },
            {
              code: 'es',
              name: 'Español',
              flag: '🇪🇸',
              isEnabled: false,
              isDefault: false,
              completionPercentage: 80,
              lastUpdated: window.firebase.firestore.Timestamp.now()
            },
            {
              code: 'fr',
              name: 'Français',
              flag: '🇫🇷',
              isEnabled: false,
              isDefault: false,
              completionPercentage: 75,
              lastUpdated: window.firebase.firestore.Timestamp.now()
            }
          ];

          defaultLanguages.forEach((lang) => {
            const docRef = languageConfigsRef.doc();
            batch.set(docRef, lang);
          });

          await batch.commit();
          console.log('✅ Default language configurations initialized (English only enabled)');
        } else {
          console.log('ℹ️ Language configurations already exist');
        }
      } catch (langError) {
        console.warn('⚠️ Could not initialize language configs:', langError);
      }

      console.log('🔄 Refresh the page to see admin features.');

      const shouldRefresh = confirm('Admin role set successfully! Refresh the page now to see admin features?');
      if (shouldRefresh) {
        window.location.reload();
      }
      return;
    }

    // Method 2: Find user by email and set admin role
    console.log('🔍 Searching for user with email:', ADMIN_EMAIL);

    // Query users collection for the admin email
    const usersQuery = firestore.collection('users').where('email', '==', ADMIN_EMAIL);
    const userSnapshot = await usersQuery.get();

    if (!userSnapshot.empty) {
      const userDoc = userSnapshot.docs[0];
      console.log('✅ Found user:', userDoc.id);

      await userDoc.ref.set({
        role: 'admin'
      }, { merge: true });

      console.log('🎉 Admin role set successfully for:', ADMIN_EMAIL);
      console.log('📝 User ID:', userDoc.id);

    } else {
      console.log('⚠️  User not found in database.');
      console.log('💡 The user needs to sign up first. Here are the steps:');
      console.log('1. Go to /auth and sign up with admin@personatests.com');
      console.log('2. Complete the signup process');
      console.log('3. Run this script again');
    }

  } catch (error) {
    console.error('❌ Error setting up admin:', error);

    if (error.code === 'permission-denied') {
      console.log('🔒 Permission denied. This might mean:');
      console.log('1. You need to be logged in');
      console.log('2. Database security rules are preventing access');
      console.log('3. Try signing in as admin@personatests.com first');
    }
  }
})();

// Alternative: Simple role assignment if you know the user ID
function setAdminByUserId(userId) {
  if (!window.firebase) {
    console.error('❌ Firebase not available');
    return;
  }

  const firestore = window.firebase.firestore();

  firestore.collection('users').doc(userId).set({
    role: 'admin'
  }, { merge: true }).then(() => {
    console.log('✅ Admin role set for user ID:', userId);
  }).catch(error => {
    console.error('❌ Error:', error);
  });
}

console.log('📋 Admin setup script loaded. Available functions:');
console.log('- Main setup will run automatically');
console.log('- setAdminByUserId(userId) - if you know the user ID');