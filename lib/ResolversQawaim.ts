require("dotenv").config();
import { isAfter, isBefore } from "date-fns";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ejs from "ejs";
//import svg64 from "svg64";
import { readFileSync } from "fs";
import { MenuSettings, EmailActions, Transaction, Prohibition, UserAdmin, Category, Image, Packs, PackUsers, User, Menu, Item, Role, Card, Addresses, Plan, LandingFAQ, LandingPartner, LandingFeature, Wallet } from "./ModelsQawaim";
import { addMinutes } from "date-fns";
import Admin from "./firebase-admin";
import s3 from "./AWS_S3";



export function cleanEmptyStrings(obj: any) {
    Object.keys(obj).forEach((k) => {
        (((!obj[k] &&
            obj[k] !== false &&
            typeof obj[k] !== "number" &&
            obj[k] != "") ||
            (Array.isArray(obj[k]) && obj[k].length == 0)) &&
            delete obj[k]) ||
            (obj[k] &&
                typeof obj[k] === "object" &&
                !(Array.isArray(obj[k]) && obj[k].length == 0) &&
                cleanEmptyStrings(obj[k]));
    });
    return obj;
}
export function difference(A: any, B: any) {
    const arrA = Array.isArray(A)
        ? A.map((x) => JSON.stringify(x))
        : [JSON.stringify(A)];
    const arrB = Array.isArray(B)
        ? B.map((x) => JSON.stringify(x))
        : [JSON.stringify(B)];

    const result = [];
    for (const p of arrA) {
        if (arrB.indexOf(p) === -1) {
            result.push(p);
        }
    }

    return result;
}
export const card = (cardId: string) => {
    console.log("tofaha", cardId);
    return Card.findById(cardId)
        .then((cardi) => {
            console.log(cardi);
            return { ...cardi._doc };
        })
        .catch((err) => {
            throw err;
        });
};
export const menusList = async (menusId: string) => {
    return Menu.find({ _id: { $in: menusId } })
        .then((menus) => {
            return menus.map((menu) => {
                return {
                    ...menu._doc,
                    menu_items: itemsList.bind(this, menu._doc.menu_items)
                };
            });
        })
        .catch((err) => {
            throw err;
        });
};
export const itemOne = async (itemId: string): Promise<any> => {
    const item = await Item.findById(itemId);
    if (!item?._doc) return null;
    return {
        ...item._doc,
        item_images: imagesItem.bind(this, item._doc.item_images)
    };
};
export const menuOne = async (menuId: string) => {
    const menu = await Menu.findById(menuId);
    if (!menu?._doc) return null;
    return {
        ...menu._doc,
        menu_items: items.bind(this, menu._doc.menu_items)
    };
};
export const itemsList = async (itemsId: string) => {
    console.log("getting items ", itemsId);
    return Item.find({ _id: { $in: itemsId } })
        .sort({ createdAt: -1 })
        .then((items) => {
            console.log("items are ", items);
            return items.map((item) => {
                console.log("item is ", item);
                return {
                    ...item._doc,
                    item_images: imagesItem.bind(this, item._doc.item_images),
                    item_menu: menuOne.bind(this, item._doc.item_menu)
                };
            });
        })
        .catch((err) => {
            throw err;
        });
};
export const userOne = async (userId: string) => {
    const user = await User.findById(userId);
    if (!user?._doc) throw new Error("User does not exit!");
    return {
        ...user._doc,
        user_role: roleOne.bind(this, user._doc.role),
        user_prohibitions: prohibitionsList.bind(this, user._doc.prohibitions),
        user_menus: menusList.bind(this, user._doc.menus)
    };
};
export const usersList = async (usersId: string) => {
    console.log("getting users ", usersId);
    return User.find({ _id: usersId })
        .then((users) => {
            console.log("users are ", users);
            return users.map(async (user) => {
                return {
                    ...user._doc,
                    user_categories: categories.bind(this, user._doc.user_categories)
                };
            });
        })
        .catch((err) => {
            throw err;
        });
};
export const categories = async (categoryId: string) => {
    console.log("categories Id : ", categoryId);
    return Category.find({ _id: { $in: categoryId } })
        .then((cats) => {
            console.log("cat is ", cats);
            return cats.map((cat) => {
                return { ...cat._doc };
            });
        })
        .catch((err) => {
            throw err;
        });
};
export const roleOne = async (roleId: string) => {
    const role = await Role.findById(roleId);
    if (!role?._doc) return null;
    return {
        ...role._doc,
        role_users: usersList.bind(this, role._doc.users),
        role_prohibitions: prohibitionsList.bind(this, role._doc.prohibitions)
    };
};
export const rolesList = async (rolesId: string): Promise<any> => {
    console.log("getting roles ", rolesId);
    return Role.find(rolesId ? { _id: rolesId } : {})
        .then((roles) => {
            console.log("roles are ", roles);
            return roles.map(async (role) => {
                return {
                    ...role._doc,
                    role_users: usersList.bind(this, role._doc.role_users),
                    role_prohibitions: prohibitionsList.bind(
                        this,
                        role._doc.role_prohibitions
                    )
                };
            });
        })
        .catch((err) => {
            throw err;
        });
};
export const prohibitionOne = async (prohibitionId: string) => {
    console.log("prohibition prohibitionId: ", prohibitionId);
    const prohibition = await Prohibition.findById(prohibitionId);
    if (!prohibition?._doc) throw new Error("Prohibition does not exist!");
    return {
        ...prohibition._doc,
        prohibition_roles: rolesList.bind(this, prohibition._doc.prohibition_roles)
    };
};
export const prohibitionsList = async (prohibitionsId: string) => {
    console.log("getting prohibitions ", prohibitionsId);
    return Prohibition.find(prohibitionsId ? { _id: prohibitionsId } : {})
        .then((prohibitions) => {
            console.log("prohibitions are ", prohibitions);
            return prohibitions.map(async (prohibition) => {
                return {
                    ...prohibition._doc,
                    prohibition_roles: rolesList.bind(
                        this,
                        prohibition._doc.prohibition_roles
                    )
                };
            });
        })
        .catch((err) => {
            throw err;
        });
};
export const imagesItem = async (itemId: string) => {
    const images = await Image.find({ _id: { $in: itemId } });
    if (!images) throw new Error("Image does not exist");
    console.log(images);
    return images.map((image) => {
        return {
            ...image._doc,
            Image_item: itemOne.bind(this, image.Image_item)
        };
    });
};
export const settingsFetch = async (settingId: string) => {
    console.log("khobza", settingId);
    const setting = await MenuSettings.findById(settingId);
    if (!setting) throw new Error("Setting does not exist");
    return {
        ...setting._doc
    };
};
// USER RESOLVERS **************************************
// ******************************************************
export async function user(args: any) {
    if (!args.userId) throw new Error("Missing User ID");
    const user = await User.findById(args.userId);
    if (!user) throw new Error("User does not exist");
    return {
        ...user._doc,
        user_categories: categories(user._doc.user_categories),
        user_menus: menusList(user._doc.user_menus)
    };
};
export function users() {
    return User.find()
        .then((users) => {
            return users.map(async (user) => {
                console.log("user doc ", user._doc);
                return {
                    ...user._doc,
                    user_categories: categories(user._doc.user_categories),
                    user_menus: menusList(user._doc.user_menus)
                };
            });
        })
        .catch((err) => {
            throw err;
        });
};
export async function createUser(args: any) {
    let inputs = args.userInput;
    const date = new Date();
    return User.findOne({ email: inputs.email })
        .then((email) => {
            if (email) {
                throw new Error("Email exists already");
            }
            if (
                inputs.password == "" ||
                inputs.password == "null" ||
                !inputs.password
            ) {
                return null;
            } else {
                return bcrypt.hash(inputs.password, 12);
            }
        })
        .then((hashedPassword) => {
            const user = new User({
                user_display: inputs.user_display ? inputs.user_display : null,
                first_name: inputs.first_name ? inputs.first_name : null,
                last_name: inputs.last_name ? inputs.last_name : null,
                email: inputs.email,
                password: hashedPassword,
                user_photo: inputs.user_photo ? inputs.user_photo : null,
                user_plan: inputs.user_plan,
                subscribed_for_news_letters:
                    inputs.subscribed_for_news_letters ?? true,
                newsletters: inputs.newsletters ?? true,
                email_verified: inputs.emailVerified ?? false,
                default_currency: inputs.default_currency,
                source: inputs.source,
                geoip: inputs.geoip
            });
            return user.save();
        })
        .then(async (result) => {
            return {
                ...result._doc,
                password: null,
                user_menus: menusList(result._doc.user_menus)
            };
        })
        .catch((err) => {
            throw err;
        });
};
export async function updateUser(args: any, req: any) {
    let inputs = args.userUpdate;
    console.log("updateUser, args: ", args);
    const oldUser = await User.findOne({ _id: args.userId });
    if (!oldUser) throw new Error("User does not exist");
    console.log("oldUser: ", oldUser);
    let userData = {
        first_name: inputs.first_name ? inputs.first_name : oldUser.first_name,
        last_name: inputs.last_name ? inputs.last_name : oldUser.last_name,
        user_display: inputs.user_display
            ? inputs.user_display
            : oldUser.user_display,
        user_photo: inputs.user_photo ? inputs.user_photo : oldUser.user_photo,
        user_plan: inputs.user_plan ? inputs.user_plan : oldUser.user_plan,
        email_verified: inputs.emailVerified
            ? inputs.emailVerified
            : oldUser.email_verified,
        subscribed_for_news_letters: inputs.subscribed_for_news_letters
            ? inputs.subscribed_for_news_letters
            : oldUser.subscribed_for_news_letters,
        geoip: inputs.geoip ? inputs.geoip : oldUser.geoip
    };
    const newUser = await User.findByIdAndUpdate(args.userId, userData, {
        new: true
    });
    console.log("userData: ", userData);
    console.log("newUser: ", newUser);
    return newUser;
};
export async function updateUserAutoRenew(args: any) {
    const oldUser = await User.findOne({ _id: args.userId });
    if (!oldUser) throw new Error("User does not exist");
    let userData = {
        auto_renew: args.auto_renew
    };
    const newUser = await User.findByIdAndUpdate(args.userId, userData, {
        new: true
    });
    return newUser;
};
export async function updateUserDefaultCurrency(args: any) {
    let user = await User.findOne({ _id: args.userId });
    if (!user) throw new Error("User does not exist");
    if (!user.original_default_currency) {
        let userData = {
            original_default_currency: user.default_currency,
            default_currency: args.default_currency
        };
        user = await User.findByIdAndUpdate(args.userId, userData, {
            new: true
        });
    } else {
        let userData = {
            default_currency: args.default_currency
        };
        user = await User.findByIdAndUpdate(args.userId, userData, {
            new: true
        });
    }

    return user;
};
export async function deleteUser(args: any) {
    let userUID: string;
    console.log(args.email);
    Admin()
        .auth()
        .getUserByEmail(args.email)
        .then((user: any) => {
            userUID = user.uid;
            Admin()
                .auth()
                .deleteUser(userUID)
                .then(async () => {
                    let itemId: any = [];
                    const dbUser = await User.findById(args.userId);
                    if (!dbUser) throw new Error("User does not exist");
                    const itemsIds = await Item.find({
                        item_menu: { $in: dbUser.user_menus }
                    });
                    itemsIds.map((item) => {
                        itemId.push(item._id);
                    });
                    const deleteImages = await Image.deleteMany({
                        _Image_item: { $in: itemId }
                    });
                    const deleteItems = await Item.deleteMany({ _id: { $in: itemId } });
                    const deleteMenus = await Menu.deleteMany({
                        _id: { $in: dbUser.user_menus }
                    });
                    const deleteCategories = await Category.deleteMany({
                        user_categories: { $in: args.userId }
                    });
                    const deleteUser = await User.deleteOne({ _id: args.userId });
                    console.log(deleteUser);
                    return {
                        ...dbUser._doc
                    };
                }).catch((err: any) => {
                    throw new Error(err.message);
                });
        }).catch((err: any) => {
            throw new Error(err.message);
        });
};
// MENU RESOLVERS **************************************
// ******************************************************
export async function menus() {
    const menus = await Menu.find();
    if (!menus) throw new Error("No Menus exist");
    return menus.map((menu) => {
        return { ...menu._doc };
    });
};
export async function createMenu(args: any, req: any) {
    const date = new Date();
    const checkMenu = await Menu.findOne({
        menu_user: args.userId,
        menu_name: {
            $regex: new RegExp("^" + args.menuInput.menu_name + "$", "i")
        }
    });
    if (checkMenu) {
        throw new Error("Menu already exist under this name!");
    }
    const menu = new Menu({
        menu_name: args.menuInput.menu_name,
        menu_custom_link: null,
        menu_address: args.menuInput.menu_address,
        menu_language: args.menuInput.menu_language,
        menu_currency: args.menuInput.menu_currency,
        menu_privacy: args.menuInput.menu_privacy,
        menu_logo: null,
        background_color: "#E2E2E2",
        primary_color: "#0843E1",
        item_color: "#ffffff",
        categories_color: "#ffffff",
        border_radius: 10,
        menu_user: args.userId,
        createdAt: date
    });
    let menuResult: any;
    return menu
        .save()
        .then((result: any) => {
            menuResult = {
                ...result._doc,
                menu_items: itemsList(result._doc.menu_items)
            };
            return User.findById(args.userId);
        })
        .then((user: any) => {
            if (!user) throw new Error("User does not exist");
            user.user_menus.push(menu);
            return user.save();
        })
        .then((result: any) => {
            return menuResult;
        })
        .catch((err: any) => {
            if (err) throw err;
        });
};
export function updateMenu(args: any, req: any) {
    console.log("updateMenu resolver, args: " + JSON.stringify(args));
    const menu = {
        menu_name: args.menuUpdate.menu_name,
        menu_address: args.menuUpdate.menu_address,
        menu_language: args.menuUpdate.menu_language,
        menu_currency: args.menuUpdate.menu_currency,
        menu_privacy: args.menuUpdate.menu_privacy
    };

    return Menu.findByIdAndUpdate(args.menuId, menu, { new: true })
        .then((result) => {
            if (!result) {
                throw new Error("Menu does not exit");
            }
            return {
                ...result._doc,
                menu_items: itemsList(result._doc.menu_items)
            };
        })
        .catch((err) => {
            throw err;
        });
};
export function deleteMenu(args: any, req: any) {
    let results: any;
    let userId: string;
    return Menu.findById(args.menuId)
        .then((result) => {
            if (!result) throw new Error("Menu does not exist");
            if (result._doc.menu_logo) {
                const params = {
                    Bucket: globalThis.__config.Bucket,
                    Key: result._doc.menu_logo
                };
                //TODO : make it return promise
                s3().deleteObject(params, function (err: any, data: any) {
                    if (err) console.error(err, err.stack);
                    console.log(data);
                });
            }
            userId = result._doc.menu_user;
            results = { ...result._doc };
            return Item.deleteMany({ item_menu: args.menuId });
        })
        .then((result) => {
            return Menu.deleteOne({ _id: args.menuId });
        })
        .then((result) => {
            return User.updateOne(
                { _id: userId },
                { $pull: { user_menus: args.menuId } },
                { safe: true }
            );
        })
        .then((result) => {
            return results;
        })
        .catch((err) => {
            throw err;
        });
};
export async function customMenuLink(args: any) {
    const menu = await Menu.findById(args.menuId);
    if (!menu) throw new Error("No menu under this Id");
    const user = await User.findById(menu._doc.menu_user);
    if (user._doc.user_plan === "Free")
        throw new Error(
            "User can not create a custom Link, only available in Pro or enterprise plan"
        );
    const checkCustomLink = await Menu.exists({
        menu_custom_link: args.customLink
    });
    if (checkCustomLink) throw new Error("Custom Link already exist");
    const saveCustomLink = await Menu.findByIdAndUpdate(
        args.menuId,
        { menu_custom_link: args.customLink },
        { new: true }
    );
    return { ...saveCustomLink._doc };
};
export async function updateMenuLive(args: any) {
    const menu = await Menu.findById(args.menuId);
    if (!menu) throw new Error("Menu does not exist under this id");
    const updateMenuLive = await Menu.findByIdAndUpdate(
        args.menuId,
        { menu_live: !menu.menu_live },
        { new: true }
    );
    return { ...updateMenuLive._doc };
};
export async function menuCategories(args: any) {
    // await category find category menu
    const categories = await Category.find({ category_menu: args.menuId });
    if (!categories) throw new Error("any category exist under this user");
    return categories.map((category) => {
        return { ...category._doc };
    });
};
export async function menuSettings(args: any) {
    const menu = await Menu.findById(args.menuId);
    if (!menu) throw new Error("No menu exist under this ID");
    const settings = await MenuSettings.findOne({ settings_menu: args.menuId });
    console.log(settings);
    if (!settings) return null;
    return settings;
};
export async function menuSettingsByHandle(args: any) {
    const menuSettings = await MenuSettings.findOne({
        menu_handle_upper: args.menuHandle?.toUpperCase()
    });
    if (!menuSettings) throw new Error("no settings have this custom handle");
    return { ...menuSettings._doc };
};
export async function updateMenuEnabled(args: any) {
    const menu = await Menu.findByIdAndUpdate(
        args.menuId,
        { menu_enabled: args.menuEnabled },
        { new: true }
    );
    if (!menu) throw new Error("Menu does not exist under this id");
    return { ...menu._doc };
};
export async function updateMenuName(args: any) {
    const menu = await Menu.findByIdAndUpdate(
        args.menuId,
        { menu_name: args.menuName },
        { new: true }
    );
    if (!menu) throw new Error("menu does not exist");
    return { ...menu._doc };
};
export async function updateCustomMenuLink(args: any) {
    const checkMenu = await Menu.exists({ _id: args.menuId });
    if (!checkMenu) throw new Error("No menu under this ID");
    const checkUniqueCustom = await Menu.exists({
        menu_custom_link: args.customLink
    });
    if (checkUniqueCustom) throw new Error("This custom link already exist");
    const updateCustomLink = await Menu.findByIdAndUpdate(
        args.menuId,
        { menu_custom_link: args.customLink },
        { new: true }
    );
    return {
        ...updateCustomLink._doc
    };
};
export async function updateMenuStyle(args: any) {
    const checkMenu = await Menu.findById(args.menuId);
    if (!checkMenu) throw new Error("Menu does not exist under this menu");
    const menuStyle = {
        background_color: args.menuStyle.background_color,
        primary_color: args.menuStyle.primary_color,
        item_color: args.menuStyle.item_color,
        categories_color: args.menuStyle.categories_color,
        border_radius: args.menuStyle.border_radius
    };
    const updateMenuStyle = await Menu.findByIdAndUpdate(
        args.menuId,
        menuStyle,
        { new: true }
    );
    return { ...updateMenuStyle._doc };
};
export async function updateMenuSettings(args: any) {
    const checkMenu = await Menu.exists({ _id: args.menuId });
    if (!checkMenu) throw new Error("No menu under this ID");
    const checkMenuHandle = await MenuSettings.exists({
        menu_handle_upper: args.menuSettingsUpdate.menu_handle?.toUpperCase()
    });
    const checkDifference = await MenuSettings.findById(
        args.menuSettingsUpdate.settingsId
    );
    if (
        checkMenuHandle &&
        args.menuSettingsUpdate.menu_handle?.toUpperCase() !=
        checkDifference?.menu_handle_upper
    ) {
        throw new Error("Menu handle already exist");
    }

    let settingsObject = {
        show_logo: args.menuSettingsUpdate.show_logo,
        show_address: args.menuSettingsUpdate.show_address,
        show_socials: args.menuSettingsUpdate.show_socials,
        show_search: args.menuSettingsUpdate.show_search,
        show_delivery: args.menuSettingsUpdate.show_delivery,
        hide_watermark: args.menuSettingsUpdate.hide_watermark,
        show_order_button: args.menuSettingsUpdate.show_order_button,
        show_menu_name: args.menuSettingsUpdate.show_menu_name,
        show_hours: args.menuSettingsUpdate.show_hours,
        twitter: args.menuSettingsUpdate.twitter,
        facebook: args.menuSettingsUpdate.facebook,
        snapchat: args.menuSettingsUpdate.snapchat,
        instagram: args.menuSettingsUpdate.instagram,

        delivery_hungerstation: args.menuSettingsUpdate.delivery_hungerstation,
        delivery_toyou: args.menuSettingsUpdate.delivery_toyou,
        delivery_jahez: args.menuSettingsUpdate.delivery_jahez,
        delivery_mrsool: args.menuSettingsUpdate.delivery_mrsool,
        delivery_wssel: args.menuSettingsUpdate.delivery_wssel,
        delivery_talabat: args.menuSettingsUpdate.delivery_talabat,
        delivery_carriage: args.menuSettingsUpdate.delivery_carriage,

        menu_handle: args.menuSettingsUpdate.menu_handle,
        menu_handle_upper: args.menuSettingsUpdate.menu_handle?.toUpperCase(),
        menu_website: args.menuSettingsUpdate.menu_website,
        menu_phone: args.menuSettingsUpdate.menu_phone,

        gmaps_link: args.menuSettingsUpdate.gmaps_link
    };
    const updateSettings = await MenuSettings.findOneAndUpdate(
        { settings_menu: args.menuId },
        settingsObject,
        { new: true }
    );
    console.log("updating settings ", updateSettings);
    return { ...updateSettings._doc };
};
export async function createMenuSettings(args: any) {
    const checkMenu = await Menu.exists({ _id: args.menuId });
    if (!checkMenu) throw new Error("no menu under this id");

    const newSettings = new MenuSettings({
        settings_menu: args.menuId
    });
    const createSettings = await newSettings.save();
    return { ...createSettings._doc };
};
export async function singleMenu(args: any) {
    if (args.isMenuPortal) {
        console.log("I'm here : ", args.isMenuPortal);
        const menu = await Menu.findOne({
            _id: args.menuId
        });
        if (!menu) throw new Error("Menu does not exist");
        return {
            ...menu._doc,
            menu_items: itemsList(menu.menu_items)
        };
    }
    const menu = await Menu.findOne({
        _id: args.menuId,
        menu_user: args.userId
    });
    if (!menu) throw new Error("Menu does not exist");
    return {
        ...menu._doc,
        menu_items: itemsList(menu.menu_items)
    };
};
export async function singleMenuWithHandle(args: any) {
    const menuSettings = await MenuSettings.findOne({
        menu_handle_upper: args.menuHandle?.toUpperCase()
    });
    if (!menuSettings) throw new Error("Menu does not have a custom url");
    const menu = await Menu.findById(menuSettings._doc.settings_menu);
    console.log(menuSettings._doc._id);
    return {
        menu_settings: settingsFetch(menuSettings._doc._id),
        ...menu._doc,
        menu_items: itemsList(menu.menu_items)
    };
};
export async function transferMenu(args: any, req: any) {
    // if(!req.isAuth) {
    //   throw new Error('unauthenticated !')
    // }

    console.log("transferMenu args: " + JSON.stringify(args));

    let oldUserId: any = null;
    let tmpMenu: any = null;

    return Menu.findById(args.menuId)
        .then((menu) => {
            console.log("menu found: " + JSON.stringify(menu));
            if (!menu) {
                throw new Error("Menu does not exit");
            }
            oldUserId = menu.menu_user;
            menu.menu_user = args.newUserId;
            menu.save();
            tmpMenu = menu;
            return tmpMenu;
        })
        .then(async (_menu) => {
            console.log("old User id: " + JSON.stringify(oldUserId));
            await User.updateOne(
                { _id: oldUserId },
                { $pull: { user_menus: args.menuId } },
                { safe: true }
            );
            return User.findById(args.newUserId);
        })
        .then((user) => {
            console.log("new User found: " + JSON.stringify(user));
            user.user_menus.push(tmpMenu);
            user.save();
            return tmpMenu;
        })
        .catch((err) => {
            throw err;
        });
};
// ADMIN RESOLVERS **************************************
// ******************************************************
export function admins() {
    return UserAdmin.find()
        .then((admins) => {
            return admins.map(async (admin) => {
                const ads = await admin.populate("admin_role").execPopulate();
                console.log("populate", ads);
                return {
                    ...ads._doc,
                    password: null
                };
            });
        })
        .catch((err) => {
            throw err;
        });
};
export async function admin(args: any) {
    const admin = await UserAdmin.findById(args.adminUserId);
    if (!admin) throw new Error("Admin does not exist");
    return {
        ...admin._doc
    };
};
export async function createAdminUser(args: any) {
    console.log("createAdminUser args: ", args);
    const _role = await Role.findById(args.adminCreate.admin_role);
    if (!_role && args.adminCreate.admin_role)
        throw new Error("Role does not exit!");
    console.log("_role: ", _role);

    const checkUserName = await UserAdmin.findOne({
        user_name: args.adminCreate.user_name
    });
    if (checkUserName) throw new Error("Admin name already exist");
    console.log("checkUserName: ", checkUserName);
    const hashedPassword = await bcrypt.hash(args.adminCreate.password, 12);
    console.log("hashedPassword: ", hashedPassword);

    const admin = new UserAdmin({
        first_name: args.adminCreate.first_name ?? null,
        last_name: args.adminCreate.last_name ?? null,
        email: args.adminCreate.email ?? null,
        user_name: args.adminCreate.user_name,
        password: hashedPassword,
        admin_role: args.adminCreate.admin_role ?? null
        // admin_prohibitions:
        //   args.adminCreate.user_prohibitions || _role?.role_prohibitions || []
    });
    console.log("admin: ", admin);
    const newAdmin = await admin.save();
    console.log("newAdmin: ", newAdmin);

    await Role.updateOne(
        { _id: newAdmin.admin_role },
        { $addToSet: { role_users: newAdmin._id } }
    );
    // await Prohibition.updateMany(
    //   { _id: newAdmin.admin_prohibitions },
    //   { $addToSet: { prohibition_users: newAdmin._id } }
    // );

    return {
        ...newAdmin._doc,
        password: null,
        admin_role: roleOne(newAdmin.admin_role)
        // admin_prohibitions: prohibitionsList.bind(this, newAdmin.admin_prohibitions)
    };
};
export async function updateAdminUser(args: any, req: any) {
    // if(!req.isAuth) {
    //   throw new Error('unauthenticated !')
    // }
    console.log("updateAdminUser, args: ", args);
    const date = new Date();

    const _role = await Role.findById(args.adminUpdate.admin_role);
    if (!_role && args.adminUpdate.admin_role)
        throw new Error("Role does not exit!");

    let admin = {
        user_name: args.adminUpdate.user_name,
        first_name: args.adminUpdate.first_name,
        last_name: args.adminUpdate.last_name,
        updatedAt: date,
        email: args.adminUpdate.email,
        admin_role: args.adminUpdate.admin_role
    };
    cleanEmptyStrings(admin);
    const oldAdmin = await UserAdmin.findOne({ _id: args.adminUserId });
    if (!oldAdmin) throw new Error("Admin does not exist");
    Object.assign(oldAdmin, admin);
    const newAdmin = await oldAdmin.save();
    await Role.updateOne(
        { _id: oldAdmin.admin_role },
        { $addToSet: { role_users: oldAdmin._id } }
    );
    await Role.updateOne(
        { _id: newAdmin.admin_role },
        { $addToSet: { role_users: newAdmin._id } }
    );
    const updateResult = {
        ...newAdmin._doc,
        admin_role: roleOne(newAdmin.admin_role)
    };
    console.log("update Admin result: ", updateResult);
    return updateResult;
};
export async function deleteAdminUser(args: any, req: any) {
    console.log("deleteAdminUser, args: " + JSON.stringify(args));
    const admin = await UserAdmin.findById(args.adminUserId);
    if (!admin) throw new Error("Admin does not exist");
    await Role.updateOne(
        { _id: admin.admin_role },
        { $pull: { role_users: admin._id } }
    );
    const deleteAdminUser = await UserAdmin.deleteOne({
        _id: args.adminUserId
    });
    console.log(deleteAdminUser);
};
export async function getAdminByUsername(args: any) {
    console.log("getAdminByUsername resolver, args: ", args);
    const admin = await UserAdmin.findOne({ user_name: args.user_name });
    if (!admin) throw new Error("User does not exist under this username");
    return {
        ...admin._doc
    };
};
export async function subscribedUsers() {
    console.log("subscribedUsers");
    return User.find()
        .then((users) => {
            return users
                .map((user) => {
                    return {
                        ...user._doc,
                        password: null,
                        user_menus: menusList(user._doc.user_menus)
                    };
                })
                .filter((user) => user.subscribed_for_news_letters === true);
        })
        .catch((err) => {
            throw err;
        });
};
// USER RESOLVERS **************************************
// ******************************************************
export async function userPro(args: any) {
    const date = new Date();
    const user = await User.findByIdAndUpdate(
        args.userId,
        { user_plan: "Pro", updatedAt: date },
        { new: true }
    );
    if (!user) throw new Error("User does not exist ! ");
    return { ...user._doc };
};
export async function userEnterprise(args: any) {
    const date = new Date();
    const user = await User.findByIdAndUpdate(
        args.userId,
        { user_plan: "Enterprise", updatedAt: date },
        { new: true }
    );
    if (!user) throw new Error("User does not exist");
    return { ...user._doc };
};
export async function userPremium(args: any, req: any) {
    const user = await User.findById(args.userId);
    if (!user) {
        throw new Error("User does not exist");
    }
    const switchPremium = await User.findOneAndUpdate(
        { _id: user._id },
        { user_premium: !user.user_premium },
        { safe: true }
    );
    if (!switchPremium) {
        throw new Error("unsuccessful !");
    }
    console.log(switchPremium);
    return { ...switchPremium._doc };
};
export async function userEmail(args: any) {
    const user = await User.findOne({ email: args.userEmail });
    if (!user) throw new Error("User does not exist under this email");
    return { ...user._doc };
};
export async function userMenus(args: any) {
    const user = await User.findById(args.userId);
    if (!user) throw new Error("User does not exist");
    const menus = await Menu.find({ _id: user.user_menus });
    if (!menus) throw new Error("User does not exist");
    if (!menus) throw new Error("User doesn't have menus");
    return menus.map(async (menu) => {
        const menuData = menu._doc;
        const menuSettings = await MenuSettings.findOne({
            settings_menu: menuData._id
        });
        menuData.menu_settings = menuSettings;
        console.log("menuSettings=", menuData);
        return { ...menuData };
    });
};
export async function userItems(args: any) {
    const user = await User.findById(args.userId);
    if (!user) throw new Error("User does not exist");
    const menus = await Menu.find({ _id: user.user_menus });
    if (!menus) throw new Error("User doesn't have menus");
    let itemsArray: any = [];
    menus.map((menu) => {
        itemsArray.push(...menu.menu_items);
    });
    const items = await Item.find({ _id: itemsArray });
    if (!items) throw new Error("User doesn't have menu items");
    return items.map((item) => {
        return { ...item._doc };
    });
};
export async function updateUserEmail(args: any) {
    const user = await User.findById(args.userId);
    if (!user) throw new Error("User does not exist under this ID");
    let newUser;
    Admin()
        .auth()
        .getUserByEmail(user.email)
        .then((t) => {
            return t.uid;
        })
        .then((uid) => {
            return Admin().auth().updateUser(uid, {
                email: args.email,
                emailVerified: false
            });
        })
        .then(async () => {
            newUser = await User.findByIdAndUpdate(
                user._id,
                { email: args.email, email_verified: false },
                { new: true }
            );
            return newUser;
        })
        .catch((err) => {
            throw new Error(err);
        });
    console.log("new new new new new : ", newUser);
    return { ...user._doc };
};
// AUTH RESOLVERS **************************************
// ******************************************************
export async function login(params: { email: string, password: string }, context: any) {
    const user = await User.findOne({ email: params.email });
    if (!user) {
        throw new Error("Invalid credential !");
    }

    const isEqual = await bcrypt.compare(params.password, user.password);
    if (!isEqual) {
        throw new Error("Invalid credential !");
    }

    const token = jwt.sign(
        { userId: user.id, email: user.email },
        "uyzjOTohap3jag#HcEd!537t#JU9r",
        { expiresIn: "30m" }
    );

    context.res.cookie(
        "jid",
        jwt.sign(
            { userId: user.id, email: user.email },
            "uyzjOTohap3jag#HcEd!537t#JU9r",
            { expiresIn: "7d" }
        ),
        { httpOnly: true }
    );

    return {
        userId: user.id,
        userPlan: user.user_plan,
        token: token,
        tokenExpiration: 30
    };
};
export function logout(req: any, context: any) {
    context.res.cookie("jid", "", { httpOnly: true });
    return true;
};
export async function loginAdmin(args: any, context: any) {
    const checkUserName = await UserAdmin.findOne({ user_name: args.userName });
    if (!checkUserName) throw new Error("Username does not exist");
    const isEqual = await bcrypt.compare(args.password, checkUserName.password);
    if (!isEqual) throw new Error("Username or password does not exist");

    const token = jwt.sign(
        { userId: checkUserName._id },
        "uyzjOTohap3jag#HcEd!537t#JU9r",
        { expiresIn: "30m" }
    );

    context.res.cookie(
        "jid",
        jwt.sign({ userId: checkUserName._id }, "uyzjOTohap3jag#HcEd!537t#JU9r", {
            expiresIn: "30m"
        }),
        { httpOnly: true }
    );

    return {
        userId: checkUserName._id,
        user_name: checkUserName.user_name,
        token: token,
        admin: checkUserName._doc
    };
};
// ITEM RESOLVERS **************************************
// ******************************************************
export async function createUpdateCategoryItem(menuId: string, item_category: string, item_category_ar: string) {
    const menu = await Menu.findOne({ _id: menuId });
    if (!menu) throw new Error("Menu does not exist");
    //we need to verify if category exist update it else skip
    let where: any = {};
    if (item_category && item_category_ar) {
        where.$or = [
            { category_name: item_category },
            { category_name_ar: item_category_ar }
        ];
    } else if (item_category) {
        where.category_name = item_category;
    } else if (item_category_ar) {
        where.category_name_ar = item_category_ar;
    }
    if (menu.menu_user) {
        where.user_categories = menu.menu_user;
    }
    const category = await Category.findOne(where);
    if (!category) {
        createCategory({
            categoryName: item_category,
            categoryNameAr: item_category_ar,
            userId: menu.menu_user
        });
    } else {
        updateCategory({
            catId: category?._id,
            categoryName: item_category,
            categoryNameAr: item_category_ar,
            userId: menu.menu_user
        });
    }
};
export function createItem(args: any, req: any) {
    //we need to verify if category exist update it else skip
    createUpdateCategoryItem(
        args.menuId,
        args.itemInput.item_category,
        args.itemInput.item_category_ar
    );
    let item: any;
    if (args?.itemoption?.length > 0) {
        item = new Item({
            item_name: args.itemInput.item_name,
            item_name_ar: args.itemInput.item_name_ar,
            item_price: null,
            item_status: args.itemInput.item_status,
            item_calories: args.itemInput.item_calories,
            item_category: args.itemInput.item_category,
            item_category_ar: args.itemInput.item_category_ar,
            item_description: args.itemInput.item_description,
            item_description_ar: args.itemInput.item_description_ar,
            item_menu: args.menuId,
            item_options: args.itemoption,
            item_price_type: "multiple"
        });
    } else {
        item = new Item({
            item_name: args.itemInput.item_name,
            item_name_ar: args.itemInput.item_name_ar,
            item_price: args.itemInput.item_price,
            item_status: args.itemInput.item_status,
            item_calories: args.itemInput.item_calories,
            item_category: args.itemInput.item_category,
            item_category_ar: args.itemInput.item_category_ar,
            item_description: args.itemInput.item_description,
            item_description_ar: args.itemInput.item_description_ar,
            item_menu: args.menuId,
            item_options: [],
            item_price_type:
                +args.itemInput?.item_price > 0 || !args.itemInput?.item_price
                    ? "single"
                    : null
        });
    }
    let items: any;
    return item
        .save()
        .then((result: any) => {
            items = {
                ...result._doc,
                item_menu: menuOne(result._doc.item_menu)
            };
            return Menu.findById(args.menuId);
        })
        .then((menu: any) => {
            if (!menu) throw new Error("Menu doesn't exists");
            menu.menu_items.push(item);
            return menu.save();
        })
        .then((result: any) => {
            return items;
        })
        .catch((err: any) => {
            console.log(err);
            throw err;
        });
};
export async function updateItem(args: any, req: any) {
    console.log("updateItem resolver, args: ", args);
    let newItem;
    if (args?.itemoption?.length > 0) {
        newItem = {
            item_name: args.itemUpdate.item_name,
            item_name_ar: args.itemUpdate.item_name_ar,
            item_price: null,
            item_status: args.itemUpdate.item_status,
            item_calories: args.itemUpdate.item_calories,
            item_category: args.itemUpdate.item_category,
            item_category_ar: args.itemUpdate.item_category_ar,
            item_description: args.itemUpdate.item_description,
            item_description_ar: args.itemUpdate.item_description_ar,
            item_options: args.itemoption
        };
    } else {
        newItem = {
            item_name: args.itemUpdate.item_name,
            item_name_ar: args.itemUpdate.item_name_ar,
            item_price: +args.itemUpdate.item_price,
            item_status: args.itemUpdate.item_status,
            item_calories: args.itemUpdate.item_calories,
            item_category: args.itemUpdate.item_category,
            item_category_ar: args.itemUpdate.item_category_ar,
            item_description: args.itemUpdate.item_description,
            item_description_ar: args.itemUpdate.item_description_ar,
            item_options: []
        };
    }
    const item = await Item.findByIdAndUpdate(args.itemId, newItem, {
        new: true
    });
    if (!item) throw new Error("item does not exist");
    console.log("the updated item: ", item);
    //we need to verify if category exist update it else skip
    createUpdateCategoryItem(
        item.item_menu,
        item.item_category,
        item.item_category_ar
    );
    return { ...item._doc };
};
export async function updateItemStatus(args: any) {
    const item = await Item.findById(args.itemId);
    if (!item) throw new Error("Item does not exist");
    const updatedItem = await Item.findOneAndUpdate(
        { _id: args.itemId },
        {
            item_status:
                item.item_status.toLowerCase() !== "available"
                    ? "available"
                    : "suspended"
        },
        { new: true }
    );
    console.log(updatedItem);
    return { ...updatedItem._doc };
};
export async function deleteItem(args: any, req: any) {
    let menuId: any;
    let results: any;
    return Item.findById(args.itemId)
        .then((result: any) => {
            if (!result) throw new Error("Item does not exists");
            menuId = result._doc.item_menu;
            results = { ...result._doc };
            return Image.deleteMany({ Image_item: args.itemId });
        })
        .then((result: any) => {
            for (let i = 0; i < result.n; i++) {
                console.log(`deleting file num : ${i + 1}`);
                const params = {
                    Bucket: globalThis.__config.Bucket,
                    Key: `${args.itemId}_file${i + 1}`
                };
                //TODO : make it return promise
                s3().deleteObject(params, function (err: any, data: any) {
                    if (err) console.error(err, err.stack);
                    console.log(data);
                });
            }
            return Item.findOneAndDelete({ _id: args.itemId });
        })
        .then(() => {
            return Menu.updateOne(
                { _id: menuId },
                { $pull: { menu_items: args.itemId } },
                { safe: true }
            );
        })
        .then(() => {
            return results;
        })
        .catch((err) => {
            throw err;
        });
};
export async function itemMenu(args: any) {
    const menu = await Menu.findById(args.menuId);
    if (!menu) throw new Error("any menu exist under this ID");
    const items = await Item.find({ item_menu: menu._id });
    if (!items) throw new Error("any items under this menu");
    console.log(items);
    return items.map((item) => {
        return { ...item._doc };
    });
};
export async function items(): Promise<any> {
    return Item.find()
        .then((items) => {
            return items.map((item) => {
                return {
                    ...item._doc,
                    item_menu: menuOne(item.item_menu)
                };
            });
        })
        .catch((err) => {
            throw err;
        });
};
// X RESOLVERS **************************************
// ******************************************************
export async function createCategory(args: any) {
    const user = await User.findById(args.userId);
    if (!user) throw new Error("any user exist under this id");
    let category;
    if (args.categoryName && args.categoryNameAr) {
        category = new Category({
            category_name: args.categoryName,
            category_name_ar: args.categoryNameAr,
            user_categories: args.userId
        });
    } else if (args.categoryName && !args.categoryNameAr) {
        category = new Category({
            category_name: args.categoryName,
            user_categories: args.userId
        });
    } else if (!args.categoryName && args.categoryNameAr) {
        category = new Category({
            category_name_ar: args.categoryNameAr,
            user_categories: args.userId
        });
    }
    return category
        .save()
        .then(async (result:any) => {
            await user.update({ $push: { user_categories: result._id } });
            return { ...result._doc };
        })
        .catch((err:any) => {
            console.log(err);
        });
};
export async function updateCategory(args: any) {
    const cat = await Category.findById(args.catId);
    if (!cat) throw new Error("any category exist under this id");
    let category;
    if (args.categoryName && args.categoryNameAr) {
        category = {
            category_name: args.categoryName,
            category_name_ar: args.categoryNameAr,
            user_categories: args.userId
        };
    } else if (args.categoryName && !args.categoryNameAr) {
        category = {
            category_name: args.categoryName
        };
    } else if (!args.categoryName && args.categoryNameAr) {
        category = {
            category_name_ar: args.categoryNameAr
        };
    }
    return await Category.findByIdAndUpdate(args.catId, category, {
        new: true
    });
};
// ROLE RESOLVERS **************************************
// ******************************************************
export async function role(args: any):Promise<any> {
    const _role = role(args.roleId);
    if (!_role) throw new Error("Role does not exist");
    return _role;
};
export async function roles(args: any):Promise<any> {
    return roles(args.rolesId);
};
export async function createRole(args: any, req: any) {
    console.log("createProhibition resolver, args: ", args);
    const _role = new Role({
        name: args.roleInput.name,
        role_prohibitions: args.roleInput.role_prohibitions
    });
    return _role
        .save()
        .then(async (result:any) => {
            console.log("createProhibition result: ", result);
            await Prohibition.updateMany(
                { _id: result.role_prohibitions },
                { $addToSet: { prohibition_roles: result._id } }
            );
            return role(result._id);
        })
        .catch((err:any) => {
            console.log(err);
            throw err;
        });
};
export async function deleteRole(args: any, req: any) {
    console.log("deleteRole args: ", args);
    const role = await Role.findById(args.roleId);
    if (!role) throw new Error("Role does not exist");
    await role.remove();
    await Prohibition.updateMany(
        { _id: role.role_prohibitions },
        { $pull: { prohibition_roles: role._id } }
    );
    await User.updateMany(
        { _id: role.role_users },
        { $pull: { user_role: role._id } }
    );
    console.log("role was deleted: ", role);
    return role;
};
export async function updateRole(args: any, req: any) {
    console.log("updateRole resolver, args: ", args);
    const role = {
        name: args.roleInput.name,
        role_prohibitions: args.roleInput.role_prohibitions
    };
    const newRoleProhibitions = role.role_prohibitions || [];
    const oldRole = await Role.findOne({ _id: args.roleId });
    if (!oldRole) throw new Error("role does not exist");
    const oldRoleProhibitions = oldRole.role_prohibitions;
    Object.assign(oldRole, role);
    const newRole = await oldRole.save();
    const added = difference(newRoleProhibitions, oldRoleProhibitions);
    const removed = difference(oldRoleProhibitions, newRoleProhibitions);
    await Prohibition.updateMany(
        { _id: added },
        { $addToSet: { roles: newRole._id } }
    );
    await Prohibition.updateMany(
        { _id: removed },
        { $pull: { roles: newRole._id } }
    );
    return newRole._doc;
};
// PROHIBITION RESOLVERS **************************************
// ******************************************************
export async function prohibition(args: any):Promise<any> {
    const _menu = prohibition(args.prohibitionId);
    if (!_menu) throw new Error("Prohibition does not exist");
    return _menu;
};
export async function prohibitions(args: any):Promise<any> {
    return prohibitions(args.prohibitionsId);
};
export async function createProhibition(args: any, req: any) {
    console.log("createProhibition resolver, args: ", args);
    const _prohibition = new Prohibition({
        action: args.prohibitionInput.action,
        model: args.prohibitionInput.model,
        prohibition_roles: args.prohibitionInput.prohibition_roles,
        prohibition_users: args.prohibitionInput.prohibition_users
    });
    return _prohibition
        .save()
        .then(async (result: any) => {
            console.log("createProhibition result: ", result);
            await Role.updateMany(
                { _id: result.prohibition_roles },
                { $addToSet: { role_prohibitions: result._id } }
            );
            await User.updateMany(
                { _id: result.prohibition_users },
                { $addToSet: { user_prohibitions: result._id } }
            );
            return prohibition(result._id);
        })
        .catch((err: any) => {
            console.log(err);
            throw err;
        });
};
export async function updateProhibition(args: any, req: any) {
    console.log("updateProhibition resolver, args: ", args);
    const prohibition = {
        action: args.prohibitionInput.action,
        model: args.prohibitionInput.model,
        prohibition_roles: args.prohibitionInput.prohibition_roles
    };
    const newProhibitionRoles = prohibition.prohibition_roles || [];
    const oldProhibition = await Prohibition.findOne({
        _id: args.prohibitionId
    });
    if (!oldProhibition) throw new Error("prohibition does not exist");
    const oldProhibitionRoles = oldProhibition.prohibition_roles;
    Object.assign(oldProhibition, prohibition);
    const newProhibition = await oldProhibition.save();
    const added = difference(newProhibitionRoles, oldProhibitionRoles);
    const removed = difference(oldProhibitionRoles, newProhibitionRoles);
    await Role.updateMany(
        { _id: added },
        { $addToSet: { prohibitions: newProhibition._id } }
    );
    await Role.updateMany(
        { _id: removed },
        { $pull: { prohibitions: newProhibition._id } }
    );
    return newProhibition._doc;
};
export async function deleteProhibition(args: any, req: any) {
    console.log("deleteProhibition args: ", args);
    const prohibition = await Prohibition.findById(args.prohibitionId);
    if (!prohibition) throw new Error("Prohibition does not exist");
    await prohibition.remove();
    await Role.updateMany(
        { _id: prohibition.prohibition_roles },
        { $pull: { role_prohibitions: prohibition._id } }
    );
    await User.updateMany(
        { _id: prohibition.prohibition_users },
        { $pull: { user_prohibitions: prohibition._id } }
    );
    console.log("prohibition was deleted: ", prohibition);
    return prohibition;
};
// LANDING FEATURE RESOLVERS **************************************
// ******************************************************
export async function landingFeatures() {
    const landingFeatures = await LandingFeature.find()
        .sort({ order: -1 })
        .exec();
    if (!landingFeatures) throw new Error("No Features exist");
    console.log("landingFeatures=", landingFeatures);
    return landingFeatures.map((feature) => {
        return { ...feature._doc };
    });
};
export async function createLandingFeature(args: any, req: any) {
    console.log("createLandingFeature resolver, args: ", args);
    const _landingFeature = new LandingFeature({
        title: args.landingFeatureInput.title,
        title_ar: args.landingFeatureInput.title_ar,
        subtitle: args.landingFeatureInput.subtitle,
        subtitle_ar: args.landingFeatureInput.subtitle_ar,
        description: args.landingFeatureInput.description,
        description_ar: args.landingFeatureInput.description_ar,
        soon: args.landingFeatureInput.soon
    });
    return _landingFeature
        .save()
        .then((result: any) => {
            return { ...result._doc };
        })
        .catch((err: any) => {
            console.log(err);
        });
};
export async function deleteLandingFeature(args: any, req: any) {
    console.log("delete Feature args: ", args);
    const feature = await LandingFeature.findById(args.landingFeatureId);
    if (!feature) throw new Error("Feature does not exist");
    await feature.remove();
    console.log("Feature was deleted: ", feature);
    return feature;
};
export async function updateLandingFeature(args: any, req: any) {
    console.log(
        "update landing feature resolver, args: " + JSON.stringify(args)
    );
    const landingFeature = {
        title: args.landingFeatureUpdate.title,
        title_ar: args.landingFeatureUpdate.title_ar,
        subtitle: args.landingFeatureUpdate.subtitle,
        subtitle_ar: args.landingFeatureUpdate.subtitle_ar,
        description: args.landingFeatureUpdate.description,
        description_ar: args.landingFeatureUpdate.description_ar,
        soon: args.landingFeatureUpdate.soon
    };
    return LandingFeature.findByIdAndUpdate(
        args.landingFeatureId,
        landingFeature,
        { new: true }
    )
        .then((result) => {
            if (!result) {
                throw new Error("Feature does not exit");
            }
            return { ...result._doc };
        })
        .catch((err) => {
            throw err;
        });
};
// LANDING FAQS RESOLVERS **************************************
// ******************************************************
export async function landingFAQs() {
    const landingFAQs = await LandingFAQ.find();
    if (!landingFAQs) throw new Error("No FAQ exist");
    console.log("landingFAQS=", landingFAQs);
    return landingFAQs.map((faq) => {
        return { ...faq._doc };
    });
};
export async function createLandingFAQ(args: any, req: any) {
    console.log("createLandingFAQ resolver, args: ", args);
    const _landingFAQ = new LandingFAQ({
        question: args.landingFAQInput.question,
        question_ar: args.landingFAQInput.question_ar,
        answer: args.landingFAQInput.answer,
        answer_ar: args.landingFAQInput.answer_ar
    });
    return _landingFAQ
        .save()
        .then((result: any) => {
            return { ...result._doc };
        })
        .catch((err: any) => {
            console.log(err);
        });
};
export async function deleteLandingFAQ(args: any, req: any) {
    console.log("deleteFAQ args: ", args);
    const faq = await LandingFAQ.findById(args.landingFAQId);
    if (!faq) throw new Error("FAQ does not exist");
    await faq.remove();
    console.log("FAQ was deleted: ", faq);
    return faq;
};
export async function updateLandingFAQ(args: any, req: any) {
    console.log("update landing FAQ resolver, args: " + JSON.stringify(args));
    const landingFAQ = {
        question: args.landingFAQUpdate.question,
        question_ar: args.landingFAQUpdate.question_ar,
        answer: args.landingFAQUpdate.answer,
        answer_ar: args.landingFAQUpdate.answer_ar
    };
    return LandingFAQ.findByIdAndUpdate(args.landingFAQId, landingFAQ, {
        new: true
    })
        .then((result) => {
            if (!result) {
                throw new Error("FAQ does not exit");
            }
            return { ...result._doc };
        })
        .catch((err) => {
            throw err;
        });
};
// LANDING PARTNERS RESOLVERS **************************************
// ******************************************************
export async function landingPartners() {
    const landingPartners = await LandingPartner.find();
    if (!landingPartners) throw new Error("No Partner exist");
    console.log("landingPartners=", landingPartners);
    return landingPartners.map((partner) => {
        return { ...partner._doc };
    });
};
export async function createLandingPartner(args: any, req: any) {
    console.log("createLandingPartner resolver, args: ", args);
    const _landingPartner = new LandingPartner({
        partner_name: args.landingPartnerInput.partner_name,
        partner_name_ar: args.landingPartnerInput.partner_name_ar,
        partner_menu_link: args.landingPartnerInput.partner_menu_link,
        partner_website: args.landingPartnerInput.partner_website,
        partner_logo: args.landingPartnerInput.partner_logo
    });
    return _landingPartner
        .save()
        .then((result: any) => {
            return { ...result._doc };
        })
        .catch((err: any) => {
            console.log(err);
        });
};
export async function deleteLandingPartner(args: any, req: any) {
    console.log("deletePartner args: ", args);
    const partner = await LandingPartner.findById(args.landingPartnerId);
    if (!partner) throw new Error("FAQ does not exist");
    await partner.remove();
    console.log("FAQ was deleted: ", partner);
    return partner;
};
export async function updateLandingPartner(args: any, req: any) {
    console.log(
        "update landing partner resolver, args: " + JSON.stringify(args)
    );

    const landingPartner = {
        partner_name: args.landingPartnerUpdate.partner_name,
        partner_name_ar: args.landingPartnerUpdate.partner_name_ar,
        partner_menu_link: args.landingPartnerUpdate.partner_menu_link,
        partner_website: args.landingPartnerUpdate.partner_website,
        partner_logo: args.landingPartnerUpdate.partner_logo
    };
    return LandingPartner.findByIdAndUpdate(
        args.landingPartnerId,
        landingPartner,
        { new: true }
    )
        .then((result) => {
            if (!result) {
                throw new Error("Partner does not exit");
            }
            return { ...result._doc };
        })
        .catch((err) => {
            throw err;
        });
};
//  X RESOLVERS **************************************
// ******************************************************
export async function updateCurrentState(args: any) {
    const user = await User.findByIdAndUpdate(
        args.userId,
        { current_state: args.plan },
        { new: true }
    );
    if (!user) throw new Error("User does not exist under this id");
    return { ...user._doc };
};
export async function updatePreferredCard(args: any) {
    const checkUser = await User.exists({ _id: args.userId });
    if (!checkUser) throw new Error("User does not exist");
    const updatePreferredCard = await User.findByIdAndUpdate(
        args.userId,
        { preferred_card: args.cardId },
        { new: true }
    );
    if (!updatePreferredCard) throw new Error("Something went wrong ");
    return { ...updatePreferredCard._doc };
};
export async function updateEmailVerifiedState(args: any) {
    const user = await User.findById(args.userId);
    if (!user) throw new Error("user does not exist under id");
    const updateUserEmail = await User.findByIdAndUpdate(
        args.userId,
        { email_verified: true },
        { new: true }
    );
    if (!updateUserEmail) throw new Error("Something went wrong");
    console.log("email : ", updateUserEmail);
    return { ...updateUserEmail._doc };
};
export async function updatePassword(args: any) {
    const hashedPassword = await bcrypt.hash(args.password, 12);
    const user = await User.findOne({ email: args.userEmail });
    if (!user) throw new Error("user does not exist ! ");
    const updateUserPassword = await User.findByIdAndUpdate(
        user._id,
        { password: hashedPassword },
        { new: true }
    );
    const userUID = await Admin().auth().getUserByEmail(args.userEmail);
    console.log("userUID=", userUID);
    Admin()
        .auth()
        .updateUser(userUID.uid, {
            password: args.password
        })
        .then((t: any) => {
            console.log("user record : ", t);
        })
        .catch((err: any) => {
            console.log(err);
        });
    return { ...updateUserPassword._doc };
};
export async function deleteObjectS3(args: any) {
    const params = { Bucket: globalThis.__config.Bucket, Key: args.menuId };
    s3().deleteObject(params, function (err: any, data: any) {
        if (err) {
            console.error(err, err.stack);
            return { data: false };
        }
        console.log(data);
        return { data: true };
    });
};
export async function deleteCategory(args: any) {
    const category = await Category.findByIdAndDelete(args.categoryId);
    console.log("the category is ", category._doc);
    const PullCaregoryUser = await User.updateOne(
        { _id: category._doc.user_categories },
        { $pull: { user_categories: category._doc._id } },
        { safe: true }
    );
    return { ...category._doc };
};
// QUERIES RESOLVERS ****************************************************
export async function userCategories(args: any) {
    const categories = await Category.find({ user_categories: args.userId });
    if (!categories) throw new Error("No category exist under this user");
    console.log("categories ", categories);
    return categories.map((category) => {
        return { ...category._doc };
    });
};
export async function userCategoryNames(args: any) {
    const categories = await Category.find({ user_categories: args.userId });
    if (!categories) throw new Error("No category exist under this user");
    console.log("categories ", categories);
    let allCategories = [];
    categories.map((category) => {
        allCategories.push(category._doc.category_name);
    });
};
export async function findCategoryByNameAndUserId(args: any) {
    const categories = await Category.find({ user_categories: args.userId });
    if (!categories) throw new Error("No category exist under this user");
    console.log("categories ", categories);
    return categories.map((category) => {
        return { ...category._doc };
    });
};
export async function getLastPlan(args: any) {
    const checkUser = await User.exists({ _id: args.userId });
    if (!checkUser) throw new Error("User does not exist");
    const lastestPlan = await Plan.findOne({ plan_user: args.userId })
        .sort({ cycle_date: -1 })
        .limit(1);
    console.log(lastestPlan.cycle_date);
    return { ...lastestPlan._doc };
};
export async function getPreferredCard(args: any) {
    const user = await User.findById(args.userId);
    if (!user) throw new Error("user does not exist under thid id");
    return { ...user._doc.preferred_card };
};
export async function getCards(args: any) {
    const checkUser = await User.exists({ _id: args.userId });
    if (!checkUser) throw new Error("Any user exist under this Id");
    const cards = await Card.find({ card_user: args.userId });
    console.log(cards);
    return cards;
};
export async function addCard(args: any) {
    const checkUser = await User.exists({ _id: args.cardInput.card_user });
    if (!checkUser) throw new Error("Any user exist under this id");
    const checkCard = await Card.exists({
        registration_id: args.cardInput.registration_id
    });
    if (checkCard) throw new Error("Card already exists");
    const newCard = new Card({
        registration_id: args.cardInput.registration_id,
        bin: args.cardInput.bin,
        binCountry: args.cardInput.binCountry,
        last4Digits: args.cardInput.last4Digits,
        holder: args.cardInput.holder,
        brand: args.cardInput.brand,
        expiryMonth: args.cardInput.expiryMonth,
        expiryYear: args.cardInput.expiryYear,
        currency: args.cardInput.currency,
        card_user: args.cardInput.card_user
    });
    const saveCard = await newCard.save();
    return { ...saveCard._doc };
};
export async function deleteCard(args: any) {
    const user = await User.findById(args.userId);
    if (!user) throw new Error("User does not exist under this ID");
    const checkCard = await Card.exists({ _id: args.cardId });
    if (!checkCard) throw new Error("Card does not exist under this ID");
    const pullCard = await user.updateOne({
        $pull: { user_cards: args.cardId }
    });
    const deleteCard = await Card.findByIdAndDelete(args.cardId);
    return { ...deleteCard._doc };
};
// TRANSACTIONS RESOLVERS **************************************
// ******************************************************
export async function addPaymentTransaction(args: any) {
    const user = await User.findById(args.userId);
    if (!user) throw new Error("No user under this ID");
    const newTransaction = new Transaction({
        payment_id: args.transactioninput.paymentId,
        transaction_user: args.userId,
        transaction_merchant_id: args.transactioninput.transactionMerchantId,
        transaction_type: args.transactioninput.transactionType,
        transaction_card: args.transactioninput.transactionCard,
        registration_id: args.transactioninput.registrationID,
        parent_transaction: args.transactioninput.parentTransaction,
        payment_method: args.transactioninput.payment_method
    });
    const addTransaction = await newTransaction.save();
    const pushTransaction = await User.findByIdAndUpdate(args.userId, {
        $push: { user_transaction: addTransaction._id }
    });

    return { ...addTransaction._doc };
};
export async function getAllTransactions() {
    return Transaction.find()
        .then((transaction) => {
            return transaction.map(async (t) => {
                console.log("c : ", t._doc);
                return { ...t._doc };
            });
        })
        .catch();
};
export async function getUserTransactions(args: any) {
    const checkUser = await User.exists({ _id: args.userId });
    if (!checkUser) throw new Error("User does not exist");
    return await Transaction.find({ user: args.userId })
        .sort({ createdAt: -1 })
        .then((transactions) => {
            return transactions.map(async (transaction) => {
                const ads = await transaction
                    .populate("card")
                    .populate("pack")
                    .populate("pack_user")
                    .populate("user")
                    .populate("billing_address")
                    .populate("parent_transaction")
                    .execPopulate();
                console.log("populate", ads);
                return { ...ads._doc, password: null };
            });
        })
        .catch((err) => {
            throw err;
        });
};
export async function getUserTransactionsByPage(args: any) {
    const checkUser = await User.exists({ _id: args.userId });
    if (!checkUser) throw new Error("User does not exist");
    return await Transaction.find({ user: args.userId })
        .sort({ createdAt: -1 })
        .then((transactions) => {
            return transactions.map(async (transaction) => {
                const ads = await transaction
                    .populate("card")
                    .populate("pack")
                    .populate("pack_user")
                    .populate("user")
                    .populate("billing_address")
                    .populate("parent_transaction")
                    .execPopulate();
                console.log("populate", ads);
                return { ...ads._doc, password: null };
            });
        })
        .catch((err) => {
            throw err;
        });
};
// PACKUSER RESOLVERS **************************************
// ******************************************************
export async function createPackUsers(args: any) {
    let pack_id = args.packUsersInput.pack_id;
    let next_cycle_date = args.packUsersInput?.next_cycle_date;
    let status = "";
    if (!pack_id) {
        const packs = await Packs.findOne({
            price_monthly_sar: 0,
            price_monthly_usd: 0,
            price_annual_sar: 0,
            price_annual_usd: 0
        });
        console.log(packs);
        if (!packs) {
            pack_id = packs._id;
            status = "free"
        }
        else {
            status = "waiting_pack";
        }
    }
    else {
        const packs = await Packs.findOne({ _id: pack_id });
        console.log(packs);
        if (!packs) throw new Error("No Packs exist");
        pack_id = packs._id;
        if (packs?.is_trial && packs?.trial_x_days) {
            let cycleDate = packs?.cycleDate;
            let nextNewCycleDate = new Date(cycleDate);
            nextNewCycleDate.setDate(cycleDate.getDate() + packs?.trial_x_days);
            next_cycle_date = nextNewCycleDate;
            status = "active";
        }
        else {
            status = "waiting";
        }
    }
    const packUser = new PackUsers({
        pack_id: pack_id,
        user_id: args.packUsersInput.user_id,
        cycle_date: args.packUsersInput.cycle_date,
        next_cycle_date: next_cycle_date,
        recurring: args.packUsersInput.recurring,
        currency: args.packUsersInput.currency,
        status: status
    });
    return packUser
        .save()
        .then((result: any) => {
            return {
                ...result._doc
            };
        })
        .catch((err: any) => {
            console.log(err);
        });
};
export async function updatePackUsers(args: any, req: any) {
    console.log("update Pack User resolver, args: " + JSON.stringify(args));
    const packUser = {
        pack_id: args.packUsersUpdate.pack_id,
        user_id: args.packUsersUpdate.user_id,
        cycle_date: args.packUsersUpdate.cycle_date,
        next_cycle_date: args.packUsersUpdate?.next_cycle_date,
        recurring: args.packUsersUpdate.recurring,
        currency: args.packUsersInput.currency,
        status: args.packUsersUpdate.status
    };
    return PackUsers.findByIdAndUpdate(args.id, packUser, { new: true })
        .then((result) => {
            if (!result) {
                throw new Error("Pack User does not exit");
            }
            return {
                ...result._doc,
                pack_items: itemsList(result._doc.pack_items)
            };
        })
        .catch((err) => {
            throw err;
        });
};
export async function updatePackUsersCycleExpiredDate(args: any, req: any) {
    console.log("update Pack User resolver, args: " + JSON.stringify(args));
    const packUser = {
        cycle_date: args.packUsersCycleDate,
        next_cycle_date: args.packUsersnextCycleDate
    };
    return PackUsers.findByIdAndUpdate(args.packUsersId, packUser, {
        new: true
    })
        .then((result) => {
            if (!result) {
                throw new Error("Pack User does not exit");
            }
            return {
                ...result._doc
            };
        })
        .catch((err) => {
            throw err;
        });
};
export async function packUsers(args: any) {
    console.log("packUserId=", args.packUsersId);
    return PackUsers.findById(args.packUsersId)
        .then((onePackUsers) => {
            console.log(onePackUsers);
            return { ...onePackUsers._doc };
        })
        .catch((err) => {
            throw err;
        });
};
export async function updateUserPackID(args: any) {
    const user = await User.findByIdAndUpdate(
        args.userId,
        { user_plan: args.user_plan },
        { new: true }
    );
    if (!user) throw new Error("User does not exist");
    return { ...user._doc };
};
export async function deletePackUsers(args: any, req: any) {
    console.log("delete Pack User, args: " + JSON.stringify(args));
    const packUser = await PackUsers.findById(args.packUserId);
    if (!packUser) throw new Error("Pack User does not exist");
    const deletePackUsers = await PackUsers.deleteOne({ _id: args.packId });
    console.log(deletePackUsers);
};
export async function packAllUsers() {
    const packUser = await PackUsers.find();
    if (!packUser) throw new Error("No Packs exist");
    console.log("packUser=", packUser);
    return packUser.map((packUser) => {
        return { ...packUser._doc };
    });
};
export async function getPackUsersByUserID(args: any) {
    console.log("getPackUsersByUserID, args: " + JSON.stringify(args));
    const packUser = await PackUsers.find({ user_id: args.user_id });
    if (!packUser) throw new Error("No Packs Users exist");
    console.log("getPackUsersByUserID=", packUser);
    return packUser.map((packUser) => {
        return { ...packUser._doc };
    });
};
export async function createPack(args: any) {
    const pack = new Packs({
        title: args.packInput.title,
        title_ar: args.packInput.title_ar,
        subtitle: args.packInput.subtitle,
        subtitle_ar: args.packInput.subtitle_ar,
        price_monthly_sar: args.packInput.price_monthly_sar,
        price_annual_sar: args.packInput.price_annual_sar,
        price_3months_sar: args.packInput.price_3months_sar,
        price_6months_sar: args.packInput.price_6months_sar,
        price_monthly_usd: args.packInput.price_monthly_usd,
        price_annual_usd: args.packInput.price_annual_usd,
        price_3months_usd: args.packInput.price_3months_usd,
        price_6months_usd: args.packInput.price_6months_usd,
        discount_sar: args.packInput.discount_sar,
        discount_usd: args.packInput.discount_usd,
        features: args.packInput.features,
        features_ar: args.packInput.features_ar,
        status: args.packInput.status,
        order: args.packInput.order,
        menu_limit: args.packInput.menu_limit,
        items_limit: args.packInput.items_limit,
        image_per_item_limit: args.packInput.image_per_item_limit,
        ability_change_item_status: args.packInput.ability_change_item_status,
        custom_menu_url: args.packInput.custom_menu_url,
        custom_menu_style: args.packInput.custom_menu_style,
        show_search_ability: args.packInput.show_search_ability,
        show_social_icons: args.packInput.show_social_icons,
        show_delivery_links: args.packInput.show_delivery_links,
        feature_hide_watermark: args.packInput.feature_hide_watermark,
        feature_open_hours: args.packInput.feature_open_hours,
        feature_order_button: args.packInput.feature_order_button,
        is_trial: args.packInput.is_trial,
        trial_x_days: args.packInput.trial_x_days
    });
    return pack
        .save()
        .then((result: any) => {
            return { ...result._doc };
        })
        .catch((err: any) => {
            console.log(err);
        });
};
export async function updatePack(args: any, req: any) {
    console.log("updatePack resolver, args: " + JSON.stringify(args));
    const pack = {
        title: args.packUpdate.title,
        title_ar: args.packUpdate.title_ar,
        subtitle: args.packUpdate.subtitle,
        subtitle_ar: args.packUpdate.subtitle_ar,
        price_monthly_sar: args.packUpdate.price_monthly_sar,
        price_annual_sar: args.packUpdate.price_annual_sar,
        price_3months_sar: args.packUpdate.price_3months_sar,
        price_6months_sar: args.packUpdate.price_6months_sar,
        price_monthly_usd: args.packUpdate.price_monthly_usd,
        price_annual_usd: args.packUpdate.price_annual_usd,
        price_3months_usd: args.packUpdate.price_3months_usd,
        price_6months_usd: args.packUpdate.price_6months_usd,
        discount_sar: args.packUpdate.discount_sar,
        discount_usd: args.packUpdate.discount_usd,
        features: args.packUpdate.features,
        features_ar: args.packUpdate.features_ar,
        status: args.packUpdate.status,
        order: args.packUpdate.order,
        menu_limit: args.packUpdate.menu_limit,
        items_limit: args.packUpdate.items_limit,
        image_per_item_limit: args.packUpdate.image_per_item_limit,
        ability_change_item_status: args.packUpdate.ability_change_item_status,
        custom_menu_url: args.packUpdate.custom_menu_url,
        custom_menu_style: args.packUpdate.custom_menu_style,
        show_search_ability: args.packUpdate.show_search_ability,
        show_social_icons: args.packUpdate.show_social_icons,
        show_delivery_links: args.packUpdate.show_delivery_links,
        feature_hide_watermark: args.packUpdate.feature_hide_watermark,
        feature_open_hours: args.packUpdate.feature_open_hours,
        feature_order_button: args.packUpdate.feature_order_button,
        is_trial: args.packUpdate.is_trial,
        trial_x_days: args.packUpdate.trial_x_days
    };

    return Packs.findByIdAndUpdate(args.packId, pack, { new: true })
        .then((result) => {
            if (!result) {
                throw new Error("Pack does not exit");
            }
            return {
                ...result._doc,
                pack_items: itemsList(result._doc.pack_items)
            };
        })
        .catch((err) => {
            throw err;
        });
};
export async function deletePack(args: any, req: any) {
    const pack = await Packs.findById(args.packId);
    if (!pack) throw new Error("Pack does not exist");
    const deletePlan = await Packs.deleteOne({ _id: args.packId });
};
export async function packs() {
    const packs = await Packs.find();
    if (!packs) throw new Error("No Packs exist");
    return packs.map((pack) => {
        return { ...pack._doc };
    });
};
export async function packsEnabled() {
    const packs = await Packs.find({ status: true }).sort({ order: 1 });
    if (!packs) throw new Error("No Packs exist");
    console.log("packsEnabled=", packs);
    return packs.map((pack) => {
        return { ...pack._doc };
    });
};
export async function pack(args: any) {
    console.log("packId=", args.packId);
    return Packs.findById(args.packId)
        .then((onePack) => {
            console.log(onePack);
            return { ...onePack._doc };
        })
        .catch((err) => {
            throw err;
        });
};
export async function getPacks(args: any) {
    const packs = await Packs.find();
    return packs;
};
export async function getPackByID(args: any) {
    const pack = await Packs.findOne({ _id: args.packId });
    if (!pack) throw new Error("Pack does not exist");
    return { ...pack._doc };
};
export async function getAddressByUserID(args: any) {
    console.log("getAddressByUserID, args: " + JSON.stringify(args));
    const addresses = await Addresses.findOne({ user: args.userId });
    if (!addresses) throw new Error("No Address Users exist");
    console.log("getAddressByUserID=", addresses);
    return { ...addresses._doc };
};
export async function addAddress(args: any) {
    let inputs = args.addressinput;
    const addresses = new Addresses({
        first_name: inputs.first_name,
        last_name: inputs.last_name,
        email: inputs.email,
        address_line_1: inputs.address_line_1,
        address_line_2: inputs.address_line_2,
        city: inputs.city,
        state: inputs.state,
        zip_code: inputs.zip_code,
        country_code: inputs.country_code,
        country: inputs.country,
        user: inputs.user
    });
    return addresses
        .save()
        .then((result: any) => {
            return { ...result._doc };
        })
        .catch((err: any) => {
            console.log(err);
        });
};
export async function updateAddress(args: any) {
    const address = await Addresses.findOne({ _id: args.idAddress });
    if (!address) throw new Error("Address does not exist");
    let inputs = args.addressUpdate;
    const addressData = {
        first_name: inputs.first_name,
        last_name: inputs.last_name,
        email: inputs.email,
        address_line_1: inputs.address_line_1,
        address_line_2: inputs.address_line_2,
        city: inputs.city,
        state: inputs.state,
        zip_code: inputs.zip_code,
        country_code: inputs.country_code,
        country: inputs.country
    };
    const newAddress = await Addresses.findByIdAndUpdate(
        args.idAddress,
        addressData,
        {
            new: true
        }
    );
    return newAddress;
};
// Wallet RESOLVERS **************************************
// ******************************************************
export async function getWalletByUserID(args: any) {
    const wallet = await Wallet.aggregate([
        {
            $group: {
                totalAmountDebit: { $sum: "$amount_debit" },
                totalAmountCredit: { $sum: "$amount_credit" },
                count: { $sum: 1 }
            }
        }
    ])/*.findOne({ user_id: args.userId })*/;
    if (!wallet) throw new Error("Pack does not exist");
    return { ...wallet };
};
export async function getWalletByID(args: any) {
    const wallet = await Wallet.findOne({ _id: args.walletId });
    if (!wallet) throw new Error("Wallet does not exist");
    return { ...wallet._doc };
};
export async function wallets(args: any) {
    const wallets = await Wallet.aggregate([
        {
            $group: {
                totalAmountDebit: { $sum: "$amount_debit" },
                totalAmountCredit: { $sum: "$amount_credit" },
                count: { $sum: 1 }
            }
        }
    ]).exec();
    return wallets;
};
export async function sendRequestedEmail(args: any) {
    const user = await User.findOne({ email: args.user_email });
    if (!user) throw new Error("no-user-exist");
    const dateNow = new Date();
    const dateExpire = addMinutes(dateNow, 30);
    const oobCode = await jwt.sign(
        {
            mode:
                args.email_mode == "verify-email" ? "verifyEmail" : "resetPassword",
            createdDate: dateNow,
            expireDate: dateExpire
        },
        globalThis.__config.OOBCODE
    );

    // Read your SVG file's contents
    const svg = readFileSync("./images/qawaim-logo.svg", "utf-8");
    // This is your SVG in base64 representation
    let base64fromSVG: string = "" /*= svg64(svg)*/;
    switch (args.email_mode) {
        case "verify-email":
            const dataMailVerify = {
                email_lang: args.lang,
                email_logo: `data:image/svg+xml;base64,${base64fromSVG}`,
                email_heading: "",
                email_footer_text:
                    args.lang == "ar"
                        ? "قوائم - تصميم و برمجة مؤسسة سكة لتقنية المعلومات"
                        : "Qawaim — Designed & Developed by Sikka Software",
                email_name_portal: "Qawaim",
                email_customer_name: args.user_email, //user display name here
                email_customer_email: args.user_email,
                email_reset_link: `${process.env.QAWAIM_USER_PORTAL_URL}/?mode=verifyEmail&oobCode=${oobCode}&email=${args.user_email}`,
                email_translate: {
                    hi_txt: args.lang == "ar" ? "مرحبا" : "Hi",
                    text_line:
                        args.lang == "ar"
                            ? "شكرا لتسجيلك في تطبيق قوائم! يرجى التحقق من بريدك الإلكتروني باستخدام الرابط أدناه والبدء في إنشاء القائمة الرقمية الخاصة بك!"
                            : "Thanks for signing up for your Qawaim account! Please verify your email using the link below and get started building Your Digital Menu!",
                    text_link:
                        args.lang == "ar"
                            ? "قم بتأكيد بريدك الألكتروني"
                            : "Verify your email"
                }
            };
            //send email to user and admin
            ejs.renderFile(
                "template/email/customer-verify-email.ejs",
                dataMailVerify,
                {},
                function (err, str) {
                    // str => Rendered HTML string
                    console.log(err);
                    console.log(str);
                    let message = {
                        headers: {
                            "X-Sender": process.env.VERIFICATION_EMAIL
                        },
                        from: `Qawaim <${process.env.VERIFICATION_EMAIL}>`,
                        to: `${args.user_email}`,
                        subject:
                            args.lang == "en"
                                ? "Please verify your account in Qawaim"
                                : "يرجى توثيق حسابك في قوائم",
                        html: str
                    };
                    /*emailTransport.sendMail(message, (error, info) => {
                        console.log(error);
                        console.log(info);
                    });*/
                }
            );
            break;
        case "reset-password":
            const dataMail = {
                email_lang: args.lang,
                email_logo: `data:image/svg+xml;base64,${base64fromSVG}`,
                email_heading: "",
                email_footer_text:
                    args.lang == "ar"
                        ? "قوائم - تصميم و برمجة مؤسسة سكة لتقنية المعلومات"
                        : "Qawaim — Designed & Developed by Sikka Software",
                email_name_portal: "Qawaim",
                email_customer_name: args.user_email,
                email_customer_email: args.user_email,
                email_reset_link: `${process.env.QAWAIM_USER_PORTAL_URL}/?mode=resetPassword&oobCode=${oobCode}&email=${args.user_email}`,
                email_translate: {
                    hi_txt: args.lang == "ar" ? "مرحبا" : "Hi",
                    text_line1:
                        args.lang == "ar"
                            ? "طلب شخص ما كلمة مرور جديدة للحساب التالي على قوائم"
                            : "Someone has requested a new password for the following account on Qawaim",
                    username: args.lang == "ar" ? "اسم المستخدم:" : "Username:",
                    text_line2:
                        args.lang == "ar"
                            ? "عنوان الفاتورةإذا لم تقدم هذا الطلب ، فتجاهل هذا البريد الإلكتروني فقط. إذا كنت ترغب في المتابعة:"
                            : "If you didn't make this request, just ignore this email. If you'd like to proceed:",
                    text_link:
                        args.lang == "ar"
                            ? "انقر هنا لإعادة تعيين كلمة المرور الخاصة بك"
                            : "Click here to reset your password"
                }
            };
            //send email to user and admin
            ejs.renderFile(
                "template/email/customer-reset-password.ejs",
                dataMail,
                {},
                function (err, str) {
                    // str => Rendered HTML string
                    console.log(err);
                    console.log(str);
                    let message = {
                        headers: {
                            "X-Sender": process.env.VERIFICATION_EMAIL
                        },
                        from: `Qawaim - Reset Password <${process.env.VERIFICATION_EMAIL}>`,
                        to: `${args.user_email}`,
                        subject:
                            args.lang == "en"
                                ? "Reset your password for Qawaim"
                                : "إعادة تعيين كلمة المرور الخاصة بك في قوائم",
                        html: str
                    };
                    /*emailTransport.sendMail(message, (error, info) => {
                        console.log(error);
                        console.log(info);
                    });*/
                }
            );
            break;
        default:
            throw new Error("Invalid mode");
    }
    try {
        const checkEmail = await EmailActions.findOne({
            user_email: args.user_email,
            email_mode:
                args.email_mode == "verify-email" ? "verifyEmail" : "resetPassword"
        });
        if (checkEmail) await checkEmail.remove();
        const newVerificationEmail = new EmailActions({
            email_mode:
                args.email_mode == "verify-email" ? "verifyEmail" : "resetPassword",
            email_oobCode: oobCode,
            email_created: dateNow,
            user_email: args.user_email,
            email_expire: dateExpire
        });
        await newVerificationEmail.save();
        return {
            email_mode: args.email_mode,
            email_code: oobCode
        };
    } catch (err) {
        console.error(err);
    }
};
export async function checkEmailValidity(args: any) {
    const user = await User.findOne({ email: args.email });
    console.log("user user : ", user);
    if (!user)
        return {
            valid: false,
            reason: "User does not exist under this email",
            code: "noUserExist"
        };
    const email = await EmailActions.findOne({
        user_email: args?.email,
        email_oobCode: args.email_oobCode,
        email_mode: args.email_mode
    });
    if (!email)
        return {
            valid: false,
            reason: "Email does not exist !",
            code: "noEmailInDb"
        };

    if (isAfter(new Date(), email.email_expire))
        return {
            valid: false,
            reason: "Expired Link !",
            code: "expiredLink"
        };

    if (isBefore(new Date(), email.email_expire)) {
        await email.remove();
        return { valid: true };
    }
};
// EXTRA RESOLVERS **************************************
// ******************************************************
export async function resetPassword(args: any) {
    const user = await User.findOne({ email: args.email });
    if (!user) throw new Error("User does not exist");
    let newPassword: any;
    try {
        newPassword = await bcrypt.hash(args.newPassword, 12);
    } catch (err: any) {
        throw new Error(err);
    }
    Admin()
        .auth()
        .getUserByEmail(args.email)
        .then((t: any) => {
            return t;
        })
        .then((t: any) => {
            Admin().auth().updateUser(t.uid, { password: args.newPassword });
        })
        .then(() => {
            return User.findByIdAndUpdate(
                user._id,
                { password: newPassword },
                { new: true }
            );
        })
        .catch((e: any) => {
            throw new Error("Something went wrong during reseting password");
        });
    return { ...user._doc, password: null };
};
export async function getMenuNumbers(args: any) {
    const user = await User.findById(args.userId);
    if (!user) throw new Error("User does not exist under this email");
    const t = parseInt(user?.user_menus?.length);
    return t;
};
