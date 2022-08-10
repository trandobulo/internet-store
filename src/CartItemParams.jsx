import React from "react";

class CartItemParams extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className={this.props.cartPage ? "productParams" : "cartItemParams"}>
        <span className={this.props.cartPage ? "brand" : ""}>
          {this.props.purchase.product.brand}
        </span>
        {!this.props.cartPage && <br></br>}
        <span className={this.props.cartPage ? "name" : ""}>
          {this.props.purchase.product.name}
        </span>
        <div className={this.props.cartPage ? "priceParam" : "cartPriceParam"}>
          {this.props.currency}
          {this.props.price}
        </div>
        {this.props.purchase.product.attributes &&
          this.props.purchase.product.attributes.map((attribute, cartIndex) => (
            <label
              className={
                this.props.cartPage ? "attributeName" : "cartAttributeName"
              }
              key={cartIndex}
            >
              {`${attribute.name} :`}
              <div>
                {attribute.items.map((item, attrIndex) =>
                  attribute.type !== "swatch" ? (
                    <div
                      className={
                        this.props.purchase.params[attribute.name] ===
                        item.value
                          ? this.props.cartPage
                            ? "paramPage activeParam"
                            : "cartParam cartActiveParam"
                          : this.props.cartPage
                          ? "paramPage"
                          : "cartParam"
                      }
                      key={attrIndex}
                      data-name={attribute.name}
                      data-id={item.id}
                      data-value={item.value}
                    >
                      {item.value}
                    </div>
                  ) : (
                    <div
                      className={
                        this.props.purchase.params[attribute.name] ===
                        item.value
                          ? this.props.cartPage
                            ? "paramSwatch activeParamSwatch"
                            : "cartParamSwatch cartActiveParamSwatch"
                          : this.props.cartPage
                          ? "paramSwatch"
                          : "cartParamSwatch"
                      }
                      key={attrIndex}
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
      </div>
    );
  }
}

export default CartItemParams;
