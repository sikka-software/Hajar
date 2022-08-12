
const OUT = "dist";
const AR_SA = "ar-SA";
const EN_US = "en-US";
const TRANSLATION = "translation";
const STRATEGY = "currentOnly";

export default {
  backend: {
    loadPath: `./${OUT}/locales/{{lng}}/{{ns}}.json`
  },
  load: STRATEGY,
  fallbackLng: AR_SA,
  preload: [AR_SA, EN_US],
  ns: [TRANSLATION],
  defaultNS: TRANSLATION
};
