import React from "react";
import ProductParams from "../ProductParams/ProductParams";
import CartItemGallery from "../CartItemGallery/CartItemGallery";
import { NavLink, withRouter } from "react-router-dom";
import getTotalPurchasesAmount from "../../utils/getTotalPurchasesAmount";
import { ReactComponent as PlusIcon } from "../../svg/plusIcon.svg";
import { ReactComponent as MinusIcon } from "../../svg/minusIcon.svg";
import getPrice from "../../utils/getPrice";
import "./CartItems.css";

class CartItems extends React.Component {
  constructor(props) {
    super(props);
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

  items = () => {
    const cartItemClassName = (index) => {
      if (this.props.page === "cartPage") {
        return index === this.props.purchases.length - 1
          ? "cartItem overlined underlined"
          : "cartItem overlined";
      }
      return "cartItem";
    };

    const cartItemPurchaseCounter = (purchase, index) => {
      const btnClass =
        this.props.page === "cartPage" ? "cartChangeAmount" : "changeAmount";

      return (
        <div className="cartItemCount">
          <button
            data-key={index}
            onClick={this.props.changeAmount}
            className={btnClass}
            data-id="increase"
          >
            <PlusIcon />
          </button>
          {purchase.amount}
          <button
            disabled={purchase.amount < 1}
            data-key={index}
            onClick={this.props.changeAmount}
            className={btnClass}
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
        <NavLink
          className={"cartItemImgContainer"}
          to={`/categories/${purchase.product.category}/products/${purchase.product.id}`}
        >
          <img
            className="cartItemImg"
            src={purchase.product.gallery[0]}
            alt={`${purchase.product.brand} ${purchase.product.name}`}
          ></img>
        </NavLink>
      );
    };

    const imgBlockClass =
      this.props.page === "cartPage" ? "cartItemGalleryBlock" : "cartItemBlock";

    return this.props.purchases.map((purchase, index) => {
      return (
        purchase.amount > 0 && (
          <React.Fragment key={index}>
            <div className={cartItemClassName(index)}>
              <ProductParams
                page={this.props.page}
                purchase={purchase}
                currency={this.props.currency}
              />
              <div className={imgBlockClass}>
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
      Math.round(this.totalPrice(this.props.purchases) * 21, 2) / 100;
    const totalPriceNumber = this.totalPrice(this.props.purchases);

    const cartSummary = (
      <div className="cartSummary">
        <div className="cartSummaryInfo">
          <div className="cartSummaryInfoContainer">
            <p className="cartSummaryText">tax 21%:</p>
            <p className="cartSummaryText">quantity:</p>
            <p className="cartSummaryText">total:</p>
          </div>
          <div className="cartSummaryNumbers">
            <p className="cartSummaryText">
              {this.props.currency}
              {taxNumber}
            </p>
            <p className="cartSummaryText">
              {getTotalPurchasesAmount(this.props.purchases)}
            </p>
            <p className="cartSummaryText">
              {this.props.currency}
              {totalPriceNumber}
            </p>
          </div>
          <button className="cartSummaryButton">order</button>
        </div>
      </div>
    );

    const totalPrice = (
      <div className="totalPrice">
        <span>total:</span>
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
      default:
        return totalPrice;
    }
  };

  render() {
    const containerClass =
      this.props.page === "cartPage" ? "" : "cartItemsContainer";

    const items = (
      <>
        <div className={containerClass}>{this.items()}</div>
        {this.totalInfo()}
      </>
    );

    const emptyCartMsg = (
      <p className="emptyCartMsg">Oops... Your cart is empty</p>
    );

    if (this.props.purchases.length > 0) {
      return items;
    } else {
      return emptyCartMsg;
    }
  }
}

export default withRouter(CartItems);
