import React from "react";
import PLP from "./pages/ProductListPage";
import Navigations from "./components/navigations/Navigations";
import Currencies from "./components/currencies/Currencies";
import PDP from "./pages/ProductPage";
import DropCart from "./components/dropCart/DropCart";
import CartPage from "./pages/CartPage";
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
    let arr = [...this.state.cart];

    if (e.currentTarget.dataset.id === "increase") {
      arr[e.currentTarget.dataset.key].amount++;
      this.setState({ cart: arr });
    } else if (e.currentTarget.dataset.id === "decrease") {
      if (arr[e.currentTarget.dataset.key].amount >= 1) {
        arr[e.currentTarget.dataset.key].amount--;
      }

      if (arr[e.currentTarget.dataset.key].amount < 1) {
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
        <header className="header">
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
              isCartOpen={this.state.isCartOpen}
              isCartOpenHandler={this.isCartOpenHandler}
              cartShortCutWrapperRef={this.cartShortCutWrapperRef}
              cartShortCutListWrapperRef={this.cartShortCutListWrapperRef}
              handleClickOutside={this.handleClickOutside}
              handleViewBagBtn={this.handleViewBagBtn}
            />
          </div>
        </header>
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
                addToCart={this.handleAddToCart}
              />
            </Route>
            <Route path="/cart">
              <CartPage
                purchases={this.state.cart}
                currency={this.state.activeCurrency}
                changeAmount={this.handleChangeAmount}
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
