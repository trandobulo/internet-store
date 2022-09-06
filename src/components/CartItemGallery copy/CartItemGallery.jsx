import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import { ReactComponent as ArrowIcon } from "../../svg/arrowIcon.svg";
import "./CartItemGallery.css";

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

  renderGalleryBtn = (direction) => {
    return (
      <button
        className={`cartItemGalleryBtn ${direction}`}
        data-direction={direction}
        onClick={this.handleGalleryClick}
      >
        <ArrowIcon />
      </button>
    );
  };

  renderGalleryImg = () => {
    return (
      <NavLink
        className={"cartItemGalleryImgContainer"}
        to={`/categories/all/products/${this.props.id}`}
      >
        <img
          className="cartItemGalleryImg"
          src={this.props.images[this.state.index]}
          alt={this.props.id}
        ></img>
      </NavLink>
    );
  };

  render() {
    return (
      <>
        {this.renderGalleryImg()}
        {this.props.images.length > 1 && (
          <>
            {this.renderGalleryBtn("prev")}
            {this.renderGalleryBtn("next")}
          </>
        )}
      </>
    );
  }
}

export default withRouter(CartItemGallery);
