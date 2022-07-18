import React from "react";
import ProductList from "./ProductList";
import Navigations from "./Navigations";
import logo from "./content/brand-icon.png";
import Currencies from "./Currencies";

class Category extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeCategory: "all", activeCurrency: "$" };
    this.handleNavClick = this.handleNavClick.bind(this);
  }

  handleNavClick(e) {
    this.setState({
      activeCategory: e.currentTarget.firstChild.innerHTML.toLowerCase(),
    });
  }

  switchCurrency(e) {
    this.setState({
      activeCurrency: e.currentTarget.firstChild.firstChild.innerHTML, // is it normal practice?
    });
  }

  render() {
    console.log(this.state.activeCategory);
    return (
      <>
        <div className="header">
          <Navigations click={this.handleNavClick} />
          <img className="navLogo" src={logo} alt="brand logo" />
          <Currencies
            click={this.switchCurrency.bind(this)}
            activeCurrency={this.state.activeCurrency}
          />
        </div>
        <h2 className="categotyTitle">
          {this.state.activeCategory.toUpperCase()}
        </h2>
        <ProductList
          activeCategory={this.state.activeCategory}
          currentCurrency={this.state.activeCurrency}
        />
      </>
    );
  }
}

export default Category;
