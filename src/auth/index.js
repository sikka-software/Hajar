const firebase = require("firebase/app");
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

async function setupFirebase() {
  if (
    __config &&
    __config.HAJAR_FIREBASE &&
    __config.HAJAR_FIREBASE.apiKey &&
    __config.HAJAR_FIREBASE.authDomain &&
    __config.HAJAR_FIREBASE.projectId &&
    __config.HAJAR_FIREBASE.storageBucket &&
    __config.HAJAR_FIREBASE.messagingSenderId &&
    __config.HAJAR_FIREBASE.appId &&
    __config.HAJAR_FIREBASE.measurementId
  ) {
    let firebaseConfig = {
      apiKey: __config.HAJAR_FIREBASE.apiKey,
      authDomain: __config.HAJAR_FIREBASE.authDomain,
      projectId: __config.HAJAR_FIREBASE.projectId,
      storageBucket: __config.HAJAR_FIREBASE.storageBucket,
      messagingSenderId: __config.HAJAR_FIREBASE.messagingSenderId,
      appId: __config.HAJAR_FIREBASE.appId,
      measurementId: __config.HAJAR_FIREBASE.measurementId,
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    } else {
      firebase.app(); // if already initialized, use that one
    }
    const auth = firebase.auth();
    const provider = new firebase.auth.GoogleAuthProvider();
    return {
      auth: auth,
      provider: provider,
    };
  } else {
    new Error("Missing Required Parameters.");
  }
}
async function createUser(auth, dataUser) {
  if (auth && dataUser.email && dataUser.password) {
    auth
      .createUserWithEmailAndPassword(dataUser.email, dataUser.password)
      .then(async (user) => {
        if (
          dataUser.callbackSuccess &&
          typeof dataUser.callbackSuccess === "function"
        ) {
          dataUser.callbackSuccess(user, dataUser);
        }
      })
      .catch((err) => {
        if (
          dataUser.callbackError &&
          typeof dataUser.callbackError === "function"
        ) {
          dataUser.callbackError(err, dataUser);
        }
      });
  } else {
    new Error("Missing Required Parameters.");
  }
}
async function updateUser(auth, email, dataUserUpdate) {
  if (auth && email) {
    auth
      .getUserByEmail(email)
      .then((t) => {
        return t.uid;
      })
      .then((uid) => {
        return auth.updateUser(uid, dataUserUpdate);
      })
      .then(async () => {
        if (
          dataUser.callbackSuccess &&
          typeof dataUser.callbackSuccess === "function"
        ) {
          dataUser.callbackSuccess(user, dataUser);
        }
      })
      .catch((err) => {
        if (
          dataUser.callbackError &&
          typeof dataUser.callbackError === "function"
        ) {
          dataUser.callbackError(err, email, dataUserUpdate);
        }
      });
  } else {
    new Error("Missing Required Parameters.");
  }
}
async function deactivateUser() {
  console.log("deactivating user");
}
async function deleteUser(auth, dataUser) {
  if (auth && dataUser.email && dataUser.password) {
    let userUID;
    auth
      .getUserByEmail(args.email)
      .then((user) => {
        userUID = user.uid;
        auth
          .deleteUser(userUID)
          .then(async () => {
            if (
              dataUser.callbackSuccess &&
              typeof dataUser.callbackSuccess === "function"
            ) {
              dataUser.callbackSuccess(user, dataUser);
            }
          })
          .catch((err) => {
            if (
              dataUser.callbackError &&
              typeof dataUser.callbackError === "function"
            ) {
              dataUser.callbackError(err, dataUser);
            }
          });
      })
      .catch((err) => {
        if (
          dataUser.callbackError &&
          typeof dataUser.callbackError === "function"
        ) {
          dataUser.callbackError(err, dataUser);
        }
      });
  } else {
    new Error("Missing Required Parameters.");
  }
}
async function signIn(auth, dataUser) {
  if (auth && dataUser.email && dataUser.password) {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(async (user) => {
        if (
          dataUser.callbackSuccess &&
          typeof dataUser.callbackSuccess === "function"
        ) {
          dataUser.callbackSuccess(user, dataUser);
        }
      })
      .catch((err) => {
        if (
          dataUser.callbackError &&
          typeof dataUser.callbackError === "function"
        ) {
          dataUser.callbackError(err, dataUser);
        }
      });
  } else {
    new Error("Missing Required Parameters.");
  }
}
async function signOut(auth) {
  if (auth) {
    auth
      .signOut()
      .then(() => {
        if (
          dataUser.callbackSuccess &&
          typeof dataUser.callbackSuccess === "function"
        ) {
          dataUser.callbackSuccess(dataUser);
        }
      })
      .catch((err) => {
        if (
          dataUser.callbackError &&
          typeof dataUser.callbackError === "function"
        ) {
          dataUser.callbackError(err, dataUser);
        }
      });
  } else {
    new Error("Missing Required Parameters.");
  }
}

module.exports = {
  setupFirebase: setupFirebase,
  createUser: createUser,
  updateUser: updateUser,
  deactivateUser: deactivateUser,
  deleteUser: deleteUser,
  signIn: signIn,
  signOut: signOut,
};
