import Stripe from "stripe";

export async function initializeStripe(secretKey) {
  global.Stripe = Stripe(secretKey);
  return new Stripe(secretKey);
}

export async function processPayment(paymentData) {
  try {
    const paymentIntent = await global.Stripe.charges.create({
      amount: paymentData.amount,
      currency: paymentData.currency,
      source: paymentData.token,
    });
    return paymentIntent;
  } catch (error) {
    throw error;
  }
}
export async function subscribeUser(customerData) {
  const { email, token } = customerData;

  try {
    const customer = await stripe.customers.create({
      email: email,
      source: token,
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          plan: "plan_ABC123",
        },
      ],
      expand: ["latest_invoice.payment_intent"],
    });

    console.log("Subscription successful:", subscription.id);
  } catch (error) {
    console.error("Error subscribing user:", error);
  }
}
