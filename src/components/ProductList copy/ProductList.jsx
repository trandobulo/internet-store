import React from "react";
import client from "../../apolloClient";
import { loader } from "graphql.macro";
import ProductCard from "../ProductCard/ProductCard";
import "./ProductList.css";

class ProductList extends React.Component {
  constructor(props) {
    super(props);

    this.state = { products: [], isLoading: false };
  }

  getProducts = (activeCategory) => {
    this.setState({ isLoading: true });

    client
      .query({
        query: loader("../../graphql/getProductList.graphql"),
        variables: { category: activeCategory },
      })

      .then((result) => {
        this.setState({
          products: result.data.category.products,
          isLoading: false,
        });
      });
  };

  componentDidMount() {
    this.getProducts(this.props.activeCategory);
  }

  componentDidUpdate(prevProps) {
    if (this.props.activeCategory !== prevProps.activeCategory) {
      this.getProducts(this.props.activeCategory);
    }
  }

  renderProductCards = () => {
    return this.state.products.map((product, index) => {
      return (
        <ProductCard
          key={index}
          product={product}
          currentCurrency={this.props.currentCurrency}
          addToCart={this.props.addToCart}
        />
      );
    });
  };

  render() {
    const loader = (
      <div className="loaderContainer">
        <div className="loader"></div>
      </div>
    );

    return this.state.isLoading ? (
      loader
    ) : (
      <div className="productList">{this.renderProductCards()}</div>
    );
  }
}

export default ProductList;
