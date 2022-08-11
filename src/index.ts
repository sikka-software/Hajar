
import i18nBackEndOptions from "./i18next/backend-options.js";
import { setupEmail, sendEmail } from "./core/email";
import * as models from "./models/qawaim";
import invoiceCreate from "./core/invoice";
import setupCron from "./core/cron";
import updateOptions from "./core/options";
import initializeDB from "./core/database";
import { initializeS3, uploadImage, deleteImage, deleteImages } from "./core/aws-s3";
import { initialize, create, update, deactivate, remove, signIn, signOutUser, signInViaGoogle } from "./core/auth";
export { HAJAR_LIST_TRANSPORT_ARRAY } from "./core/email";


declare global {
  var _config: any;
  var _auth: any;
  var _provider: any;
  var SIKKA_SOFTWARE_APPLEPAY_PAYFOR_SHA_REQUEST_PHRASE: any;
  var SIKKA_SOFTWARE_APPLEPAY_PAYFOR_SHA_RESPONSE_PHRASE: any;
  var SIKKA_SOFTWARE_PAYFOR_SHA_REQUEST_PHRASE: any;
  var SIKKA_SOFTWARE_PAYFOR_SHA_RESPONSE_PHRASE: any;
};

/*
example use
Hajar.Database()
Hajar.Invoice()
Hajar.Mail.setupEmail()
Hajar.Mail.sendEmail()
*/
const Hajar = {
  Config: updateOptions,
  Database: initializeDB,
  Models: {
    Qawaim: models
  },
  Invoice: invoiceCreate,
  Mail: { SetupEmail: setupEmail, SendEmail: sendEmail },
  // will be added next release
  /* Payment: {
    Wallet: setupWallet,
    Payfort: setupAmazonPayments,
    Paypal: setupPaypal,
    GooglePay: setupGooglePay,
  }, */
  Auth: {
    SetupFirebase: initialize,
    CreateUser: create,
    UpdateUser: update,
    DeactivateUser: deactivate,
    DeleteUser: remove,
    SignIn: signIn,
    SignInViaGoogle: signInViaGoogle,
    SignOut: signOutUser
  },
  S3: {
    InitializeS3: initializeS3,
    UploadImage: uploadImage,
    DeleteImage: deleteImage,
    DeleteImages: deleteImages
  },
  Schedule: setupCron,
  i18n: i18nBackEndOptions
};

export default Hajar;
