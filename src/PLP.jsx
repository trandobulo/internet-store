import React from "react";
import ProductList from "./ProductList";
import { withRouter } from "react-router-dom";

class PLP extends React.Component {
  render() {
    return (
      <>
        <h2 className="categotyTitle">
          {this.props.match.params.categoryId.toUpperCase()}
        </h2>

        <ProductList
          activeCategory={this.props.match.params.categoryId}
          currentCurrency={this.props.currentCurrency}
          addToCart={this.props.addToCart}
        />
      </>
    );
  }
}

export default withRouter(PLP);
