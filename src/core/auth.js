/* tslint:disable:no-string-literal */
import { add } from "date-fns";
import * as firebase from "@firebase/app";
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

/*
let firebaseConfig = {
  apiKey:
  authDomain:
  projectId:
  storageBucket:
  messagingSenderId:
  appId:
  measurementId:
};
*/

export async function initialize(params) {
  if (
    params.apiKey !== "" &&
    params.authDomain !== "" &&
    params.projectId !== "" &&
    params.storageBucket !== "" &&
    params.messagingSenderId !== "" &&
    params.appId !== "" &&
    params.measurementId !== ""
  ) {
    const app =
      firebase.getApps().length > 0
        ? firebase.initializeApp(params)
        : firebase.getApp();
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    globalThis._auth = auth;
    globalThis._provider = provider;
  } else {
    Error("Missing Required Parameters.");
  }
}

export async function signIn(fieldValues, e, callback) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      globalThis._auth,
      fieldValues.email,
      fieldValues.password
    );
    callback(userCredential, fieldValues, e);
  } catch (error) {
    callback(error.code, fieldValues, e);
  }
}

export async function signInViaGoogle(e, callback) {
  try {
    const userCredential = await signInWithPopup(
      globalThis._auth,
      globalThis._provider
    );
    callback(userCredential, e);
  } catch (error) {
    callback(error.code, e);
  }
}

export async function create(auth, dataUser) {
  if (dataUser.email !== "" && dataUser.password !== "") {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      dataUser.email,
      dataUser.password
    );
    dataUser.callback(userCredential);
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
