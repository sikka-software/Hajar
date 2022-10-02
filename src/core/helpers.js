export function getPrice (cycle, currency, pack){
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

  return price
}

export function formatCurrency (cents, currency){
  if (currency === "SAR") {
    return String(cents) + " " + String(currency);
  }
  return String(currency) + " " + String(cents);
}