import React from "react";
import CartItems from "./CartItems";
import { Link } from "react-router-dom";
import getTotalPurchasesAmount from "./utils/getTotalPurchasesAmount";
import cartIcon from "./cartIcon";

class DropCart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isCartOpen: false,
    };

    this.price = 0;

    this.wrapperRef = React.createRef();
    this.wrapperRef1 = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.isCartOpen = this.isCartOpen.bind(this);
  }

  handleClickOutside(event) {
    if (
      event.target.dataset.id === "viewBagBtn" ||
      event.target.dataset.id === "checkOut"
    ) {
      this.setState({ isCartOpen: false });
    }

    if (
      this.state.isCartOpen &&
      this.wrapperRef &&
      !this.wrapperRef.current.contains(event.target) &&
      this.wrapperRef1 &&
      !this.wrapperRef1.current.contains(event.target)
    ) {
      this.setState({ isCartOpen: false });
    }
  }

  isCartOpen() {
    this.props.purchases.length > 0 &&
      this.setState({ isCartOpen: !this.state.isCartOpen });
  }

  componentDidMount() {
    document.addEventListener("click", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  }

  render() {
    return (
      <>
        <div
          className="cartShortCut"
          ref={this.wrapperRef}
          onClick={this.isCartOpen}
        >
          {cartIcon("20", "20", "#000")}
          {this.props.purchases.length > 0 && (
            <div className="countCircle">
              {getTotalPurchasesAmount(this.props.purchases)}
            </div>
          )}
        </div>
        {this.state.isCartOpen && (
          <>
            <div className="cartShortCutList" ref={this.wrapperRef1}>
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
                  <button className="viewBagBtn" data-id="viewBagBtn">
                    VIEW BAG
                  </button>
                </Link>
                <button className="checkOutBtn" data-id="checkOut">
                  CHECK OUT
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
