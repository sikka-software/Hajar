/**
 * My module description. Please update with your module data.
 *
 * @remarks
 * This module runs perfectly in node.js and browsers
 *
 * @packageDocumentation
 */

// export { helloWorld, Response } from './hello-world'
// export default function sayHello (): void { console.log('hello') }

import { setupEmail, sendEmail } from './email'
import * as models from './models/qawaim'
import invoiceCreate from './invoice'
import setupCron from './cron'
import updateOptions from './options'
import initializeDB from './database'
import { initializeS3, uploadImage, deleteImage, deleteImages } from './aws-s3'
import { initialize, create, update, deactivate, remove, signIn, signOutUser, signInViaGoogle } from './auth'

export { HAJAR_LIST_TRANSPORT_ARRAY } from './email'

declare global {
  var _config: any;
  var _auth: any;
  var _provider: any;
  var SIKKA_SOFTWARE_APPLEPAY_PAYFOR_SHA_REQUEST_PHRASE: any;
  var SIKKA_SOFTWARE_APPLEPAY_PAYFOR_SHA_RESPONSE_PHRASE: any;
  var SIKKA_SOFTWARE_PAYFOR_SHA_REQUEST_PHRASE: any;
  var SIKKA_SOFTWARE_PAYFOR_SHA_RESPONSE_PHRASE: any;
}

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
  Schedule: setupCron
}

export default Hajar
