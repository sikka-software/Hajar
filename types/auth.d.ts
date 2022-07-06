import { Auth, User, UserCredential } from 'firebase/auth';
interface HajarFirebaseParameters {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
}
declare type CallbackCreateUser = (response: UserCredential) => void;
declare type CallbackUpdateUser = (user: User, type: string, dataUserUpdate: HajarFirebaseDataUserUpdateParameters) => void;
declare type CallbackDeleteUser = (user: User) => void;
declare type CallbackResetPassword = (OOBCODE: string, URL_ACTION: string, expireDate: Date, codeToSend: string) => void;
interface HajarFirebaseDataUserParameters {
    email: string;
    password: string;
    callback: CallbackCreateUser;
}
interface HajarFirebaseDataUserUpdateParameters {
    displayName: string;
    photoUrl: string;
    newEmail: string;
    newPassword: string;
    callback: CallbackUpdateUser;
}
declare type CallbackSignUser = (response: any, fieldValues: any, e: any) => void;
declare type CallbackSignUserViaGoogle = (response: any, e: any) => void;
export declare function initialize(params: HajarFirebaseParameters): Promise<any>;
export declare function signIn(fieldValues: any, e: any, callback: CallbackSignUser): Promise<any>;
export declare function signInViaGoogle(e: any, callback: CallbackSignUserViaGoogle): Promise<any>;
export declare function create(auth: Auth, dataUser: HajarFirebaseDataUserParameters): Promise<any>;
export declare function update(auth: Auth, type: string, dataUserUpdate: HajarFirebaseDataUserUpdateParameters): Promise<any>;
export declare function deactivate(): Promise<any>;
export declare function remove(auth: Auth, callback: CallbackDeleteUser): Promise<any>;
export declare function signOutUser(auth: Auth): Promise<void>;
export declare function sendPasswordResetEmail(email: string, callback: CallbackResetPassword): Promise<any>;
export declare function resetPasswordViaEmail(oobCode: string, email: string, newPassword: string): Promise<any>;
export {};
//# sourceMappingURL=auth.d.ts.map