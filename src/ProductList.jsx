import React from "react";
import client from "./ApolloClient";
import gql from "graphql-tag";
import ProductCard from "./ProductCard";

class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { products: [] };
    this.currencyFilter = this.currencyFilter.bind(this);
  }

  getProducts = (activeCategory) => {
    client
      .query({
        query: gql`
          query ($category: String!) {
            category(input: { title: $category }) {
              products {
                id
                brand
                gallery
                name
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
          }
        `,
        variables: { category: activeCategory },
      })

      .then((result) => {
        this.setState({ products: result.data.category.products });
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

  currencyFilter = (item) =>
    this.props.currentCurrency === item.currency.symbol;

  render() {
    return (
      <div className="productList">
        {this.state.products.map((product, index) => {
          return (
            <ProductCard
              product={product}
              key={index}
              currentCurrency={this.props.currentCurrency}
              currencyFilter={this.currencyFilter}
              productCardOnClick={this.props.productCardOnClick}
            />
          );
        })}
      </div>
    );
  }
}

export default ProductList;
