import React from "react";
import CartItems from "../components/cartItems/CartItems";
import getTotalPurchasesAmount from "../utils/getTotalPurchasesAmount";

class CartPage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="cartPageContent">
        <h3>CART</h3>
        {this.props.purchases.length > 0 ? (
          <CartItems
            page={"cartPage"}
            purchases={this.props.purchases}
            currency={this.props.currency}
            changeAmount={this.props.changeAmount}
            totalAmount={getTotalPurchasesAmount(this.props.purchases)}
          />
        ) : (
          <p>Oops... Your cart is empty</p>
        )}
      </div>
    );
  }
}

export default CartPage;
