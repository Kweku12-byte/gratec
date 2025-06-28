// This is the final version of our Automated Secretary (Serverless Function).
// It listens for the secret message from Paystack and automatically creates a user account.

// We need to import the Firebase Admin SDK tools
import admin from 'firebase-admin';

// --- Firebase Admin Initialization ---
// We will check if the app is already initialized to prevent errors in Vercel's environment.
if (!admin.apps.length) {
  // Get the secret JSON key from the Environment Variable we set up in Vercel
  const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_JSON);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

// Get instances of the auth and firestore services from the admin app
const db = admin.firestore();
const auth = admin.auth();


// --- The Main Handler Function ---
export default async function handler(request, response) {
  // First, verify the request is a POST from Paystack
  if (request.method !== 'POST') {
    return response.status(405).send('Method Not Allowed');
  }

  // For security, you might want to verify the request comes from Paystack
  // This is an advanced step, for now we will trust the request.

  const paystackEvent = request.body;

  // We only care about the 'charge.success' event
  if (paystackEvent.event === 'charge.success') {
    const customerEmail = paystackEvent.data.customer.email;
    const customerName = paystackEvent.data.customer.first_name || 'Valued'; // Use first name or a default

    if (!customerEmail) {
      console.error("Webhook Error: Customer email not found in payload.");
      return response.status(400).send('Customer email not found.');
    }

    try {
      // --- The Magic Happens Here ---
      console.log(`Processing successful payment for: ${customerEmail}`);

      // 1. Check if a user with this email already exists
      let userRecord;
      try {
        userRecord = await auth.getUserByEmail(customerEmail);
        console.log(`User ${customerEmail} already exists. Granting access.`);
      } catch (error) {
        // If the user does not exist, create them
        if (error.code === 'auth/user-not-found') {
          console.log(`User ${customerEmail} not found. Creating new user.`);
          
          // Generate a simple, random temporary password
          const temporaryPassword = Math.random().toString(36).slice(-8);

          userRecord = await auth.createUser({
            email: customerEmail,
            emailVerified: true,
            password: temporaryPassword,
            displayName: customerName,
          });

          // TODO LATER: Here you would trigger an email to the user
          // with their login details and temporary password.
          console.log(`TODO: Send welcome email to ${customerEmail} with temp password: ${temporaryPassword}`);
        } else {
          // Some other error occurred
          throw error;
        }
      }

      // 2. Grant course access in Firestore (The VIP List)
      const userId = userRecord.uid;
      const userDocRef = db.collection('users').doc(userId);

      await userDocRef.set({
        email: customerEmail,
        has_access: true, // This is the VIP pass!
        purchase_date: new Date().toISOString(),
      }, { merge: true }); // Use merge to avoid overwriting other data

      console.log(`Successfully granted course access to user: ${userId}`);

      // 3. Send a success response back to Paystack
      return response.status(200).json({ message: 'User created and access granted.' });

    } catch (error) {
      console.error('Error processing webhook:', error);
      return response.status(500).json({ error: 'Internal server error.' });
    }
  }

  // If the event is not 'charge.success', just acknowledge it
  return response.status(200).json({ message: 'Event received, but not processed.' });
}
