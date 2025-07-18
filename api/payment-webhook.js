import admin from 'firebase-admin';
// NEW: Import the Resend library
import { Resend } from 'resend';

// Helper to initialize Firebase Admin only once
function initializeFirebaseAdmin() {
  if (!admin.apps.length) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_JSON);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log("Firebase Admin initialized successfully.");
    } catch (error) {
      console.error("CRITICAL: Failed to initialize Firebase Admin.", error);
      throw new Error("Firebase Admin initialization failed.");
    }
  }
}

// The main handler function for the Vercel Serverless environment
export default async function handler(request, response) {
  try {
    if (request.method !== 'POST') {
      return response.status(405).send('Method Not Allowed');
    }

    initializeFirebaseAdmin();
    const db = admin.firestore();
    const auth = admin.auth();

    const paystackEvent = request.body;

    if (paystackEvent.event !== 'charge.success') {
      return response.status(200).json({ message: 'Event received, but not a charge success.' });
    }

    const customerEmail = paystackEvent.data.customer.email;
    const customerName = paystackEvent.data.customer.first_name || 'Valued Student';

    if (!customerEmail) {
      console.error("Webhook Error: Customer email not found.");
      return response.status(400).send('Customer email not found.');
    }

    console.log(`Processing successful payment for: ${customerEmail}`);
    
    let userRecord;
    let temporaryPassword = null;

    try {
      userRecord = await auth.getUserByEmail(customerEmail);
      console.log(`User ${customerEmail} already exists. Granting access.`);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        console.log(`User ${customerEmail} not found. Creating new user.`);
        temporaryPassword = Math.random().toString(36).slice(-8);

        userRecord = await auth.createUser({
          email: customerEmail,
          emailVerified: true,
          password: temporaryPassword,
          displayName: customerName,
        });
      } else {
        throw error;
      }
    }

    const userId = userRecord.uid;
    const userDocRef = db.collection('users').doc(userId);

    await userDocRef.set({
      email: customerEmail,
      has_access: true,
      purchase_date: new Date().toISOString(),
    }, { merge: true });

    console.log(`Successfully granted course access to user: ${userId}`);

    // --- NEW: SEND THE WELCOME EMAIL WITH RESEND ---
    if (temporaryPassword) {
      console.log("Attempting to send welcome email with Resend...");
      
      // Initialize Resend with our secret API key
      const resend = new Resend(process.env.RESEND_API_KEY);

      // Send the email
      await resend.emails.send({
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
        to: [customerEmail],
        subject: 'Welcome to GRATEC! Your Course Access Details',
        html: `<h1>Welcome to GRATEC, ${customerName}!</h1><p>Thank you for your purchase. Your account has been created and you now have full access to the course.</p><p>You can log in with the following details:</p><ul><li><strong>Email:</strong> ${customerEmail}</li><li><strong>Temporary Password:</strong> ${temporaryPassword}</li></ul><p>We recommend you change your password after your first login.</p><p>Click here to log in and start learning: <a href="https://gratec-kweku12-bytes-projects.vercel.app/">Go to Course</a></p><p>Thank you,</p><p>The GRATEC Team</p>`,
      });
      
      console.log(`Welcome email sent successfully to ${customerEmail}.`);
    }

    return response.status(200).json({ message: 'User processed and access granted.' });

  } catch (error) {
    console.error('!!! --- FATAL WEBHOOK ERROR --- !!!');
    console.error(error);
    return response.status(500).json({ error: 'Internal server error.' });
  }
}
