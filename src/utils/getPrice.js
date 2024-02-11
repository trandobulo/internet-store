const getPrice = (product, currency) => {
  const currencyFilter = (item) => currency === item.currency.symbol;

  return product &&
    product.prices &&
    currency &&
    product.prices.findIndex(currencyFilter) >= 0
    ? product.prices[product.prices.findIndex(currencyFilter)].amount
    : "N/A";
};

export default getPrice;

//123
