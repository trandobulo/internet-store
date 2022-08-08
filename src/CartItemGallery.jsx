import React from "react";

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
    const row = (
      <svg
        width="8"
        height="14"
        viewBox="0 -0.5 8 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.75 1.06808L6.375 6.68711L0.75 12.3062"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );

    return (
      <>
        <img
          src={this.props.images[this.state.index]}
          alt={"product foto"}
        ></img>
        <div
          className="cartItemGalleryBtn prev"
          data-direction="prev"
          onClick={this.handleGalleryClick}
        >
          {row}
        </div>
        <div
          className="cartItemGalleryBtn next"
          data-direction="next"
          onClick={this.handleGalleryClick}
        >
          {row}
        </div>
      </>
    );
  }
}

export default CartItemGallery;
