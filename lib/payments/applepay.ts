import forge from "node-forge";
import $ from "jquery";
import axios from "axios";
import Hajarimport from "../load";

const supported_networks = ["amex", "masterCard", "visa", "mada"];

export async function setupAPI() {
    if ((typeof process !== 'undefined') && (process.release.name === 'node')) {
        const express = await Hajarimport("express", "");
        const https = await Hajarimport("https", "");
        const fs = await Hajarimport("fs", "");
        const app = express();
        app.post("/payfort/init_apple_pay_api", async (req: any, res: any) => {
            let apple_url = req.body.apple_url;
            console.log("apple_url=", apple_url);
            try {
                const domain_name = "beta-checkout.sikka.sa";
                const apple_pay_display_name = "SIKKA";
                const production_key = "amazon123";
                const certificate_path = "./apple_certificates/identifier.crt.pem";
                const apple_pay_merchant_identifier =
                    "merchant.sikka.software";
                const certificate_key = "./apple_certificates/identifier.key.pem";
                const data = `{"merchantIdentifier":"${apple_pay_merchant_identifier}", "domainName":"${domain_name}", "displayName":"${apple_pay_display_name}"}`;

                const useragent =
                    "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:20.0) Gecko/20100101 Firefox/20.0";

                const agent = new https.Agent({
                    rejectUnauthorized: false, // (NOTE: this will disable client verification)
                    cert: fs.readFileSync(certificate_path),
                    key: fs.readFileSync(certificate_key),
                    //passphrase: production_key
                });

                const options: any = {
                    url: apple_url,
                    method: "POST",
                    httpsAgent: agent,
                    headers: {
                        "Content-Type": "application/json",
                        charset: "UTF-8",
                        "User-Agent": useragent,
                    },
                    data: data,
                };

                console.log("options=", options);

                axios(options)
                    .then((response) => {
                        console.log("response=", response);
                        return res.status(200).json(response.data);
                    })
                    .catch((err) => {
                        console.log("err1=", err);
                        return res.status(200).json({ success: false, response: err });
                    });
            } catch (err) {
                res.status(200).json({ success: false, response: err });
            }
        });
    }
}

export async function setupPayfortApplepay(IdentifierCrtPem: any, merchant_id: any, front_url: any, cancel_url: any, urlBackend: any, currency_code: any, display_name: any, sub_total: any, tax_total: any, shipping_total: any, discount_total: any, grand_total: any, lang: any) {
    const parsed_certificate = forge.pki.certificateFromPem(IdentifierCrtPem);
    const apple_pay_merchant_identifier =
        parsed_certificate.subject.attributes[0].value;

    const res = await axios.get("https://www.cloudflare.com/cdn-cgi/trace");
    let dataIP = res.data.trim().split("\n").reduce(function (obj: any, pair: any) {
        pair = pair.split("=");
        return (obj[pair[0]] = pair[1]), obj;
    }, {});


    const apple_vars = {
        cancel_url: cancel_url,
        merchant_identifier: apple_pay_merchant_identifier,
        country_code: dataIP?.loc,
        currency_code: currency_code,
        display_name: display_name ? display_name : "SIKKA",
        payment_method_installment: "aps_installment",
        supported_networks: supported_networks
    };
    const apple_order = {
        sub_total: sub_total ? sub_total : 0.0,
        tax_total: tax_total ? tax_total : 0.0,
        shipping_total: shipping_total ? shipping_total : 0.0,
        discount_total: discount_total ? discount_total : 0.0,
        grand_total: grand_total ? grand_total : 0.0,
        order_items: []
    };

    const initApplePayment = (evt: any) => {
        var runningAmount: any = parseFloat(apple_order.grand_total);
        var runningPP = parseFloat("0");
        var runningTotal = function () {
            return parseFloat(runningAmount + runningPP).toFixed(2);
        };
        var shippingOption = "";

        var cart_array: any = [];
        var x = 0;
        var subtotal = apple_order.sub_total;
        var tax_total = apple_order.tax_total;
        var shipping_total = apple_order.shipping_total;
        var discount_total = apple_order.discount_total;
        var supported_networks: any = [];
        apple_vars.supported_networks.forEach(function (network) {
            supported_networks.push(network);
        });
        cart_array[x++] = {
            type: "final",
            label: "Subtotal",
            amount: parseFloat(subtotal).toFixed(2)
        };
        cart_array[x++] = {
            type: "final",
            label: "Shipping fees",
            amount: parseFloat(shipping_total).toFixed(2)
        };
        if (parseFloat(discount_total) >= 1) {
            cart_array[x++] = {
                type: "final",
                label: "Discount",
                amount: parseFloat(discount_total).toFixed(2)
            };
        }
        cart_array[x++] = {
            type: "final",
            label: "Tax",
            amount: parseFloat(tax_total).toFixed(2)
        };

        var paymentRequest = {
            currencyCode: apple_vars.currency_code,
            countryCode: apple_vars.country_code,
            //requiredShippingContactFields: ['postalAddress'],
            lineItems: cart_array,
            total: {
                label: apple_vars.display_name,
                amount: runningTotal()
            },
            supportedNetworks: supported_networks,
            merchantCapabilities: ["supports3DS"]
        };

        var supported_networks_level = 3;
        if (supported_networks.includes("mada")) {
            supported_networks_level = 5;
        }

        const session: any = new (window as any).ApplePaySession(supported_networks_level, paymentRequest);
        (window as any).applypaysession = session;
        
        // Merchant Validation
        session.onvalidatemerchant = function (event: any) {
            console.log("onvalidatemerchant=", event);
            var promise = performValidation(event.validationURL);
            promise.then(function (merchantSession) {
                session.completeMerchantValidation(merchantSession);
            });
        };

        session.onpaymentmethodselected = function (event: any) {
            console.log("onpaymentmethodselected=", event);
            var newTotal = {
                type: "final",
                label: apple_vars.display_name,
                amount: runningTotal()
            };
            var newLineItems = cart_array;

            session.completePaymentMethodSelection(newTotal, newLineItems);
        };

        session.onpaymentauthorized = function (event: any) {
            console.log("onpaymentauthorized=", event);
            var promise = sendPaymentToken(event.payment.token);
            promise.then(function (success) {
                var status;
                if (success) {
                    status = (window as any).ApplePaySession.STATUS_SUCCESS;
                    sendPaymentToAps(event.payment.token);
                } else {
                    status = (window as any).ApplePaySession.STATUS_FAILURE;
                }

                session.completePayment(status);
            });
        };

        session.oncancel = function (event: any) {
            alert(JSON.stringify(event));
            window.location.href = apple_vars.cancel_url;
        };

        session.begin();
    };

    const performValidation = (apple_url: any) => {
        return new Promise(function (resolve, reject) {
            if (!apple_url) {
                reject;
            }
            if (
                !apple_url.match(
                    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
                )
            ) {
                reject;
            }
            $.ajax({
                url: `${urlBackend}/payfort/init_apple_pay_api`,
                type: "POST",
                data: {
                    apple_url
                },
                success: function (data: any) {
                    if (!data) {
                        reject;
                    } else {
                        //data = JSON.parse( data );
                        resolve(data);
                    }
                },
                error: function () {
                    reject;
                }
            });
        });
    };

    const getShippingCosts = (shippingIdentifier: any, updateRunningPP: any) => {
        var shippingCost = 0;

        switch (shippingIdentifier) {
            case "domestic_std":
                shippingCost = 0;
                break;
            case "domestic_exp":
                shippingCost = 0;
                break;
            case "international":
                shippingCost = 0;
                break;
            default:
                shippingCost = 0;
        }

        return shippingCost;
    };

    const getShippingOptions = (shippingCountry: any) => {
        let shippingOption: any = [];
        if (shippingCountry.toUpperCase() == apple_vars.country_code) {
            shippingOption = [
                {
                    label: "Standard Shipping",
                    amount: getShippingCosts("domestic_std", true),
                    detail: "3-5 days",
                    identifier: "domestic_std"
                },
                {
                    label: "Expedited Shipping",
                    amount: getShippingCosts("domestic_exp", false),
                    detail: "1-3 days",
                    identifier: "domestic_exp"
                }
            ];
        } else {
            shippingOption = [
                {
                    label: "International Shipping",
                    amount: getShippingCosts("international", true),
                    detail: "5-10 days",
                    identifier: "international"
                }
            ];
        }
        return shippingOption;
    };

    const sendPaymentToken = (paymentToken: any) => {
        return new Promise(function (resolve, reject) {
            resolve(true);
        });
    };

    const sendPaymentToAps = (data: any) => {
        $.ajax({
            url: `${urlBackend}/payfort/payment/applepay_finalize`,
            type: "POST",
            data: {
                response_params: data,
                language: lang,
                invoice_id: merchant_id,
                customer_ip: dataIP.ip
            },
            success: function (checkoutInfo: any) {
                if (checkoutInfo.ok === true) {
                    window.location.href = front_url + "/confirmation/" + checkoutInfo.transaction._id;
                } else {
                    window.location.href = front_url + "/payment/error/" + merchant_id;
                }
            },
            error: function () { }
        });
    };

    const handleApplePay = (evt: any) => {
        initApplePayment(evt);
    };

    return handleApplePay;
}