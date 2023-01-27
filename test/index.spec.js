import Hajar from "../src";
import { CreateSchema } from "../src/core/schema";

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

// Test create Schema function
describe("CreateSchema", () => {
  it("should create a new schema", () => {
    const fields = [
      { name: "name", type: "String" },
      { name: "email", type: "String" },
    ];
    const name = "User";
    const path = "./test";
    // create a schema file
    const schema = CreateSchema(name, fields, path);
    const expectedSchema = `type User {
      name: String
      email: String
    }`;

    expect(schema).toEqual(print(expectedSchema));
  });
});
