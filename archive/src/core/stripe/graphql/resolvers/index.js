const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

async function createCheckoutSession(
  _,
  { midelware, planTitle, currency, amount, email }
) {
  try {
    const price = await stripe.prices.create({
      unit_amount: amount,
      currency: currency,
      recurring: {
        interval: "month",
      },
      product_data: {
        name: planTitle,
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: price.id, // price id
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url:
        "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/billing",
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          planTitle: planTitle,
          email: email,
          currency: currency,
          price: amount,
        },
      },
      locale: "it",
    });

    return { id: session.id };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create checkout session");
  }
}
module.exports = {
  createCheckoutSession,
};
