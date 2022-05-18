app.post("/PayWithWallet", async (req, res) => {
    if (
      !req.body.isWallet &&
      (!req.body.pack ||
        !req.body.user ||
        !req.body.cycle ||
        !req.body.currency ||
        !req.body.amount ||
        !req.body.email ||
        !req.body.selectedPaymentMethod)
    ) {
      return res.status(200).json({ ok: false, error: "Missing required Data" });
    }
  
    const pack_id = req.body.pack;
    const user_id = req.body.user;
    const billing_address = req.body.billing_address;
    const cycle = req.body.cycle;
    const currency_pack = req.body.currency;
    const amount_pack = parseFloat(req.body.amount);
    const email = req.body.email;
    const paymentMethod = req.body.selectedPaymentMethod;
    const isWallet = req.body.isWallet === "false" ? false : true;
  
    console.log("isWallet=", isWallet);
  
    try {
      //const card = await Card.findOne({ _id: card_id });
      const transactions = await Transactions.find();
      //if (!card) throw new Error("card does not exist under thid id");
  
      let transactions_length = transactions.length + 1;
  
      let user = await User.findOne({ _id: user_id });
      console.log("user33", user);
      if (!user) {
        return res.status(200).json({ ok: false, error: "User not found" });
      }
  
      let amount_payed = amount_pack;
  
      if (user?.amount_payed > 0 && !isWallet) {
        const new_price = parseFloat(user.amount_payed) - amount_pack;
        amount_payed = Math.abs(new_price);
      }
  
      //create transaction with status waiting_payment
      const newTransaction = new Transactions({
        increment_id: transactions_length.toString().padStart(8, "0"),
        card: null,
        pack: pack_id,
        pack_user: null,
        user: user_id,
        billing_address: billing_address,
        status: "waiting_payment",
        registration_id: null,
        parent_transaction: null,
        invoice_id: null,
        original_amount: 0,
        amount_wallet: 0,
        amount: amount_payed,
        currency: currency_pack,
        paymentMethod: paymentMethod,
        referencedid: null
      });
  
      let transaction = await newTransaction.save();
  
      if (!isWallet) {
        //create pack and affect it to transaction
  
        let cycleDate = new Date();
        let nextCycleDate = new Date(cycleDate);
        if (cycle === "monthly") {
          nextCycleDate.setMonth(cycleDate.getMonth() + 1);
        } else if (cycle === "3-months") {
          nextCycleDate.setMonth(cycleDate.getMonth() + 3);
        } else if (cycle === "6-months") {
          nextCycleDate.setMonth(cycleDate.getMonth() + 6);
        } else {
          nextCycleDate.setYear(cycleDate.getFullYear() + 1);
        }
  
        const packUserNew = new PackUsers({
          pack_id: pack_id,
          user_id: user_id,
          cycle_date: cycleDate,
          next_cycle_date: nextCycleDate,
          recurring: cycle,
          status: "pending"
        });
  
        const newPackUser = await packUserNew.save();
  
        let transactionData = {
          pack_user: newPackUser._id
        };
        transaction = await Transactions.findByIdAndUpdate(
          transaction._id,
          transactionData,
          { new: true }
        );
      }
      return res.status(200).json({
        ok: true,
        data: { gateway: null, transaction: transaction }
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ ok: false, error: err });
    }
  });