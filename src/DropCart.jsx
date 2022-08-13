import React from "react";
import CartItems from "./CartItems";
import { Link } from "react-router-dom";
import getTotalPurchasesAmount from "./utils/getTotalPurchasesAmount";
import { ReactComponent as CartIcon } from "./cartIcon.svg";

class DropCart extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    document.addEventListener("click", this.props.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.props.handleClickOutside);
  }

  render() {
    return (
      <>
        <div
          className="cartShortCut"
          ref={this.props.cartShortCutWrapperRef}
          onClick={this.props.isCartOpenHandler}
        >
          <CartIcon width="20" heigth="20" fill="#000" />
          {this.props.purchases.length > 0 && (
            <div className="countCircle">
              {getTotalPurchasesAmount(this.props.purchases)}
            </div>
          )}
        </div>
        {this.props.isCartOpen && (
          <>
            <div
              className="cartShortCutList"
              ref={this.props.cartShortCutListWrapperRef}
            >
              <span>
                My bag.{" "}
                <span>
                  {getTotalPurchasesAmount(this.props.purchases)} items
                </span>{" "}
              </span>
              <CartItems
                getPrice={this.props.getPrice}
                purchases={this.props.purchases}
                currency={this.props.currency}
                changeAmount={this.props.changeAmount}
              />
              <div className="cartBtns">
                <Link to="/cart">
                  <button
                    className="viewBagBtn"
                    data-id="viewBagBtn"
                    onClick={this.props.handleViewBagBtn}
                  >
                    view bag
                  </button>
                </Link>
                <button className="checkOutBtn" data-id="checkOut">
                  check out
                </button>
              </div>
            </div>
          </>
        )}
      </>
    );
  }
}

export default DropCart;
