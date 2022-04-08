import initializeDB from "./database";
import invoiceCreate from "./invoice";
import { setup, send } from "./email";
import { setupWallet, setupAmazonPayments, setupPaypal, setupGooglePay } from "./payments";
import { initialize, create, update, deactivate, remove, signIn, signOutUser, signInViaGoogle } from "./auth";
import Config from "./config";
import * as models from "./ModelsQawaim";

declare global {
  var __config: any;
  var __auth: any;
  var __provider: any;
}

/*
example use
Hajar.Database()
Hajar.Invoice()
Hajar.Mail.setupEmail()
Hajar.Mail.sendEmail()
*/
let Hajar = {
  Config: Config,
  Database: initializeDB,
  Models: {
    Qawaim: models
  },
  Invoice: invoiceCreate,
  Mail: { setupEmail: setup, sendEmail: send },
  Payment: {
    Wallet: setupWallet,
    Payfort: setupAmazonPayments,
    Paypal: setupPaypal,
    GooglePay: setupGooglePay,
  },
  Auth: {
    setupFirebase: initialize,
    createUser: create,
    updateUser: update,
    deactivateUser: deactivate,
    deleteUser: remove,
    signIn: signIn,
    signInViaGoogle: signInViaGoogle,
    signOut: signOutUser,
  }
}

export default Hajar;
