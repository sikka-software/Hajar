import Hajar from "../src";
import mongoose from "mongoose";
/*
 @Mansour Test Part 
*/
// Test create Schema function
describe("CreateSchema", () => {
  it("should create a valid GraphQL schema and the resolver for a Mongoose model", () => {
    const User = mongoose.model("User", {
      name: String,
      email: String,
    });

    // This Part will create a schema for the User model
    const schema = Hajar.Schema(User);

    expect(schema).toBeDefined();
    // This Part will create a resolver for the same User model
    const resolver = Hajar.Resolver(User);
    expect(resolver).toBeDefined();
  });
});
