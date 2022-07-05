import { add } from 'date-fns'
import * as firebase from 'firebase/app'
import { Auth, User, getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, UserCredential, updateProfile, updatePassword, updateEmail, signInWithEmailAndPassword, signOut, deleteUser, signInWithPopup } from 'firebase/auth'
import CryptoJS from 'crypto-js'

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

export async function initialize (params: HajarFirebaseParameters): Promise<void> {
  if (
    params &&
    params.apiKey !== '' &&
    params.authDomain !== '' &&
    params.projectId !== '' &&
    params.storageBucket !== '' &&
    params.messagingSenderId !== '' &&
    params.appId !== '' &&
    params.measurementId !== ''
  ) {
    const app = (!firebase?.getApps().length) ? firebase.initializeApp(params) : firebase.getApp()
    const auth = getAuth(app)
    const provider = new GoogleAuthProvider()
    globalThis._auth = auth
    globalThis._provider = provider
  } else {
    new Error('Missing Required Parameters.')
  }
}

export async function signIn (fieldValues: any, e: any, callback: CallbackSignUser): Promise<void> {
  try {
    const userCredential = await signInWithEmailAndPassword(globalThis._auth, fieldValues.email, fieldValues.password)
    callback(userCredential, fieldValues, e)
  } catch (error: any) {
    callback(error.code, fieldValues, e)
  }
}

export async function signInViaGoogle (e: any, callback: CallbackSignUserViaGoogle): Promise<void> {
  try {
    const userCredential = await signInWithPopup(globalThis._auth, globalThis._provider)
    callback(userCredential, e)
  } catch (error: any) {
    callback(error.code, e)
  }
}

export async function create (auth: Auth, dataUser: HajarFirebaseDataUserParameters): Promise<void> {
  if (auth && dataUser.email && dataUser.password) {
    const userCredential = await createUserWithEmailAndPassword(auth, dataUser.email, dataUser.password)
    dataUser.callback(userCredential)
  } else {
    new Error('Missing Required Parameters.')
  }
}
export async function update (auth: Auth, type: string, dataUserUpdate: HajarFirebaseDataUserUpdateParameters): Promise<void> {
  const user = auth.currentUser
  if (user != null) {
    switch (type) {
      case 'profile':
        updateProfile(user, { displayName: dataUserUpdate.displayName, photoURL: dataUserUpdate.photoUrl })
        break
      case 'email':
        updateEmail(user, dataUserUpdate.newEmail)
        break
      case 'password':
        updatePassword(user, dataUserUpdate.newPassword)
        break
    }
    dataUserUpdate.callback(user, type, dataUserUpdate)
  } else {
    new Error('Missing Required Parameters.')
  }
}
export async function deactivate (): Promise<void> {
  console.log('deactivating user')
}
export async function remove (auth: Auth, callback: CallbackDeleteUser): Promise<void> {
  const user = auth.currentUser
  if (user != null) {
    await deleteUser(user)
    callback(user)
  } else {
    new Error('Missing Required Parameters.')
  }
}

export async function signOutUser (auth: Auth): Promise<void> {
  if (auth) {
    await signOut(auth)
  } else {
    new Error('Missing Required Parameters.')
  }
}

export async function sendPasswordResetEmail (email: string, callback: CallbackResetPassword): Promise<void> {
  if (!globalThis._config.OOBCODE || !globalThis._config.URL_ACTION) new Error('Missing Required Parameters.')
  const currentDate = new Date()
  const expireDate = add(currentDate, { minutes: 30 })
  const codeToSend = CryptoJS.AES.encrypt(JSON.stringify({ createdDate: currentDate, expireDate }), globalThis.__config.OOBCODE).toString()
  callback(globalThis._config.OOBCODE, globalThis._config.URL_ACTION, expireDate, codeToSend)

  // here goes sending email
}

export async function resetPasswordViaEmail (oobCode: string, email: string, newPassword: string): Promise<void> {
  if (!oobCode || !email || !newPassword) new Error('Missing Required Parameters')
  // configure admin firebase to change user's password
}
