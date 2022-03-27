import mongoose from "mongoose";
import { addMonths } from "date-fns";
const Schema = mongoose.Schema;

const AddressesSchema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    address_line_1: { type: String, required: true },
    address_line_2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip_code: { type: String, required: true },
    country_code: { type: String, required: true, default: "SA" },
    country: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "Users", required: true }
  },
  { timestamps: true }
);

export const Addresses = mongoose.model("Addresses", AddressesSchema);

const adminUsersSchema = new Schema(
  {
    first_name: { type: String, required: false, unique: false },
    last_name: { type: String, required: false, unique: false },
    user_name: { type: String, required: true, unique: true },
    email: { type: String, required: false, unique: true, sparse: true },
    password: { type: String, required: true },
    admin_role: { type: Schema.Types.ObjectId, ref: "Role" }
  },
  { timestamps: true }
);

export const UserAdmin = mongoose.model("admin", adminUsersSchema);

const userCards = new Schema(
  {
    language: { type: String },
    card_number: { type: String },
    expiry_date: { type: String },
    currency: { type: String },
    token_name: { type: String },
    card_holder_name: { type: String },
    brand: { type: String },
    status: { type: String },
    card_user: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export const Card = mongoose.model("Card", userCards);

const CategorySchema = new Schema(
  {
    category_name: { type: String, required: false },
    category_name_ar: { type: String, required: false },
    user_categories: { type: Schema.Types.ObjectId, ref: "User" },
    category_menu: { type: Schema.Types.ObjectId, ref: "Menu" }
  },
  { strict: false }
);

export const Category = mongoose.model("Category", CategorySchema);

const EmailActionSchema = new Schema({
  email_mode: { type: String, required: true },
  email_oobCode: { type: String, required: true },
  email_created: { type: Date, default: new Date() },
  email_expire: { type: Date, default: addMonths(new Date(), 30) },
  user_email: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" }
});

export const EmailActions = mongoose.model("Email_Actions", EmailActionSchema);

const ImageSchema = new Schema({
  image_url: { type: String, required: true },
  image_item: { type: Schema.Types.ObjectId, ref: "Item" }
});

export const Image = mongoose.model("Image", ImageSchema);

const ItemSchema = new Schema({
  item_name: { type: String, required: false },
  item_name_ar: { type: String, required: false },
  item_price: { type: Number, required: false },
  item_category: { type: String, required: false },
  item_category_ar: { type: String, required: false },
  item_status: { type: String, required: true },
  item_calories: { type: Number, required: false },
  item_description: { type: String, required: false },
  item_description_ar: { type: String, required: false },
  item_images: [{ type: Schema.Types.ObjectId, ref: "Image" }],
  item_menu: { type: Schema.Types.ObjectId, ref: "Menu" },
  item_options: [
    { option_title: String, option_title_ar: String, option_price: Number }
  ],
  item_price_type: { type: String, required: false }
},
{ timestamps: true });

export const Item = mongoose.model("Item", ItemSchema);

const LandingFAQSchema = new Schema({
  question: { type: String, required: false },
  question_ar: { type: String, required: false },
  answer: { type: String, required: false },
  answer_ar: { type: String, required: false }
});

export const LandingFAQ = mongoose.model("LandingFAQ", LandingFAQSchema);

const LandingFeatureSchema = new Schema({
  title: { type: String, required: true },
  title_ar: { type: String, required: true },
  subtitle: { type: String, required: false },
  subtitle_ar: { type: String, required: false },
  description: { type: String, required: false },
  description_ar: { type: String, required: false },
  icon: { type: String, required: false },
  soon: { type: Boolean, required: false }
});

export const LandingFeature = mongoose.model("LandingFeature", LandingFeatureSchema);

const LandingPartnerSchema = new Schema({
  partner_name: { type: String, required: true },
  partner_name_ar: { type: String, required: false },
  partner_menu_link: { type: String, required: false },
  partner_website: { type: String, required: false },
  partner_logo: { type: String, required: false }
});

export const LandingPartner = mongoose.model("LandingPartner", LandingPartnerSchema);

const MenuSettingsSchema = new Schema({
  settings_menu: { type: Schema.Types.ObjectId, ref: "Menu" },
  twitter: { type: String, required: false },
  facebook: { type: String, required: false },
  instagram: { type: String, required: false },
  delivery_hungerstation: { type: String, required: false },
  delivery_toyou: { type: String, required: false },
  delivery_jahez: { type: String, required: false },
  delivery_mrsool: { type: String, required: false },
  delivery_wssel: { type: String, required: false },
  delivery_talabat: { type: String, required: false },
  delivery_carriage: { type: String, required: false },
  snapchat: { type: String, required: false },

  show_menu_name: { type: Boolean, default: true },
  show_logo: { type: Boolean, required: false, default: false },
  show_address: { type: Boolean, required: false, default: false },
  show_order_button: { type: Boolean, required: false, default: false },
  show_hours: { type: Boolean, required: false, default: false },
  show_search: { type: Boolean, required: false, default: false },
  show_socials: { type: Boolean, required: false, default: false },
  show_delivery: { type: Boolean, required: false, default: false },
  hide_watermark: { type: Boolean, required: false, default: false },
  menu_phone: { type: String, required: false },
  menu_website: { type: String, required: false },
  menu_handle: { type: String, required: false, unique: true },
  menu_handle_upper: {
    type: String,
    required: false,
    uppercase: true,
    unique: true
  },
  gmaps_link: { type: String, required: false }
});

export const MenuSettings = mongoose.model("MenuSettings", MenuSettingsSchema);

const MenuSchema = new Schema(
  {
    menu_name: { type: String, required: true },
    menu_address: { type: String, required: false },
    menu_language: { type: String, required: false },
    menu_currency: { type: String, required: true },
    menu_logo: { type: String, required: false },
    menu_items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
    menu_user: { type: Schema.Types.ObjectId, ref: "User" },
    menu_settings: { type: Schema.Types.ObjectId, ref: "MenuSettings" },
    menu_privacy: { type: String, required: true, default: "private" },
    menu_enabled: { type: Boolean, required: false },
    menu_style: {
      background_color: { type: String, required: false },
      primary_color: { type: String, required: false },
      item_color: { type: String, required: false },
      categories_color: { type: String, required: false },
      border_radius: { type: Number, required: false }
    },
    menu_live: { type: Boolean, default: true }
  },
  { timestamps: true, strict: false }
);

export const Menu = mongoose.model("Menu", MenuSchema);

const PackUsersSchema = new Schema(
  {
    registration_id: { type: String },
    pack_id: { type: Schema.Types.ObjectId, ref: "Packs" },
    user_id: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    transaction_id: { type: Schema.Types.ObjectId, ref: "Transaction" },
    cycle_date: { type: String },
    next_cycle_date: { type: String },
    recurring: { type: String },
    currency: { type: String },
    status: { type: String, required: true },
    renew_status: { type: String, default: "" }
  },
  { timestamps: true }
);

export const PackUsers = mongoose.model("PackUsers", PackUsersSchema);

const PackSchema = new Schema(
  {
    title: { type: String, required: true },
    title_ar: { type: String, required: true },
    subtitle: { type: String, required: true },
    subtitle_ar: { type: String, required: true },
    price_monthly_sar: { type: Number },
    price_annual_sar: { type: Number },
    price_3months_sar: { type: Number },
    price_6months_sar: { type: Number },
    price_monthly_usd: { type: Number },
    price_annual_usd: { type: Number },
    price_3months_usd: { type: Number },
    price_6months_usd: { type: Number },
    discount_sar: { type: Number },
    discount_usd: { type: Number },
    features: [{ type: String, required: true }],
    features_ar: [{ type: String, required: true }],
    status: { type: Boolean, required: true },
    order: { type: Number, required: true },
    menu_limit: { type: Number },
    items_limit: { type: Number },
    image_per_item_limit: { type: Number },
    custom_menu_url: { type: Boolean },
    custom_menu_style: { type: Boolean },
    ability_change_item_status: { type: Boolean },
    show_search_ability: { type: Boolean },
    show_social_icons: { type: Boolean },
    show_delivery_links: { type: Boolean },
    feature_order_button: { type: Boolean },
    feature_hide_watermark: { type: Boolean },
    feature_open_hours: { type: Boolean },
    is_trial: { type: Boolean, default: false },
    trial_x_days: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Packs = mongoose.model("Packs", PackSchema);

const userPlan = new Schema({
  plan_level: { type: String, required: true },
  cycle_date: { type: Date, required: false },
  recurring: { type: String, required: false },
  plan_user: { type: Schema.Types.ObjectId, ref: "User" },
  registration_id: { type: String, required: true }
});

export const Plan = mongoose.model("Plan", userPlan);

const ProhibitionSchema = new Schema({
  action: { type: String, required: true },
  model: { type: String, required: false },
  prohibition_roles: [{ type: Schema.Types.ObjectId, ref: "Role" }]
});

export const Prohibition = mongoose.model("Prohibition", ProhibitionSchema);

const RoleSchema = new Schema({
  name: { type: String, required: true },
  role_users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  role_admins: [{ type: Schema.Types.ObjectId, ref: "UserAdmin" }],
  role_prohibitions: [{ type: Schema.Types.ObjectId, ref: "Prohibition" }]
});

export const Role = mongoose.model("Role", RoleSchema);

const transactionSchema = new Schema(
  {
    increment_id: { type: String, required: true },
    card: { type: Schema.Types.ObjectId, ref: "Card" },
    pack: { type: Schema.Types.ObjectId, ref: "Packs"},
    pack_user: { type: Schema.Types.ObjectId, ref: "PackUsers" },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    billing_address: {
      type: Schema.Types.ObjectId,
      ref: "Addresses",
      required: true
    },
    registration_id: { type: String },
    parent_transaction: { type: Schema.Types.ObjectId, ref: "Transactions" },
    invoice_id: { type: String },
    original_amount: { type: Number },
    amount_wallet: { type: Number },
    amount: { type: Number },
    currency: { type: String },
    status: { type: String, required: true },
    paymentMethod: { type: String },
    referencedid: { type: String },
    payfort_id: { type: String },
    maintenance_reference: { type: String }
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transactions", transactionSchema);

const UserSchema = new Schema(
  {
    user_display: { type: String, required: false, unique: false },
    first_name: { type: String, required: false },
    last_name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    user_photo: { type: String, required: false },
    subscribed_for_news_letters: {
      type: Boolean,
      required: false,
      default: false
    },
    newsletters: { type: Boolean, required: false, default: false },
    user_menus: [{ type: Schema.Types.ObjectId, ref: "Menu" }],
    user_categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    user_cards: [{ type: Schema.Types.ObjectId, ref: "Card" }],
    user_plan: { type: Schema.Types.ObjectId, ref: "PackUsers" },
    user_transaction: [{ type: Schema.Types.ObjectId, ref: "Transactions" }],
    plan: { type: String, default: "free" },
    preferred_card: {
      type: Schema.Types.ObjectId,
      ref: "Card",
      required: false
    },
    email_verified: { type: Boolean, required: true, default: false },
    current_state: { type: Schema.Types.ObjectId, ref: "Packs" },
    payment_status: { type: String, required: false },
    auto_renew: { type: Boolean, required: false, default: false },
    pack_user: { type: Schema.Types.ObjectId, ref: "PackUsers" },
    amount_payed: { type: Number, default: 0.0 }, //used in upgrade/downgrade difference
    default_currency: { type: String, default: "sar" }, //used in upgrade/downgrade difference
    original_default_currency: { type: String, default: "" }, //when user switch default_currency backup original default_currency used for amount conversion
    source: { type: String, required: false },
    geoip: { type: String }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true } // So `console.log()` and other functions that use `toObject()` include virtuals }
  }
);

UserSchema.virtual("packUser", {
  ref: "PackUsers",
  localField: "user_plan",
  foreignField: "_id"
});

UserSchema.virtual("wallet", {
  ref: "Wallet",
  localField: "_id",
  foreignField: "user_id"
});

export const User = mongoose.model("User", UserSchema);

const WalletSchema = new Schema(
  {
    amount_debit: { type: Number },
    amount_credit: { type: Number },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false
    },
    transaction_id: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
      required: false
    },
    description: { type: String },
    currency: { type: String }
  },
  { timestamps: true }
);

export const Wallet = mongoose.model("Wallet", WalletSchema);