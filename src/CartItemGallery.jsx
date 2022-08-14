import React from "react";
import { Link, withRouter } from "react-router-dom";
import { ReactComponent as ArrowIcon } from "./svg/arrowIcon.svg";

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
          <img
            className="cartItemGalleryImg"
            src={this.props.images[this.state.index]}
            alt={this.props.id}
          ></img>
        </Link>
        {this.props.images.length > 1 && (
          <>
            <button
              className="cartItemGalleryBtn prev"
              data-direction="prev"
              onClick={this.handleGalleryClick}
            >
              <ArrowIcon />
            </button>
            <button
              className="cartItemGalleryBtn next"
              data-direction="next"
              onClick={this.handleGalleryClick}
            >
              <ArrowIcon />
            </button>
          </>
        )}
      </>
    );
  }
}

export default withRouter(CartItemGallery);
