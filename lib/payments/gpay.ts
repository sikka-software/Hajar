import Hajarimport from "../load";
import braintree from "braintree";
export async function setupGooglePay(params: any) {
  if ((typeof process !== 'undefined') && (process.release.name === 'node')) {
    const express = await Hajarimport("express", "");
    const app = express();
    app.post("/braintreegateway/googlepay", async (req: any, res: any) => {
      if (
        !req.body.nonce ||
        !req.body.deviceDataClient ||
        !req.body.billing_address ||
        !req.body.amount ||
        !req.body.currency ||
        !req.body.transaction_id ||
        !req.body.increment_id ||
        !req.body.merchantId || 
        !req.body.publicKey || 
        !req.body.privateKey
      ) {
        return res
          .status(200)
          .json({ ok: false, error: "Missing required Data" });
      }

      const amount = req.body.amount;
      const nonce = req.body.nonce;
      const deviceDataClient = req.body.deviceDataClient;
      const billing_address = req.body.billing_address;
      const transaction_id = req.body.transaction_id;
      const merchantId = req.body.merchantId;
      const publicKey = req.body.publicKey;
      const privateKey = req.body.privateKey;
      const first_name = req.body.first_name;
      const last_name = req.body.last_name;
      const address_line_1 = req.body.address_line_1;
      const address_line_2 = req.body.address_line_2;
      const city= req.body.city;
      const state= req.body.state;
      const zip_code= req.body.zip_code;
      const country= req.body.country;
      
      const environment =
        process.env.QAWAIM_GOOGLEPAY_ENVIRONMENT === "TEST"
          ? braintree.Environment.Sandbox
          : braintree.Environment.Production;

      const gateway = new braintree.BraintreeGateway({
        environment: environment,
        merchantId: merchantId,
        publicKey: publicKey,
        privateKey: privateKey,
      });

      gateway.transaction
        .sale({
          amount: amount,
          paymentMethodNonce: nonce,
          deviceData: deviceDataClient,
          orderId: req.body.increment_id,
          options: { submitForSettlement: true },
          billing: {
            firstName: first_name,
            lastName: last_name,
            streetAddress: address_line_1,
            extendedAddress: address_line_2,
            locality: city,
            region: state,
            postalCode: zip_code,
            countryName: country,
          },
        })
        .then((result: any) => {
          console.log(result);
          if (result.success == true) {
          } else {
            return res.status(400).json({ ok: false });
          }
        });
    });
  }
}
