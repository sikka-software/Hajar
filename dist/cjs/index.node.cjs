'use strict';

var nodemailer = require('nodemailer');
var mongoose = require('mongoose');
var dateFns = require('date-fns');
var wkhtmltopdf = require('wkhtmltopdf');
var ejs = require('ejs');
var fs = require('fs');
var moment = require('moment');
var base64Stream = require('base64-stream');
var QRCode = require('qrcode');
var schedule = require('node-schedule');
var AWS = require('aws-sdk');
var firebase = require('firebase/app');
var auth = require('firebase/auth');
require('crypto-js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var nodemailer__default = /*#__PURE__*/_interopDefaultLegacy(nodemailer);
var mongoose__default = /*#__PURE__*/_interopDefaultLegacy(mongoose);
var wkhtmltopdf__default = /*#__PURE__*/_interopDefaultLegacy(wkhtmltopdf);
var ejs__default = /*#__PURE__*/_interopDefaultLegacy(ejs);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var moment__default = /*#__PURE__*/_interopDefaultLegacy(moment);
var QRCode__default = /*#__PURE__*/_interopDefaultLegacy(QRCode);
var schedule__default = /*#__PURE__*/_interopDefaultLegacy(schedule);
var AWS__default = /*#__PURE__*/_interopDefaultLegacy(AWS);
var firebase__namespace = /*#__PURE__*/_interopNamespace(firebase);

function setupEmail(params) {
    const listTransport = {};
    if (params.length > 0) {
        for (let i = 0; i < params.length; i++) {
            const config = params[i];
            const nameTransporter = config.name ?? '';
            const transporter = nodemailer__default["default"].createTransport({
                host: config.host,
                port: config.port,
                secure: config.secure,
                auth: {
                    user: config.user,
                    pass: config.pass
                }
            });
            listTransport[nameTransporter] = transporter;
            (listTransport[nameTransporter]).verify(function (error, success) {
                if (error != null) {
                    console.log(error);
                }
                else {
                    console.log(`Server ${nameTransporter} is ready to send mail`);
                }
            });
        }
    }
    return listTransport;
}
async function sendEmail(transport, params) {
    return await new Promise((resolve, reject) => {
        transport.sendMail(params, function (error, info) {
            if (error === null) {
                console.log('error=', error);
                resolve(false);
            }
            else {
                console.log(info);
                resolve(true);
            }
        });
    });
}

const AddressesSchema = new mongoose.Schema({
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
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }
}, { timestamps: true });
const Addresses = mongoose.model('Addresses', AddressesSchema);
const adminUsersSchema = new mongoose.Schema({
    first_name: { type: String, required: false, unique: false },
    last_name: { type: String, required: false, unique: false },
    user_name: { type: String, required: true, unique: true },
    email: { type: String, required: false, unique: true, sparse: true },
    password: { type: String, required: true },
    admin_role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' }
}, { timestamps: true });
const UserAdmin = mongoose.model('admin', adminUsersSchema);
const userCards = new mongoose.Schema({
    language: { type: String },
    card_number: { type: String },
    expiry_date: { type: String },
    currency: { type: String },
    token_name: { type: String },
    card_holder_name: { type: String },
    brand: { type: String },
    status: { type: String },
    card_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
const Card = mongoose.model('Card', userCards);
const CategorySchema = new mongoose.Schema({
    category_name: { type: String, required: false },
    category_name_ar: { type: String, required: false },
    user_categories: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category_menu: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }
}, { strict: false });
const Category = mongoose.model('Category', CategorySchema);
const EmailActionSchema = new mongoose.Schema({
    email_mode: { type: String, required: true },
    email_oobCode: { type: String, required: true },
    email_created: { type: Date, default: new Date() },
    email_expire: { type: Date, default: dateFns.addMonths(new Date(), 30) },
    user_email: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
const EmailActions = mongoose.model('Email_Actions', EmailActionSchema);
const ImageSchema = new mongoose.Schema({
    image_url: { type: String, required: true },
    image_item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' }
});
const Image = mongoose.model('Image', ImageSchema);
const ItemSchema = new mongoose.Schema({
    item_name: { type: String, required: false },
    item_name_ar: { type: String, required: false },
    item_price: { type: Number, required: false },
    item_category: { type: String, required: false },
    item_category_ar: { type: String, required: false },
    item_status: { type: String, required: true },
    item_calories: { type: Number, required: false },
    item_description: { type: String, required: false },
    item_description_ar: { type: String, required: false },
    item_images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
    item_menu: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },
    item_options: [
        { option_title: String, option_title_ar: String, option_price: Number }
    ],
    item_price_type: { type: String, required: false }
}, { timestamps: true });
const Item = mongoose.model('Item', ItemSchema);
const LandingFAQSchema = new mongoose.Schema({
    question: { type: String, required: false },
    question_ar: { type: String, required: false },
    answer: { type: String, required: false },
    answer_ar: { type: String, required: false }
});
const LandingFAQ = mongoose.model('LandingFAQ', LandingFAQSchema);
const LandingFeatureSchema = new mongoose.Schema({
    title: { type: String, required: true },
    title_ar: { type: String, required: true },
    subtitle: { type: String, required: false },
    subtitle_ar: { type: String, required: false },
    description: { type: String, required: false },
    description_ar: { type: String, required: false },
    icon: { type: String, required: false },
    soon: { type: Boolean, required: false }
});
const LandingFeature = mongoose.model('LandingFeature', LandingFeatureSchema);
const LandingPartnerSchema = new mongoose.Schema({
    partner_name: { type: String, required: true },
    partner_name_ar: { type: String, required: false },
    partner_menu_link: { type: String, required: false },
    partner_website: { type: String, required: false },
    partner_logo: { type: String, required: false }
});
const LandingPartner = mongoose.model('LandingPartner', LandingPartnerSchema);
const MenuSettingsSchema = new mongoose.Schema({
    settings_menu: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },
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
const MenuSettings = mongoose.model('MenuSettings', MenuSettingsSchema);
const MenuSchema = new mongoose.Schema({
    menu_name: { type: String, required: true },
    menu_address: { type: String, required: false },
    menu_language: { type: String, required: false },
    menu_currency: { type: String, required: true },
    menu_logo: { type: String, required: false },
    menu_items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
    menu_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    menu_settings: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuSettings' },
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
}, { timestamps: true, strict: false });
const Menu = mongoose.model('Menu', MenuSchema);
const PackUsersSchema = new mongoose.Schema({
    registration_id: { type: String },
    pack_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Packs' },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    transaction_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
    cycle_date: { type: String },
    next_cycle_date: { type: String },
    recurring: { type: String },
    currency: { type: String },
    status: { type: String, required: true },
    renew_status: { type: String, default: '' }
}, { timestamps: true });
const PackUsers = mongoose.model('PackUsers', PackUsersSchema);
const PackSchema = new mongoose.Schema({
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
}, { timestamps: true });
const Packs = mongoose.model('Packs', PackSchema);
const userPlan = new mongoose.Schema({
    plan_level: { type: String, required: true },
    cycle_date: { type: Date, required: false },
    recurring: { type: String, required: false },
    plan_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    registration_id: { type: String, required: true }
});
const Plan = mongoose.model('Plan', userPlan);
const ProhibitionSchema = new mongoose.Schema({
    action: { type: String, required: true },
    model: { type: String, required: false },
    prohibition_roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }]
});
const Prohibition = mongoose.model('Prohibition', ProhibitionSchema);
const RoleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role_users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    role_admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserAdmin' }],
    role_prohibitions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prohibition' }]
});
const Role = mongoose.model('Role', RoleSchema);
const transactionSchema = new mongoose.Schema({
    increment_id: { type: String, required: true },
    card: { type: mongoose.Schema.Types.ObjectId, ref: 'Card' },
    pack: { type: mongoose.Schema.Types.ObjectId, ref: 'Packs' },
    pack_user: { type: mongoose.Schema.Types.ObjectId, ref: 'PackUsers' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    billing_address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Addresses',
        required: true
    },
    registration_id: { type: String },
    parent_transaction: { type: mongoose.Schema.Types.ObjectId, ref: 'Transactions' },
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
}, { timestamps: true });
const Transaction = mongoose.model('Transactions', transactionSchema);
const UserSchema = new mongoose.Schema({
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
    user_menus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }],
    user_categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    user_cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }],
    user_plan: { type: mongoose.Schema.Types.ObjectId, ref: 'PackUsers' },
    user_transaction: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transactions' }],
    plan: { type: String, default: 'free' },
    preferred_card: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card',
        required: false
    },
    email_verified: { type: Boolean, required: true, default: false },
    current_state: { type: mongoose.Schema.Types.ObjectId, ref: 'Packs' },
    payment_status: { type: String, required: false },
    auto_renew: { type: Boolean, required: false, default: false },
    pack_user: { type: mongoose.Schema.Types.ObjectId, ref: 'PackUsers' },
    amount_payed: { type: Number, default: 0.0 },
    default_currency: { type: String, default: 'sar' },
    original_default_currency: { type: String, default: '' },
    source: { type: String, required: false },
    geoip: { type: String }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true } // So `console.log()` and other functions that use `toObject()` include virtuals }
});
UserSchema.virtual('packUser', {
    ref: 'PackUsers',
    localField: 'user_plan',
    foreignField: '_id'
});
UserSchema.virtual('wallet', {
    ref: 'Wallet',
    localField: '_id',
    foreignField: 'user_id'
});
const User = mongoose.model('User', UserSchema);
const WalletSchema = new mongoose.Schema({
    amount_debit: { type: Number },
    amount_credit: { type: Number },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    transaction_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
        required: false
    },
    description: { type: String },
    currency: { type: String }
}, { timestamps: true });
const Wallet = mongoose.model('Wallet', WalletSchema);

var models = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Addresses: Addresses,
    UserAdmin: UserAdmin,
    Card: Card,
    Category: Category,
    EmailActions: EmailActions,
    Image: Image,
    Item: Item,
    LandingFAQ: LandingFAQ,
    LandingFeature: LandingFeature,
    LandingPartner: LandingPartner,
    MenuSettings: MenuSettings,
    Menu: Menu,
    PackUsers: PackUsers,
    Packs: Packs,
    Plan: Plan,
    Prohibition: Prohibition,
    Role: Role,
    Transaction: Transaction,
    User: User,
    Wallet: Wallet
});

/* eslint-disable @typescript-eslint/naming-convention */
function getPrice(cycle, currency, pack) {
    let price = 0;
    if (cycle === 'annually') {
        if (currency === 'usd') {
            price = pack?.price_annual_usd;
        }
        else {
            price = pack?.price_annual_sar;
        }
    }
    else if (cycle === '3-months') {
        if (currency === 'usd') {
            price = pack?.price_3months_usd;
        }
        else {
            price = pack?.price_3months_sar;
        }
    }
    else if (cycle === '6-months') {
        if (currency === 'usd') {
            price = pack?.price_6months_usd;
        }
        else {
            price = pack?.price_6months_sar;
        }
    }
    else {
        if (currency === 'usd') {
            price = pack?.price_monthly_usd;
        }
        else {
            price = pack?.price_monthly_sar;
        }
    }
    return price;
}
function formatCurrency(cents, currency) {
    if (currency === 'SAR') {
        return String(cents) + ' ' + String(currency);
    }
    return String(currency) + ' ' + String(cents);
}

/* eslint-disable @typescript-eslint/naming-convention */
async function createInvoice(transactionID, res, lang, isMail, isWallet) {
    const dataUrlString = Buffer.from(`${String(transactionID)}_${String(lang)}_${String(isWallet)}`).toString('base64');
    const urlQrcode = await QRCode__default["default"].toDataURL(`${String(process.env.QAWAIM_USER_PORTAL_URL)}/invoice/${String(dataUrlString)}`);
    console.log(urlQrcode);
    const transaction = await Transaction.findOne({
        _id: transactionID
    })
        .populate('card')
        .populate('pack')
        .populate('pack_user')
        .populate('user')
        .populate('billing_address')
        .populate('parent_transaction')
        .exec();
    let price;
    let cycletexteinvoice;
    let pack_subtitle_text;
    let pack_title_text;
    let pack_price_value;
    if (isWallet === false) {
        price = getPrice(transaction?.pack_user.recurring, transaction?.currency, transaction?.pack);
        const cycle = transaction?.pack_user.recurring;
        if (cycle === 'monthly') {
            if (lang === 'ar') {
                cycletexteinvoice = 'شهريا';
            }
            else {
                cycletexteinvoice = '(Monthly)';
            }
        }
        else if (cycle === '3-months') {
            if (lang === 'ar') {
                cycletexteinvoice = '3 أشهر';
            }
            else {
                cycletexteinvoice = '(3 Months)';
            }
        }
        else if (cycle === '6-months') {
            if (lang === 'ar') {
                cycletexteinvoice = '6 أشهر';
            }
            else {
                cycletexteinvoice = '(6 Months)';
            }
        }
        else {
            if (lang === 'ar') {
                cycletexteinvoice = 'سنويا';
            }
            else {
                cycletexteinvoice = '(Annually)';
            }
        }
        pack_title_text =
            lang === 'ar'
                ? String(transaction?.pack.title_ar) + '-' + String(cycletexteinvoice)
                : String(transaction?.pack.title) + '-' + String(cycletexteinvoice);
        pack_subtitle_text =
            lang === 'ar' ? String(transaction?.pack.subtitle_ar) : String(transaction?.pack.subtitle);
        pack_price_value = formatCurrency(price, transaction?.currency);
    }
    if (isWallet === true) {
        price = ((transaction?.amount) != null) ? transaction?.amount : 0;
        pack_title_text = lang === 'ar' ? 'مبلغ المحفظة' : 'Wallet Amount';
        pack_price_value = formatCurrency(transaction?.amount, transaction?.currency);
    }
    const data = {
        invoice_lang: lang,
        invoice_company: {
            name: 'Sikka Software Est',
            address: 'Ash Shati Ash Sharqi, Dammam. Eastern Region, Saudi Arabia',
            phone: '',
            email: 'contact@qawaim.app'
        },
        invoice_customer: {
            full_name: String(transaction?.billing_address.first_name) + ' ' + String(transaction?.billing_address.last_name),
            address: String(transaction?.billing_address.address_line_1) +
                ' ' +
                String(transaction?.billing_address.address_line_2) +
                ' ' +
                String(transaction?.billing_address.city) +
                ' ' +
                String(transaction?.billing_address.zip_code) +
                ' ' +
                String(transaction?.billing_address.state) +
                ',' +
                String(transaction?.billing_address.country),
            email: transaction?.billing_address.email
        },
        invoice_data: {
            qrCodeURL: urlQrcode,
            invoice_id: '#' + String(transaction?.invoice_id),
            date_invoice: moment__default["default"](new Date((transaction?.createdAt !== undefined) ? transaction?.createdAt : '')).format(lang === 'ar' ? 'YYYY/MM/DD' : 'DD/MM/YYYY'),
            date_due: moment__default["default"](new Date((transaction?.updatedAt !== undefined) ? transaction?.updatedAt : '')).format(lang === 'ar' ? 'YYYY/MM/DD' : 'DD/MM/YYYY'),
            pack_title: pack_title_text,
            pack_subtitle: pack_subtitle_text,
            pack_price: pack_price_value
        },
        invoice_translate: {
            invoice: lang === 'ar' ? 'فاتورة ' : 'INVOICE ',
            invoice_to: lang === 'ar' ? 'فاتورة إلى:' : 'INVOICE TO:',
            date_invoice: lang === 'ar' ? 'تاريخ الفاتورة: ' : 'Date of Invoice: ',
            date_due: lang === 'ar' ? 'تاريخ الدفع: ' : 'Due Date: ',
            table: {
                description: lang === 'ar' ? 'الباقة' : 'DESCRIPTION',
                unit_price: lang === 'ar' ? 'سعر الوحدة' : 'UNIT PRICE',
                quantity: lang === 'ar' ? 'كمية' : 'QUANTITY',
                total_product: lang === 'ar' ? 'المجموع' : 'TOTAL',
                subtotal: lang === 'ar' ? 'المجموع الفرعي' : 'SUBTOTAL',
                grandtotal: lang === 'ar' ? 'المبلغ الإجمالي' : 'GRAND TOTAL'
            },
            thanks: lang === 'ar' ? 'شكرا لك!' : 'Thank you!',
            footer: lang === 'ar'
                ? 'تم إنشاء الفاتورة على جهاز كمبيوتر وهي صالحة بدون التوقيع والختم.'
                : 'Invoice was created on a computer and is valid without the signature and seal.',
            notice: lang === 'ar' ? 'تنويه:' : 'NOTICE:',
            notice_text: lang === 'ar'
                ? 'سيتم فرض رسوم تمويل بنسبة 1.5٪ على الأرصدة غير المدفوعة بعد 30 يومًا.'
                : 'A finance charge of 1.5% will be made on unpaid balances after 30 days.'
        }
    };
    if (isMail === true) {
        ejs__default["default"].renderFile('template/invoice/tpl-invoice.ejs', data, {}, function (err, str) {
            console.log(err);
            console.log(str);
            wkhtmltopdf__default["default"](str).pipe(fs__default["default"].createWriteStream(`invoices/invoice-${String(transaction?.invoice_id)}.pdf`, { flags: 'w' }));
        });
    }
    else {
        ejs__default["default"].renderFile('template/invoice/tpl-invoice.ejs', data, {}, function (err, str) {
            console.log(err);
            // console.log(str);
            // let stream = wkhtmltopdf(str);
            // let blob = stream.toBlob('application/pdf');
            wkhtmltopdf__default["default"](str).pipe(new base64Stream.Base64Encode()).pipe(res);
        });
    }
}

function setupCron(callback) {
    // Schedule tasks to be run on the server.
    const job = schedule__default["default"].scheduleJob('*/1 * * * *', async function () {
        console.log('Job Start!');
        callback(job);
    });
}

function updateOptions(options) {
    globalThis._config = options;
}

function initializeDB(callback) {
    mongoose__default["default"]
        .connect(`mongodb+srv://${String(globalThis._config.mongodb_name)}:${String(global._config.mongodb_password)}@cluster0.dubdn.mongodb.net/${String(global._config.mongodb_user)}?retryWrites=true&w=majority`, global._config.mongodb_options, callback);
}

function initializeS3() {
    const config = {
        accessKeyId: globalThis._config.accessKeyId,
        secretAccessKey: globalThis._config.secretAccessKey
    };
    return new AWS__default["default"].S3(config);
}
async function uploadImage(params, callback, e) {
    try {
        const stored = await initializeS3().putObject(params).promise();
        callback(stored, e);
    }
    catch (error) {
        callback(error, e);
    }
}
async function deleteImage(params, callback, e) {
    try {
        const deleted = await initializeS3().deleteObject(params).promise();
        callback(deleted, e);
    }
    catch (error) {
        callback(error, e);
    }
}
async function deleteImages(params, callback, e) {
    try {
        const deleted = await initializeS3().deleteObjects(params).promise();
        callback(deleted, e);
    }
    catch (error) {
        callback(error, e);
    }
}

async function initialize(params) {
    if (params.apiKey !== '' &&
        params.authDomain !== '' &&
        params.projectId !== '' &&
        params.storageBucket !== '' &&
        params.messagingSenderId !== '' &&
        params.appId !== '' &&
        params.measurementId !== '') {
        const app = (firebase__namespace?.getApps().length > 0) ? firebase__namespace.initializeApp(params) : firebase__namespace.getApp();
        const auth$1 = auth.getAuth(app);
        const provider = new auth.GoogleAuthProvider();
        globalThis._auth = auth$1;
        globalThis._provider = provider;
    }
}
async function signIn(fieldValues, e, callback) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(globalThis._auth, fieldValues.email, fieldValues.password);
        callback(userCredential, fieldValues, e);
    }
    catch (error) {
        callback(error.code, fieldValues, e);
    }
}
async function signInViaGoogle(e, callback) {
    try {
        const userCredential = await auth.signInWithPopup(globalThis._auth, globalThis._provider);
        callback(userCredential, e);
    }
    catch (error) {
        callback(error.code, e);
    }
}
async function create(auth$1, dataUser) {
    if (dataUser.email !== '' && dataUser.password !== '') {
        const userCredential = await auth.createUserWithEmailAndPassword(auth$1, dataUser.email, dataUser.password);
        dataUser.callback(userCredential);
    }
}
async function update(auth$1, type, dataUserUpdate) {
    const user = auth$1.currentUser;
    if (user != null) {
        switch (type) {
            case 'profile':
                await auth.updateProfile(user, { displayName: dataUserUpdate.displayName, photoURL: dataUserUpdate.photoUrl });
                break;
            case 'email':
                await auth.updateEmail(user, dataUserUpdate.newEmail);
                break;
            case 'password':
                await auth.updatePassword(user, dataUserUpdate.newPassword);
                break;
        }
        dataUserUpdate.callback(user, type, dataUserUpdate);
    }
}
async function deactivate() {
    console.log('deactivating user');
}
async function remove(auth$1, callback) {
    const user = auth$1.currentUser;
    if (user != null) {
        await auth.deleteUser(user);
        callback(user);
    }
}
async function signOutUser(auth$1) {
    return await auth.signOut(auth$1);
}

/**
 * My module description. Please update with your module data.
 *
 * @remarks
 * This module runs perfectly in node.js and browsers
 *
 * @packageDocumentation
 */
/*
example use
Hajar.Database()
Hajar.Invoice()
Hajar.Mail.setupEmail()
Hajar.Mail.sendEmail()
*/
const Hajar = {
    Config: updateOptions,
    Database: initializeDB,
    Models: {
        Qawaim: models
    },
    Invoice: createInvoice,
    Mail: { SetupEmail: setupEmail, SendEmail: sendEmail },
    // will be added next release
    /* Payment: {
      Wallet: setupWallet,
      Payfort: setupAmazonPayments,
      Paypal: setupPaypal,
      GooglePay: setupGooglePay,
    }, */
    Auth: {
        SetupFirebase: initialize,
        CreateUser: create,
        UpdateUser: update,
        DeactivateUser: deactivate,
        DeleteUser: remove,
        SignIn: signIn,
        SignInViaGoogle: signInViaGoogle,
        SignOut: signOutUser
    },
    S3: {
        InitializeS3: initializeS3,
        UploadImage: uploadImage,
        DeleteImage: deleteImage,
        DeleteImages: deleteImages
    },
    Schedule: setupCron
};

module.exports = Hajar;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgubm9kZS5janMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90cy9lbWFpbC50cyIsIi4uLy4uL3NyYy90cy9tb2RlbHMvcWF3YWltL2luZGV4LnRzIiwiLi4vLi4vc3JjL3RzL2hlbHBlcnMudHMiLCIuLi8uLi9zcmMvdHMvaW52b2ljZS50cyIsIi4uLy4uL3NyYy90cy9jcm9uLnRzIiwiLi4vLi4vc3JjL3RzL29wdGlvbnMudHMiLCIuLi8uLi9zcmMvdHMvZGF0YWJhc2UudHMiLCIuLi8uLi9zcmMvdHMvYXdzLXMzLnRzIiwiLi4vLi4vc3JjL3RzL2F1dGgudHMiLCIuLi8uLi9zcmMvdHMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOm51bGwsIm5hbWVzIjpbIm5vZGVtYWlsZXIiLCJTY2hlbWEiLCJtb2RlbCIsImFkZE1vbnRocyIsIlFSQ29kZSIsIm1vbWVudCIsImVqcyIsIndraHRtbHRvcGRmIiwiZnMiLCJCYXNlNjRFbmNvZGUiLCJzY2hlZHVsZSIsIm1vbmdvb3NlIiwiQVdTIiwiZmlyZWJhc2UiLCJhdXRoIiwiZ2V0QXV0aCIsIkdvb2dsZUF1dGhQcm92aWRlciIsInNpZ25JbldpdGhFbWFpbEFuZFBhc3N3b3JkIiwic2lnbkluV2l0aFBvcHVwIiwiY3JlYXRlVXNlcldpdGhFbWFpbEFuZFBhc3N3b3JkIiwidXBkYXRlUHJvZmlsZSIsInVwZGF0ZUVtYWlsIiwidXBkYXRlUGFzc3dvcmQiLCJkZWxldGVVc2VyIiwic2lnbk91dCIsImludm9pY2VDcmVhdGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWdCTSxTQUFVLFVBQVUsQ0FBRSxNQUErQixFQUFBO0lBQ3pELE1BQU0sYUFBYSxHQUErQixFQUFFLENBQUE7QUFDcEQsSUFBQSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3JCLFFBQUEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FB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
