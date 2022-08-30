import React from "react";
import client from "../../apolloClient";
import { gql } from "@apollo/client";
import ProductParams from "../productParams/ProductParams";
import CartItemGallery from "../cartItemGallery/CartItemGallery";
import { Link, withRouter } from "react-router-dom";
import getTotalPurchasesAmount from "../../utils/getTotalPurchasesAmount";
import { ReactComponent as PlusIcon } from "../../svg/plusIcon.svg";
import { ReactComponent as MinusIcon } from "../../svg/minusIcon.svg";
import getPrice from "../../utils/getPrice";

class CartItems extends React.Component {
  constructor(props) {
    super(props);

    this.state = { purchases: [] };
    this.getProductsInfo = this.getProductsInfo.bind(this);
  }

  getProductsInfo = (purchases) => {
    const productsPromises = [];

    for (let purchase of purchases) {
      productsPromises.push(
        client.query({
          query: gql`
            query ($id: String!) {
              product(id: $id) {
                category
                brand
                id
                gallery
                name
                description
                attributes {
                  id
                  name
                  type
                  items {
                    displayValue
                    value
                    id
                  }
                }
                prices {
                  currency {
                    symbol
                    label
                  }
                  amount
                }
                inStock
              }
            }
          `,
          variables: { id: purchase.productId },
        })
      );
    }

    Promise.all(productsPromises).then((results) => {
      const arr = results.map((result, index) => ({
        ...this.props.purchases[index],
        product: result.data.product,
      }));

      this.setState({ purchases: arr });
    });
  };

  changeQuantityState() {
    const arr = [];

    this.state.purchases.forEach((item) => arr.push({ ...item }));

    arr.forEach((purchase, index) => {
      if (this.props.purchases[index]) {
        purchase.amount = this.props.purchases[index].amount;
      }
    });

    this.setState({ purchases: arr });
  }

  totalPrice(purchases) {
    return (
      Math.round(
        100 *
          purchases.reduce(
            (sum, item) =>
              sum + getPrice(item.product, this.props.currency) * item.amount,
            0
          ),
        2
      ) / 100
    );
  }

  componentDidMount() {
    this.getProductsInfo(this.props.purchases);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.purchases.length !== this.props.purchases.length) {
      this.getProductsInfo(this.props.purchases);
    } else if (
      getTotalPurchasesAmount(prevProps.purchases) !==
      getTotalPurchasesAmount(this.state.purchases)
    ) {
      this.changeQuantityState();
    }
  }

  items = () => {
    const cartItemClassName = (index) => {
      if (this.props.page === "cartPage") {
        if (index === this.state.purchases.length - 1) {
          return "cartItem overlined underlined";
        }
        return "cartItem overlined";
      }
      return "cartItem";
    };

    const cartItemPurchaseCounter = (purchase, index) => {
      return (
        <div className="cartItemCount">
          <button
            data-key={index}
            onClick={this.props.changeAmount}
            className={
              this.props.page === "cartPage"
                ? "cartChangeAmount"
                : "changeAmount"
            }
            data-id="increase"
          >
            <PlusIcon />
          </button>
          {purchase.amount}
          <button
            disabled={purchase.amount < 1}
            data-key={index}
            onClick={this.props.changeAmount}
            className={
              this.props.page === "cartPage"
                ? "cartChangeAmount"
                : "changeAmount"
            }
            data-id="decrease"
          >
            <MinusIcon />
          </button>
        </div>
      );
    };

    const cartItemImg = (purchase, page) => {
      if (page === "cartPage") {
        return (
          <CartItemGallery
            images={purchase.product.gallery}
            id={purchase.product.id}
          />
        );
      }
      return (
        <Link
          to={`/categories/${purchase.product.category}/products/${purchase.product.id}`}
        >
          <img
            className="cartItemImg"
            src={purchase.product.gallery[0]}
            alt={`${purchase.product.brand} ${purchase.product.name}`}
          ></img>
        </Link>
      );
    };

    return this.state.purchases.map((purchase, index) => {
      return (
        purchase.amount > 0 && (
          <React.Fragment key={index}>
            <div className={cartItemClassName(index)}>
              <ProductParams
                page={this.props.page}
                purchase={purchase}
                currency={this.props.currency}
              />
              <div
                className={
                  this.props.page === "cartPage"
                    ? "cartItemGalleryBlock"
                    : "cartItemBlock"
                }
              >
                {cartItemPurchaseCounter(purchase, index)}
                {cartItemImg(purchase, this.props.page)}
              </div>
            </div>
          </React.Fragment>
        )
      );
    });
  };

  totalInfo = () => {
    const taxNumber =
      Math.round(this.totalPrice(this.state.purchases) * 21, 2) / 100;
    const totalPriceNumber = this.totalPrice(this.state.purchases);

    const cartSummary = (
      <div className="cartSummary">
        <div className="cartSummaryInfo">
          <div>
            <p>Tax 21%:</p>
            <p>Quantity:</p>
            <p>Total:</p>
          </div>
          <div className="cartSummaryNumbers">
            <p>
              {this.props.currency}
              {taxNumber}
            </p>
            <p>{getTotalPurchasesAmount(this.state.purchases)}</p>
            <p>
              {this.props.currency}
              {totalPriceNumber}
            </p>
          </div>
          <button className="cartSummaryButton">ORDER</button>
        </div>
      </div>
    );

    const totalPrice = (
      <div className="totalPrice">
        <span>Total:</span>
        <span className="totalPriceSum">
          {this.props.currency}
          {totalPriceNumber}
        </span>
      </div>
    );

    switch (this.props.page) {
      case "cartPage":
        return cartSummary;
      case "dropCart":
        return totalPrice;
      default:
        return totalPrice;
    }
  };

  renderPurchases = () => {
    if (this.state.purchases.length > 0) {
      return (
        <>
          <div
            className={
              this.props.page === "cartPage" ? "" : "cartItemsContainer"
            }
          >
            {this.items()}
          </div>
          {this.totalInfo()}
        </>
      );
    } else {
      return (
        <div className="loaderContainer">
          <div className="loader"></div>
        </div>
      );
    }
  };

  render() {
    return this.renderPurchases();
  }
}

export default withRouter(CartItems);
