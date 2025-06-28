// This is our Automated Secretary (Serverless Function).
// Its job is to listen for the secret message from Paystack after a successful payment.

export default function handler(request, response) {
  // First, we check to make sure the message is coming from Paystack.
  // We only accept 'POST' requests, which is what webhooks use.
  if (request.method !== 'POST') {
    // If it's not a POST request, we ignore it.
    return response.status(405).send('Method Not Allowed');
  }

  // For now, we will just log the body of the message from Paystack
  // so we can see what data it sends us.
  console.log('Webhook received from Paystack:');
  console.log(request.body);

  // Here, we get the customer's email from the data Paystack sent.
  const customerEmail = request.body?.data?.customer?.email;

  if (!customerEmail) {
    console.log("Could not find customer email in the webhook payload.");
    // If there's no email, we can't create an account, so we stop.
    return response.status(400).send('Customer email not found.');
  }

  // TODO LATER:
  // 1. Add Firebase Admin to create a user with this email.
  // 2. Add the user to the Firestore "VIP list".
  // 3. Send a welcome email.

  // Finally, we send a "200 OK" message back to Paystack.
  // This tells Paystack, "We got your message loud and clear, everything is fine."
  // If we don't send this, Paystack will think the message failed and will try again.
  response.status(200).json({ message: 'Webhook received successfully.' });
}
