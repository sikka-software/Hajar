import Stripe from "stripe";

export async function initializeStripe(secretKey) {
  if (!secretKey) {
    throw new Error("Stripe secret key is required");
  }
  global._stripe = Stripe(secretKey);
  return new Stripe(secretKey);
}
export async function generatetoken(card) {
  try {
    const token = await global._stripe.tokens.create({
      card: {
        number: card.number,
        exp_month: card.exp_month,
        exp_year: card.exp_year,
        cvc: card.cvc,
      },
    });
    return token;
  } catch (error) {
    throw error;
  }
}

export async function processPayment(amount, currency, source, description) {
  try {
    const charge = await global._stripe.charges.create({
      amount: amount,
      currency: currency,
      source: source,
      description: description,
    });
    return charge;
  } catch (error) {
    throw error;
  }
}
/*export async function subscribeUser(customerData) {
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
}*/
