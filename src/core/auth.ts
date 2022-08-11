/* tslint:disable:no-string-literal */
import { add } from "date-fns";
import * as firebase from "@firebase/app";
import { Auth, User, getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, UserCredential, updateProfile, updatePassword, updateEmail, signInWithEmailAndPassword, signOut, deleteUser, signInWithPopup } from "@firebase/auth";
import CryptoJS from "crypto-js";

interface HajarFirebaseParameters {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId: string
}

type CallbackCreateUser = (response: UserCredential) => void

type CallbackUpdateUser = (user: User, type: string, dataUserUpdate: HajarFirebaseDataUserUpdateParameters) => void

type CallbackDeleteUser = (user: User) => void

type CallbackResetPassword = (OOBCODE: string, URL_ACTION: string, expireDate: Date, codeToSend: string) => void

interface HajarFirebaseDataUserParameters {
  email: string
  password: string
  callback: CallbackCreateUser
}

interface HajarFirebaseDataUserUpdateParameters {
  displayName: string
  photoUrl: string
  newEmail: string
  newPassword: string
  callback: CallbackUpdateUser
}

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

type CallbackSignUser = (response: any, fieldValues: any, e: any) => void
type CallbackSignUserViaGoogle = (response: any, e: any) => void

export async function initialize (params: HajarFirebaseParameters): Promise<any> {
  if (
    params.apiKey !== "" &&
    params.authDomain !== "" &&
    params.projectId !== "" &&
    params.storageBucket !== "" &&
    params.messagingSenderId !== "" &&
    params.appId !== "" &&
    params.measurementId !== ""
  ) {
    const app: firebase.FirebaseApp = (firebase?.getApps().length > 0) ? firebase.initializeApp(params) : firebase.getApp();
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    globalThis._auth = auth;
    globalThis._provider = provider;
  } else {
    Error("Missing Required Parameters.");
  }
}

export async function signIn (fieldValues: any, e: any, callback: CallbackSignUser): Promise<any> {
  try {
    const userCredential = await signInWithEmailAndPassword(globalThis._auth, fieldValues.email, fieldValues.password);
    callback(userCredential, fieldValues, e);
  } catch (error: any) {
    callback(error.code, fieldValues, e);
  }
}

export async function signInViaGoogle (e: any, callback: CallbackSignUserViaGoogle): Promise<any> {
  try {
    const userCredential = await signInWithPopup(globalThis._auth, globalThis._provider);
    callback(userCredential, e);
  } catch (error: any) {
    callback(error.code, e);
  }
}

export async function create (auth: Auth, dataUser: HajarFirebaseDataUserParameters): Promise<any> {
  if (dataUser.email !== "" && dataUser.password !== "") {
    const userCredential = await createUserWithEmailAndPassword(auth, dataUser.email, dataUser.password);
    dataUser.callback(userCredential);
  } else {
    Error("Missing Required Parameters.");
  }
}
export async function update (auth: Auth, type: string, dataUserUpdate: HajarFirebaseDataUserUpdateParameters): Promise<any> {
  const user = auth.currentUser;
  if (user != null) {
    switch (type) {
      case "profile":
        await updateProfile(user, { displayName: dataUserUpdate.displayName, photoURL: dataUserUpdate.photoUrl });
        break
      case "email":
        await updateEmail(user, dataUserUpdate.newEmail);
        break
      case "password":
        await updatePassword(user, dataUserUpdate.newPassword);
        break
    }
    dataUserUpdate.callback(user, type, dataUserUpdate);
  } else {
    Error("Missing Required Parameters.");
  }
}
export async function deactivate (): Promise<any> {
  console.log("deactivating user");
}
export async function remove (auth: Auth, callback: CallbackDeleteUser): Promise<any> {
  const user = auth.currentUser;
  if (user != null) {
    await deleteUser(user);
    callback(user);
  } else {
    Error("Missing Required Parameters.");
  }
}

export async function signOutUser (auth: Auth): Promise<void> {
  return await signOut(auth);
}

export async function sendPasswordResetEmail (email: string, callback: CallbackResetPassword): Promise<any> {
  if (globalThis._config.OOBCODE === "" || globalThis._config.URL_ACTION === "") Error("Missing Required Parameters.")
  const currentDate = new Date();
  const expireDate = add(currentDate, { minutes: 30 });
  const codeToSend = CryptoJS.AES.encrypt(JSON.stringify({ createdDate: currentDate, expireDate }), globalThis._config.OOBCODE).toString();
  callback(globalThis._config.OOBCODE, globalThis._config.URL_ACTION, expireDate, codeToSend);

  // here goes sending email
}

export async function resetPasswordViaEmail (oobCode: string, email: string, newPassword: string): Promise<any> {
  if (oobCode === "" || email === "" || newPassword === "") Error("Missing Required Parameters");
  // configure admin firebase to change user"s password
}