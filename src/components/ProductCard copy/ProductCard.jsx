import React from "react";
import { Link, withRouter } from "react-router-dom";
import setDefaultProductParams from "../../utils/setDefaultProductParams";
import { ReactComponent as CartIcon } from "../../svg/cartIcon.svg";
import getPrice from "../../utils/getPrice";
import "./ProductCard.css";

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
          this.props.product.attributes,
          {}
        ),
      },
    });
  }

  onMouseEnter = () => {
    this.setState({ activeListCartBtn: true });
  };

  onMouseLeave = () => {
    this.setState({ activeListCartBtn: false });
  };

  renderProductCardImg = () => {
    return (
      <div className="productCardImgContainer">
        {!this.props.product.inStock && (
          <div className="outOfStockLayer">out of stock</div>
        )}
        <img
          className="productCardImg"
          src={this.props.product.gallery[0]}
          alt={`${this.props.product.brand} ${this.props.product.name}`}
        ></img>
      </div>
    );
  };

  render() {
    return (
      <div
        className="productCard"
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <Link
          to={`${this.props.match.url}/products/${this.props.product.id}`}
          key={this.props.product.id}
        >
          {this.renderProductCardImg()}
          <div className="productName">
            {`${this.props.product.brand} ${this.props.product.name}`}
          </div>
          <div className="productPrice">
            {this.props.currentCurrency}
            {getPrice(this.props.product, this.props.currentCurrency)}
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
