import React from "react";
import client from "./ApolloClient";
import { gql } from "@apollo/client";
import ProductList from "./ProductList";
import Navigations from "./Navigations";
import logo from "./content/brand-icon.png";
import Currencies from "./Currencies";
import ProductPage from "./ProductPage";
import Cart from "./Cart";

class Category extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeCategory: "all",
      activeCurrency: "$",
      activeProductId: "",
      activeProductInfo: {},
      activeProductParams: {},
      cart: [],
    };
    this.handleNavClick = this.handleNavClick.bind(this);
    this.switchCurrency = this.switchCurrency.bind(this);
    this.handleProductClick = this.handleProductClick.bind(this);
    this.handleAddToCart = this.handleAddToCart.bind(this);
    this.handleChooseParam = this.handleChooseParam.bind(this);
    this.handleChangeAmount = this.handleChangeAmount.bind(this);
  }

  getProductInfo = async (productId) => {
    await client
      .query({
        query: gql`
          query ($id: String!) {
            product(id: $id) {
              brand
              id
              gallery
              name
              description
              attributes {
                id
                name
                type
                items {
                  displayValue
                  value
                  id
                }
              }
              prices {
                currency {
                  symbol
                  label
                }
                amount
              }
              inStock
            }
          }
        `,
        variables: { id: productId },
      })

      .then((result) => {
        this.setState({ activeProductInfo: result.data.product });
        this.firstState(result.data.product.attributes);
      });
  };

  firstState = (attributes) => {
    let obj = {};
    for (let attribute of attributes) {
      obj[attribute.name] = attribute.items[0].value;
    }
    this.setState({ activeProductParams: obj });
  };

  handleNavClick(e) {
    this.setState({
      activeCategory: e.currentTarget.dataset.category,
      activeProductId: "",
      activeProductInfo: {},
      activeProductParams: {}, //  bug of changing sizes
    });
  }

  switchCurrency(e) {
    this.setState({
      activeCurrency: e.currentTarget.dataset.symbol,
    });
  }

  handleProductClick(e) {
    this.setState({ activeProductId: e.currentTarget.dataset.id });
  }

  handleAddToCart() {
    let arr = this.state.cart.slice();
    let product = {};
    let params = {};

    let isExist = arr.findIndex(
      (item) =>
        JSON.stringify(item.product) ===
          JSON.stringify(this.state.activeProductInfo) &&
        JSON.stringify(item.params) ===
          JSON.stringify(this.state.activeProductParams)
    );

    if (isExist >= 0) {
      arr[isExist].amount++;
    } else {
      arr.push({
        product: Object.assign(product, this.state.activeProductInfo),
        params: Object.assign(params, this.state.activeProductParams),
        amount: 1,
      });
    }
    this.setState({ cart: arr });
  }

  handleChangeAmount(e) {
    let arr = this.state.cart.slice(); // even if I not use SetState , state.amount is changing , why?

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

  handleChooseParam(e) {
    let paramName = e.currentTarget.dataset.name;
    let paramValue = e.currentTarget.dataset.value;

    let obj = this.state.activeProductParams;
    obj[paramName] = paramValue;

    this.setState({ activeProductParams: obj });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.activeProductId &&
      prevState.activeProductId !== this.state.activeProductId
    ) {
      this.getProductInfo(this.state.activeProductId);
    }
  }

  render() {
    return (
      <>
        <div className="header">
          <Navigations
            onclick={this.handleNavClick}
            activeCategory={this.state.activeCategory}
          />
          <img className="navLogo" src={logo} alt="brand logo" />
          <div className="actions">
            <Currencies
              onclick={this.switchCurrency}
              activeCurrency={this.state.activeCurrency}
            />
            {this.state.isCartOpen && <div className="cartOverlay"></div>}
            <Cart
              purchases={this.state.cart}
              currency={this.state.activeCurrency}
              changeAmount={this.handleChangeAmount}
            />
          </div>
        </div>
        {this.state.activeProductId === "" && (
          <h2 className="categotyTitle">
            {this.state.activeCategory.toUpperCase()}
          </h2>
        )}
        {this.state.activeProductId === "" && (
          <ProductList
            activeCategory={this.state.activeCategory}
            currentCurrency={this.state.activeCurrency}
            productCardOnClick={this.handleProductClick}
          />
        )}
        {this.state.activeProductId && (
          <ProductPage
            currentCurrency={this.state.activeCurrency}
            activeProduct={this.state.activeProductInfo}
            activeProductParams={this.state.activeProductParams}
            addToCart={this.handleAddToCart}
            chooseParam={this.handleChooseParam}
          />
        )}
      </>
    );
  }
}

export default Category;
