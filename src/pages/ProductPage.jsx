import React from "react";
import client from "../apolloClient";
import { gql } from "@apollo/client";
import { withRouter } from "react-router-dom";
import setDefaultProductParams from "../utils/setDefaultProductParams";
import ProductParams from "../components/productParams/ProductParams";

class PDP extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activePhotoIndex: 0,
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
          activeProductParams: {},
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
      activePhotoIndex:
        e.target.dataset.index !== undefined
          ? e.target.dataset.index
          : this.state.activePhotoIndex,
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
      activeProductParams: setDefaultProductParams(
        this.state.activeProduct.attributes,
        this.state.activeProductParams
      ),
      activeProductPrice: this.state.activeProductPrice,
    });
  }

  galleryItems = () => {
    return this.state.activeProduct.gallery.map((item, index) => (
      <img
        className="galleryThumbnail"
        key={index}
        src={item}
        alt={this.state.activeProduct.name}
        data-index={index}
      ></img>
    ));
  };

  render() {
    const purchase = {
      product: this.state.activeProduct,
      params: this.state.activeProductParams,
    };
    return (
      this.state.activeProduct.id && (
        <div className="productPage">
          <div className="gallery">
            <div className="galleryItems" onClick={this.handleGalleryClick}>
              {this.galleryItems()}
            </div>
            <div className="activeFotoContainer">
              {!this.state.activeProduct.inStock && (
                <div className="galleryOutOfStockLayer">out of stock</div>
              )}
              {
                <img
                  className="activePhoto"
                  src={
                    this.state.activeProduct.gallery[
                      this.state.activePhotoIndex
                    ]
                  }
                  alt={this.state.activeProduct.name}
                ></img>
              }
            </div>
          </div>
          <ProductParams
            page="productPage"
            disabled={this.state.activeProduct.inStock}
            purchase={purchase}
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
