/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/inferschematype" />
import { Types } from 'mongoose';
export interface IAddresses {
    first_name: string;
    last_name: string;
    email: string;
    address_line_1: string;
    address_line_2: string;
    city: string;
    state: string;
    zip_code: string;
    country_code: string;
    country: string;
    user: Types.ObjectId;
    createdAt: string;
    updatedAt: string;
}
export declare const Addresses: import("mongoose").Model<IAddresses, {}, {}, {}, any>;
export interface IAdmin {
    first_name: string;
    last_name: string;
    user_name: string;
    email: string;
    password: string;
    admin_role: Types.ObjectId;
    createdAt: string;
    updatedAt: string;
}
export declare const UserAdmin: import("mongoose").Model<IAdmin, {}, {}, {}, any>;
export interface ICard {
    language: string;
    card_number: string;
    expiry_date: string;
    currency: string;
    token_name: string;
    card_holder_name: string;
    brand: string;
    status: string;
    card_user: Types.ObjectId;
    createdAt: string;
    updatedAt: string;
}
export declare const Card: import("mongoose").Model<ICard, {}, {}, {}, any>;
export interface ICategory {
    category_name: string;
    category_name_ar: string;
    user_categories: Types.ObjectId;
    category_menu: Types.ObjectId;
}
export declare const Category: import("mongoose").Model<ICategory, {}, {}, {}, any>;
export interface IEmail_Actions {
    email_mode: string;
    email_oobCode: string;
    email_created: Date;
    email_expire: Date;
    user_email: string;
    user: Types.ObjectId;
}
export declare const EmailActions: import("mongoose").Model<IEmail_Actions, {}, {}, {}, any>;
export interface IImage {
    image_url: string;
    image_item: Types.ObjectId;
}
export declare const Image: import("mongoose").Model<IImage, {}, {}, {}, any>;
export interface IItem {
    image_url: string;
    image_item: Types.ObjectId;
    item_name: string;
    item_name_ar: string;
    item_price: Number;
    item_category: string;
    item_category_ar: string;
    item_status: string;
    item_calories: Number;
    item_description: string;
    item_description_ar: string;
    item_images: Types.ObjectId;
    item_menu: Types.ObjectId;
    item_options: [
        {
            option_title: String;
            option_title_ar: String;
            option_price: Number;
        }
    ];
    item_price_type: string;
    createdAt: string;
    updatedAt: string;
}
export declare const Item: import("mongoose").Model<IItem, {}, {}, {}, any>;
export interface ILandingFAQ {
    question: string;
    question_ar: string;
    answer: string;
    answer_ar: string;
}
export declare const LandingFAQ: import("mongoose").Model<ILandingFAQ, {}, {}, {}, any>;
export interface ILandingFeature {
    title: string;
    title_ar: string;
    subtitle: string;
    subtitle_ar: string;
    description: string;
    description_ar: string;
    icon: string;
    soon: Boolean;
}
export declare const LandingFeature: import("mongoose").Model<ILandingFeature, {}, {}, {}, any>;
export interface ILandingPartner {
    partner_name: string;
    partner_name_ar: string;
    partner_menu_link: string;
    partner_website: string;
    partner_logo: string;
}
export declare const LandingPartner: import("mongoose").Model<ILandingPartner, {}, {}, {}, any>;
export interface IMenuSettings {
    settings_menu: Types.ObjectId;
    twitter: string;
    facebook: string;
    instagram: string;
    delivery_hungerstation: string;
    delivery_toyou: string;
    delivery_jahez: string;
    delivery_mrsool: string;
    delivery_wssel: string;
    delivery_talabat: string;
    delivery_carriage: string;
    snapchat: string;
    show_menu_name: Boolean;
    show_logo: Boolean;
    show_address: Boolean;
    show_order_button: Boolean;
    show_hours: Boolean;
    show_search: Boolean;
    show_socials: Boolean;
    show_delivery: Boolean;
    hide_watermark: Boolean;
    menu_phone: string;
    menu_website: string;
    menu_handle: string;
    menu_handle_upper: string;
    gmaps_link: string;
}
export declare const MenuSettings: import("mongoose").Model<IMenuSettings, {}, {}, {}, any>;
export interface IMenu {
    menu_name: string;
    menu_address: string;
    menu_language: string;
    menu_currency: string;
    menu_logo: string;
    menu_items: Types.ObjectId;
    menu_user: Types.ObjectId;
    menu_settings: Types.ObjectId;
    menu_privacy: string;
    menu_enabled: Boolean;
    menu_style: {
        background_color: string;
        primary_color: string;
        item_color: string;
        categories_color: string;
        border_radius: string;
    };
    menu_live: Boolean;
    createdAt: string;
    updatedAt: string;
}
export declare const Menu: import("mongoose").Model<IMenu, {}, {}, {}, any>;
export interface IPackUsers {
    registration_id: string;
    pack_id: Types.ObjectId;
    user_id: Types.ObjectId;
    transaction_id: Types.ObjectId;
    cycle_date: string;
    next_cycle_date: string;
    recurring: string;
    currency: string;
    status: string;
    renew_status: string;
    createdAt: string;
    updatedAt: string;
}
export declare const PackUsers: import("mongoose").Model<IPackUsers, {}, {}, {}, any>;
export interface IPacks {
    title: string;
    title_ar: string;
    subtitle: string;
    subtitle_ar: string;
    price_monthly_sar: Number;
    price_annual_sar: Number;
    price_3months_sar: Number;
    price_6months_sar: Number;
    price_monthly_usd: Number;
    price_annual_usd: Number;
    price_3months_usd: Number;
    price_6months_usd: Number;
    discount_sar: Number;
    discount_usd: Number;
    features: string[];
    features_ar: string[];
    status: Boolean;
    order: Number;
    menu_limit: Number;
    items_limit: Number;
    image_per_item_limit: Number;
    custom_menu_url: Boolean;
    custom_menu_style: Boolean;
    ability_change_item_status: Boolean;
    show_search_ability: Boolean;
    show_social_icons: Boolean;
    show_delivery_links: Boolean;
    feature_order_button: Boolean;
    feature_hide_watermark: Boolean;
    feature_open_hours: Boolean;
    is_trial: Boolean;
    trial_x_days: Number;
    createdAt: string;
    updatedAt: string;
}
export declare const Packs: import("mongoose").Model<IPacks, {}, {}, {}, any>;
export interface IPlan {
    plan_level: string;
    cycle_date: Date;
    recurring: string;
    plan_user: Types.ObjectId;
    registration_id: string;
}
export declare const Plan: import("mongoose").Model<IPlan, {}, {}, {}, any>;
export interface IProhibition {
    action: string;
    model: string;
    prohibition_roles: Types.ObjectId;
}
export declare const Prohibition: import("mongoose").Model<IProhibition, {}, {}, {}, any>;
export interface IRole {
    name: string;
    role_users: Types.ObjectId[];
    role_admins: Types.ObjectId[];
    role_prohibitions: Types.ObjectId[];
}
export declare const Role: import("mongoose").Model<IRole, {}, {}, {}, any>;
export interface ITransactions {
    increment_id: string;
    card: Types.ObjectId;
    pack: Types.ObjectId;
    pack_user: Types.ObjectId;
    user: Types.ObjectId;
    billing_address: Types.ObjectId;
    registration_id: string;
    parent_transaction: Types.ObjectId;
    invoice_id: string;
    original_amount: Number;
    amount_wallet: Number;
    amount: Number;
    currency: string;
    status: string;
    paymentMethod: string;
    referencedid: string;
    payfort_id: string;
    maintenance_reference: string;
    createdAt: string;
    updatedAt: string;
}
export declare const Transaction: import("mongoose").Model<ITransactions, {}, {}, {}, any>;
export interface IUser {
    user_display: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    user_photo: string;
    subscribed_for_news_letters: Boolean;
    newsletters: Boolean;
    user_menus: Types.ObjectId[];
    user_categories: Types.ObjectId[];
    user_cards: Types.ObjectId[];
    user_plan: Types.ObjectId;
    user_transaction: Types.ObjectId[];
    plan: string;
    preferred_card: Types.ObjectId;
    email_verified: Boolean;
    current_state: Types.ObjectId;
    payment_status: string;
    auto_renew: Boolean;
    pack_user: Types.ObjectId;
    amount_payed: Number;
    default_currency: string;
    original_default_currency: string;
    source: string;
    geoip: string;
    createdAt: string;
    updatedAt: string;
}
export declare const User: import("mongoose").Model<IUser, {}, {}, {}, any>;
export interface IWallet {
    amount_debit: Number;
    amount_credit: Number;
    user_id: Types.ObjectId;
    transaction_id: Types.ObjectId;
    description: string;
    currency: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Wallet: import("mongoose").Model<IWallet, {}, {}, {}, any>;
//# sourceMappingURL=index.d.ts.map