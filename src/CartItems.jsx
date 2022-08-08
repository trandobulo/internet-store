import React from "react";
import client from "./ApolloClient";
import { gql } from "@apollo/client";
import CartItemParams from "./CartItemParams";
import CartItemGallery from "./CartItemGallery";
import { Link, withRouter } from "react-router-dom";

class CartItems extends React.Component {
  constructor(props) {
    super(props);

    this.state = { purchases: [] };
    this.getProductsInfo = this.getProductsInfo.bind(this);
  }

  getProductsInfo = (purchases) => {
    const productsPromises = [];

    for (let purchase of purchases) {
      productsPromises.push(
        client.query({
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
          variables: { id: purchase.productId },
        })
      );
    }

    Promise.all(productsPromises).then((results) => {
      const arr = results.map((result, index) => ({
        ...this.props.purchases[index],
        product: result.data.product,
      }));

      this.setState({ purchases: arr, totalPrice: this.totalPrice(arr) });
    });
  };

  totalPrice(purchases) {
    return (
      Math.round(
        100 *
          purchases.reduce(
            (sum, item) =>
              sum +
              this.props.getPrice(item.product, this.props.currency) *
                item.amount,
            0
          ),
        2
      ) / 100
    );
  }

  componentDidMount() {
    this.getProductsInfo(this.props.purchases);
  }

  componentDidUpdate(prevProps) {
    prevProps !== this.props && this.getProductsInfo(this.props.purchases); // do fetching everytime when change amount of purchase. Is it norm ?
  }

  render() {
    return (
      this.state.purchases &&
      this.state.purchases.map((purchase, index) => {
        return (
          purchase.amount > 0 && (
            <React.Fragment key={purchase.id}>
              <div
                className={
                  this.props.cartPage
                    ? index === this.state.purchases.length - 1
                      ? "cartItem overlined underlined"
                      : "cartItem overlined"
                    : "cartItem"
                }
              >
                <CartItemParams
                  cartPage={this.props.cartPage}
                  location={this.props.location}
                  purchase={purchase}
                  currency={this.props.currency}
                  price={this.props.getPrice(
                    purchase.product,
                    this.props.currency
                  )}
                />
                <div className="cartItemBlock">
                  <div
                    className="cartItemCount"
                    data-key={index}
                    onClick={this.props.changeAmount}
                  >
                    <div className="changeAmount" data-id="increase">
                      +
                    </div>
                    {purchase.amount}
                    <div className="changeAmount" data-id="decrease">
                      -
                    </div>
                  </div>
                  <Link to={`/categories/all/products/${purchase.product.id}`}>
                    <div
                      className={
                        this.props.cartPage
                          ? "cartItemGalleryImg"
                          : "cartItemImg"
                      }
                    >
                      {this.props.cartPage ? (
                        <CartItemGallery images={purchase.product.gallery} />
                      ) : (
                        <img
                          src={purchase.product.gallery[0]}
                          alt={
                            purchase.product.brand + " " + purchase.product.name
                          }
                        ></img>
                      )}
                    </div>
                  </Link>
                </div>
              </div>

              {index === this.state.purchases.length - 1 &&
                (this.props.cartPage ? (
                  <div className="cartSummary">
                    <div className="cartSummaryInfo">
                      <div>
                        <p>Tax 21%:</p>
                        <p>Quantity:</p>
                        <p>Total:</p>
                      </div>
                      <div className="cartSummaryNumbers">
                        <p>
                          {this.props.currency}
                          {Math.round(this.state.totalPrice * 21, 2) / 100}
                        </p>
                        <p>{this.props.totalAmount}</p>
                        <p>
                          {this.props.currency}
                          {this.state.totalPrice}
                        </p>
                      </div>
                      <button className="cartSummaryButton">ORDER</button>
                    </div>
                  </div>
                ) : (
                  <div className="totalPrice">
                    <span>Total:</span>
                    <span className="totalPriceSum">
                      {this.props.currency}
                      {this.state.totalPrice}
                    </span>
                  </div>
                ))}
            </React.Fragment>
          )
        );
      })
    );
  }
}

export default withRouter(CartItems);
