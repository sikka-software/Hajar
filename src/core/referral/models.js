import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ReferralSchema = new Schema(
  {
    code: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    clicks: { type: Number, required: true },
    commission: { type: Number, required: true }
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

const ReferralModels = {
  Referral: mongoose.model("Referral", ReferralSchema),
  ReferralAnalytics: mongoose.model("ReferralAnalytics", ReferralAnalyticsSchema)
};

export default ReferralModels;