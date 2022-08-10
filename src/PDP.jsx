import React from "react";
import ProductParams from "./ProductParams";
import client from "./apolloClient";
import { gql } from "@apollo/client";
import { withRouter } from "react-router-dom";
import setDefaultProductParams from "./utils/setDefaultProductParams";

class PDP extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeFotoIndex: 0,
      activeProduct: {},
      activeProductParams: {},
      activeProductPrice: "",
    };

    this.handleGalleryClick = this.handleGalleryClick.bind(this);
    this.handleChooseParam = this.handleChooseParam.bind(this);
    this.addToCart = this.addToCart.bind(this);
  }

  getProductInfo = (productId) => {
    client
      .query({
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
        variables: { id: productId },
      })

      .then((result) => {
        this.setState({
          activeProduct: result.data.product,
          activeProductParams: setDefaultProductParams(
            result.data.product.attributes
          ),
        });
      });
  };

  handleChooseParam(e) {
    let paramName = e.currentTarget.dataset.name;
    let paramValue = e.currentTarget.dataset.value;

    let obj = this.state.activeProductParams;
    obj[paramName] = paramValue;

    this.setState({ activeProductParams: obj });
  }

  handleGalleryClick(e) {
    this.setState({
      activeFotoIndex:
        e.target.dataset.index !== undefined
          ? e.target.dataset.index
          : this.state.activeFotoIndex,
    });
  }

  componentDidMount() {
    this.getProductInfo(this.props.match.params.productId);
  }

  componentDidUpdate(prevProps) {
    this.props.match.params.productId !== prevProps.match.params.productId &&
      this.getProductInfo(this.props.match.params.productId);
  }

  addToCart() {
    this.props.addToCart({
      activeProductId: this.props.match.params.productId,
      activeProductParams: this.state.activeProductParams,
      activeProductPrice: this.state.activeProductPrice,
    });
  }

  render() {
    return (
      this.state.activeProduct.id && (
        <div className="productPage">
          <div className="gallery">
            <div className="galleryItems" onClick={this.handleGalleryClick}>
              {this.state.activeProduct.gallery.map((item, index) => (
                <div className="gallerythumbnail" key={index}>
                  <img
                    src={item}
                    alt={this.state.activeProduct.name}
                    data-index={index}
                  ></img>
                </div>
              ))}
            </div>
            <div className="activeFoto">
              {!this.state.activeProduct.inStock && (
                <div className="galleryOutOfStockLayer">OUT OF STOCK</div>
              )}
              {
                <img
                  src={
                    this.state.activeProduct.gallery[this.state.activeFotoIndex]
                  }
                  alt={this.state.activeProduct.name}
                ></img>
              }
            </div>
          </div>
          <ProductParams
            disabled={this.state.activeProduct.inStock}
            product={this.state.activeProduct}
            getPrice={this.props.getPrice}
            activeProductParams={this.state.activeProductParams}
            currency={this.props.currentCurrency}
            addToCart={this.addToCart}
            chooseParam={this.handleChooseParam}
          />
        </div>
      )
    );
  }
}

export default withRouter(PDP);
