import React from "react";
import ProductParams from "./ProductParams";

class ProductPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeFotoIndex: 0,
    };

    this.handleGalleryClick = this.handleGalleryClick.bind(this);
  }

  handleGalleryClick(e) {
    this.setState({ activeFotoIndex: e.target.dataset.index });
  }

  render() {
    return (
      <div className="productPage">
        <div className="gallery">
          <div className="galleryItems" onClick={this.handleGalleryClick}>
            {this.props.activeProduct.gallery &&
              this.props.activeProduct.gallery.map((item, index) => (
                <div className="galleryThumbNail" key={index}>
                  <img
                    src={item}
                    alt={this.props.activeProduct.name}
                    data-index={index}
                  ></img>
                </div>
              ))}
          </div>
          <div className="activeFoto">
            {!this.props.activeProduct.inStock && (
              <div className="galleryOutOfStockLayer">OUT OF STOCK</div>
            )}
            {this.props.activeProduct.gallery && (
              <img
                src={
                  this.props.activeProduct.gallery[this.state.activeFotoIndex]
                }
                alt={this.props.activeProduct.name}
              ></img>
            )}
          </div>
        </div>
        <ProductParams
          disabled={this.props.activeProduct.inStock}
          product={this.props.activeProduct}
          currency={this.props.currentCurrency}
          addToCart={this.props.addToCart}
          chooseParam={this.props.chooseParam}
          activeProductParams={this.props.activeProductParams}
        />
      </div>
    );
  }
}

export default ProductPage;
