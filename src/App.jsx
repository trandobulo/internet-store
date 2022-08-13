import React from "react";
import PLP from "./PLP";
import Navigations from "./Navigations";
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
      isCartOpen: false,
    };

    this.cartShortCutWrapperRef = React.createRef();
    this.cartShortCutListWrapperRef = React.createRef();

    this.switchCurrency = this.switchCurrency.bind(this);
    this.handleAddToCart = this.handleAddToCart.bind(this);
    this.handleChangeAmount = this.handleChangeAmount.bind(this);
    this.handleChangeAmount = this.handleChangeAmount.bind(this);

    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.isCartOpenHandler = this.isCartOpenHandler.bind(this);
    this.handleViewBagBtn = this.handleViewBagBtn.bind(this);
  }

  switchCurrency(e) {
    this.setState({
      activeCurrency: e.currentTarget.dataset.symbol,
    });
  }

  getPrice(product, currency) {
    const currencyFilter = (item) => currency === item.currency.symbol;

    return product.prices &&
      currency &&
      product.prices.findIndex(currencyFilter) >= 0
      ? product.prices[product.prices.findIndex(currencyFilter)].amount
      : "N/A";
  }

  handleAddToCart(productInfo) {
    const arr = [...this.state.cart];

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

  handleClickOutside(event) {
    if (
      this.state.isCartOpen &&
      this.cartShortCutWrapperRef &&
      !this.cartShortCutWrapperRef.current.contains(event.target) &&
      this.cartShortCutListWrapperRef &&
      !this.cartShortCutListWrapperRef.current.contains(event.target)
    ) {
      this.setState({ isCartOpen: false });
    }
  }

  handleViewBagBtn() {
    this.setState({ isCartOpen: false });
  }

  isCartOpenHandler() {
    this.state.cart.length > 0 &&
      this.setState({ isCartOpen: !this.state.isCartOpen });
  }

  componentDidMount() {
    const storage = JSON.parse(window.localStorage.getItem("cart"));
    const currency = JSON.parse(window.localStorage.getItem("currency"));

    this.setState({
      cart: storage === null ? [] : storage,
      activeCurrency: currency === null ? "$" : currency,
    });
  }

  componentDidUpdate() {
    window.localStorage.setItem("cart", JSON.stringify(this.state.cart));
    window.localStorage.setItem(
      "currency",
      JSON.stringify(this.state.activeCurrency)
    );
  }

  render() {
    return (
      <>
        <div className="header">
          <Navigations onclick={this.handleNavClick} />
          <img
            className="navLogo"
            src={`${process.env.PUBLIC_URL}/brand-icon.png`}
            alt="brand logo"
          />
          <div className="actions">
            <Currencies
              onclick={this.switchCurrency}
              activeCurrency={this.state.activeCurrency}
            />
            <DropCart
              purchases={this.state.cart}
              currency={this.state.activeCurrency}
              changeAmount={this.handleChangeAmount}
              getPrice={this.getPrice}
              isCartOpen={this.state.isCartOpen}
              isCartOpenHandler={this.isCartOpenHandler}
              cartShortCutWrapperRef={this.cartShortCutWrapperRef}
              cartShortCutListWrapperRef={this.cartShortCutListWrapperRef}
              handleClickOutside={this.handleClickOutside}
              handleViewBagBtn={this.handleViewBagBtn}
            />
          </div>
        </div>
        <main>
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
          {this.state.isCartOpen && <div className="cartOverlay"></div>}
        </main>
      </>
    );
  }
}

export default App;
