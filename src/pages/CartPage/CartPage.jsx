import React from "react";
import CartItems from "../../components/CartItems/CartItems";
import getTotalPurchasesAmount from "../../utils/getTotalPurchasesAmount";
import "./CartPage.css";

class CartPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="cartPageContent">
        <h3 className="cartPageTitle">cart</h3>
        <CartItems
          page={"cartPage"}
          purchases={this.props.purchases}
          currency={this.props.currency}
          changeAmount={this.props.changeAmount}
          totalAmount={getTotalPurchasesAmount(this.props.purchases)}
        />
      </div>
    );
  }
}

export default CartPage;
