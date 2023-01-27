import { LIB_NAME, LIB_VERSION } from "./constants";
import { setupEmail, sendEmail, sendEmailVerify } from "./core/email";
import {
  initializeS3,
  uploadImage,
  deleteImage,
  deleteImages,
} from "./core/aws-s3";
import {
  initialize,
  create,
  update,
  deactivate,
  remove,
  signIn,
  signOutUser,
  signInViaGoogle,
} from "./core/auth";
import updateOptions from "./core/options";
import setupCron from "./core/cron";
import initializeMongoDB from "./core/database/index";
import { createInvoice } from "./core/invoice";
import ReferralShema from "./core/referral/graphql/schema/index";
import {
  GenerateUniqueReferalCode,
  ReferralModels,
} from "./core/referral/index";
import {
  createReferral,
  updateReferral,
  deleteReferral,
  referral,
  referrals,
  createReferralAnalytics,
  updateReferralAnalytics,
  deleteReferralAnalytics,
  referralAnalytics,
  referralsAnalytics,
} from "./core/referral/graphql/resolvers/index";
import addModel from "./core/database/models";

import { CreateSchema } from "./core/schema";
global._config;
global._auth;
global._provider;
global.SIKKA_SOFTWARE_APPLEPAY_PAYFOR_SHA_REQUEST_PHRASE;
global.SIKKA_SOFTWARE_APPLEPAY_PAYFOR_SHA_RESPONSE_PHRASE;
global.SIKKA_SOFTWARE_PAYFOR_SHA_REQUEST_PHRASE;
global.SIKKA_SOFTWARE_PAYFOR_SHA_RESPONSE_PHRASE;

/*
example use
Hajar.Database()
Hajar.Invoice()
Hajar.Mail.setupEmail()
Hajar.Mail.sendEmail()
*/
const Hajar = {
  _name: LIB_NAME,
  version: LIB_VERSION,
  Config: updateOptions,
  Database: {
    initialize: initializeMongoDB,
    model: addModel,
  },
  Invoice: createInvoice,
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
    SignOut: signOutUser,
  },
  S3: {
    InitializeS3: initializeS3,
    UploadImage: uploadImage,
    DeleteImage: deleteImage,
    DeleteImages: deleteImages,
  },
  Schedule: setupCron,
  Referral: {
    Graphql: {
      Schema: ReferralShema,
      Resolvers: {
        CreateReferral: createReferral,
        UpdateReferral: updateReferral,
        DeleteReferral: deleteReferral,
        OneReferral: referral,
        AllReferrals: referrals,
        CreateReferralAnalytics: createReferralAnalytics,
        UpdateReferralAnalytics: updateReferralAnalytics,
        DeleteReferralAnalytics: deleteReferralAnalytics,
        ReferralAnalytics: referralAnalytics,
        ReferralsAnalytics: referralsAnalytics,
      },
    },
    GenerateUniqueCode: GenerateUniqueReferalCode,
    Models: ReferralModels,
  },
  Schema: CreateSchema,
};

export default Hajar;
