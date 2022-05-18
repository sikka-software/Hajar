import Hajarimport from "../load";
export async function setupGooglePay(params: any) {
  if ((typeof process !== 'undefined') && (process.release.name === 'node')) {
    const braintree = Hajarimport("braintree", "");
    const express = await Hajarimport("express", "");
    const app = express();
    app.post("/braintreegateway/googlepay", async (req: any, res: any) => {
      if (
        !req.body.nonce ||
        !req.body.deviceDataClient ||
        !req.body.billing_address ||
        !req.body.amount ||
        !req.body.currency ||
        !req.body.transaction_id
      ) {
        return res
          .status(200)
          .json({ ok: false, error: "Missing required Data" });
      }

      const amount = parseFloat(req.body.amount);
      const nonce = req.body.nonce;
      const deviceDataClient = req.body.deviceDataClient;
      const billing_address = req.body.billing_address;
      const transaction_id = req.body.transaction_id;
      const transaction = await Transactions.findOne({ _id: transaction_id });
      const address = await Addresses.findOne({ _id: billing_address });
      const environment =
        process.env.QAWAIM_GOOGLEPAY_ENVIRONMENT === "TEST"
          ? braintree.Environment.Sandbox
          : braintree.Environment.Sandbox.Production;

      const gateway = new braintree.BraintreeGateway({
        environment: environment,
        merchantId: process.env.QAWAIM_BRAINTREE_MERCHANTID,
        publicKey: process.env.QAWAIM_BRAINTREE_PUBLICKEY,
        privateKey: process.env.QAWAIM_BRAINTREE_PRIVATEKEY,
      });

      gateway.transaction
        .sale({
          amount: amount,
          paymentMethodNonce: nonce,
          deviceData: deviceDataClient,
          orderId: transaction?.increment_id,
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
          console.log(result);
          if (result.success == true) {
            return res.status(200).json({
              ok: true,
              data: {
                transaction: transaction,
              },
            });
          } else {
            return res.status(400).json({ ok: false });
          }
        });
      return res.status(400).json({ ok: false, error: err });
    });
  }
}
