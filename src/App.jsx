import React from "react";
import ProductListPage from "./pages/ProductListPage/ProductListPage";
import Navigations from "./components/Navigations/Navigations";
import Currencies from "./components/Currencies/Currencies";
import ProductPage from "./pages/ProductPage/ProductPage";
import DropCart from "./components/DropCart/DropCart";
import CartPage from "./pages/CartPage/CartPage";
import { Switch, Route, Redirect } from "react-router-dom";
import "./App.css";

import client from "./apolloClient";
import { loader } from "graphql.macro";

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

  getProductInfo = (productId) => {
    const query = loader("./graphql/getProductInfo.graphql");

    return client.query({
      query: query,
      variables: { id: productId },
    });
  };

  switchCurrency(e) {
    this.setState({
      activeCurrency: e.currentTarget.dataset.symbol,
    });
  }

  handleAddToCart(productInfo) {
    const arr = [...this.state.cart];

    const params = {};

    const compareProductParams = (inCart, addToCart) => {
      for (let key in addToCart) {
        if (!inCart.hasOwnProperty(key)) {
          return false;
        }
        if (inCart[key] !== addToCart[key]) {
          return false;
        }
      }

      return true;
    };

    let isExist = arr.findIndex(
      (item) =>
        item.productId === productInfo.activeProductId &&
        compareProductParams(item.params, productInfo.activeProductParams)
    );

    if (isExist >= 0) {
      arr[isExist].amount++;
      this.setState({ cart: arr });
    } else {
      this.getProductInfo(productInfo.activeProductId).then((result) => {
        arr.push({
          productId: productInfo.activeProductId,
          product: result.data.product,
          params: Object.assign(params, productInfo.activeProductParams),
          amount: 1,
        });
        this.setState({ cart: arr });
      });
    }
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
    this.setState({ isCartOpen: !this.state.isCartOpen });
  }

  readMemory() {
    const storage = JSON.parse(window.localStorage.getItem("dataStorage"));

    this.setState({
      cart:
        storage === null || storage.purchases === undefined
          ? []
          : storage.purchases,
      activeCurrency:
        storage === null || storage.currency === undefined
          ? "$"
          : storage.currency,
    });
  }

  writeMemory() {
    const dataStorage = {
      purchases: this.state.cart,
      currency: this.state.activeCurrency,
    };
    window.localStorage.setItem("dataStorage", JSON.stringify(dataStorage));
  }

  componentDidMount() {
    this.readMemory();
  }

  componentDidUpdate() {
    this.writeMemory();
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
              <ProductListPage
                currentCurrency={this.state.activeCurrency}
                productCardOnClick={this.handleProductClick}
                addToCart={this.handleAddToCart}
              />
            </Route>
            <Route path="/categories/:categoryId/products/:productId">
              <ProductPage
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
