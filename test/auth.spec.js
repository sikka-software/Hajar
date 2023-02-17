import Hajar from "../src";
import * as firebase from "@firebase/app";

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
describe("createUser", () => {
  it("creates a new user", async () => {
    const UserCredential = {
      email: "zakher12@example.com",
      password: "password99",
    };
    Hajar.Auth.CreateUser(global._auth, UserCredential);
    //  expect(UserCredential.email).toEqual(Hajar.Auth.CreateUser.dataUser.email);
  });
});

// Test sign out function
describe("signOut", () => {
  it("signs out from Firebase", async () => {
    const result = Hajar.Auth.SignOut(global._auth);
    expect(result).toBeTruthy();
  });
});