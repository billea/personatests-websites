/**
 * Secure Admin Setup Function
 *
 * This function should be called server-side to securely set admin roles
 * Run this once to set up the initial admin user
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin (if not already initialized)
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

async function setupInitialAdmin() {
  const ADMIN_EMAIL = 'admin@personatests.com';

  try {
    console.log('🔐 Setting up secure admin access for:', ADMIN_EMAIL);

    // Find user by email
    const userQuery = await db.collection('users')
      .where('email', '==', ADMIN_EMAIL)
      .limit(1)
      .get();

    if (userQuery.empty) {
      console.log('❌ User not found. Please sign up first with:', ADMIN_EMAIL);
      return false;
    }

    const userDoc = userQuery.docs[0];
    console.log('✅ Found user:', userDoc.id);

    // Set admin role securely on server-side
    await userDoc.ref.update({
      role: 'admin',
      adminSetAt: admin.firestore.FieldValue.serverTimestamp(),
      adminSetBy: 'initial_setup'
    });

    console.log('🎉 Admin role set successfully!');
    console.log('📧 Admin email:', ADMIN_EMAIL);
    console.log('🔑 User ID:', userDoc.id);

    return true;

  } catch (error) {
    console.error('❌ Error setting up admin:', error);
    return false;
  }
}

// Export for use in Firebase Functions
module.exports = { setupInitialAdmin };

// Run directly if called from command line
if (require.main === module) {
  setupInitialAdmin().then(success => {
    if (success) {
      console.log('✅ Admin setup completed successfully');
    } else {
      console.log('❌ Admin setup failed');
    }
    process.exit(success ? 0 : 1);
  });
}