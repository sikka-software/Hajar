import Hajar from "../src/index";
import * as Stripe from "stripe";
jest.setTimeout(10000);

describe("initializeStripe", () => {
  it("initializes a Stripe instance with the provided secret key", () => {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const stripe = Hajar.Stripe.initializeStripe(secretKey);

    expect(stripe).not.toBeNull();
    //expect(stripe.getKey()).toEqual(secretKey);
  });
});
describe("Generate TOKEN ", () => {
  it("should generate a test token", async () => {
    const card = {
      number: "4242424242424242",
      exp_month: 12,
      exp_year: 2028,
      cvc: "123",
    };

    process.env.STRIPE_TOKEN = await Hajar.Stripe.generatetoken(card);

    expect(token).toBeDefined();
    expect(token.id).toBeDefined();
  });
}, 1000);
/*
describe("processPayment function", () => {
  it("should return a successful payment response", async () => {
    const card = {
      number: "4242424242424242",
      exp_month: 12,
      exp_year: 2028,
      cvc: "123",
    };
    const tokenGenerated = await Hajar.Stripe.generatetoken(card);
    // Set up the test data
    const amount = 100;
    const currency = "usd";
    const token = tokenGenerated;

    // Call the processPayment function
    const response = await Hajar.Stripe.ProcessPayment(amount, currency, token);

    // Assert that the response is successful
    expect(response.status).toEqual("succeeded");
  });

  it("should return an error for an invalid token", async () => {
    // Set up the test data
    const amount = 100;
    const currency = "usd";
    const token = "tok_invalid";

    // Call the processPayment function
    const response = await Hajar.Stripe.ProcessPayment(amount, currency, token);

    // Assert that the response contains an error message
    expect(response.error).toBeDefined();
  });
});*/
