import Hajarimport from "../load";
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

            let invoiceobj = await Invoice.findOne({ _id: merchant_reference });
            let invoice;
            console.log("invoice=", invoiceobj);
            if (!invoiceobj) {
                return res
                    .status(200)
                    .json({ ok: false, error: "Invoice does not exist under thid id" });
            } else {
                invoice = await invoiceobj
                    .populate("invoice_client")
                    .populate("invoice_products")
                    .execPopulate();
            }

            if (!invoice) {
                return res
                    .status(200)
                    .json({ ok: false, error: "Invoice does not exist under thid id" });
            }

            let transaction = await Transaction.findOne({
                transaction_invoice_id: merchant_reference,
                transaction_status: "waiting_payment",
            });
            if (!transaction) {
                return res
                    .status(200)
                    .json({ ok: false, error: "Transaction does not exist under thid id" });
            }

            transaction = await Transaction.findByIdAndUpdate(
                transaction._id,
                {
                    transaction_amount: amount,
                    transaction_currency: currency,
                    transaction_payment_method: payment_option,
                    transaction_fort_id: fort_id,
                    transaction_language: language,
                    transaction_status: "completed",
                },
                { new: true }
            );
            await Invoice.findByIdAndUpdate(
                invoice._id,
                {
                    invoice_payment_status: "completed",
                },
                { new: true }
            );
            if (transaction) {
                let cycletextemail = invoice.invoice_type;
                if (language == "ar" && cycletextemail == "once") {
                    cycletextemail == "دفعة واحدة";
                }
                if (language == "ar" && cycletextemail == "recurring") {
                    cycletextemail == "دفعات متكررة";
                }
                const dataMail = {
                    email_lang: language,
                    email_name_portal: "SIKKA",
                    email_heading:
                        language == "ar" ? "شكرا لطلبك" : "Thank you for your order",
                    email_transaction: transaction,
                    email_logo: `${process.env.SIKKA_CHEKOUT_USER_PORTAL_URL}/qawaim-logo.png`,
                    email_date_order: moment(new Date(transaction.createdAt)).format(
                        "DD/MM/YYYY h:mm A"
                    ),
                    email_translate: {
                        cycle: cycletextemail,
                        orderdate: language == "ar" ? "تاريخ الطلبية:" : "Order Date:",
                        billing_address:
                            language == "ar" ? "عنوان وصول الفواتير" : "Billing address",
                        orderdate: language == "ar" ? "تاريخ الطلب:" : "Order Date:",
                        billing_address:
                            language == "ar" ? "عنوان الفاتورة" : "Billing address",
                        product: language == "ar" ? "المنتج" : "Product",
                        order: language == "ar" ? "رقم الطلب:" : "Order:",
                        quantity: language == "ar" ? "الكمية" : "Quantity",
                        price: language == "ar" ? "السعر" : "Price",
                        subtotal: language == "ar" ? "المجموع الفرعي" : "Subtotal",
                        total: language == "ar" ? "المجموع" : "Total",
                        thankyou:
                            language == "ar"
                                ? "شكرا لك على الإشتراك."
                                : "Thank you for your purchase.",
                        himess: language == "ar" ? "مرحبا" : "Hi",
                        statorders:
                            language == "ar"
                                ? "لقد انتهينا من معالجة طلبك."
                                : "We have finished processing your order.",
                    },
                    email_full_name: invoice.invoice_client.client_name,
                    email_customer_address:
                        invoice.invoice_client.client_address_line_1 +
                        " " +
                        invoice.invoice_client.client_address_line_2 +
                        " " +
                        invoice.invoice_client.client_city +
                        " " +
                        invoice.invoice_client.client_zip_code +
                        " " +
                        invoice.invoice_client.client_state +
                        "," +
                        invoice.invoice_client.client_country,
                    email_customer_billing_phone: false,
                    email_customer_billing_email: invoice.invoice_client.client_email,
                    email_footer_text:
                        language == "ar"
                            ? "قوائم - تصميم و برمجة مؤسسة سكة لتقنية المعلومات"
                            : "Qawaim — Designed & Developed by Sikka Software",
                    email_products: invoice.invoice_products,
                };

                createInvoice(transaction._id, res, language, true);

                //send email to user and admin
                ejs.renderFile(
                    "template/email/customer-completed-order.ejs",
                    dataMail,
                    {},
                    function (err, str) {
                        // str => Rendered HTML string
                        //console.log(err);
                        console.log(str);
                        let message = {
                            attachments: [
                                {
                                    // stream as an attachment
                                    filename: `invoice-${invoice.invoice_increment_id}.pdf`,
                                    path: `invoices/invoice-${invoice.invoice_increment_id}.pdf`,
                                },
                            ],
                            headers: {
                                "X-Sender": process.env.BILLING_EMAIL,
                            },
                            from: `Sikka Software Billing <${process.env.BILLING_EMAIL}>`,
                            to: `${invoice.invoice_client.client_name} <${invoice.invoice_client.client_email}>`,
                            subject:
                                language == "ar"
                                    ? "فاتورة طلبك من سكة"
                                    : "Your order invoice from SIKKA",
                            html: juice(str),
                        };
                        console.log("message=", message);
                        if (transporter) {
                            console.log("transporter=", transporter);
                            transporter.sendMail(message, (error, info) => {
                                console.log(error);
                                console.log(info);
                            });
                        }
                    }
                );
                return res.status(200).json({
                    ok: true,
                    payment: req.body,
                    transaction: transaction,
                });
            } else {
                return res.status(200).json({ ok: false, payment: req.body });
            }
        });


        app.post("/payfort/payment/finalize", async (req, res) => {
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

            console.log("req.body3=", req.body);

            let invoiceobj = await Invoice.findOne({ _id: merchant_reference });
            let invoice;
            console.log("invoice=", invoiceobj);
            if (!invoiceobj) {
                return res
                    .status(200)
                    .json({ ok: false, error: "Invoice does not exist under thid id" });
            } else {
                invoice = await invoiceobj
                    .populate("invoice_client")
                    .populate("invoice_products")
                    .execPopulate();
            }

            if (!invoice) {
                return res
                    .status(200)
                    .json({ ok: false, error: "Invoice does not exist under thid id" });
            }

            let total = getTotal(invoice);
            let finalTotal = total + getVat(total);

            let transaction = await Transaction.findOne({
                transaction_invoice_id: merchant_reference,
                transaction_status: "waiting_payment",
            });
            if (transaction && !token_name) {
                token_name = transaction.transaction_payment_token;
            }
            if (!transaction) {
                //Create Transaction
                const newTransaction = new Transaction({
                    transaction_invoice_id: invoice._id,
                    transaction_invoice_payment: null,
                    transaction_invoice_client: invoice.invoice_client._id,
                    transaction_payment_token: token_name,
                    transaction_amount: finalTotal,
                    transaction_currency: invoice.invoice_currency,
                    transaction_payment_method: "T",
                    transaction_status: "waiting_payment",
                });
                transaction = await newTransaction.save();
            }
            await Invoice.findByIdAndUpdate(
                invoice._id,
                {
                    invoice_payment_status: "waiting_payment",
                },
                { new: true }
            );
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
                currency: invoice.invoice_currency,
                customer_email: invoice.invoice_client.client_email,
                customer_ip: customer_ip,
                customer_name: invoice.invoice_client.client_name,
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
                currency: invoice.invoice_currency,
                customer_email: invoice.invoice_client.client_email,
                return_url: return_url,
                token_name: token_name,
                customer_name: invoice.invoice_client.client_name,
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
                    transaction = await Transaction.findByIdAndUpdate(
                        transaction._id,
                        {
                            transaction_amount: paymentInfo.data.amount,
                            transaction_currency: paymentInfo.data.currency,
                            transaction_payment_method: paymentInfo.data.payment_option,
                            transaction_fort_id: paymentInfo.data.fort_id,
                            transaction_language: paymentInfo.data.language,
                            transaction_status: "completed",
                        },
                        { new: true }
                    );
                    await Invoice.findByIdAndUpdate(
                        invoice._id,
                        { invoice_payment_status: "completed" },
                        { new: true }
                    );
                    let cycletextemail = invoice.invoice_type;
                    if (language == "ar" && cycletextemail == "once") {
                        cycletextemail == "دفعة واحدة";
                    }
                    if (language == "ar" && cycletextemail == "recurring") {
                        cycletextemail == "دفعات متكررة";
                    }
                    const dataMail = {
                        email_lang: language,
                        email_name_portal: "SIKKA",
                        email_heading:
                            language == "ar" ? "شكرا لطلبك" : "Thank you for your order",
                        email_transaction: transaction,
                        email_logo: `${process.env.SIKKA_CHEKOUT_USER_PORTAL_URL}/qawaim-logo.png`,
                        email_date_order: moment(new Date(transaction.createdAt)).format(
                            "DD/MM/YYYY h:mm A"
                        ),
                        email_translate: {
                            cycle: cycletextemail,
                            orderdate: language == "ar" ? "تاريخ الطلبية:" : "Order Date:",
                            billing_address:
                                language == "ar" ? "عنوان وصول الفواتير" : "Billing address",
                            orderdate: language == "ar" ? "تاريخ الطلب:" : "Order Date:",
                            billing_address:
                                language == "ar" ? "عنوان الفاتورة" : "Billing address",
                            product: language == "ar" ? "المنتج" : "Product",
                            order: language == "ar" ? "رقم الطلب:" : "Order:",
                            quantity: language == "ar" ? "الكمية" : "Quantity",
                            price: language == "ar" ? "السعر" : "Price",
                            subtotal: language == "ar" ? "المجموع الفرعي" : "Subtotal",
                            total: language == "ar" ? "المجموع" : "Total",
                            thankyou:
                                language == "ar"
                                    ? "شكرا لك على الإشتراك."
                                    : "Thank you for your purchase.",
                            himess: language == "ar" ? "مرحبا" : "Hi",
                            statorders:
                                language == "ar"
                                    ? "لقد انتهينا من معالجة طلبك."
                                    : "We have finished processing your order.",
                        },
                        email_full_name: invoice.invoice_client.client_name,
                        email_customer_address:
                            invoice.invoice_client.client_address_line_1 +
                            " " +
                            invoice.invoice_client.client_address_line_2 +
                            " " +
                            invoice.invoice_client.client_city +
                            " " +
                            invoice.invoice_client.client_zip_code +
                            " " +
                            invoice.invoice_client.client_state +
                            "," +
                            invoice.invoice_client.client_country,
                        email_customer_billing_phone: false,
                        email_customer_billing_email: invoice.invoice_client.client_email,
                        email_footer_text:
                            language == "ar"
                                ? "قوائم - تصميم و برمجة مؤسسة سكة لتقنية المعلومات"
                                : "Qawaim — Designed & Developed by Sikka Software",
                        email_products: invoice.invoice_products,
                    };

                    createInvoice(transaction._id, res, language, true);

                    //send email to user and admin
                    ejs.renderFile(
                        "template/email/customer-completed-order.ejs",
                        dataMail,
                        {},
                        function (err, str) {
                            // str => Rendered HTML string
                            //console.log(err);
                            console.log(str);
                            let message = {
                                attachments: [
                                    {
                                        // stream as an attachment
                                        filename: `invoice-${invoice.invoice_increment_id}.pdf`,
                                        path: `invoices/invoice-${invoice.invoice_increment_id}.pdf`,
                                    },
                                ],
                                headers: {
                                    "X-Sender": process.env.BILLING_EMAIL,
                                },
                                from: `Sikka Software Billing <${process.env.BILLING_EMAIL}>`,
                                to: `${invoice.invoice_client.client_name} <${invoice.invoice_client.client_email}>`,
                                subject:
                                    language == "ar"
                                        ? "فاتورة طلبك من سكة"
                                        : "Your order invoice from SIKKA",
                                html: juice(str),
                            };
                            console.log("message=", message);
                            if (transporter) {
                                console.log("transporter=", transporter);
                                transporter.sendMail(message, (error, info) => {
                                    console.log(error);
                                    console.log(info);
                                });
                            }
                        }
                    );
                }
                console.log("paymentInfo=", paymentInfo);
                return res.status(200).json({
                    ok: true,
                    reponse: paymentInfo.data,
                    transaction: transaction,
                });
            } catch (err) {
                console.log(err);
                return res.status(400).json({ ok: false, error: err });
            }
        });


        app.post("/payfort/feedback", async (req, res) => {
            console.log("ok");
            return aps_handle_response(req, res);
        });

        app.post("/payfort/offline", async (req, res) => {
            return aps_handle_response(req, res, 'offline');
        });

        app.post("/payfort/redirect", async (req, res) => {
            return aps_handle_response(req, res);
        });

        app.post("/payfort/applepay/feedback", async (req, res) => {
            return aps_handle_response(req, res);
        });

        app.post("/payfort/applepay/offline", async (req, res) => {
            return aps_handle_response(req, res, 'offline');
        });

        app.post("/payfort/applepay/redirect", async (req, res) => {
            return aps_handle_response(req, res);
        });
    }
}