import { Menu, Wallet } from "./models/qawaim";
const Invoice = require("../models/invoice");
const Transaction = require("../models/transactions");
const axios = require("axios").default;
const qs = require("qs");
const crypto = require("crypto");

export function getPrice(cycle: any, currency: any, pack: any) {
  let price = 0;
  if (cycle === "annually") {
    if (currency === "usd") {
      price = pack?.price_annual_usd;
    } else {
      price = pack?.price_annual_sar;
    }
  } else if (cycle === "3-months") {
    if (currency === "usd") {
      price = pack?.price_3months_usd;
    } else {
      price = pack?.price_3months_sar;
    }
  } else if (cycle === "6-months") {
    if (currency === "usd") {
      price = pack?.price_6months_usd;
    } else {
      price = pack?.price_6months_sar;
    }
  } else {
    if (currency === "usd") {
      price = pack?.price_monthly_usd;
    } else {
      price = pack?.price_monthly_sar;
    }
  }

  return price;
}

export function formatCurrency(cents: any, currency: any) {
  if (currency == "SAR") {
    return cents + " " + currency;
  }
  return currency + " " + cents;
}

export async function resetMenu(pack: any, user_id: string) {
  //reset menu styles only for downgrade pack free
  if (!pack.price_monthly_sar || pack.price_monthly_sar == 0) {
    await Menu.find({ menu_user: user_id }).then((menus: any) => {
      menus.map(async (menu: any) => {
        const menuData = {
          background_color: "#E2E2E2",
          primary_color: "#0843E1",
          item_color: "#ffffff",
          categories_color: "#ffffff",
          border_radius: 10
        };
        await Menu.findByIdAndUpdate(menu._id, menuData, {
          new: true
        });
      });
    });
  }
}

export async function unpublishMenu(pack: any, user_id: string) {
  const allMenusUser = await Menu.find({
    menu_user: user_id,
    menu_live: true
  });
  const menu_count = allMenusUser.length;
  console.log("menu_limit=", pack.menu_limit);
  console.log("menu_count=", menu_count);
  if (pack.menu_limit < menu_count) {
    await Menu.find({ menu_user: user_id, menu_live: true })
      .sort({ createdAt: -1 })
      .limit(menu_count - pack.menu_limit)
      .then((menus) => {
        console.log("menus=", menus);
        menus.map(async (menu) => {
          await Menu.findByIdAndUpdate(
            menu._id,
            { menu_live: false },
            {
              new: true
            }
          );
        });
      });
  }
}

export async function getWalletAmount(user_id: string) {
  const wallet_user = await Wallet.find({ user_id: user_id });
  let total_wallet: number = 0.0;
  if (wallet_user) {
    wallet_user.map((wallet: any) => {
      total_wallet = total_wallet + wallet.amount_debit + wallet.amount_credit;
    });
  }
  return total_wallet;
}

/**
 * Generate fort signature
 */
export function generate_signature(arr_data: any, sign_type = "request", type = "regular") {
  let sha_string: any = "";
  let hash_algorithm: any = "";
  let arrDataSorted: {} = Object.keys(arr_data)
    .sort()
    .reduce(
      (acc, key) => ({
        ...acc,
        [key]: arr_data[key]
      }),
      {}
    );
  for (const [key, value] of Object.entries(arrDataSorted)) {
    if ("apple_header" === key || "apple_paymentMethod" === key) {
      sha_string = `${sha_string}${key}={`;
      for (const [k, v] of Object.entries(typeof value)) {
        sha_string = `${sha_string}${k}=${v}, `;
      }
      sha_string = sha_string.replace(new RegExp("[, ]*$"), "");
      sha_string = `${sha_string}` + "}";
    } else {
      sha_string = `${sha_string}${key}=${value}`;
    }
  }
  let hmac_key: any = "";
  if ("apple_pay" === type) {
    if ("request" === sign_type) {
      sha_string =
        process.env.SIKKA_SOFTWARE_APPLEPAY_PAYFOR_SHA_REQUEST_PHRASE +
        sha_string +
        process.env.SIKKA_SOFTWARE_APPLEPAY_PAYFOR_SHA_REQUEST_PHRASE;
      hmac_key = process.env.SIKKA_SOFTWARE_APPLEPAY_PAYFOR_SHA_REQUEST_PHRASE;
    } else {
      sha_string =
        process.env.SIKKA_SOFTWARE_APPLEPAY_PAYFOR_SHA_RESPONSE_PHRASE +
        sha_string +
        process.env.SIKKA_SOFTWARE_APPLEPAY_PAYFOR_SHA_RESPONSE_PHRASE;
      hmac_key = process.env.SIKKA_SOFTWARE_APPLEPAY_PAYFOR_SHA_RESPONSE_PHRASE;
    }
  } else {
    if ("request" === sign_type) {
      sha_string =
        process.env.SIKKA_SOFTWARE_PAYFOR_SHA_REQUEST_PHRASE +
        sha_string +
        process.env.SIKKA_SOFTWARE_PAYFOR_SHA_REQUEST_PHRASE;
      hmac_key = process.env.SIKKA_SOFTWARE_PAYFOR_SHA_REQUEST_PHRASE;
    } else {
      sha_string =
        process.env.SIKKA_SOFTWARE_PAYFOR_SHA_RESPONSE_PHRASE +
        sha_string +
        process.env.SIKKA_SOFTWARE_PAYFOR_SHA_RESPONSE_PHRASE;
      hmac_key = process.env.SIKKA_SOFTWARE_PAYFOR_SHA_RESPONSE_PHRASE;
    }
  }
  // your request signature
  let signature = crypto.createHash("sha256").update(sha_string).digest("hex");
  return signature;
}

export function aps_notify(response_params: any, order_id: any, integration_type: any) {

}

/**
 * Handle fort response
 */
async function handle_fort_response(
  req: any,
  res: any,
  response_params: any,
  response_mode: any,
  integration_type: any
) {
  try {
    let APS_ONHOLD_RESPONSE_CODES: any = [];
    let success = false;
    let response_message = "Invalid Fort Parameters";
    let aps_error_log = "APS handler ERROR=\n\n" + JSON.stringify(
      response_params
    );
    if (!response_params) {
      console.log(aps_error_log);
      throw response_message;
    }

    if (!response_params?.merchant_reference) {
      console.log(aps_error_log);
      throw response_message;
    }

    let order_id = response_params.merchant_reference;
    //$this->aps_order->load_order( $order_id );

    let excluded_params = [
      "signature",
      "wc-ajax",
      "wc-api",
      "APS_fort",
      "integration_type",
      "WordApp_launch",
      "WordApp_mobile_site",
      "WordApp_demo",
      "WordApp_demo",
      "lang"
    ];

    let response_type = response_params.response_message;
    let signature = response_params.signature;
    let response_order_id = response_params.merchant_reference;
    let response_status = response_params.status ? response_params.status : "";
    let response_code = response_params.response_code
      ? response_params.response_code
      : "";
    let response_status_message = response_type;

    let response_gateway_params = response_params;

    let invoiceobj = await Invoice.findOne({
      _id: response_params.merchant_reference
    });
    let transaction = await Transaction.findOne({
      transaction_invoice_id: response_params.merchant_reference,
      transaction_status: "waiting_payment"
    });

    for (const [key, value] of Object.entries(response_gateway_params)) {
      if (excluded_params.includes(key)) {
        delete response_gateway_params[key];
      }
    }

    let signature_type =
      response_params?.digital_wallet &&
        "APPLE_PAY" === response_params?.digital_wallet
        ? "apple_pay"
        : "regular";

    //check webhook call for apple pay
    if (
      response_params?.command &&
      ["REFUND", "CAPTURE", "VOID_AUTHORIZATION"].includes(
        response_params?.command
      )
    ) {
      if (
        response_params?.access_code &&
        response_params?.access_code ==
        process.env.SIKKA_SOFTWARE_APPLEPAY_PAYFOR_ACCESS_TOKEN
      ) {
        signature_type = "apple_pay";
      }
    }

    let response_signature = generate_signature(
      response_gateway_params,
      "response",
      signature_type
    );

    // check the signature
    if (
      response_signature.toLowerCase() !== signature.toLowerCase() &&
      "VALU" !== response_params?.payment_option
    ) {
      response_message = "Invalid Singature";
      // There is a problem in the response we got
      //update transaction with status failed
      let aps_invalid_signature_log =
        "APS Response invalid signature ERROR\n\n Original array : " +
        JSON.stringify(response_params) +
        "\n\n\n Final array : " +
        JSON.stringify(response_gateway_params);
      console.log(aps_invalid_signature_log);
      return true;
    }
    if ("00072" === response_code) {
      response_message = "Transaction Cancelled";
      //update transaction with status failed
      console.log(aps_error_log);
      throw response_message;
    }
    if ("14000" === response_code || "02000" === response_code) {
      //update transaction with status completed
    } else if (APS_ONHOLD_RESPONSE_CODES.includes(response_code)) {
      //update transaction with status failed
      console.log(aps_error_log);
    } else if ("04000" === response_code || "02000" === response_code) {
      //update transaction with status completed
    } else if ("06000" === response_code) {
      //here we sont have refund
      throw "Refund not exist";
    } else if ("08000" === response_code || "02000" === response_code) {
      //update transaction with status failed
    } else if ("18000" === response_code || "18063" === response_code) {
      let checkoutInfo = await axios.post(
        `${process.env.SIKKA_API_URL}/payfort/payment/finalize`,
        qs.stringify(response_params)
      );
      let aps_notify_params = checkoutInfo.data.reponse;
      let notify_response_message = aps_notify_params?.response_message;
      let notify_code = aps_notify_params?.response_code;
      if ("20064" === notify_code || "14000" === notify_code) {
        if (aps_notify_params["3ds_url"]) {
          if ("standard_checkout" == integration_type) {
            console.log("JS 3ds_url redirect=", aps_notify_params["3ds_url"]);
            res
              .writeHead(301, {
                Location: aps_notify_params["3ds_url"]
              })
              .end();
          } else {
            console.log("3ds_url redirect=", aps_notify_params["3ds_url"]);
            res
              .writeHead(301, {
                Location: aps_notify_params["3ds_url"]
              })
              .end();
          }
        } else {
          //update transaction with status completed
        }
      } else if (APS_ONHOLD_RESPONSE_CODES.includes(notify_code)) {
        //update transaction with status failed
        aps_error_log =
          "APS handler ERROR:\n\n" + JSON.stringify(aps_notify_params);
        console.log(aps_error_log);
      } else {
        //update transaction with status failed
        aps_error_log =
          "APS handler ERROR-\n\n" + JSON.stringify(aps_notify_params);
        console.log(aps_error_log);
        throw notify_response_message;
      }
    } else if ("18062" === response_code) {
      let aps_notify_params: any = aps_notify(
        response_params,
        order_id,
        integration_type
      );

      let notify_response_message = aps_notify_params?.response_message;
      let notify_code = aps_notify_params.response_code;
      if ("20064" === notify_code || "14000" === notify_code) {
        if (aps_notify_params["3ds_url"]) {
          console.log("3ds_url redirect :=", aps_notify_params["3ds_url"]);
          res
            .writeHead(301, {
              Location: aps_notify_params["3ds_url"]
            })
            .end();
        } else {
          //update transaction with status completed
        }
      } else if (APS_ONHOLD_RESPONSE_CODES.includes(notify_code)) {
        //update transaction with status failed
        aps_error_log =
          "APS handler ERROR:\n\n" + JSON.stringify(aps_notify_params);
        console.log(aps_error_log);
      } else {
        //update transaction with status failed
        aps_error_log =
          "APS handler ERROR-\n\n" + JSON.stringify(aps_notify_params);
        console.log(aps_error_log);
        throw notify_response_message;
      }
    } else {
      //update transaction with status failed
      console.log(aps_error_log);
      throw response_status_message;
    }
  } catch (err) {
    return false;
  }
  return true;
}

/**
 * APS handle Response
 */
export async function aps_handle_response(
  req: any,
  res: any,
  response_mode = "online",
  integration_type = "redirection",
  is_merchant_call = false
) {
  let post = req?.body ? req?.body : {};
  let get = req?.params ? req?.params : {};
  let response_params = Object.assign(post, get);
  console.log("response_params=", response_params);
  if (!response_params) {
    console.log("webhook params is empty");
  }
  let redirect_url = "";
  if (response_params?.merchant_reference) {
    let success = await handle_fort_response(
      req,
      res,
      response_params,
      response_mode,
      integration_type
    );
    if (success) {
      redirect_url = `${process.env.SIKKA_CHEKOUT_USER_PORTAL_URL}/confirmation/${response_params?.merchant_reference}`;
    } else {
      redirect_url = `${process.env.SIKKA_CHEKOUT_USER_PORTAL_URL}/${response_params?.merchant_reference}`;
    }
    if ("offline" === response_mode) {
      console.log("Webhook processed");
      res.socket.write("HTTP/1.1 200 OK");
    } else {
      let order = await Invoice.findOne({
        _id: response_params?.merchant_reference
      });
      if (order.invoice_payment_status === "completed") {
        redirect_url = `${process.env.SIKKA_CHEKOUT_USER_PORTAL_URL}/confirmation/${response_params?.merchant_reference}`;
      }

      res
        .writeHead(301, {
          Location: redirect_url
        })
        .end();
    }
  }
}

export async function validateEmailLink(){
  console.log("validate link")
}