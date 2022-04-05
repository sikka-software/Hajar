import * as firebase from "firebase/app";
import { Auth, User, getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, UserCredential, updateProfile, updatePassword, updateEmail, signInWithEmailAndPassword, signOut, deleteUser } from "firebase/auth";

type HajarFirebaseParameters = {
  apiKey: string,
  authDomain: string,
  projectId: string,
  storageBucket: string,
  messagingSenderId: string,
  appId: string,
  measurementId: string
};

type CallbackCreateUser = (response: UserCredential) => void

type CallbackUpdateUser = (user: User, type: string, dataUserUpdate: HajarFirebaseDataUserUpdateParameters) => void

type CallbackDeleteUser = (user: User) => void

type HajarFirebaseDataUserParameters = {
  email: string,
  password: string,
  callback: CallbackCreateUser
};

type HajarFirebaseDataUserUpdateParameters = {
  displayName: string,
  photoUrl: string,
  newEmail: string,
  newPassword: string,
  callback: CallbackUpdateUser
};

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

export async function initialize(params: HajarFirebaseParameters) {
  if (
    params &&
    params.apiKey &&
    params.authDomain &&
    params.projectId &&
    params.storageBucket &&
    params.messagingSenderId &&
    params.appId &&
    params.measurementId
  ) {
    let app = (!firebase?.getApps().length) ? firebase.initializeApp(params) : firebase.getApp();
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    globalThis.__auth = auth;
    globalThis.__provider =  provider;
  } else {
    new Error("Missing Required Parameters.");
  }
}

export async function signIn(fieldValues: any, e: any, callback: CallbackSignUser) {
  try {
    let userCredential = await signInWithEmailAndPassword(globalThis.__auth, fieldValues.email, fieldValues.password);
    callback(userCredential, fieldValues, e);
  } catch (error: any) {
    callback(error.code, fieldValues, e);
  }
}

export async function create(auth: Auth, dataUser: HajarFirebaseDataUserParameters) {
  if (auth && dataUser.email && dataUser.password) {
    let userCredential = await createUserWithEmailAndPassword(auth, dataUser.email, dataUser.password);
    dataUser.callback(userCredential);
  } else {
    new Error("Missing Required Parameters.");
  }
}
export async function update(auth: Auth, type: string, dataUserUpdate: HajarFirebaseDataUserUpdateParameters) {
  const user = auth.currentUser;
  if (user) {
    switch (type) {
      case "profile":
        updateProfile(user, { displayName: dataUserUpdate.displayName, photoURL: dataUserUpdate.photoUrl });
        break;
      case "email":
        updateEmail(user, dataUserUpdate.newEmail);
        break;
      case "password":
        updatePassword(user, dataUserUpdate.newPassword);
        break;
    }
    dataUserUpdate.callback(user, type, dataUserUpdate);
  } else {
    new Error("Missing Required Parameters.");
  }
}
export async function deactivate() {
  console.log("deactivating user");
}
export async function remove(auth: Auth, callback: CallbackDeleteUser) {
  const user = auth.currentUser;
  if (user) {
    await deleteUser(user);
    callback(user);
  }
  else {
    new Error("Missing Required Parameters.");
  }
}

export async function signOutUser(auth: Auth) {
  if (auth) {
    await signOut(auth);
  } else {
    new Error("Missing Required Parameters.");
  }
}