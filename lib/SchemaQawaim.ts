import "reflect-metadata";
import {ObjectType, InputType, Field, ID} from "type-graphql";
import { buildSchema } from "graphql";

const user = `
type User {
	_id: ID!
	first_name: String
	last_name: String
	email: String!
	password: String
	email_verified: Boolean
	user_display: String
	user_photo: String
	user_plan: ID
	user_menus: [Menu!]
	user_categories: [Category!]
	user_role: Role
	emailVerified: Boolean
	subscribed_for_news_letters: Boolean
	newsletter: Boolean
	preferred_card: Card
	current_state: String,
	payment_status : String
	user_wallet: [Wallet]
	amount_payed: String
	auto_renew : Boolean
	default_currency: String
	original_default_currency: String
	source: String
	geoip: String
	createdAt: String
    updatedAt: String
}
input UserInput {
	first_name: String
	last_name: String
	user_display: String
	user_role: ID
	user_plan: ID
	user_photo: String
	email: String!
	password: String
	emailVerified: Boolean
	newsletter: Boolean
	subscribed_for_news_letters: Boolean
	auto_renew: Boolean
	user_wallet: ID
	amount_payed: String
	default_currency: String
	original_default_currency: String
	source: String
	geoip: String
}
input UserUpdate {
	email: String
	user_display: String
	user_plan: ID
	user_role: ID
	user_photo: String
	first_name: String
	last_name: String
	emailVerified: Boolean
	newsletter: Boolean
	subscribed_for_news_letters: Boolean
	auto_renew : Boolean
	user_wallet: ID
	amount_payed: String
	default_currency: String
	original_default_currency: String
	geoip: String
}
`;
const userMutations = `
	userPremium(userId: ID!): User
	userPro(userId: ID!): User!
	userEnterprise(userId: ID!): User!
	createUser(userInput: UserInput): User
	deleteUser(userId: ID!, email : String!): User
	updateUserEmail(userId:ID!, email : String!): User!
	updateUser(userId: ID!, userUpdate: UserUpdate): User
	updatePassword(userEmail: String!, password: String!): User!
	updatePreferredCard(userId: ID!, cardId: ID!): User!
	updateEmailVerifiedState(userId: ID!): User!
	updateCurrentState(userId:ID!, plan : String!): User
	updateUserPackID(userId: ID!, user_plan: ID!): User!
	resetPassword(email : String!, newPassword : String!): User!
	updateUserAutoRenew(userId: ID!, auto_renew: Boolean): User!
	updateUserDefaultCurrency(userId: ID!, default_currency: String): User!
`;
const userQueries = `
	user(userId: ID!): User!
	users: [User!]!
	subscribedUsers: [User!]
	userEmail(userEmail: String!): User!
	userMenus(userId: ID!): [Menu!]!
	userItems(userId: ID!): [Item!]!
	getPreferredCard(userId : ID!): String!
	getMenuNumbers(userId : ID!): Int!
`;
const wallet = `
type Wallet {
	_id: ID!
	amount_debit: Float
	amount_credit: Float
	user_id: User!
	transaction_id: Transaction
	description: String
	currency: String
	createdAt: String
	updatedAt: String
}
input WalletInput {
	amount_debit: Float
	amount_credit: Float
	user_id: ID!
	transaction_id: ID
	description: String
	currency: String
	createdAt: String
	updatedAt: String
}
`;
const walletMutations = `
	addWallet(walletInput: WalletInput): Wallet
`;
const walletQueries = `
	wallets: [Wallet!]!
	getWalletByID(walletId: ID!): Wallet
	getWalletByUserID(userId: ID!): Wallet
`;
const pack = `
type Packs {
	_id: ID!
	title: String!
	title_ar: String!
	subtitle: String!
	subtitle_ar: String!
	price_monthly_sar: Float
	price_annual_sar: Float
	price_3months_sar: Float
	price_6months_sar: Float


	price_monthly_usd: Float
	price_annual_usd: Float
	price_3months_usd: Float
	price_6months_usd: Float

	discount_sar: Float
	discount_usd: Float
	features: [String!]
	features_ar: [String!]
	is_trial: Boolean
	trial_x_days: Int
	status: Boolean!
	order: Int!
	menu_limit: Int
	items_limit: Int
	image_per_item_limit: Int
	custom_menu_url: Boolean
	custom_menu_style: Boolean
	ability_change_item_status: Boolean
	show_search_ability: Boolean
	show_social_icons: Boolean
	show_delivery_links: Boolean
	feature_hide_watermark: Boolean
	feature_order_button: Boolean
	feature_open_hours: Boolean
	createdAt: String
	updatedAt: String
}
input PackInput {
	title: String!
	title_ar: String!
	subtitle: String!
	subtitle_ar: String!
	price_monthly_sar: Float
	price_annual_sar: Float
	price_3months_sar: Float
	price_6months_sar: Float
	price_monthly_usd: Float
	price_annual_usd: Float
	price_3months_usd: Float
	price_6months_usd: Float
	discount_sar: Float
	discount_usd: Float
	features: [String!]
	features_ar: [String!]
	status: Boolean!
	order: Int!
	menu_limit: Int
	items_limit: Int
	image_per_item_limit: Int
	ability_change_item_status: Boolean
	custom_menu_url: Boolean
	custom_menu_style: Boolean
	show_search_ability: Boolean
	show_social_icons: Boolean
	show_delivery_links: Boolean
	feature_hide_watermark: Boolean
	feature_order_button: Boolean
	feature_open_hours: Boolean
	is_trial: Boolean
	trial_x_days: Int
}
input PackUpdate {
	title: String!
	title_ar: String!
	subtitle: String!
	subtitle_ar: String!
	price_monthly_sar: Float
	price_annual_sar: Float
	price_3months_sar: Float
	price_6months_sar: Float


	price_monthly_usd: Float
	price_annual_usd: Float
	price_3months_usd: Float
	price_6months_usd: Float
	discount_sar: Float
	discount_usd: Float
	features: [String!]
	features_ar: [String!]
	status: Boolean!
	order: Int!
	menu_limit: Int
	items_limit: Int
	image_per_item_limit: Int
	ability_change_item_status: Boolean
	custom_menu_url: Boolean
	custom_menu_style: Boolean
	show_search_ability: Boolean
	show_social_icons: Boolean
	show_delivery_links: Boolean
	feature_hide_watermark: Boolean
	feature_order_button: Boolean
	feature_open_hours: Boolean
	is_trial: Boolean
	trial_x_days: Int
}
`;
const packMutations = `
	createPack(packInput: PackInput): Packs
	deletePack(packId: ID!): Packs
	updatePack(packId: ID!, packUpdate: PackUpdate): Packs
`;
const packQueries = `
	pack(packId: ID!): Packs
	getPackByID(packId: ID!): Packs
	packs: [Packs!]!
	packsEnabled: [Packs!]!
`;
const packUsers = `
type PackUsers {
	_id: ID!
	pack_id: ID
	user_id: ID!
	transaction_id: ID
	cycle_date: String!
	next_cycle_date: String!
	recurring: String!
	currency: String
	status: String!
	renew_status: String
	createdAt: String
	updatedAt: String
}
input PackUsersInput {
	pack_id: ID
	user_id: ID!
	transaction_id: ID
	cycle_date: String!
	next_cycle_date: String!
	recurring: String!
	currency: String
	status: String!
	renew_status: String
	createdAt: String
	updatedAt: String
}
input PackUsersUpdate {
	pack_id: ID
	user_id: ID!
	transaction_id: ID
	cycle_date: String!
	next_cycle_date: String!
	recurring: String!
	currency: String
	status: String!
	renew_status: String
	createdAt: String
	updatedAt: String
}
`;
const packUsersMutations = `
	createPackUsers(currency: String, packUsersInput: PackUsersInput): PackUsers
	deletePackUsers(packUsersId: ID!): PackUsers
	updatePackUsers(packUsersId: ID!, packUsersUpdate: PackUsersUpdate): PackUsers
	updatePackUsersCycleExpiredDate(packUsersId: ID!, packUsersCycleDate: String, packUsersnextCycleDate: String): PackUsers
`;
const packUsersQueries = `
	packUsers(packUsersId: ID!): PackUsers
	packAllUsers: [PackUsers!]!
	getPackUsersByUserID(userId: ID!): [PackUsers!]!
	getPackUsersByPackID(packId: ID!): [PackUsers!]!
`;
const role = `
type Role {
	_id: ID!
	name: String!
	role_users: [User]
	role_admins: [UserAdmin]
	role_prohibitions: [Prohibition]
	createdAt: String
	updatedAt: String
}
input RoleInput {
	name: String!
	role_prohibitions: [ID]
}
input RoleUpdate {
	name: String!
	role_prohibitions: [ID]
}
`;
const roleMutations = `
	createRole(roleInput: RoleInput): Role
	deleteRole(roleId: ID!): Role
	updateRole(roleId: ID!, roleUpdate: RoleUpdate): Role
`;
const roleQueries = `
	role(roleId: ID!): Role
	roles: [Role!]
`;
const prohibition = `
type Prohibition {
	_id: ID!
	action: String!
	model: String!
	prohibition_roles: [Role]
	prohibition_users: [User]
	prohibition_admins: [UserAdmin]
	createdAt: String
	updatedAt: String
}
input ProhibitionInput {
	action: String!
	model: String!
	prohibition_roles: [ID]
}
input ProhibitionUpdate {
	action: String!
	model: String!
	prohibition_roles: [ID]
}
`;
const prohibitionMutations = `
	createProhibition(prohibitionInput: ProhibitionInput): Prohibition
	deleteProhibition(prohibitionId: ID!): Prohibition
	updateProhibition(prohibitionId: ID!, prohibitionUpdate: ProhibitionUpdate): Prohibition
`;
const prohibitionQueries = `
	prohibition(prohibitionId: ID!): Prohibition
	prohibitions: [Prohibition!]
`;
const card = `
type Card {
	_id: ID!
	language: String
	card_number: String
	expiry_date: String
	currency: String
	token_name: String
	card_holder_name: String
	brand: String
	status: String
	card_user: User!
	createdAt: String
	updatedAt: String
}
input CardInput {
	language: String
	card_number: String
	expiry_date: String
	currency: String
	token_name: String
	card_holder_name: String
	brand: String
	status: String
}
`;
const cardMutations = `
	addCard(cardInput : CardInput!): Card!
	deleteCard(userId : ID!, cardId : ID!): Card!
`;
const cardQueries = `
	getCards(userId: ID!): [Card]!
`;
const transaction = `
type Transaction {
	_id: ID!
	increment_id: String!
	card: Card
	pack: Packs
	pack_user: PackUsers
	user: User!
	billing_address: Address!
	status: String!
	registration_id: String
	parent_transaction: Transaction
	invoice_id: String
	original_amount: Float
	amount_wallet: Float
	amount: Float
	currency: String
	paymentMethod: String
	referencedid: String
	payfort_id: String
	maintenance_reference: String
	createdAt: String
	updatedAt: String
}
input TransactionInput {
	increment_id: String!
	card: ID
	pack: ID
	pack_user: ID
	user: ID!
	billing_address: ID!
	status: ID!
	registration_id: String
	parent_transaction: ID
	invoice_id: String
	original_amount: Float
	amount_wallet: Float
	amount: Float
	currency: String
	paymentMethod: String
	referencedid: String
	payfort_id: String
	maintenance_reference: String
}
`;
const transactionMutations = `
	addPaymentTransaction(transactioninput: TransactionInput! ) : Transaction!
`;
const transactionQueries = `
	getAllTransactions : [Transaction!]!
	getUserTransactions(userId: ID!) : [Transaction!]!
	getUserTransactionsByPage(userId: ID!, page: Int!, per_page: Int!) : [Transaction!]!
`;
const address = `
type Address {
	_id: ID!
	first_name: String!
	last_name: String!
	email: String!
	address_line_1: String!
	address_line_2: String
	city: String!
	state: String!
	zip_code: String!
	country_code: String!
	country: String!

	user: User!
	createdAt: String
	updatedAt: String
}
input AddressInput {
	first_name: String!
	last_name: String!
	email: String!
	address_line_1: String!
	address_line_2: String
	city: String!
	state: String!
	zip_code: String!
	country_code: String!
	country: String!

	user: ID!
}
input AddressUpdate {
	first_name: String!
	last_name: String!
	email: String!
	address_line_1: String!
	address_line_2: String
	city: String!
	state: String!
	zip_code: String!
	country_code: String!
	country: String!
}
`;
const addressesMutations = `
	addAddress(addressinput: AddressInput! ): Address!
	updateAddress(idAddress: ID!, addressUpdate: AddressUpdate!): Address!
`;
const addressesQueries = `
	getAllAddresses : [Address!]!
	getAddressByUserID(userId: ID!) : Address!
`;
const plan = `
type Plan {
	_id: ID!
	plan_level: String!
	cycle_date: String
	recurring: String
	plan_user: User!
}
input PlanInput {
	transaction_type: String!
}
`;
const planMutations = `
	
`;
const planQueries = `
	getLastPlan(userId: ID!): Plan!
`;
const userAdmin = `
type UserAdmin {
    _id: ID!
    first_name: String
    last_name: String
    user_name: String!
    email: String
    password: String
    admin_role: Role
    createdAt: String
    updatedAt: String
}
input AdminCreate {
	email: String
	user_name: String
	first_name: String
	last_name: String
	password: String
	admin_role: ID
}
input AdminUpdate {
	email: String
	user_name: String
	first_name: String
	last_name: String
	password: String
	admin_role: ID
}
`;
const userAdminMutations = `
	createAdminUser(adminCreate: AdminCreate): UserAdmin!
	updateAdminUser(adminUserId: ID!, adminUpdate: AdminUpdate): UserAdmin!
	deleteAdminUser(adminUserId: ID!): UserAdmin
`;
const userAdminQueries = `
	admin(adminUserId: ID!): UserAdmin!
	admins: [UserAdmin!]!
	getAdminByUsername(user_name: String!): UserAdmin!
`;
const menu = `
type Menu {
	_id: ID!
	menu_name: String!
	menu_currency: String!
	menu_address: String
	menu_language: String
	menu_logo: String
	menu_items: [Item!]
	menu_categories: [Category!]
	menu_user: User
	menu_status: String
	menu_enabled: Boolean
	menu_settings: MenuSettings
	menu_privacy: String!
	background_color: String
	primary_color : String
	item_color : String
	categories_color : String
	border_radius : Float
	menu_live: Boolean
	createdAt: String
	updatedAt: String
}
input MenuInput {
	menu_name: String!
	menu_currency: String!
	menu_logo: String
	menu_address: String
	menu_language: String
	menu_privacy: String!
}

input MenuUpdate {
	menu_name: String
	menu_currency: String
	menu_logo: String
	menu_address: String
	menu_enabled: Boolean
	menu_language: String
	menu_privacy: String!
	menu_user: ID
}


type MenuSettings {
	_id: ID!
	settings_menu : ID!

	twitter : String
	facebook : String
	instagram : String
	snapchat : String
	
	delivery_hungerstation: String
	delivery_toyou: String
	delivery_jahez: String
	delivery_mrsool: String
	delivery_wssel: String
	delivery_talabat: String
	delivery_carriage: String

	show_logo: Boolean
	show_address: Boolean
	show_order_button: Boolean
	show_search: Boolean
	hide_watermark: Boolean
	show_socials: Boolean
	show_delivery: Boolean
	show_menu_name: Boolean
	show_hours: Boolean
	menu_phone: String
	menu_website: String
	menu_handle: String
	menu_handle_upper : String
	gmaps_link: String

}
input MenuSettingsInput {
	twitter : String
	facebook : String
	instagram : String
	snapchat : String

	delivery_hungerstation: String
	delivery_toyou: String
	delivery_jahez: String
	delivery_mrsool: String
	delivery_wssel: String
	delivery_talabat: String
	delivery_carriage: String

	hide_watermark: Boolean
	show_search: Boolean
	show_socials: Boolean
	show_delivery: Boolean
	show_hours: Boolean
	show_logo: Boolean
	show_address: Boolean
	show_order_button: Boolean
	show_menu_name: Boolean
	
	menu_handle : String
	menu_website: String
	menu_phone: String


}
input MenuSettingsUpdate {
	settingsId : ID!
	
	twitter : String
	facebook : String
	instagram : String
	snapchat : String

	delivery_hungerstation: String
	delivery_toyou: String
	delivery_jahez: String
	delivery_mrsool: String
	delivery_wssel: String
	delivery_talabat: String
	delivery_carriage: String

	hide_watermark: Boolean
	show_search: Boolean
	show_socials: Boolean
	show_delivery: Boolean
	show_hours: Boolean

	show_logo: Boolean
	show_address: Boolean
	show_menu_name: Boolean
	show_order_button: Boolean

	menu_handle : String
	menu_website: String
	menu_phone: String

	gmaps_link: String
}

input MenuStyleSettings {
	background_color : String!
	primary_color : String!
	item_color : String!
	categories_color : String!
	border_radius: Float!

}
`;
const menuMutations = `
	createMenuSettings(menuId:ID!): MenuSettings!
	createMenu(menuInput: MenuInput, userId: ID!): Menu
	updateMenu(menuId: ID!, menuUpdate: MenuUpdate): Menu
	updateMenuName(menuId: ID!, menuName: String!): Menu!
	updateCustomMenuLink(menuId : ID!, customLink : String!) : Menu!
	updateMenuLink(menuId:ID!, customLink: String!): Menu!
	updateMenuSettings(menuId:ID!, menuSettingsUpdate:MenuSettingsUpdate): MenuSettings!
	updateMenuEnabled(menuID:ID!, menuEnabled : Boolean!): Menu!
	updateMenuStyle(menuId:ID!, menuStyle : MenuStyleSettings!): Menu
	updateMenuLive(menuId: ID!): Menu!
	transferMenu(menuId: ID!, newUserId: ID!): Menu!
	deleteMenu(menuId: ID!): Menu
	customMenuLink(menuId: ID!, customLink : String!): Menu!
`;
const menuQueries = `
	menus: [Menu!]!
	menuItems(menuId: ID!): [Item!]!
	menuCategories(menuId: ID!): [Category!]!
	menuSettings(menuId:ID!): MenuSettings
	menuSettingsByHandle(menuHandle: String!): MenuSettings
	singleMenu(menuId: ID!, userId: ID, isMenuPortal : Boolean): Menu!
	refetchMenu(menuId: ID!, userId: ID, isMenuPortal : Boolean): Menu!
	singleMenuWithHandle(menuHandle : String!): Menu!
`;
const item = `

type ItemOption {
	option_title : String
	option_title_ar: String
	option_price : Float
}

type Item {
	_id: ID!
	item_menu: Menu
	item_name: String
	item_name_ar: String
	item_price: Float
	item_calories: Float
	item_category: String
	item_category_ar: String
	item_status: String!
	item_description: String
	item_description_ar: String
	item_images: [Image!]!
	item_options: [ItemOption]
	item_price_type: String
	createdAt: String
	updatedAt: String
}

input ItemInput {
	item_name: String
	item_name_ar: String
	item_price: Float
	item_status: String!
	item_calories: Float
	item_category: String
	item_category_ar: String
	item_description: String
	item_description_ar: String
	item_image: String
	item_price_type: String
}
input ItemUpdate {
	item_name: String
	item_name_ar: String
	item_price: Float
	item_calories: Float
	item_status: String
	item_category: String
	item_category_ar: String
	item_description: String
	item_description_ar: String
	item_image: String
	item_price_type: String

}

input ItemOptions {
	option_title : String
	option_title_ar : String
	option_price : Float
}


`;
const itemMutations = `
	createItem(menuId: ID!, itemInput: ItemInput, itemoption : [ItemOptions]): Item
	deleteItem(itemId: ID!): Item
	updateItem(itemId: ID!, itemUpdate: ItemUpdate, itemoption : [ItemOptions]): Item
	updateItemStatus(itemId: ID!): Item!
`;
const category = `
type Category {
	_id: ID!
	category_name: String
	category_name_ar: String
	category_menu: Menu
}
`;
const categoryMutations = `
	createCategory(userId: ID!, categoryName: String, categoryNameAr: String): Category!
	updateCategory(catId: ID!, categoryName: String, categoryNameAr: String): Category!
	deleteCategory(categoryId: ID!): Category!
`;
const categoryQueries = `
	userCategories(userId: ID!): [Category!]!
	userCategoryNames(userId: ID!): [Category!]!
`;
const email = `
	type Email {
		email_mode : String
		email_message : String
		email_code : String
		email : String
		object : String
		message : String
		html : String
	}

	type EmailValidity {
		valid : Boolean ! 
		reason : String 
		code : String
	}

	input SendEmail {
		from : String!
		to : String!
		email : String!
		subject : String!
		message : String
		html : String!
	}
`;
const emailMutation = `
	sendRequestedEmail(email_mode : String!, user_email : String!, lang : String): Email!
	sendResetPasswordWithEmail(email : String!): Email
	checkEmailValidity(email_oobCode : String, email_mode : String, email : String!) : EmailValidity!
	deleteEmail(emailId : ID!) : Email!
	sendEmail(inputEmail : SendEmail!): Email
	sendVerifyEmailLink(email : String!): Email
	sendResetPasswordEmailLink(email : String!): Email
	sendNewsLetters(template : String!, subject : String!, lang : String): Email
`;
const landingFeature = `
type LandingFeature {
	_id: ID!
	title: String!
	title_ar: String!
	subtitle: String
	subtitle_ar: String
	description: String
	description_ar: String
	icon: String
	soon: Boolean
}
input LandingFeatureInput {
	title: String!
	title_ar: String!
	subtitle: String
	subtitle_ar: String
	description: String
	description_ar: String
	icon: String
	soon: Boolean
}
input LandingFeatureUpdate {
	title: String!
	title_ar: String!
	subtitle: String
	subtitle_ar: String
	description: String
	description_ar: String
	icon: String
	soon: Boolean
}
`;
const landingFeatureMutations = `
	createLandingFeature(landingFeatureInput: LandingFeatureInput): LandingFeature
	deleteLandingFeature(landingFeatureId: ID!): LandingFeature
	updateLandingFeature(landingFeatureId: ID!, landingFeatureUpdate: LandingFeatureUpdate): LandingFeature
`;
const landingFeatureQueries = `
	landingFeature(landingFeatureId: ID!): LandingFeature
	landingFeatures: [LandingFeature!]!

`;
const landingFAQ = `
type LandingFAQ {
	_id: ID!
	question: String!
	question_ar: String!
	answer: String!
	answer_ar: String!
}
input LandingFAQInput {
	question: String!
	question_ar: String!
	answer: String!
	answer_ar: String!
}
input LandingFAQUpdate {
	question: String!
	question_ar: String!
	answer: String!
	answer_ar: String!
}
`;
const landingFAQMutations = `
	createLandingFAQ(landingFAQInput: LandingFAQInput): LandingFAQ
	deleteLandingFAQ(landingFAQId: ID!): LandingFAQ
	updateLandingFAQ(landingFAQId: ID!, landingFAQUpdate: LandingFAQUpdate): LandingFAQ
`;
const landingFAQQueries = `
	landingFAQ(landingFAQId: ID!): LandingFAQ
	landingFAQs: [LandingFAQ!]!

`;
const landingPartner = `
type LandingPartner {
	_id: ID!
	partner_name: String!
	partner_name_ar: String
	partner_menu_link: String
	partner_website: String
	partner_logo: String
}
input LandingPartnerInput {
	partner_name: String!
	partner_name_ar: String
	partner_menu_link: String
	partner_website: String
	partner_logo: String
}
input LandingPartnerUpdate {
	partner_name: String!
	partner_name_ar: String
	partner_menu_link: String
	partner_website: String
	partner_logo: String
}
`;
const landingPartnerMutations = `
	createLandingPartner(landingPartnerInput: LandingPartnerInput): LandingPartner
	deleteLandingPartner(landingPartnerId: ID!): LandingPartner
	updateLandingPartner(landingPartnerId: ID!, landingPartnerUpdate: LandingPartnerUpdate): LandingPartner
`;
const landingPartnerQueries = `
	landingPartner(landingPartnerId: ID!): LandingPartner
	landingPartners: [LandingPartner!]!
`;
let SchemaQawaim = buildSchema(`
	${user}
	${card}
	${transaction}
	${address}
	${plan}
	${menu}
	${item}
	${role}
	${pack}
	${wallet}
	${prohibition}
	${category}
	${userAdmin}
	${email}
	${packUsers}
	${landingFeature}
	${landingPartner}
	${landingFAQ}

type authDataAdmin {
    userId : ID!
    user_name : String!
    token : String!
	admin : UserAdmin
}

type Image {
	_id: ID!
	image_url: String!
}

type s3Object {
	success: Boolean!
}

type authData {
	userId: ID!
	token: String!
	tokenExpiration: Int!
}

type File {
	url: String!
}

type RootQuery {
	${userQueries}
	${cardQueries}
	${categoryQueries}
	${transactionQueries}
	${addressesQueries}
	${planQueries}
	${userAdminQueries}
	${menuQueries}
	${roleQueries}
	${packQueries}
	${prohibitionQueries}
	${packUsersQueries}
	${walletQueries}
	${landingPartnerQueries}
	${landingFeatureQueries}
	${landingFAQQueries}
	items: [Item!]!
}

type RootMutation {
	test(title: String!): String!
	deleteObjectS3(menuId: ID!): Boolean
	logout: Boolean
	login(email: String!, password: String!): authData!
	loginAdmin(userName: String!, password: String!): authDataAdmin!
	${categoryMutations}
	${userAdminMutations}
	${userMutations}
	${menuMutations}
	${itemMutations}
	${roleMutations}
	${prohibitionMutations}
	${cardMutations}
	${transactionMutations}
	${addressesMutations}
	${planMutations}
	${packMutations}
	${walletMutations}
	${emailMutation}
	${packUsersMutations}
	${landingFeatureMutations}
	${landingFAQMutations}
	${landingPartnerMutations}
}
schema {
	query: RootQuery
	mutation: RootMutation
}
`);

export default SchemaQawaim;