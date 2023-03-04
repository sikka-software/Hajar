const CheckoutSessionSchema = `
type CheckoutSession {
    id: ID!
  }
  
  type Mutation {
    createCheckoutSession(
      planTitle: String!
      currency: String!
      amount: Int
      email: String!
    ): CheckoutSession
  }
  `;
module.exports = CheckoutSessionSchema;
