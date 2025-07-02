// This is the final version of our Automated Secretary (Serverless Function).
// It now sends a welcome email with the user's login details.

import admin from 'firebase-admin';
// NEW: Import the MailerSend library and its helper classes
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

// --- Firebase Admin Initialization ---
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_JSON);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}
const db = admin.firestore();
const auth = admin.auth();

// --- MailerSend Initialization ---
// We get our secret API key from the Vercel Environment Variables
const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});


// --- The Main Handler Function ---
export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).send('Method Not Allowed');
  }

  const paystackEvent = request.body;

  if (paystackEvent.event === 'charge.success') {
    const customerEmail = paystackEvent.data.customer.email;
    const customerName = paystackEvent.data.customer.first_name || 'Valued';

    if (!customerEmail) {
      console.error("Webhook Error: Customer email not found.");
      return response.status(400).send('Customer email not found.');
    }

    try {
      console.log(`Processing successful payment for: ${customerEmail}`);
      
      let userRecord;
      let temporaryPassword = null; // We'll store the password here

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

      // --- NEW: SEND THE WELCOME EMAIL ---
      if (temporaryPassword) { // Only send the email if a new user was created
        const sentFrom = new Sender(process.env.EMAIL_FROM_ADDRESS, process.env.EMAIL_FROM_NAME);
        const recipients = [new Recipient(customerEmail, customerName)];

        const emailParams = new EmailParams()
          .setFrom(sentFrom)
          .setTo(recipients)
          .setSubject("Welcome to GRATEC! Your Course Access Details")
          .setHtml(
            `
            <h1>Welcome to GRATEC, ${customerName}!</h1>
            <p>Thank you for your purchase. Your account has been created and you now have full access to the course.</p>
            <p>You can log in with the following details:</p>
            <ul>
              <li><strong>Email:</strong> ${customerEmail}</li>
              <li><strong>Temporary Password:</strong> ${temporaryPassword}</li>
            </ul>
            <p>We recommend you change your password after your first login.</p>
            <p>Click here to log in and start learning: <a href="https://focosmode.com/gratec-courses">Go to Course</a></p>
            <p>Thank you,</p>
            <p>The GRATEC Team</p>
            `
          )
          .setText(`Welcome to GRATEC, ${customerName}! Your login email is ${customerEmail} and your temporary password is ${temporaryPassword}.`);
        
        await mailerSend.email.send(emailParams);
        console.log(`Welcome email sent successfully to ${customerEmail}.`);
      }

      return response.status(200).json({ message: 'User processed and access granted.' });

    } catch (error) {
      console.error('Error processing webhook:', error);
      return response.status(500).json({ error: 'Internal server error.' });
    }
  }

  return response.status(200).json({ message: 'Event received, but not processed.' });
}
