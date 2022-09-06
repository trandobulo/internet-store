import React from "react";
import Attributes from "../Attributes/Attributes";
import getPrice from "../../utils/getPrice";
import parse from "html-react-parser";
import "./ProductParams.css";

class ProductParams extends React.Component {
  constructor(props) {
    super(props);
  }

  getStyles(page) {
    switch (page) {
      case "productPage":
        return {
          params: "productParams",
          productBrand: "brand",
          productName: "name",
          productPrice: "priceParam",
          attributeName: "attributeName",
          attributeItem: "attributeItem",
          activeParam: "param activeParam",
          notActiveParam: "param",
          paramSwatchItem: "paramSwatchItem",
          activeParamSwatch: "paramSwatch activeParamSwatch",
          notActiveParamSwatch: "paramSwatch",
        };

      case "dropCart":
        return {
          params: "cartItemParams",
          productBrand: "cartItemName",
          productName: "cartItemName",
          productPrice: "cartPriceParam",
          attributeName: "cartAttributeName",
          attributeItem: "cartAttributeItem",
          activeParam: "cartParam cartActiveParam",
          notActiveParam: "cartParam",
          paramSwatchItem: "cartParamSwatchItem",
          activeParamSwatch: "cartParamSwatch cartActiveParamSwatch",
          notActiveParamSwatch: "cartParamSwatch",
        };

      case "cartPage":
        return {
          params: "productParams",
          productBrand: "brand",
          productName: "name",
          productPrice: "priceParam",
          attributeName: "attributeName",
          attributeItem: "attributeItem",
          activeParam: "paramPage activeParam",
          notActiveParam: "paramPage",
          paramSwatchItem: "paramSwatchItem",
          activeParamSwatch: "paramSwatch activeParamSwatch",
          notActiveParamSwatch: "paramSwatch",
        };

      default:
        return {};
    }
  }

  renderTitle = (styles) => {
    return (
      <>
        <span className={styles.productBrand}>
          {this.props.purchase.product.brand}
        </span>
        <span className={styles.productName}>
          {this.props.purchase.product.name}
        </span>
      </>
    );
  };

  renderPrice = (page, styles) => {
    const price = getPrice(this.props.purchase.product, this.props.currency);
    const currency = this.props.currency;

    if (page === "productPage") {
      return (
        <label className="attributeNamePrice">
          price:
          <div className="priceParam">
            {currency}
            {price}
          </div>
        </label>
      );
    }
    return (
      <div className={styles.productPrice}>
        {currency}
        {price}
      </div>
    );
  };

  renderAddToCartButton = () => {
    return (
      <button
        disabled={this.props.disabled}
        className="addToCartBtn"
        type="submit"
        onClick={this.props.addToCart}
      >
        add to cart
      </button>
    );
  };

  renderDescription = () => {
    return (
      <div className="description">
        {parse(this.props.purchase.product.description)}
      </div>
    );
  };

  render() {
    const styles = this.getStyles(this.props.page);

    return (
      <div className={styles.params}>
        {this.renderTitle(styles)}
        {this.props.page !== "productPage" &&
          this.renderPrice(this.props.page, styles)}
        {this.props.purchase.product.attributes && (
          <Attributes
            styles={styles}
            page={this.props.page}
            attributes={this.props.purchase.product.attributes}
            params={this.props.purchase.params}
            chooseParam={this.props.chooseParam}
          />
        )}
        {this.props.page === "productPage" && (
          <>
            {this.renderPrice(this.props.page, styles)}
            {this.renderAddToCartButton()}
            {this.renderDescription()}
          </>
        )}
      </div>
    );
  }
}

export default ProductParams;
