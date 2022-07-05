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
import * as models from "./models/qawaim"
import invoiceCreate from "./invoice"
import setupCron from './cron'
import updateOptions from "./options"
import initializeDB from "./database"
import initializeS3, { uploadImage, deleteImage, deleteImages } from "./aws-s3"
import { initialize, create, update, deactivate, remove, signIn, signOutUser, signInViaGoogle } from "./auth"

export { HAJAR_LIST_TRANSPORT_ARRAY } from './email'

type HajarConfigParameters = {
  accessKeyId: string,
  secretAccessKey: string,
  Bucket: string,
  firebaseConfig: string,
  OOBCODE: string,
  mongodb_name: string,
  mongodb_user: string,
  mongodb_password: string,
  mongodb_options: any,
};

declare module global{
  let _config: HajarConfigParameters
  let _auth: any
  let _provider: any
}


/*
example use
Hajar.Database()
Hajar.Invoice()
Hajar.Mail.setupEmail()
Hajar.Mail.sendEmail()
*/
let Hajar = {
  Config: updateOptions,
  Database: initializeDB,
  Models: {
    Qawaim: models
  },
  Invoice: invoiceCreate,
  Mail: { SetupEmail: setupEmail, SendEmail: sendEmail },
  //will be added next release
  /*Payment: {
    Wallet: setupWallet,
    Payfort: setupAmazonPayments,
    Paypal: setupPaypal,
    GooglePay: setupGooglePay,
  },*/
  Auth: {
    SetupFirebase: initialize,
    CreateUser: create,
    UpdateUser: update,
    DeactivateUser: deactivate,
    DeleteUser: remove,
    SignIn: signIn,
    SignInViaGoogle: signInViaGoogle,
    SignOut: signOutUser,
  },
  S3: {
    UploadImage: uploadImage,
    DeleteImage: deleteImage,
    DeleteImages: deleteImages
  },
  Schedule: setupCron
}

export default Hajar
