const getTotalPurchasesAmount = (arr) => {
  return arr.reduce((sum, cur) => sum + cur.amount, 0);
};

export default getTotalPurchasesAmount;
