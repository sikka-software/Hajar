/**
 * My module description. Please update with your module data.
 *
 * @remarks
 * This module runs perfectly in node.js and browsers
 *
 * @packageDocumentation
 */
import { setupEmail, sendEmail } from './email';
import * as models from './models/qawaim';
import invoiceCreate from './invoice';
import setupCron from './cron';
import updateOptions from './options';
import initializeDB from './database';
import { initializeS3, uploadImage, deleteImage, deleteImages } from './aws-s3';
import { initialize, create, update, deactivate, remove, signIn, signOutUser, signInViaGoogle } from './auth';
export { HAJAR_LIST_TRANSPORT_ARRAY } from './email';
declare global {
    var _config: any;
    var _auth: any;
    var _provider: any;
    var SIKKA_SOFTWARE_APPLEPAY_PAYFOR_SHA_REQUEST_PHRASE: any;
    var SIKKA_SOFTWARE_APPLEPAY_PAYFOR_SHA_RESPONSE_PHRASE: any;
    var SIKKA_SOFTWARE_PAYFOR_SHA_REQUEST_PHRASE: any;
    var SIKKA_SOFTWARE_PAYFOR_SHA_RESPONSE_PHRASE: any;
}
declare const Hajar: {
    Config: typeof updateOptions;
    Database: typeof initializeDB;
    Models: {
        Qawaim: typeof models;
    };
    Invoice: typeof invoiceCreate;
    Mail: {
        SetupEmail: typeof setupEmail;
        SendEmail: typeof sendEmail;
    };
    Auth: {
        SetupFirebase: typeof initialize;
        CreateUser: typeof create;
        UpdateUser: typeof update;
        DeactivateUser: typeof deactivate;
        DeleteUser: typeof remove;
        SignIn: typeof signIn;
        SignInViaGoogle: typeof signInViaGoogle;
        SignOut: typeof signOutUser;
    };
    S3: {
        InitializeS3: typeof initializeS3;
        UploadImage: typeof uploadImage;
        DeleteImage: typeof deleteImage;
        DeleteImages: typeof deleteImages;
    };
    Schedule: typeof setupCron;
};
export default Hajar;
//# sourceMappingURL=index.d.ts.map