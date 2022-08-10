import React from "react";
import { Link, withRouter } from "react-router-dom";
import arrowIcon from "./arrowIcon";

class CartItemGallery extends React.Component {
  constructor(props) {
    super(props);

    this.state = { index: 0 };

    this.handleGalleryClick = this.handleGalleryClick.bind(this);
  }

  handleGalleryClick(e) {
    if (e.currentTarget.dataset.direction === "next") {
      this.state.index < this.props.images.length - 1 &&
        this.setState({ index: this.state.index + 1 });
    } else {
      this.state.index > 0 && this.setState({ index: this.state.index - 1 });
    }
  }

  render() {
    return (
      <>
        <Link to={`/categories/all/products/${this.props.id}`}>
          <div className="cartItemGalleryImg">
            <img
              src={this.props.images[this.state.index]}
              alt={this.props.id}
            ></img>
          </div>
        </Link>
        {this.props.images.length > 1 && (
          <>
            <div
              className="cartItemGalleryBtn prev"
              data-direction="prev"
              onClick={this.handleGalleryClick}
            >
              {arrowIcon()}
            </div>
            <div
              className="cartItemGalleryBtn next"
              data-direction="next"
              onClick={this.handleGalleryClick}
            >
              {arrowIcon()}
            </div>
          </>
        )}
      </>
    );
  }
}

export default withRouter(CartItemGallery);
