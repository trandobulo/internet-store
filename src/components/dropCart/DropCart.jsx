import React from "react";
import CartItems from "../CartItems/CartItems.jsx";
import { Link } from "react-router-dom";
import getTotalPurchasesAmount from "../../utils/getTotalPurchasesAmount";
import { ReactComponent as CartBtnIcon } from "../../svg/cartIcon.svg";
import "./DropCart.css";

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

  dropCartOpenBtn = () => {
    return (
      <button
        className="cartShortCut"
        ref={this.props.cartShortCutWrapperRef}
        onClick={this.props.isCartOpenHandler}
      >
        <CartBtnIcon width="20" heigth="20" fill="#000" />
        {this.props.purchases.length > 0 && (
          <div className="countCircle">
            {getTotalPurchasesAmount(this.props.purchases)}
          </div>
        )}
      </button>
    );
  };

  purchasesAmount = () => {
    return (
      <span className="cartTitle">
        My bag.{" "}
        <span className="cartTitleCount">
          {getTotalPurchasesAmount(this.props.purchases)} items
        </span>{" "}
      </span>
    );
  };

  dropCartBtns = () => {
    return (
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
    );
  };

  render() {
    return (
      <>
        {this.dropCartOpenBtn()}
        {this.props.isCartOpen && (
          <div
            className="cartShortCutList"
            ref={this.props.cartShortCutListWrapperRef}
          >
            {this.purchasesAmount()}
            <CartItems
              page={"dropCart"}
              purchases={this.props.purchases}
              currency={this.props.currency}
              changeAmount={this.props.changeAmount}
            />
            {this.dropCartBtns()}
          </div>
        )}
      </>
    );
  }
}

export default DropCart;
