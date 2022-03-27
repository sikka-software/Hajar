import initializeDB from "./database";
import invoiceCreate from "./invoice";
import { setup, send } from "./email";
import { setupWallet, setupAmazonPayments, setupPaypal, setupGooglePay } from "./payments";
import { initialize, create, update, deactivate, remove, signIn, signOutUser } from "./auth";
import Config from "./config";

declare global {
  var __config: any;
}

/*
example use
Hajar.Database()
Hajar.Invoice()
Hajar.Mail.setupEmail()
Hajar.Mail.sendEmail()
*/
let Hajar = {
  HajarConfig: Config,
  Database: initializeDB,
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
    signOut: signOutUser,
  }
}

export default Hajar;
