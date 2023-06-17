const referralType = `
type Referral {
	_id: ID!
	code: String
	user: User
	clicks: Int
    commission: Int
	createdAt: String
    updatedAt: String
}
input ReferralInput {
	code: String
	user: ID
	clicks: Int
    commission: Int
}
input ReferralUpdate {
	code: String
	user: ID
	clicks: Int
    commission: Int
}
`;
const referralMutations = `
	createReferral(referralInput: ReferralInput): Referral
	deleteReferral(referralId: ID!): Referral
	updateReferral(referralId: ID!, referralUpdate: ReferralUpdate): Referral
`;
const referralQueries = `
    referral(referralId: ID!): Referral!
    referrals: [Referral!]!
`;

const referralAnalyticsType = `
type ReferralAnalytics {
	_id: ID!
	referral: String
	user: User
	commission: Int
	createdAt: String
    updatedAt: String
}
input ReferralAnalyticsInput {
	referral: String
	user: User
	commission: Int
}
input ReferralAnalyticsUpdate {
	referral: String
	user: User
	commission: Int
}
`;
const referralAnalyticsMutations = `
    createReferralAnalytics(referralAnalyticsInput: ReferralAnalyticsInput): ReferralAnalytics
	deleteReferralAnalytics(referralAnalyticsId: ID!): ReferralAnalytics
	updateReferralAnalytics(referralAnalyticsId: ID!, referralAnalyticsUpdate: ReferralAnalyticsUpdate): ReferralAnalytics
`;
const referralAnalyticsQueries = `
    referralAnalytics(referralAnalyticsId: ID!): ReferralAnalytics!
    referralsAnalytics: [ReferralAnalytics!]!
`;

const ReferralShema = {
  ReferralType: referralType,
  ReferralMutations: referralMutations,
  ReferralQueries: referralQueries,
  ReferralAnalyticsType: referralAnalyticsType,
  ReferralAnalyticsMutations: referralAnalyticsMutations,
  ReferralAnalyticsQueries: referralAnalyticsQueries,
};

module.exports = ReferralShema;
