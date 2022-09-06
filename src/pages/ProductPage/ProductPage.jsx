import React from "react";
import { withRouter } from "react-router-dom";
import setDefaultProductParams from "../../utils/setDefaultProductParams";
import ProductParams from "../../components/ProductParams/ProductParams";
import "./ProductPage.css";

import client from "../../apolloClient";
import { loader } from "graphql.macro";

class PDP extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
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
    const query = loader("../../graphql/getProductInfo.graphql");

    client
      .query({
        query: query,
        variables: { id: productId },
      })

      .then((result) => {
        this.setState({ activeProduct: result.data.product, isLoading: false });
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

  renderGallery = () => {
    return (
      <>
        <div className="galleryItems" onClick={this.handleGalleryClick}>
          {this.galleryItems()}
        </div>
        <div className="activePhotoContainer">
          {!this.state.activeProduct.inStock && (
            <div className="galleryOutOfStockLayer">out of stock</div>
          )}
          {
            <img
              className="activePhoto"
              src={
                this.state.activeProduct.gallery[this.state.activePhotoIndex]
              }
              alt={this.state.activeProduct.name}
            ></img>
          }
        </div>
      </>
    );
  };

  render() {
    const purchase = {
      product: this.state.activeProduct,
      params: this.state.activeProductParams,
    };

    const loader = (
      <div className="loaderContainer">
        <div className="loader"></div>
      </div>
    );

    return !this.state.isLoading ? (
      <div className="productPage">
        <div className="gallery">{this.renderGallery()}</div>
        <ProductParams
          page="productPage"
          disabled={!this.state.activeProduct.inStock}
          purchase={purchase}
          currency={this.props.currentCurrency}
          addToCart={this.addToCart}
          chooseParam={this.handleChooseParam}
        />
      </div>
    ) : (
      loader
    );
  }
}

export default withRouter(PDP);
