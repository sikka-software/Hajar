import Hajarimport from "../load";
import axios from "axios";
import crypto from "crypto";
import { aps_handle_response } from "../helpers";

export async function setupPayfortAPI() {
    if ((typeof process !== 'undefined') && (process.release.name === 'node')) {
        const express = await Hajarimport("express", "");
        const https = await Hajarimport("https", "");
        const fs = await Hajarimport("fs", "");
        const app = express();
        app.post("/payfort/payment/finalizePurchase", async (req: any, res: any) => {
            console.log("req.body=", req.body);
            if (
                !req.body.amount ||
                !req.body.response_code ||
                !req.body.card_number ||
                !req.body.card_holder_name ||
                !req.body.signature ||
                !req.body.merchant_identifier ||
                !req.body.access_code ||
                !req.body.payment_option ||
                !req.body.expiry_date ||
                !req.body.customer_ip ||
                !req.body.language ||
                !req.body.eci ||
                !req.body.fort_id ||
                !req.body.command ||
                !req.body.response_message ||
                !req.body.merchant_reference ||
                !req.body.authorization_code ||
                !req.body.customer_email ||
                !req.body.currency ||
                !req.body.customer_name ||
                !req.body.remember_me ||
                !req.body.acquirer_response_code ||
                !req.body.status
            ) {
                return res.status(200).json({ ok: false, error: "Missing required Data" });
            }

            console.log("req.body2=", req.body);

            let amount = req.body.amount;
            let response_code = req.body.response_code;
            let card_number = req.body.card_number;
            let card_holder_name = req.body.card_holder_name;
            let signature = req.body.signature;
            let merchant_identifier = req.body.merchant_identifier;
            let access_code = req.body.access_code;
            let payment_option = req.body.payment_option;
            let expiry_date = req.body.expiry_date;
            let customer_ip = req.body.customer_ip;
            let language = req.body.language;
            let eci = req.body.eci;
            let fort_id = req.body.fort_id;
            let command = req.body.command;
            let response_message = req.body?.response_message;
            let merchant_reference = req.body.merchant_reference;
            let customer_email = req.body.customer_email;
            let currency = req.body.currency;
            let customer_name = req.body.customer_name;
            let remember_me = req.body.remember_me;
            let acquirer_response_code = req.body.acquirer_response_code;
            let status = req.body.status;


        });


        app.post("/payfort/payment/finalize", async (req: any , res: any) => {
            console.log("req.body=", req.body);
            if (!req.body.merchant_reference) {
                return res.status(200).json({ ok: false, error: "Missing required Data" });
            }

            console.log("req.body2=", req.body);

            let response_code = req.body.response_code;
            let card_number = req.body.card_number;
            let card_holder_name = req.body.card_holder_name;
            let signature = req.body.signature;
            let merchant_identifier = req.body.merchant_identifier;
            let expiry_date = req.body.expiry_date;
            let access_code = req.body.access_code;
            let language = req.body.language;
            let service_command = req.body.service_command;
            let response_message = req.body.response_message;
            let merchant_reference = req.body.merchant_reference;
            let token_name = req.body.token_name;
            let return_url = req.body.return_url;
            let remember_me = req.body.remember_me;
            let card_bin = req.body?.card_bin;
            let status = req.body.status;
            let customer_ip = req.body.customer_ip;
            let finalTotal = req.body.finalTotal;
            let currency = req.body.currency;
            let customer_email = req.body.customer_email;
            let customer_name = req.body.customer_name;

            let sha_request_passphrase =
                access_code === process.env.SIKKA_SOFTWARE_APPLEPAY_PAYFOR_ACCESS_TOKEN
                    ? process.env.SIKKA_SOFTWARE_APPLEPAY_PAYFOR_SHA_REQUEST_PHRASE
                    : process.env.SIKKA_SOFTWARE_PAYFOR_SHA_REQUEST_PHRASE;

            console.log("sha_request_passphrase=", sha_request_passphrase);

            // Calculate request signature
            let shaString = "";

            // array request
            let arrData = {
                access_code: access_code,
                amount: finalTotal * 100,
                app_framework: "REACTJS",
                app_plugin: "SIKKA ADMIN",
                app_plugin_version: "v0.1.0",
                app_programming: "JS",
                app_ver: "v17.0.2",
                command: "PURCHASE",
                currency: currency,
                customer_email: customer_email,
                customer_ip: customer_ip,
                customer_name: customer_name,
                eci: "ECOMMERCE",
                language: language,
                merchant_extra: "SIKKA_ADMIN",
                merchant_identifier: merchant_identifier,
                merchant_reference: merchant_reference,
                remember_me: remember_me,
                return_url: return_url,
                token_name: token_name,
            };

            console.log("arrData=", arrData);

            shaString = `${sha_request_passphrase}${shaString}`;
            for (const [key, value] of Object.entries(arrData)) {
                shaString = `${shaString}${key}=${value}`;
            }
            shaString = `${shaString}${sha_request_passphrase}`;

            console.log("shaString=", shaString);

            // your request signature
            let newsignature = crypto
                .createHash("sha256")
                .update(shaString)
                .digest("hex");

            console.log("signature=", newsignature);

            const data = {
                merchant_identifier: merchant_identifier,
                access_code: access_code,
                merchant_reference: merchant_reference,
                language: language,
                command: "PURCHASE",
                customer_ip: customer_ip,
                amount: finalTotal * 100,
                currency: currency,
                customer_email: customer_email,
                return_url: return_url,
                token_name: token_name,
                customer_name: customer_name,
                eci: "ECOMMERCE",
                remember_me: remember_me,
                app_programming: "JS",
                app_framework: "REACTJS",
                app_ver: "v17.0.2",
                app_plugin: "SIKKA ADMIN",
                app_plugin_version: "v0.1.0",
                merchant_extra: "SIKKA_ADMIN",
                signature: newsignature,
            };

            console.log("data=", data);

            try {
                let paymentInfo = await axios.post(
                    `${process.env.SIKKA_SOFTWARE_PAYFOR_ENVIRONMENT_URL_API}`,
                    data
                );
                if (
                    paymentInfo.data.acquirer_response_message === "Approved" &&
                    !paymentInfo.data["3ds_url"]
                ) {

                }
                console.log("paymentInfo=", paymentInfo);
            } catch (err) {
                console.log(err);
                return res.status(400).json({ ok: false, error: err });
            }
        });


        app.post("/payfort/feedback", async (req: any, res: any) => {
            console.log("ok");
            return aps_handle_response(req, res);
        });

        app.post("/payfort/offline", async (req: any, res: any) => {
            return aps_handle_response(req, res, 'offline');
        });

        app.post("/payfort/redirect", async (req: any, res: any) => {
            return aps_handle_response(req, res);
        });

        app.post("/payfort/applepay/feedback", async (req: any, res: any) => {
            return aps_handle_response(req, res);
        });

        app.post("/payfort/applepay/offline", async (req: any, res: any) => {
            return aps_handle_response(req, res, 'offline');
        });

        app.post("/payfort/applepay/redirect", async (req: any, res: any) => {
            return aps_handle_response(req, res);
        });
    }
}