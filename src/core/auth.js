/* tslint:disable:no-string-literal */
import { add } from "date-fns";
import * as firebase from "@firebase/app";
import { HAJAR_FIREBASE } from "../../Hajar.config.json";
import {
  Auth,
  User,
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  UserCredential,
  updateProfile,
  updatePassword,
  updateEmail,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
  signInWithPopup,
} from "@firebase/auth";
import CryptoJS from "crypto-js";
globalThis._Hajar_config = HAJAR_FIREBASE;
export async function initialize() {
  globalThis.firebase = firebase.initializeApp(globalThis._Hajar_config);
  globalThis._auth = getAuth();
  globalThis._provider = new GoogleAuthProvider();
}

export async function signIn(fieldValues) {
  const { email, password } = fieldValues;

  const result = await signInWithEmailAndPassword(
    globalThis._auth,
    email,
    password
  );
  return result;
}

export async function signInViaGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(globalThis._auth, provider);
  const user = result.user;
  return user;
}

export async function create(auth, dataUser) {
  if (dataUser.email !== "" && dataUser.password !== "") {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      dataUser.email,
      dataUser.password
    );
    return userCredential;
  } else {
    Error("Missing Required Parameters.");
  }
}
export async function update(auth, type, dataUserUpdate) {
  const user = auth.currentUser;
  if (user != null) {
    switch (type) {
      case "profile":
        await updateProfile(user, {
          displayName: dataUserUpdate.displayName,
          photoURL: dataUserUpdate.photoUrl,
        });
        break;
      case "email":
        await updateEmail(user, dataUserUpdate.newEmail);
        break;
      case "password":
        await updatePassword(user, dataUserUpdate.newPassword);
        break;
    }
    dataUserUpdate.callback(user, type, dataUserUpdate);
  } else {
    Error("Missing Required Parameters.");
  }
}
export async function deactivate() {
  console.log("deactivating user");
}
export async function remove(auth, callback) {
  const user = auth.currentUser;
  if (user != null) {
    await deleteUser(user);
    callback(user);
  } else {
    Error("Missing Required Parameters.");
  }
}

export async function signOutUser(auth) {
  return await signOut(auth);
}

export async function sendPasswordResetEmail(email, callback) {
  if (globalThis._config.OOBCODE === "" || globalThis._config.URL_ACTION === "")
    Error("Missing Required Parameters.");
  const currentDate = new Date();
  const expireDate = add(currentDate, { minutes: 30 });
  const codeToSend = CryptoJS.AES.encrypt(
    JSON.stringify({ createdDate: currentDate, expireDate }),
    globalThis._config.OOBCODE
  ).toString();
  callback(
    globalThis._config.OOBCODE,
    globalThis._config.URL_ACTION,
    expireDate,
    codeToSend
  );

  // here goes sending email
}

export async function resetPasswordViaEmail(oobCode, email, newPassword) {
  if (oobCode === "" || email === "" || newPassword === "")
    Error("Missing Required Parameters");
  // configure admin firebase to change user"s password
}
