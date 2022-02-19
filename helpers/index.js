function formatCurrency(cents, currency) {
  if (currency == "SAR") {
    return cents + " " + currency;
  }
  return currency + " " + cents;
}

module.exports = {
  formatCurrency,
};
