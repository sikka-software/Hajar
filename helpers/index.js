function formatCurrency(cents, currency) {
  if (currency == "SAR") {
    return cents + " " + currency;
  }
  return currency + " " + cents;
}

function getTotals(products, invoice_vat, invoice_discount) {
  let totals = {
    subtotal: 0.0,
    discount: invoice_discount,
    vat: 0.0,
    total: 0.0,
  };
  for (var product in products) {
    totals.subtotal += parseFloat(product["product_price"]);
  }
  totals.total += totals.subtotal;
  if (invoice_discount) {
    totals.total -= invoice_discount;
  }
  if (invoice_vat) {
    totals.vat = totals.total * invoice_vat;
    totals.total += totals.vat;
  }
  return  totals;
}

module.exports = {
  formatCurrency,
  getTotals,
};
