import * as firebaseAdmin from "firebase-admin";

export default function Admin() {
    return firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(globalThis.__config.firebaseConfig)
    });
};