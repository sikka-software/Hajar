import Hajar from "../src/index";
import * as Stripe from "stripe";

describe("initializeStripe", () => {
  it("initializes a Stripe instance with the provided secret key", () => {
    const secretKey = "pk_test_9P3wu2r91mxQvoWW17rv4fdv00OtHXcM0X";
    const stripe = Hajar.Stripe.initializeStripe(secretKey);

    expect(stripe).not.toBeNull();
    //expect(stripe.getKey()).toEqual(secretKey);
  });
});
describe("processPayment", () => {
  it("processes a payment successfully", async () => {
    const paymentData = {
      amount: 1000,
      currency: "usd",
      token: "sk_test_aAIvYzrQKnKPbiKFFqk9e6HY00E9ud1vx1",
    };

    const charge = await Hajar.Stripe.ProcessPayment(paymentData);
    // expect(charge).not.toBeNull();
    expect(charge.amount).toEqual(paymentData.amount);
  });
});
