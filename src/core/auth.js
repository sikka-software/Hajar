const firebase = require("@firebase/app");
const {
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
} = require("@firebase/auth");

const CryptoJS = require("crypto-js");
const { add } = require("date-fns");
export async function initialize() {
  const firebaseConfig = JSON.parse(process.env.HAJAR_FIREBASE);

  globalThis.firebase = firebase.initializeApp(firebaseConfig);
  globalThis._auth = getAuth();
  globalThis._provider = new GoogleAuthProvider();
}

async function signIn(auth, fieldValues) {
  const { email, password } = fieldValues;

  const result = await signInWithEmailAndPassword(auth, email, password);
  return result;
}

async function signInViaGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(globalThis._auth, provider);
  const user = result.user;
  return user;
}

async function create(auth, dataUser) {
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
async function update(auth, type, dataUserUpdate) {
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
    return true;
  } else {
    Error("Missing Required Parameters.");
    return false;
  }
}
async function deactivate() {
  console.log("deactivating user");
}
async function remove(auth, callback) {
  const user = auth.currentUser;
  if (user != null) {
    await deleteUser(user);
    callback(user);
  } else {
    Error("Missing Required Parameters.");
  }
}

async function signOutUser(auth) {
  return await signOut(auth);
}

async function sendPasswordResetEmail(email, callback) {
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

async function resetPasswordViaEmail(oobCode, email, newPassword) {
  if (oobCode === "" || email === "" || newPassword === "")
    Error("Missing Required Parameters");
  // configure admin firebase to change user"s password
}

module.exports = {
  initialize,
  signIn,
  signInViaGoogle,
  create,
  update,
  deactivate,
  remove,
  signOutUser,
  resetPasswordViaEmail,
  sendPasswordResetEmail,
};
