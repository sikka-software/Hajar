const express = require("express");
const app = express();
const braintree = require("braintree");
const axios = require("axios").default;

async function setupWallet() {
  console.log("setting up User Wallet");
}
/*
dataPayfort = {
access_code REQUIRED
amount REQUIRED
app_framework
app_plugin
app_plugin_version
app_programming
app_ver
command: "PURCHASE",
currency REQUIRED
customer_email REQUIRED
customer_ip REQUIRED
customer_name REQUIRED
eci
language REQUIRED
merchant_reference REQUIRED
remember_me
return_url
token_name
callbackSuccess: function(result, data)
callbackSuccess3DS: function(result, data)
callbackError: function(result, data)
}
*/
async function setupAmazonPayments(dataPayfort) {
  if (!dataPayfort.merchant_reference) {
    new Error("Missing Required Parameters.");
  }

  if (
    __config &&
    __config.HAJAR_PAYEMENTS_PARAMETERS &&
    __config.HAJAR_PAYEMENTS_PARAMETERS["payfort"] &&
    __config.HAJAR_PAYEMENTS_PARAMETERS["payfort"].access_code &&
    __config.HAJAR_PAYEMENTS_PARAMETERS["payfort"].merchant_identifier &&
    __config.HAJAR_PAYEMENTS_PARAMETERS["payfort"].sha_request_passphrase
  ) {
    // Calculate request signature
    let shaString = "";

    // array request
    let arrData = {
      access_code: __config.HAJAR_PAYEMENTS_PARAMETERS["payfort"].access_code,
      amount: dataPayfort.amount,
      app_framework: "REACTJS",
      app_plugin: "SIKKA ADMIN",
      app_plugin_version: "v0.1.0",
      app_programming: "JS",
      app_ver: "v17.0.2",
      command: "PURCHASE",
      currency: dataPayfort.currency,
      customer_email: dataPayfort.customer_email,
      customer_ip: dataPayfort.customer_ip,
      customer_name: dataPayfort.customer_name,
      eci: "ECOMMERCE",
      language: dataPayfort.language,
      merchant_identifier:
        __config.HAJAR_PAYEMENTS_PARAMETERS["payfort"].merchant_identifier,
      merchant_reference: dataPayfort.merchant_reference,
      remember_me: dataPayfort.remember_me,
      return_url: dataPayfort.return_url,
      token_name: dataPayfort.token_name,
    };
    shaString = `${__config.HAJAR_PAYEMENTS_PARAMETERS["payfort"].sha_request_passphrase}${shaString}`;
    for (const [key, value] of Object.entries(arrData)) {
      shaString = `${shaString}${key}=${value}`;
    }
    shaString = `${shaString}${__config.HAJAR_PAYEMENTS_PARAMETERS["payfort"].sha_request_passphrase}`;
    // your request signature
    let newsignature = crypto
      .createHash("sha256")
      .update(shaString)
      .digest("hex");
    const data = {
      merchant_identifier:
        __config.HAJAR_PAYEMENTS_PARAMETERS["payfort"].merchant_identifier,
      access_code: __config.HAJAR_PAYEMENTS_PARAMETERS["payfort"].access_code,
      merchant_reference: dataPayfort.merchant_reference,
      language: dataPayfort.language,
      command: "PURCHASE",
      customer_ip: dataPayfort.customer_ip,
      amount: dataPayfort.amount,
      currency: dataPayfort.currency,
      customer_email: dataPayfort.customer_email,
      return_url: dataPayfort.return_url,
      token_name: dataPayfort.token_name,
      customer_name: dataPayfort.customer_name,
      eci: "ECOMMERCE",
      remember_me: dataPayfort.remember_me,
      app_programming: "JS",
      app_framework: "REACTJS",
      app_ver: "v17.0.2",
      app_plugin: "Hajar",
      app_plugin_version: "v0.1.0",
      signature: newsignature,
    };
    try {
      let paymentInfo = await axios.post(
        `${process.env.SIKKA_SOFTWARE_PAYFOR_ENVIRONMENT_URL_API}`,
        data
      );
      if (
        paymentInfo.data.acquirer_response_message === "Approved" &&
        !paymentInfo.data["3ds_url"]
      ) {
        //callback here for example send email or create invoice
        if (
          dataPayfort.callbackSuccess &&
          typeof dataPayfort.callbackSuccess === "function"
        ) {
          dataPayfort.callbackSuccess(result, dataPayfort);
        }
      }
      if (
        dataPayfort.callbackSuccess3DS &&
        typeof dataPayfort.callbackSuccess3DS === "function"
      ) {
        dataPayfort.callbackSuccess3DS(paymentInfo, dataPayfort);
      }
      //callback here for example redirect user to 3ds
    } catch (err) {
      if (
        dataPayfort.callbackError &&
        typeof dataPayfort.callbackError === "function"
      ) {
        dataPayfort.callbackError(err, dataPayfort);
      }
    }
  }
}

async function setupPaypal() {

}
/*
dataGooglePay = {
nonce
deviceDataClient
customerOrderId
billing_address:{
  firstName
  lastName
  streetAddress
  extendedAddress
  locality
  region
  postalCode
  countryName
}
amount
callback: function(result, data)
}
*/
async function setupGooglePay(GooglePayData) {
  if (
    !GooglePayData.nonce ||
    !GooglePayData.deviceDataClient ||
    !GooglePayData.billing_address ||
    !GooglePayData.amount ||
    !GooglePayData.currency
  ) {
    new Error("Missing Required Parameters.");
  }

  const amount = parseFloat(GooglePayData.amount);
  const nonce = GooglePayData.nonce;
  const deviceDataClient = GooglePayData.deviceDataClient;
  const customerOrderId = GooglePayData.customerOrderId;
  const address = GooglePayData.billing_address;

  if (
    __config &&
    __config.HAJAR_PAYEMENTS_PARAMETERS &&
    __config.HAJAR_PAYEMENTS_PARAMETERS["googlepay"] &&
    __config.HAJAR_PAYEMENTS_PARAMETERS["googlepay"].environment &&
    __config.HAJAR_PAYEMENTS_PARAMETERS["googlepay"].merchantId &&
    __config.HAJAR_PAYEMENTS_PARAMETERS["googlepay"].publicKey &&
    __config.HAJAR_PAYEMENTS_PARAMETERS["googlepay"].privateKey
  ) {
    const environment =
      __config.HAJAR_PAYEMENTS_PARAMETERS["googlepay"].environment === "TEST"
        ? braintree.Environment.Sandbox
        : braintree.Environment.Sandbox.Production;
    const gateway = new braintree.BraintreeGateway({
      environment: environment,
      merchantId: __config.HAJAR_PAYEMENTS_PARAMETERS["googlepay"].merchantId,
      publicKey: __config.HAJAR_PAYEMENTS_PARAMETERS["googlepay"].publicKey,
      privateKey: __config.HAJAR_PAYEMENTS_PARAMETERS["googlepay"].privateKey,
    });
    gateway.transaction
      .sale({
        amount: amount,
        paymentMethodNonce: nonce,
        deviceData: deviceDataClient,
        orderId: customerOrderId,
        options: { submitForSettlement: true },
        billing: {
          firstName: address?.first_name,
          lastName: address?.last_name,
          streetAddress: address?.address_line_1,
          extendedAddress: address?.address_line_2,
          locality: address?.city,
          region: address?.state,
          postalCode: address?.zip_code,
          countryName: address?.country,
        },
      })
      .then((result) => {
        if (
          GooglePayData.callback &&
          typeof GooglePayData.callback === "function"
        ) {
          GooglePayData.callback(result, GooglePayData);
        }
      });
  } else {
    new Error("Missing Required Parameters.");
  }
}

module.exports = {
  setupWallet: setupWallet,
  setupAmazonPayments: setupAmazonPayments,
  setupPaypal: setupPaypal,
  setupGooglePay: setupGooglePay,
};
