import Hajar from "../src";
import { CreateSchema } from "../src/core/schema";
import { createResolvers } from "../src/core/resolver";
import * as path from "path";
import mongoose from "mongoose";
import * as firebase from "@firebase/app";
import nodemailer from "nodemailer";
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
// The purpose of these tests is to validate that the function correctly sets up a connection to the specified database type.
// The tests cover three scenarios: a successful connection to MongoDB, a successful connection to MySQL, and an unsupported database type.
describe("Database", () => {
  it("should return a connected MongoDB instance", () => {
    const options = {
      type: "MongoDB",
      url: "mongodb://localhost:27017/test-db",
    };
    const db = Hajar.Database.initialize(options);
    expect(db).toBeTruthy();
    // expect(db.connection.readyState).toBe(1); // connected
  });

  /*   it("should return a connected MySQL instance", async () => {
    const options = {
      type: "mysql",
      url: "mysql://localhost:3306/test-db",
    };

    const db = await Hajar.Database.initialize(options);

    expect(db).toBeTruthy();
    expect(db.state).toBe("connected");
  }); */

  it("should return null for unsupported database types", async () => {
    const options = {
      type: "unsupported",
      url: "invalid://localhost:1234/test-db",
    };
    const db = await Hajar.Database.initialize(options);
    expect(db).toBeNull();
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

    /*
    // @Mansour
    // Here we will give modelName and schema to the function
    // and it will return a model
    // We can use this function to create Schema and resolver for the model
    */
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
      email: "createdbymansour99@example.com",
      password: "password",
    };
    const result = Hajar.Auth.SignIn(global._auth, fieldValues);
    expect(result).toBeTruthy();
  });
});

// Test create user function
/* describe("createUser", () => {
  it("creates a new user", async () => {
    const UserCredential = {
      email: "Createdddddqsdqsddddd@example.com",
      password: "password99",
    };
    Hajar.Auth.CreateUser(global._auth, UserCredential);
    // expect(fieldValues.email).toEqual(Hajar.Auth.CreateUser.dataUser.email);
  });
}); */

// Setup Email Config (Mansour)
describe("setupEmail", () => {
  it("configures nodemailer with the given emailConfig", () => {
    const emailConfig = {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "benmansourmansour08@gmail.com",
        pass: "grmislczfdqayrak",
      },
    };

    Hajar.Mail.SetupEmail(emailConfig);

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: "benmansourmansour08@gmail.com",
        pass: "grmislczfdqayrak",
      },
    });
  });
});
// Send email function
describe("sendEmail", () => {
  it("should send an email", async () => {
    const Template = (props) => {
      return (
        <div>
          <h1>{props.title}</h1>
          <p>{props.body}</p>
        </div>
      );
    };
    const emailConfig = {
      from: "from@example.com",
      to: "to@example.com",
      subject: "Test Email",
      html: "<p>Test email body</p>",
    };
    const template = <Template />;
    const data = { name: "John Doe" };

    const result = await Hajar.Mail.SendEmail({ emailConfig, template, data });

    expect(result).toEqual({ response: "email sent successfully" });
    expect(nodemailer.createTransport).toHaveBeenCalled();
  });
});
// Test update user function

// Test update user profile function
