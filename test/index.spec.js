import Hajar from "../src";
import { CreateSchema } from "../src/core/schema";
import { createResolvers } from "../src/core/resolver";
import * as path from "path";
import mongoose from "mongoose";

// Replace with actual tests
describe("Hajar.src.js", () => {
  it("should get the library's version", () => {
    expect(Hajar.version).toEqual("1.0.16");
  });

  it("should get the library's name", () => {
    const name = Hajar._name;
    expect(name).toEqual("Hajar");
  });
});

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
    const schema = CreateSchema(User);

    expect(schema).toBeDefined();
    // This Part will create a resolver for the same User model
    const resolver = createResolvers(User);
    expect(resolver).toBeDefined();
  });
});

// Test Send Email function
/* describe("Send Email", () => {
  it("should send an email", () => {
    const transport = {};
    const params = {
      from: 'test@example.com',
      to: 'test2@example.com',
      subject: 'Test email',
      html: '<p>This is a test email</p>'
    };
    const result = sendEmail(transport, params);
    expect(result).toEqual(true);
  });
});
 */
