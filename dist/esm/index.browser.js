import nodemailer from 'nodemailer';
import mongoose, { Schema, model } from 'mongoose';
import { addMonths } from 'date-fns';
import wkhtmltopdf from 'wkhtmltopdf';
import ejs from 'ejs';
import fs from 'fs';
import moment from 'moment';
import { Base64Encode } from 'base64-stream';
import QRCode from 'qrcode';
import schedule from 'node-schedule';
import AWS from 'aws-sdk';
import * as firebase from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword, updatePassword, updateEmail, updateProfile, deleteUser, signOut } from 'firebase/auth';
import 'crypto-js';

function setupEmail(params) {
    const listTransport = {};
    if (params.length > 0) {
        for (let i = 0; i < params.length; i++) {
            const config = params[i];
            const nameTransporter = config.name ?? '';
            const transporter = nodemailer.createTransport({
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

const AddressesSchema = new Schema({
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
}, { timestamps: true });
const Addresses = model('Addresses', AddressesSchema);
const adminUsersSchema = new Schema({
    first_name: { type: String, required: false, unique: false },
    last_name: { type: String, required: false, unique: false },
    user_name: { type: String, required: true, unique: true },
    email: { type: String, required: false, unique: true, sparse: true },
    password: { type: String, required: true },
    admin_role: { type: Schema.Types.ObjectId, ref: 'Role' }
}, { timestamps: true });
const UserAdmin = model('admin', adminUsersSchema);
const userCards = new Schema({
    language: { type: String },
    card_number: { type: String },
    expiry_date: { type: String },
    currency: { type: String },
    token_name: { type: String },
    card_holder_name: { type: String },
    brand: { type: String },
    status: { type: String },
    card_user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
const Card = model('Card', userCards);
const CategorySchema = new Schema({
    category_name: { type: String, required: false },
    category_name_ar: { type: String, required: false },
    user_categories: { type: Schema.Types.ObjectId, ref: 'User' },
    category_menu: { type: Schema.Types.ObjectId, ref: 'Menu' }
}, { strict: false });
const Category = model('Category', CategorySchema);
const EmailActionSchema = new Schema({
    email_mode: { type: String, required: true },
    email_oobCode: { type: String, required: true },
    email_created: { type: Date, default: new Date() },
    email_expire: { type: Date, default: addMonths(new Date(), 30) },
    user_email: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});
const EmailActions = model('Email_Actions', EmailActionSchema);
const ImageSchema = new Schema({
    image_url: { type: String, required: true },
    image_item: { type: Schema.Types.ObjectId, ref: 'Item' }
});
const Image = model('Image', ImageSchema);
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
    item_images: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
    item_menu: { type: Schema.Types.ObjectId, ref: 'Menu' },
    item_options: [
        { option_title: String, option_title_ar: String, option_price: Number }
    ],
    item_price_type: { type: String, required: false }
}, { timestamps: true });
const Item = model('Item', ItemSchema);
const LandingFAQSchema = new Schema({
    question: { type: String, required: false },
    question_ar: { type: String, required: false },
    answer: { type: String, required: false },
    answer_ar: { type: String, required: false }
});
const LandingFAQ = model('LandingFAQ', LandingFAQSchema);
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
const LandingFeature = model('LandingFeature', LandingFeatureSchema);
const LandingPartnerSchema = new Schema({
    partner_name: { type: String, required: true },
    partner_name_ar: { type: String, required: false },
    partner_menu_link: { type: String, required: false },
    partner_website: { type: String, required: false },
    partner_logo: { type: String, required: false }
});
const LandingPartner = model('LandingPartner', LandingPartnerSchema);
const MenuSettingsSchema = new Schema({
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
});
const MenuSettings = model('MenuSettings', MenuSettingsSchema);
const MenuSchema = new Schema({
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
}, { timestamps: true, strict: false });
const Menu = model('Menu', MenuSchema);
const PackUsersSchema = new Schema({
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
}, { timestamps: true });
const PackUsers = model('PackUsers', PackUsersSchema);
const PackSchema = new Schema({
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
const Packs = model('Packs', PackSchema);
const userPlan = new Schema({
    plan_level: { type: String, required: true },
    cycle_date: { type: Date, required: false },
    recurring: { type: String, required: false },
    plan_user: { type: Schema.Types.ObjectId, ref: 'User' },
    registration_id: { type: String, required: true }
});
const Plan = model('Plan', userPlan);
const ProhibitionSchema = new Schema({
    action: { type: String, required: true },
    model: { type: String, required: false },
    prohibition_roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }]
});
const Prohibition = model('Prohibition', ProhibitionSchema);
const RoleSchema = new Schema({
    name: { type: String, required: true },
    role_users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    role_admins: [{ type: Schema.Types.ObjectId, ref: 'UserAdmin' }],
    role_prohibitions: [{ type: Schema.Types.ObjectId, ref: 'Prohibition' }]
});
const Role = model('Role', RoleSchema);
const transactionSchema = new Schema({
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
}, { timestamps: true });
const Transaction = model('Transactions', transactionSchema);
const UserSchema = new Schema({
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
const User = model('User', UserSchema);
const WalletSchema = new Schema({
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
}, { timestamps: true });
const Wallet = model('Wallet', WalletSchema);

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
    const urlQrcode = await QRCode.toDataURL(`${String(process.env.QAWAIM_USER_PORTAL_URL)}/invoice/${String(dataUrlString)}`);
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
            date_invoice: moment(new Date((transaction?.createdAt !== undefined) ? transaction?.createdAt : '')).format(lang === 'ar' ? 'YYYY/MM/DD' : 'DD/MM/YYYY'),
            date_due: moment(new Date((transaction?.updatedAt !== undefined) ? transaction?.updatedAt : '')).format(lang === 'ar' ? 'YYYY/MM/DD' : 'DD/MM/YYYY'),
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
        ejs.renderFile('template/invoice/tpl-invoice.ejs', data, {}, function (err, str) {
            console.log(err);
            console.log(str);
            wkhtmltopdf(str).pipe(fs.createWriteStream(`invoices/invoice-${String(transaction?.invoice_id)}.pdf`, { flags: 'w' }));
        });
    }
    else {
        ejs.renderFile('template/invoice/tpl-invoice.ejs', data, {}, function (err, str) {
            console.log(err);
            // console.log(str);
            // let stream = wkhtmltopdf(str);
            // let blob = stream.toBlob('application/pdf');
            wkhtmltopdf(str).pipe(new Base64Encode()).pipe(res);
        });
    }
}

function setupCron(callback) {
    // Schedule tasks to be run on the server.
    const job = schedule.scheduleJob('*/1 * * * *', async function () {
        console.log('Job Start!');
        callback(job);
    });
}

function updateOptions(options) {
    globalThis._config = options;
}

function initializeDB(callback) {
    mongoose
        .connect(`mongodb+srv://${String(globalThis._config.mongodb_name)}:${String(global._config.mongodb_password)}@cluster0.dubdn.mongodb.net/${String(global._config.mongodb_user)}?retryWrites=true&w=majority`, global._config.mongodb_options, callback);
}

function initializeS3() {
    const config = {
        accessKeyId: globalThis._config.accessKeyId,
        secretAccessKey: globalThis._config.secretAccessKey
    };
    return new AWS.S3(config);
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
        const app = (firebase?.getApps().length > 0) ? firebase.initializeApp(params) : firebase.getApp();
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();
        globalThis._auth = auth;
        globalThis._provider = provider;
    }
}
async function signIn(fieldValues, e, callback) {
    try {
        const userCredential = await signInWithEmailAndPassword(globalThis._auth, fieldValues.email, fieldValues.password);
        callback(userCredential, fieldValues, e);
    }
    catch (error) {
        callback(error.code, fieldValues, e);
    }
}
async function signInViaGoogle(e, callback) {
    try {
        const userCredential = await signInWithPopup(globalThis._auth, globalThis._provider);
        callback(userCredential, e);
    }
    catch (error) {
        callback(error.code, e);
    }
}
async function create(auth, dataUser) {
    if (dataUser.email !== '' && dataUser.password !== '') {
        const userCredential = await createUserWithEmailAndPassword(auth, dataUser.email, dataUser.password);
        dataUser.callback(userCredential);
    }
}
async function update(auth, type, dataUserUpdate) {
    const user = auth.currentUser;
    if (user != null) {
        switch (type) {
            case 'profile':
                await updateProfile(user, { displayName: dataUserUpdate.displayName, photoURL: dataUserUpdate.photoUrl });
                break;
            case 'email':
                await updateEmail(user, dataUserUpdate.newEmail);
                break;
            case 'password':
                await updatePassword(user, dataUserUpdate.newPassword);
                break;
        }
        dataUserUpdate.callback(user, type, dataUserUpdate);
    }
}
async function deactivate() {
    console.log('deactivating user');
}
async function remove(auth, callback) {
    const user = auth.currentUser;
    if (user != null) {
        await deleteUser(user);
        callback(user);
    }
}
async function signOutUser(auth) {
    return await signOut(auth);
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

export { Hajar as default };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguYnJvd3Nlci5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3RzL2VtYWlsLnRzIiwiLi4vLi4vc3JjL3RzL21vZGVscy9xYXdhaW0vaW5kZXgudHMiLCIuLi8uLi9zcmMvdHMvaGVscGVycy50cyIsIi4uLy4uL3NyYy90cy9pbnZvaWNlLnRzIiwiLi4vLi4vc3JjL3RzL2Nyb24udHMiLCIuLi8uLi9zcmMvdHMvb3B0aW9ucy50cyIsIi4uLy4uL3NyYy90cy9kYXRhYmFzZS50cyIsIi4uLy4uL3NyYy90cy9hd3MtczMudHMiLCIuLi8uLi9zcmMvdHMvYXV0aC50cyIsIi4uLy4uL3NyYy90cy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6bnVsbCwibmFtZXMiOlsiaW52b2ljZUNyZWF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JNLFNBQVUsVUFBVSxDQUFFLE1BQStCLEVBQUE7SUFDekQsTUFBTSxhQUFhLEdBQStCLEVBQUUsQ0FBQTtBQUNwRCxJQUFBLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDckIsUUFBQSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN0QyxZQUFBLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN4QixZQUFBLE1BQU0sZUFBZSxHQUFXLE1BQU0sQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFBO0FBQ2pELFlBQUEsTUFBTSxXQUFXLEdBQUcsVUFBVSxDQUFDLGVBQWUsQ0FBQztnQkFDN0MsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO2dCQUNqQixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7Z0JBQ2pCLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTTtBQUNyQixnQkFBQSxJQUFJLEVBQUU7b0JBQ0osSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO29CQUNqQixJQUFJLEVB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QUFVLEdBQUcsSUFBSSxNQUFNLENBQzNCO0lBQ0UsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO0lBQ3ZDLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtJQUMxQyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7SUFDMUMsV0FBVyxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO0FBQzdDLElBQUEsaUJBQWlCLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO0FBQ25DLElBQUEsZ0JBQWdCLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO0FBQ2xDLElBQUEsaUJBQWlCLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO0FBQ25DLElBQUEsaUJBQWlCLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO0FBQ25DLElBQUEsaUJBQWlCLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO0FBQ25DLElBQUEsZ0JBQWdCLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO0FBQ2xDLElBQUEsaUJBQWlCLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO0FBQ25DLElBQUEsaUJBQWlCLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO0FBQ25DLElBQUEsWUFBWSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtBQUM5QixJQUFBLFlBQVksRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7SUFDOUIsUUFBUSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQztJQUM1QyxXQUFXLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDO0lBQy9DLE1BQU0sRUFB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
