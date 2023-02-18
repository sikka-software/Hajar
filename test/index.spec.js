import Hajar from "../src";
import { CreateSchema } from "../src/core/schema";
import { createResolvers } from "../src/core/resolver";
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
