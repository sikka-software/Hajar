import Hajar from "../src";
import { CreateSchema } from "../src/core/schema";
import { createResolvers } from "../src/core/resolver";
import * as path from "path";
import mongoose from "mongoose";
import * as firebase from "@firebase/app";

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

// Test database part
// Test database connection
describe("Database", () => {
  it("should connect to the database", async () => {
    Hajar.Database.initialize();
    console.log(mongoose.connection.readyState);
    expect(mongoose.connection.readyState).toEqual(1);
  });
});

// Add a new model to the database
describe("addModel", () => {
  it("adds a new model to the database", async () => {
    const modelName = "TestModel";
    const schema = new mongoose.Schema({
      name: String,
      age: Number,
    });

    const testModel = Hajar.Database.model(modelName, schema);

    expect(testModel.modelName).toBe(modelName);
  });
});

// Delete the firebase connection
afterEach(() => {
  firebase.getApp.delete;
});
// Test Firebase connection
describe("initializeFirebase", () => {
  it("initializes Firebase", () => {
    Hajar.Auth.SetupFirebase();
    expect(firebase.getApp.length).toBe(1);
  });
});
// sign in to firebase
describe("signIn", () => {
  it("signs in to Firebase", async () => {
    const fieldValues = {
      email: "CreatedByMansour1@example.com",
      password: "password",
    };
    const email = "CreatedByMansour@example.com";
    const password = "password";
    Hajar.Auth.SignIn(fieldValues);
  });
});

// Test create user function
describe("createUser", () => {
  it("creates a new user", async () => {
    const fieldValues = {
      email: "Createdexamplesss@example.com",
      password: "password99",
    };
    Hajar.Auth.CreateUser(globalThis._auth, fieldValues);
    // expect(fieldValues.email).toEqual(Hajar.Auth.CreateUser.dataUser.email);
  });
});

// Test update user function
