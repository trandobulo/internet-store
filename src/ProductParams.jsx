import React from "react";

class ProductParams extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidUpdate(prevProps, prevState) {
    prevState === this.state &&
      this.props.activeProductParams !== {} &&
      this.setState(this.props.activeProductParams);
  }

  render() {
    const currencyFilter = (item) =>
      this.props.currency === item.currency.symbol;

    return (
      <div className="productParams">
        <h3 className="brand">{this.props.product.brand}</h3>
        <h3 className="name">{this.props.product.name}</h3>
        {this.props.product.attributes &&
          this.props.product.attributes.map((attribute, index) => (
            <label className="attributeName" key={index}>
              {attribute.name + ":"}
              <div>
                {attribute.items.map((item, index) =>
                  attribute.type !== "swatch" ? (
                    <div
                      onClick={this.props.chooseParam}
                      className={
                        this.state[attribute.name] === item.value
                          ? "param activeParam"
                          : "param"
                      }
                      key={index}
                      data-name={attribute.name}
                      data-id={item.id}
                      data-value={item.value}
                    >
                      {item.displayValue}
                    </div>
                  ) : (
                    <div
                      onClick={this.props.chooseParam}
                      className={
                        this.state[attribute.name] === item.value
                          ? "paramSwatch activeParamSwatch"
                          : "paramSwatch"
                      }
                      key={index}
                      data-name={attribute.name}
                      data-id={item.id}
                      data-value={item.value}
                    >
                      <div
                        style={{
                          backgroundColor: item.value,
                        }}
                      ></div>
                    </div>
                  )
                )}
              </div>
            </label>
          ))}
        <label className="attributeName">
          PRICE:
          <div className="priceParam">
            {this.props.currency}
            {this.props.product.prices && // is that's most suitable way of checking?
              this.props.product.prices[
                this.props.product.prices.findIndex(currencyFilter)
              ].amount}
          </div>
        </label>
        <button
          disabled={!this.props.disabled}
          className="addToCartBtn"
          type="submit"
          onClick={this.props.addToCart}
        >
          ADD TO CART
        </button>
        <div
          className="description"
          dangerouslySetInnerHTML={{ __html: this.props.product.description }}
        ></div>
      </div>
    );
  }
}

export default ProductParams;
