import { Menu, Wallet } from "./ModelsQawaim";

export function getPrice(cycle:any, currency:any, pack: any) {
  let price = 0;
  if (cycle === "annually") {
    if (currency === "usd") {
      price = pack?.price_annual_usd;
    } else {
      price = pack?.price_annual_sar;
    }
  } else if (cycle === "3-months") {
    if (currency === "usd") {
      price = pack?.price_3months_usd;
    } else {
      price = pack?.price_3months_sar;
    }
  } else if (cycle === "6-months") {
    if (currency === "usd") {
      price = pack?.price_6months_usd;
    } else {
      price = pack?.price_6months_sar;
    }
  } else {
    if (currency === "usd") {
      price = pack?.price_monthly_usd;
    } else {
      price = pack?.price_monthly_sar;
    }
  }

  return price;
}

export function formatCurrency(cents:any, currency:any) {
  if (currency == "SAR") {
    return cents + " " + currency;
  }
  return currency + " " + cents;
}

export async function resetMenu(pack: any, user_id: string) {
  //reset menu styles only for downgrade pack free
  if (!pack.price_monthly_sar || pack.price_monthly_sar == 0) {
    await Menu.find({ menu_user: user_id }).then((menus: any) => {
      menus.map(async (menu: any) => {
        const menuData = {
          background_color: "#E2E2E2",
          primary_color: "#0843E1",
          item_color: "#ffffff",
          categories_color: "#ffffff",
          border_radius: 10
        };
        await Menu.findByIdAndUpdate(menu._id, menuData, {
          new: true
        });
      });
    });
  }
}

export async function unpublishMenu(pack: any, user_id: string) {
  const allMenusUser = await Menu.find({
    menu_user: user_id,
    menu_live: true
  });
  const menu_count = allMenusUser.length;
  console.log("menu_limit=", pack.menu_limit);
  console.log("menu_count=", menu_count);
  if (pack.menu_limit < menu_count) {
    await Menu.find({ menu_user: user_id, menu_live: true })
      .sort({ createdAt: -1 })
      .limit(menu_count - pack.menu_limit)
      .then((menus) => {
        console.log("menus=", menus);
        menus.map(async (menu) => {
          await Menu.findByIdAndUpdate(
            menu._id,
            { menu_live: false },
            {
              new: true
            }
          );
        });
      });
  }
}

export async function getWalletAmount(user_id: string) {
  const wallet_user = await Wallet.find({ user_id: user_id });
  let total_wallet: number = 0.0;
  if (wallet_user) {
    wallet_user.map((wallet: any) => {
      total_wallet = total_wallet + wallet.amount_debit + wallet.amount_credit;
    });
  }
  return total_wallet;
}
