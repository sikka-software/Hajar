import axios from "axios";
import sha256 from "crypto-js/sha256";
import Hajarimport from "./load";

let braintree: any = Hajarimport("braintree", "braintree-web");

export async function setupWallet() {
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

type CallbackPayfortSuccess = (result: any, params: HajarPayfortParameters) => void
type callbackPayfortSuccess3DS = (result: any, params: HajarPayfortParameters) => void
type callbackPayfortError = (result: any, params: HajarPayfortParameters) => void

type HajarPayfortParameters = {
  token_name: string,
  return_url: string,
  remember_me: string,
  language: string,
  customer_name: string,
  customer_email: string,
  customer_ip: string,
  amount: string,
  currency: string,
  merchant_reference: string,
  access_code: string,
  merchant_identifier: string,
  sha_request_passphrase: string,
  environment_url: string,
  callbackSuccess: CallbackPayfortSuccess,
  callbackSuccess3DS: callbackPayfortSuccess3DS
  callbackError: callbackPayfortError
};

export async function setupAmazonPayments(params: HajarPayfortParameters) {
  if (!params.merchant_reference) {
    new Error("Missing Required Parameters.");
  }

  if (
    params &&
    params.access_code &&
    params.merchant_identifier &&
    params.sha_request_passphrase
  ) {
    // Calculate request signature
    let shaString = "";

    // array request
    let arrData = {
      access_code: params.access_code,
      amount: params.amount,
      app_framework: "REACTJS",
      app_plugin: "SIKKA ADMIN",
      app_plugin_version: "v0.1.0",
      app_programming: "JS",
      app_ver: "v17.0.2",
      command: "PURCHASE",
      currency: params.currency,
      customer_email: params.customer_email,
      customer_ip: params.customer_ip,
      customer_name: params.customer_name,
      eci: "ECOMMERCE",
      language: params.language,
      merchant_identifier:
        params.merchant_identifier,
      merchant_reference: params.merchant_reference,
      remember_me: params.remember_me,
      return_url: params.return_url,
      token_name: params.token_name,
    };
    shaString = `${params.sha_request_passphrase}${shaString}`;
    for (const [key, value] of Object.entries(arrData)) {
      shaString = `${shaString}${key}=${value}`;
    }
    shaString = `${shaString}${params.sha_request_passphrase}`;
    // your request signature
    let newsignature = sha256(shaString);
    const data = {
      merchant_identifier:
        params.merchant_identifier,
      access_code: params.access_code,
      merchant_reference: params.merchant_reference,
      language: params.language,
      command: "PURCHASE",
      customer_ip: params.customer_ip,
      amount: params.amount,
      currency: params.currency,
      customer_email: params.customer_email,
      return_url: params.return_url,
      token_name: params.token_name,
      customer_name: params.customer_name,
      eci: "ECOMMERCE",
      remember_me: params.remember_me,
      app_programming: "JS",
      app_framework: "REACTJS",
      app_ver: "v17.0.2",
      app_plugin: "Hajar",
      app_plugin_version: "v0.1.0",
      signature: newsignature,
    };
    try {
      let paymentInfo = await axios.post(
        `${params.environment_url}`,
        data
      );
      if (
        paymentInfo.data.acquirer_response_message === "Approved" &&
        !paymentInfo.data["3ds_url"]
      ) {
        //callback here for example send email or create invoice
        params.callbackSuccess(paymentInfo, params);
      }
      params.callbackSuccess3DS(paymentInfo, params);
      //callback here for example redirect user to 3ds
    } catch (err) {
      params.callbackError(err, params);
    }
  }
}

export async function setupPaypal() {

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
type CallbackGooglePaySuccess = (result: any, params: HajarGooglePayParameters) => void

type HajarGooglePayParameters = {
  nonce: string,
  deviceDataClient: string,
  billing_address: any,
  amount: string,
  currency: string,
  customerOrderId: string,
  environment: string,
  merchantId: string,
  publicKey: string,
  privateKey: string,
  callback: CallbackGooglePaySuccess,
};
export async function setupGooglePay(params: HajarGooglePayParameters) {
  if (
    !params.nonce ||
    !params.deviceDataClient ||
    !params.billing_address ||
    !params.amount ||
    !params.currency
  ) {
    new Error("Missing Required Parameters.");
  }

  const amount = params.amount;
  const nonce = params.nonce;
  const deviceDataClient = params.deviceDataClient;
  const customerOrderId = params.customerOrderId;
  const address: any = params.billing_address;

  if (
    params.environment &&
    params.merchantId &&
    params.publicKey &&
    params.privateKey
  ) {
    const environment =
      params.environment === "TEST"
        ? braintree.Environment.Sandbox
        : braintree.Environment.Production;
    const gateway = new braintree.BraintreeGateway({
      environment: environment,
      merchantId: params.merchantId,
      publicKey: params.publicKey,
      privateKey: params.privateKey,
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
      .then((result: any) => {
        params.callback(result, params);
      });
  } else {
    new Error("Missing Required Parameters.");
  }
}
