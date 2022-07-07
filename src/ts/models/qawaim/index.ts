import { Schema, model, Types } from 'mongoose'
import { addMonths } from 'date-fns'

export interface IAddresses {
  first_name: string
  last_name: string
  email: string
  address_line_1: string
  address_line_2: string
  city: string
  state: string
  zip_code: string
  country_code: string
  country: string
  user: Types.ObjectId
  createdAt: string
  updatedAt: string
}

const AddressesSchema = new Schema<IAddresses>(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    address_line_1: { type: String, required: true },
    address_line_2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip_code: { type: String, required: true },
    country_code: { type: String, required: true, default: 'SA' },
    country: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'Users', required: true }
  },
  { timestamps: true }
)

export const Addresses = model<IAddresses>('Addresses', AddressesSchema)

export interface IAdmin {
  first_name: string
  last_name: string
  user_name: string
  email: string
  password: string
  admin_role: Types.ObjectId
  createdAt: string
  updatedAt: string
}

const adminUsersSchema = new Schema<IAdmin>(
  {
    first_name: { type: String, required: false, unique: false },
    last_name: { type: String, required: false, unique: false },
    user_name: { type: String, required: true, unique: true },
    email: { type: String, required: false, unique: true, sparse: true },
    password: { type: String, required: true },
    admin_role: { type: Schema.Types.ObjectId, ref: 'Role' }
  },
  { timestamps: true }
)

export const UserAdmin = model<IAdmin>('admin', adminUsersSchema)

export interface ICard {
  language: string
  card_number: string
  expiry_date: string
  currency: string
  token_name: string
  card_holder_name: string
  brand: string
  status: string
  card_user: Types.ObjectId
  createdAt: string
  updatedAt: string
}

const userCards = new Schema<ICard>(
  {
    language: { type: String },
    card_number: { type: String },
    expiry_date: { type: String },
    currency: { type: String },
    token_name: { type: String },
    card_holder_name: { type: String },
    brand: { type: String },
    status: { type: String },
    card_user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
)

export const Card = model<ICard>('Card', userCards)

export interface ICategory {
  category_name: string
  category_name_ar: string
  user_categories: Types.ObjectId
  category_menu: Types.ObjectId
}

const CategorySchema = new Schema<ICategory>(
  {
    category_name: { type: String, required: false },
    category_name_ar: { type: String, required: false },
    user_categories: { type: Schema.Types.ObjectId, ref: 'User' },
    category_menu: { type: Schema.Types.ObjectId, ref: 'Menu' }
  },
  { strict: false }
)

export const Category = model<ICategory>('Category', CategorySchema)

export interface IEmail_Actions {
  email_mode: string
  email_oobCode: string
  email_created: Date
  email_expire: Date
  user_email: string
  user: Types.ObjectId
}

const EmailActionSchema = new Schema<IEmail_Actions>({
  email_mode: { type: String, required: true },
  email_oobCode: { type: String, required: true },
  email_created: { type: Date, default: new Date() },
  email_expire: { type: Date, default: addMonths(new Date(), 30) },
  user_email: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' }
})

export const EmailActions = model<IEmail_Actions>('Email_Actions', EmailActionSchema)

export interface IImage {
  image_url: string
  image_item: Types.ObjectId
}

const ImageSchema = new Schema<IImage>({
  image_url: { type: String, required: true },
  image_item: { type: Schema.Types.ObjectId, ref: 'Item' }
})

export const Image = model<IImage>('Image', ImageSchema)

export interface IItem {
  image_url: string
  image_item: Types.ObjectId

  item_name: string
  item_name_ar: string
  item_price: Number
  item_category: string
  item_category_ar: string
  item_status: string
  item_calories: Number
  item_description: string
  item_description_ar: string
  item_images: Types.ObjectId
  item_menu: Types.ObjectId
  item_options: [
    { option_title: String, option_title_ar: String, option_price: Number }
  ]
  item_price_type: string
  createdAt: string
  updatedAt: string
}

const ItemSchema = new Schema<IItem>({
  item_name: { type: String, required: false },
  item_name_ar: { type: String, required: false },
  item_price: { type: Number, required: false },
  item_category: { type: String, required: false },
  item_category_ar: { type: String, required: false },
  item_status: { type: String, required: true },
  item_calories: { type: Number, required: false },
  item_description: { type: String, required: false },
  item_description_ar: { type: String, required: false },
  item_images: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
  item_menu: { type: Schema.Types.ObjectId, ref: 'Menu' },
  item_options: [
    { option_title: String, option_title_ar: String, option_price: Number }
  ],
  item_price_type: { type: String, required: false }
},
{ timestamps: true })

export const Item = model<IItem>('Item', ItemSchema)

export interface ILandingFAQ {
  question: string
  question_ar: string
  answer: string
  answer_ar: string
}

const LandingFAQSchema = new Schema<ILandingFAQ>({
  question: { type: String, required: false },
  question_ar: { type: String, required: false },
  answer: { type: String, required: false },
  answer_ar: { type: String, required: false }
})

export const LandingFAQ = model<ILandingFAQ>('LandingFAQ', LandingFAQSchema)

export interface ILandingFeature {
  title: string
  title_ar: string
  subtitle: string
  subtitle_ar: string
  description: string
  description_ar: string
  icon: string
  soon: Boolean
}

const LandingFeatureSchema = new Schema<ILandingFeature>({
  title: { type: String, required: true },
  title_ar: { type: String, required: true },
  subtitle: { type: String, required: false },
  subtitle_ar: { type: String, required: false },
  description: { type: String, required: false },
  description_ar: { type: String, required: false },
  icon: { type: String, required: false },
  soon: { type: Boolean, required: false }
})

export const LandingFeature = model<ILandingFeature>('LandingFeature', LandingFeatureSchema)

export interface ILandingPartner {
  partner_name: string
  partner_name_ar: string
  partner_menu_link: string
  partner_website: string
  partner_logo: string
}

const LandingPartnerSchema = new Schema<ILandingPartner>({
  partner_name: { type: String, required: true },
  partner_name_ar: { type: String, required: false },
  partner_menu_link: { type: String, required: false },
  partner_website: { type: String, required: false },
  partner_logo: { type: String, required: false }
})

export const LandingPartner = model<ILandingPartner>('LandingPartner', LandingPartnerSchema)

export interface IMenuSettings {
  settings_menu: Types.ObjectId
  twitter: string
  facebook: string
  instagram: string
  delivery_hungerstation: string
  delivery_toyou: string
  delivery_jahez: string
  delivery_mrsool: string
  delivery_wssel: string
  delivery_talabat: string
  delivery_carriage: string
  snapchat: string
  show_menu_name: Boolean
  show_logo: Boolean
  show_address: Boolean
  show_order_button: Boolean
  show_hours: Boolean
  show_search: Boolean
  show_socials: Boolean
  show_delivery: Boolean
  hide_watermark: Boolean
  menu_phone: string
  menu_website: string
  menu_handle: string
  menu_handle_upper: string
  gmaps_link: string
}

const MenuSettingsSchema = new Schema<IMenuSettings>({
  settings_menu: { type: Schema.Types.ObjectId, ref: 'Menu' },
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
})

export const MenuSettings = model<IMenuSettings>('MenuSettings', MenuSettingsSchema)

export interface IMenu {
  menu_name: string
  menu_address: string
  menu_language: string
  menu_currency: string
  menu_logo: string
  menu_items: Types.ObjectId
  menu_user: Types.ObjectId
  menu_settings: Types.ObjectId
  menu_privacy: string
  menu_enabled: Boolean
  menu_style: {
    background_color: string
    primary_color: string
    item_color: string
    categories_color: string
    border_radius: string
  }
  menu_live: Boolean
  createdAt: string
  updatedAt: string
}

const MenuSchema = new Schema<IMenu>(
  {
    menu_name: { type: String, required: true },
    menu_address: { type: String, required: false },
    menu_language: { type: String, required: false },
    menu_currency: { type: String, required: true },
    menu_logo: { type: String, required: false },
    menu_items: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
    menu_user: { type: Schema.Types.ObjectId, ref: 'User' },
    menu_settings: { type: Schema.Types.ObjectId, ref: 'MenuSettings' },
    menu_privacy: { type: String, required: true, default: 'private' },
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
)

export const Menu = model<IMenu>('Menu', MenuSchema)

export interface IPackUsers {
  registration_id: string
  pack_id: Types.ObjectId
  user_id: Types.ObjectId
  transaction_id: Types.ObjectId
  cycle_date: string
  next_cycle_date: string
  recurring: string
  currency: string
  status: string
  renew_status: string
  createdAt: string
  updatedAt: string
}

const PackUsersSchema = new Schema<IPackUsers>(
  {
    registration_id: { type: String },
    pack_id: { type: Schema.Types.ObjectId, ref: 'Packs' },
    user_id: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    transaction_id: { type: Schema.Types.ObjectId, ref: 'Transaction' },
    cycle_date: { type: String },
    next_cycle_date: { type: String },
    recurring: { type: String },
    currency: { type: String },
    status: { type: String, required: true },
    renew_status: { type: String, default: '' }
  },
  { timestamps: true }
)

export const PackUsers = model<IPackUsers>('PackUsers', PackUsersSchema)

export interface IPacks {
  title: string
  title_ar: string
  subtitle: string
  subtitle_ar: string
  price_monthly_sar: Number
  price_annual_sar: Number
  price_3months_sar: Number
  price_6months_sar: Number
  price_monthly_usd: Number
  price_annual_usd: Number
  price_3months_usd: Number
  price_6months_usd: Number
  discount_sar: Number
  discount_usd: Number
  features: string[]
  features_ar: string[]
  status: Boolean
  order: Number
  menu_limit: Number
  items_limit: Number
  image_per_item_limit: Number
  custom_menu_url: Boolean
  custom_menu_style: Boolean
  ability_change_item_status: Boolean
  show_search_ability: Boolean
  show_social_icons: Boolean
  show_delivery_links: Boolean
  feature_order_button: Boolean
  feature_hide_watermark: Boolean
  feature_open_hours: Boolean
  is_trial: Boolean
  trial_x_days: Number
  createdAt: string
  updatedAt: string
}

const PackSchema = new Schema<IPacks>(
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
)

export const Packs = model<IPacks>('Packs', PackSchema)

export interface IPlan {
  plan_level: string
  cycle_date: Date
  recurring: string
  plan_user: Types.ObjectId
  registration_id: string
}

const userPlan = new Schema<IPlan>({
  plan_level: { type: String, required: true },
  cycle_date: { type: Date, required: false },
  recurring: { type: String, required: false },
  plan_user: { type: Schema.Types.ObjectId, ref: 'User' },
  registration_id: { type: String, required: true }
})

export const Plan = model<IPlan>('Plan', userPlan)

export interface IProhibition {
  action: string
  model: string
  prohibition_roles: Types.ObjectId
}

const ProhibitionSchema = new Schema<IProhibition>({
  action: { type: String, required: true },
  model: { type: String, required: false },
  prohibition_roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }]
})

export const Prohibition = model<IProhibition>('Prohibition', ProhibitionSchema)

export interface IRole {
  name: string
  role_users: Types.ObjectId[]
  role_admins: Types.ObjectId[]
  role_prohibitions: Types.ObjectId[]
}

const RoleSchema = new Schema<IRole>({
  name: { type: String, required: true },
  role_users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  role_admins: [{ type: Schema.Types.ObjectId, ref: 'UserAdmin' }],
  role_prohibitions: [{ type: Schema.Types.ObjectId, ref: 'Prohibition' }]
})

export const Role = model<IRole>('Role', RoleSchema)

export interface ITransactions {
  increment_id: string
  card: Types.ObjectId
  pack: Types.ObjectId
  pack_user: Types.ObjectId
  user: Types.ObjectId
  billing_address: Types.ObjectId
  registration_id: string
  parent_transaction: Types.ObjectId
  invoice_id: string
  original_amount: Number
  amount_wallet: Number
  amount: Number
  currency: string
  status: string
  paymentMethod: string
  referencedid: string
  payfort_id: string
  maintenance_reference: string
  createdAt: string
  updatedAt: string
}

const transactionSchema = new Schema<ITransactions>(
  {
    increment_id: { type: String, required: true },
    card: { type: Schema.Types.ObjectId, ref: 'Card' },
    pack: { type: Schema.Types.ObjectId, ref: 'Packs' },
    pack_user: { type: Schema.Types.ObjectId, ref: 'PackUsers' },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    billing_address: {
      type: Schema.Types.ObjectId,
      ref: 'Addresses',
      required: true
    },
    registration_id: { type: String },
    parent_transaction: { type: Schema.Types.ObjectId, ref: 'Transactions' },
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
)

export const Transaction = model<ITransactions>('Transactions', transactionSchema)

export interface IUser {
  user_display: string
  first_name: string
  last_name: string
  email: string
  password: string
  user_photo: string
  subscribed_for_news_letters: Boolean
  newsletters: Boolean
  user_menus: Types.ObjectId[]
  user_categories: Types.ObjectId[]
  user_cards: Types.ObjectId[]
  user_plan: Types.ObjectId
  user_transaction: Types.ObjectId[]
  plan: string
  preferred_card: Types.ObjectId
  email_verified: Boolean
  current_state: Types.ObjectId
  payment_status: string
  auto_renew: Boolean
  pack_user: Types.ObjectId
  amount_payed: Number // used in upgrade/downgrade difference
  default_currency: string // used in upgrade/downgrade difference
  original_default_currency: string // when user switch default_currency backup original default_currency used for amount conversion
  source: string
  geoip: string
  createdAt: string
  updatedAt: string
}

const UserSchema = new Schema<IUser>(
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
    user_menus: [{ type: Schema.Types.ObjectId, ref: 'Menu' }],
    user_categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    user_cards: [{ type: Schema.Types.ObjectId, ref: 'Card' }],
    user_plan: { type: Schema.Types.ObjectId, ref: 'PackUsers' },
    user_transaction: [{ type: Schema.Types.ObjectId, ref: 'Transactions' }],
    plan: { type: String, default: 'free' },
    preferred_card: {
      type: Schema.Types.ObjectId,
      ref: 'Card',
      required: false
    },
    email_verified: { type: Boolean, required: true, default: false },
    current_state: { type: Schema.Types.ObjectId, ref: 'Packs' },
    payment_status: { type: String, required: false },
    auto_renew: { type: Boolean, required: false, default: false },
    pack_user: { type: Schema.Types.ObjectId, ref: 'PackUsers' },
    amount_payed: { type: Number, default: 0.0 }, // used in upgrade/downgrade difference
    default_currency: { type: String, default: 'sar' }, // used in upgrade/downgrade difference
    original_default_currency: { type: String, default: '' }, // when user switch default_currency backup original default_currency used for amount conversion
    source: { type: String, required: false },
    geoip: { type: String }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true } // So `console.log()` and other functions that use `toObject()` include virtuals }
  }
)

UserSchema.virtual('packUser', {
  ref: 'PackUsers',
  localField: 'user_plan',
  foreignField: '_id'
})

UserSchema.virtual('wallet', {
  ref: 'Wallet',
  localField: '_id',
  foreignField: 'user_id'
})

export const User = model<IUser>('User', UserSchema)

export interface IWallet {
  amount_debit: Number
  amount_credit: Number
  user_id: Types.ObjectId
  transaction_id: Types.ObjectId
  description: string
  currency: string
  createdAt: Date
  updatedAt: Date
}

const WalletSchema = new Schema<IWallet>(
  {
    amount_debit: { type: Number },
    amount_credit: { type: Number },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    transaction_id: {
      type: Schema.Types.ObjectId,
      ref: 'Transaction',
      required: false
    },
    description: { type: String },
    currency: { type: String }
  },
  { timestamps: true }
)

export const Wallet = model<IWallet>('Wallet', WalletSchema)
