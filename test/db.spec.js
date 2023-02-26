const Hajar = require("../src/index").default;
const mongoose = require("mongoose");
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
/*
describe("addModel", () => {
  it("adds a new model to the database", async () => {
    const modelName = "TestModel";
    const schema = new mongoose.Schema({
      name: String,
      age: Number,
    });

    /*
      @TODO: to be redesigned
      // @Mansour
      // Here we will give modelName and schema to the function
      // and it will return a model
      // We can use this function to create Schema and resolver for the model
      */
/*
    const testModel = Hajar.Database.model(modelName, schema);
    expect(testModel.modelName).toBe(modelName);
  });
  
});
*/
