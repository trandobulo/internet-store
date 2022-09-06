import React from "react";
import ProductList from "../../components/ProductList/ProductList";
import { withRouter } from "react-router-dom";
import "./ProductListPage.css";

class PLP extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <>
        <h2 className="categotyTitle">{this.props.match.params.categoryId}</h2>

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
