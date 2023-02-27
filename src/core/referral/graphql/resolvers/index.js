import { ReferralModels } from "../../index";

async function createReferral(args) {
  const referral = await ReferralModels.Referral.findOne({
    code: args.referralInput.code,
  });
  if (referral) throw new Error("Referral exist");
  const ReferralInit = new ReferralModels.Referral({
    code: args.referralInput.code,
    user: args.referralInput.user,
    clicks: args.referralInput.clicks,
    commission: args.referralInput.commission,
  });
  const newReferral = await ReferralInit.save();
  return { ...newReferral._doc };
}

async function updateReferral(args) {
  const referral = await ReferralModels.Referral.findById(args.referralId);
  if (referral) throw new Error("Referral exist");
  const newReferralData = {
    code: args.referralAnalyticsUpdate.code,
    user: args.referralAnalyticsUpdate.user,
    clicks: args.referralAnalyticsUpdate.clicks,
    commission: args.referralAnalyticsUpdate.commission,
  };
  const newReferral = await ReferralModels.Referral.findByIdAndUpdate(
    args.referralId,
    newReferralData,
    {
      new: true,
    }
  );
  return { ...newReferral._doc };
}

async function deleteReferral(args) {
  const referral = await ReferralModels.Referral.findById(args.referralId);
  if (!referral) throw new Error("Referral does not exist");
  const deleteReferral = await ReferralModels.Referral.deleteOne({
    _id: args.referralId,
  });
}

async function referral(args) {
  let referral = await ReferralModels.Referral.findById(args.referralId);
  if (!referral) throw new Error("Could not find any referral");
  const newReferral = referral.populate("user").execPopulate();
  return newReferral;
}

async function referrals(args) {
  let allReferral = await ReferralModels.Referral.find();
  if (!allReferral) throw new Error("Could not find any referral");
  return allReferral.map(async (singleReferral) => {
    let ref = await singleReferral.populate("user").execPopulate();
    return { ...ref._doc };
  });
}

async function createReferralAnalytics(args) {
  const referral = await ReferralModels.Referral.findOne({
    code: args.referralAnalyticsInput.referral,
  });
  if (!referral) throw new Error("Referral does not exist");
  const referralAnalyticsInit = new ReferralModels.ReferralAnalytics({
    referral: args.referralAnalyticsInput.code,
    user: args.referralAnalyticsInput.user,
    commission: args.referralAnalyticsInput.commission,
  });
  const newReferralAnalytics = await referralAnalyticsInit.save();
  return { ...newReferralAnalytics._doc };
}

async function updateReferralAnalytics(args) {
  const referralAnalytics = await ReferralModels.ReferralAnalytics.findById(
    args.referralAnalyticsId
  );
  if (referralAnalytics) throw new Error("Referral Analytics exist");
  const newReferralAnalyticsData = {
    referral: args.referralAnalyticsUpdate.code,
    user: args.referralAnalyticsUpdate.user,
    commission: args.referralAnalyticsUpdate.commission,
  };
  const newReferralAnalytics =
    await ReferralModels.ReferralAnalytics.findByIdAndUpdate(
      args.referralAnalyticsId,
      newReferralAnalyticsData,
      {
        new: true,
      }
    );
  return { ...newReferralAnalytics._doc };
}

async function deleteReferralAnalytics(args) {
  const referralAnalytics = await ReferralModels.ReferralAnalytics.findById(
    args.referralAnalyticsId
  );
  if (!referralAnalytics) throw new Error("Referral Analytics does not exist");
  const deleteReferralAnalytics =
    await ReferralModels.ReferralAnalytics.deleteOne({
      _id: args.referralAnalyticsId,
    });
}

async function referralAnalytics(args) {
  let referralAnalytics = await ReferralModels.ReferralAnalytics.findById(
    args.referralAnalyticsId
  );
  if (!referralAnalytics)
    throw new Error("Could not find any referral analytics");
  const newReferralAnalytics = referralAnalytics
    .populate("referral")
    .populate("user")
    .execPopulate();
  return newReferralAnalytics;
}

async function referralsAnalytics(args) {
  let allReferralAnalytics =
    await ReferralModels.ReferralAnalytics.Referral.find();
  if (!allReferralAnalytics) throw new Error("Could not find any referral");
  return allReferralAnalytics.map(async (singleReferralAnalytics) => {
    let refAnalytics = await singleReferralAnalytics
      .populate("referral")
      .populate("user")
      .execPopulate();
    return { ...refAnalytics._doc };
  });
}
module.exports = {
  createReferral,
  updateReferral,
  deleteReferral,
  referral,
  referrals,
  createReferralAnalytics,
  updateReferralAnalytics,
  deleteReferralAnalytics,
  referralAnalytics,
  referralsAnalytics,
};
