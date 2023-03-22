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
  signIn,
  signOutUser,
  signInViaGoogle,
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

  // This will be the authentication part

  HajarAuth: {
    HajarAuth: HajarAuth,
    Singin: HajarAuth.Singin,
    Singup: HajarAuth.Singup,
    getUserByToken: HajarAuth.getUserByToken,
  },
  /*  HajarRoles: {
    HajarRoles: HajarRoles,
    createRole: HajarRoles.createRole,
    roleToUser: HajarRoles.roleToUser,
    updateRole: HajarRoles.updateRole,
    deleteRole: HajarRoles.deleteRole,
    addPermissionToRole: HajarRoles.addPermissionToRole,
    removePermissionFromRole: HajarRoles.removePermissionFromRole,
    updatePermission: HajarRoles.updatePermission,
  },
  HajarPermissions: {
    HajarPermissions: HajarPermissions,
    createPermission: HajarPermissions.createPermission,
    updatePermission: HajarPermissions.updatePermission,
    deletePermission: HajarPermissions.deletePermission,
    getPermission: HajarPermissions.getPermission,
    getPermissions: HajarPermissions.getPermissions,
  }, */
};

export default Hajar;
