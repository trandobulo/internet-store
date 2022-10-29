import getPrice from "./getPrice";

const product = {
  prices: [
    { currency: { symbol: "$" }, amount: "120" },
    { currency: { symbol: "₴" }, amount: "4400" },
  ],
};

const product1 = {
  prices: [{ currency: { symbol: "₴" }, amount: "4400" }],
};

it("getting price", () => {
  expect(getPrice(undefined, undefined)).toEqual("N/A");
  expect(getPrice(product, "₴")).toEqual("4400");
  expect(getPrice(product, "$")).toEqual("120");
});

it("unexisting currency", () => {
  expect(getPrice(product, "3")).toEqual("N/A");
});

it("wrong data", () => {
  expect(getPrice(null)).toEqual("N/A");
});
