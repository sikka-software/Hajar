const crypto = require("crypto");
const ReferralModels = require("./models");

export async function GenerateUniqueReferalCode() {
    let isOk = false;
    let codeReferal = "";
    do {
        codeReferal = crypto.randomBytes(4).toString("hex").toUpperCase();
        const referral = await ReferralModels.Referral.findOne({ code: codeReferal });
        if (!referral) {
            isOk = true;
        }
        else {
            isOk = false;
        }
    } while (isOk == false);
    return codeReferal;
}