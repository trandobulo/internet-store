import React from "react";
import CartItems from "./CartItems";

class CartPage extends React.Component {
  render() {
    const totalAmount = this.props.purchases.reduce(
      (sum, cur) => sum + cur.amount,
      0
    );

    return (
      <div className="cartPageContent">
        <h3>CART</h3>
        {this.props.purchases.length > 0 ? (
          <CartItems
            cartPage={true}
            purchases={this.props.purchases}
            currency={this.props.currency}
            changeAmount={this.props.changeAmount}
            getPrice={this.props.getPrice}
            totalAmount={totalAmount}
          />
        ) : (
          <p>Oops... Your cart is empty</p>
        )}
      </div>
    );
  }
}

export default CartPage;
