import crypto from "crypto";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

export async function GenerateUniqueReferalCode() {
  let isOk = false;
  let codeReferal = "";
  do {
    codeReferal = crypto.randomBytes(4).toString("hex").toUpperCase();
    const referral = await ReferralModels.Referral.findOne({
      code: codeReferal,
    });
    if (!referral) {
      isOk = true;
    } else {
      isOk = false;
    }
  } while (isOk == false);
  return codeReferal;
}

const ReferralSchema = new Schema(
  {
    code: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    clicks: { type: Number, required: true },
    commission: { type: Number, required: true },
  },
  { timestamps: true }
);

const ReferralAnalyticsSchema = new Schema(
  {
    referral: { type: Schema.Types.ObjectId, ref: "Referral", required: true },
    user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    commission: { type: Number, required: true },
  },
  { timestamps: true }
);

export const ReferralModels = {
  Referral: mongoose.model("Referral", ReferralSchema),
  ReferralAnalytics: mongoose.model(
    "ReferralAnalytics",
    ReferralAnalyticsSchema
  ),
};
