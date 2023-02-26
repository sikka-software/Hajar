/*
  /*-----@Mansour imports /*-----
*/
const dotenv = require("dotenv");
dotenv.config();
const { createResolvers } = require("./core/resolver");
const { CreateSchema } = require("./core/schema");
/*------*/
const { LIB_NAME, LIB_VERSION } = require("./constants");
const { setupEmail, sendEmail, sendEmailVerify } = require("./core/email");
const {
  initializeS3,
  uploadImage,
  deleteImage,
  deleteImages,
} = require("./core/aws-s3");
const {
  initialize,
  create,
  update,
  deactivate,
  remove,
  signIn,
  signOutUser,
  signInViaGoogle,
} = require("./core/auth");
const updateOptions = require("./core/options");
const setupCron = require("./core/cron");
const { setupDatabase } = require("./core/database/index");
const { createInvoice } = require("./core/invoice");
const ReferralShema = require("./core/referral/graphql/schema/index");
const {
  GenerateUniqueReferalCode,
  ReferralModels,
} = require("./core/referral/index");
const {
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
} = require("./core/referral/graphql/resolvers/index");

const addModel = require("./core/database/models");
const {
  initializeStripe,
  processPayment,
  generatetoken,
} = require("./core/stripe");

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
    initialize: setupDatabase,
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
  Resolver: createResolvers,

  Stripe: {
    initializeStripe: initializeStripe,
    ProcessPayment: processPayment,
    generatetoken: generatetoken,
  },
};

export default Hajar;
