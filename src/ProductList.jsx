import React from "react";
import client from "./index";
import gql from "graphql-tag";

class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { products: [] };
  }

  GET_PRODUCTS = (activeCategory) => {
    client
      .query({
        query: gql`
          query ($category: String!) {
            category(input: { title: $category }) {
              products {
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
    this.GET_PRODUCTS(this.props.activeCategory);
    console.log("mount");
  }

  componentDidUpdate(prevProps) {
    // Популярный пример (не забудьте сравнить пропсы):
    if (this.props.activeCategory !== prevProps.activeCategory) {
      this.GET_PRODUCTS(this.props.activeCategory);
    }
  }

  render() {
    console.log(this.props.activeCategory);
    return (
      <div className="productList">
        {this.state.products.map((product, index) => {
          return (
            <div className="productCard" key={index}>
              <div className="productCardImg">
                {product.inStock && (
                  <div className="outOfStockLayer">OUT OF STOCK</div>
                )}
                <img src={product.gallery} alt={product.name}></img>
              </div>
              <div className="productName">{product.name}</div>
              <div className="productPrice">
                {this.props.currentCurrency}
                {
                  product.prices.filter(
                    (item) =>
                      this.props.currentCurrency === item.currency.symbol
                  )[0].amount
                }
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default ProductList;
