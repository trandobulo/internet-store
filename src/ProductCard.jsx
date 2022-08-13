import React from "react";
import { Link, withRouter } from "react-router-dom";
import setDefaultProductParams from "./utils/setDefaultProductParams";
import { ReactComponent as CartIcon } from "./cartIcon.svg";

class productCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = { activeListCartBtn: false, productInfo: {} };
    this.addToCart = this.addToCart.bind(this);
  }

  addToCart() {
    this.props.addToCart(this.state.productInfo);
  }

  componentDidMount() {
    this.setState({
      productInfo: {
        activeProductId: this.props.product.id,
        activeProductParams: setDefaultProductParams(
          this.props.product.attributes
        ),
      },
    });
  }

  render() {
    const onMouseEnter = () => {
      this.setState({ activeListCartBtn: true });
    };

    const onMouseLeave = () => {
      this.setState({ activeListCartBtn: false });
    };

    return (
      <div
        className="productCard"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <Link
          to={`${this.props.match.url}/products/${this.props.product.id}`}
          key={this.props.product.id}
        >
          <div className="productCardImg">
            {!this.props.product.inStock && (
              <div className="outOfStockLayer">OUT OF STOCK</div>
            )}
            <img
              src={this.props.product.gallery[0]}
              alt={`${this.props.product.brand} ${this.props.product.name}`}
            ></img>
          </div>
          <div className="productName">
            {`${this.props.product.brand} ${this.props.product.name}`}
          </div>
          <div className="productPrice">
            {this.props.currentCurrency}
            {this.props.product.prices.findIndex(this.props.currencyFilter) >= 0
              ? this.props.product.prices[
                  this.props.product.prices.findIndex(this.props.currencyFilter)
                ].amount
              : "N/A"}
          </div>
        </Link>
        {this.state.activeListCartBtn && this.props.product.inStock && (
          <button className="listAddToCartBtn" onClick={this.addToCart}>
            <CartIcon width={"24"} height={"24"} fill={"#fff"} />
          </button>
        )}
      </div>
    );
  }
}

export default withRouter(productCard);
