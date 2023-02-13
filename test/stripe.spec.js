import Hajar from "../src/index";
import * as Stripe from "stripe";

describe("initializeStripe", () => {
  it("initializes a Stripe instance with the provided secret key", () => {
    const secretKey = "";
    const stripe = Hajar.Stripe.initializeStripe(secretKey);

    expect(stripe).not.toBeNull();
    //expect(stripe.getKey()).toEqual(secretKey);
  });
});
/* describe("processPayment", () => {
  it("processes a payment successfully", async () => {
    const paymentData = {
      amount: 1000,
      currency: "usd",
      token:
        "",
    };

    const charge = await Hajar.Stripe.ProcessPayment(paymentData);
    // expect(charge).not.toBeNull();
    expect(charge.amount).toEqual(paymentData.amount);
  });
});
 */
