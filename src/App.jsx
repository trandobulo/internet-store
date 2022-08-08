import React from "react";
import PLP from "./PLP";
import Navigations from "./Navigations";
import logo from "./content/brand-icon.png";
import Currencies from "./Currencies";
import PDP from "./PDP";
import DropCart from "./DropCart";
import CartPage from "./CartPage";
import { Switch, Route, Redirect } from "react-router-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeCurrency: "$",
      cart: [],
    };

    this.switchCurrency = this.switchCurrency.bind(this);
    this.handleAddToCart = this.handleAddToCart.bind(this);
    this.handleChangeAmount = this.handleChangeAmount.bind(this);
    this.handleChangeAmount = this.handleChangeAmount.bind(this);
  }

  switchCurrency(e) {
    this.setState({
      activeCurrency: e.currentTarget.dataset.symbol,
    });
  }

  getPrice(product, currency) {
    const currencyFilter = (item) => currency === item.currency.symbol;

    return (
      product.prices &&
      currency &&
      product.prices[product.prices.findIndex(currencyFilter)].amount
    );
  }

  handleAddToCart(productInfo) {
    const arr = this.state.cart.slice();

    const params = {};

    let isExist = arr.findIndex(
      (item) =>
        JSON.stringify(item.product) ===
          JSON.stringify(productInfo.activeProduct) &&
        JSON.stringify(item.params) ===
          JSON.stringify(productInfo.activeProductParams)
    );

    if (isExist >= 0) {
      arr[isExist].amount++;
    } else {
      arr.push({
        productId: productInfo.activeProductId,
        params: Object.assign(params, productInfo.activeProductParams),
        amount: 1,
      });
    }
    this.setState({ cart: arr });
  }

  handleChangeAmount(e) {
    let arr = this.state.cart.slice();

    if (e.target.dataset.id === "increase") {
      arr[e.currentTarget.dataset.key].amount++;
      this.setState({ cart: arr });
    } else if (e.target.dataset.id === "decrease") {
      if (arr[e.currentTarget.dataset.key].amount > 0) {
        arr[e.currentTarget.dataset.key].amount--;
      }

      if (arr[e.currentTarget.dataset.key].amount === 0) {
        arr.splice(e.currentTarget.dataset.key, 1);
      }
      this.setState({ cart: arr });
    }
  }

  componentDidMount() {
    const storage = JSON.parse(window.localStorage.getItem("cart"));

    this.setState({ cart: storage === null ? [] : storage });
  }

  componentDidUpdate() {
    window.localStorage.setItem("cart", JSON.stringify(this.state.cart));
  }

  render() {
    return (
      <>
        <div className="header">
          <Navigations onclick={this.handleNavClick} />
          <img className="navLogo" src={logo} alt="brand logo" />
          <div className="actions">
            <Currencies
              onclick={this.switchCurrency}
              activeCurrency={this.state.activeCurrency}
            />
            {this.state.isCartOpen && <div className="cartOverlay"></div>}
            <DropCart
              purchases={this.state.cart}
              currency={this.state.activeCurrency}
              changeAmount={this.handleChangeAmount}
              getPrice={this.getPrice}
            />
          </div>
        </div>
        <Switch>
          <Route exact path="/">
            <Redirect to="/categories/all" />
          </Route>
          <Route exact path="/categories">
            <Redirect to="/categories/all" />
          </Route>
          <Route exact path="/categories/:categoryId/products">
            <Redirect to="/categories/all" />
          </Route>
          <Route exact path="/categories/:categoryId">
            <PLP
              currentCurrency={this.state.activeCurrency}
              productCardOnClick={this.handleProductClick}
              addToCart={this.handleAddToCart}
            />
          </Route>
          <Route path="/categories/:categoryId/products/:productId">
            <PDP
              currentCurrency={this.state.activeCurrency}
              getPrice={this.getPrice}
              addToCart={this.handleAddToCart}
            />
          </Route>
          <Route path="/cart">
            <CartPage
              purchases={this.state.cart}
              currency={this.state.activeCurrency}
              changeAmount={this.handleChangeAmount}
              getPrice={this.getPrice}
            />
          </Route>
        </Switch>
      </>
    );
  }
}

export default App;
