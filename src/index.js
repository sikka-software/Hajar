/*
  /*-----@Mansour imports /*-----
*/
const dotenv = require("dotenv");
dotenv.config();
const createResolvers = require("../src/core/resolver");
const CreateSchema = require("../src/core/schema");
/*------*/
const { LIB_NAME, LIB_VERSION } = require("../src/constants");
const { setupEmail, sendEmail, sendEmailVerify } = require("../src/core/email");
const generateModelsFromJSON = require("../src/core/models/index");

const {
  initializeS3,
  uploadImage,
  deleteImage,
  deleteImages,
} = require("../src/core/aws-s3");
const {
  initialize,
  create,
  update,
  deactivate,
  remove,
  login,
  logoutUser,
  loginViaGoogle,
} = require("../src/core/auth");
const { updateOptions } = require("../src/core/options");
const { setupCron } = require("../src/core/cron");
const { setupDatabase } = require("../src/core/database/index");
const { createInvoice } = require("../src/core/invoice");
const ReferralShema = require("../src/core/referral/graphql/schema/index");
const {
  GenerateUniqueReferalCode,
  ReferralModels,
} = require("../src/core/referral/index");
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
} = require("../src/core/referral/graphql/resolvers/index");

const { addModel } = require("../src/core/database/models");
const {
  initializeStripe,
  processPayment,
  generatetoken,
} = require("../src/core/stripe");

const HajarAuth = require("../src/core/authentication/index");
const HajarMail = require("../src/core/email");
let auth = new HajarAuth()

console.log("hajar auth is ", auth);
/* const HajarRoles = require("../src/core/authentication/roles/index");
const HajarPermissions = require("../src/core/authentication/permissions/index"); */
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
    Login: login,
    LoginViaGoogle: loginViaGoogle,
    Logout: logoutUser,
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

  HajarAuth: {
    HajarAuth: HajarAuth,
    Singin: HajarAuth.Singin,
    Singup: HajarAuth.Singup,
    getUserByToken: HajarAuth.getUserByToken,
  },
  HajarMail: {
    HajarMail: HajarMail,
    SetupEmail: HajarMail.SetupEmail,
    SendEmail: HajarMail.SendEmail,
    SendEmailVerify: sendEmailVerify,
  },
  Models: {
    generateModelsFromJSON: generateModelsFromJSON,
  },
};

export default Hajar;
// module.exports = Hajar;
