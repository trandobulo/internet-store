import React from "react";
import gql from "graphql-tag";
import client from "../../apolloClient";
import { Link, withRouter } from "react-router-dom";

class Navigations extends React.Component {
  constructor(props) {
    super(props);
    this.state = { categories: [], activeCategory: "all" };
  }

  getCategories = () =>
    client
      .query({
        query: gql`
          query {
            categories {
              name
            }
          }
        `,
      })
      .then((result) =>
        this.setState({
          categories: result.data.categories,
        })
      );

  componentDidMount() {
    this.getCategories();
  }

  getNavBtnClass(category) {
    return this.props.location.pathname
      .split("/")
      .find((item) => item === category.name)
      ? "activeNavButton"
      : "navButton";
  }

  navBtns = () => {
    return this.state.categories.map((category, index) => {
      return (
        <Link to={`/categories/${category.name}`} key={index}>
          <div
            className={this.getNavBtnClass(category)}
            data-category={category.name}
            onClick={this.props.onclick}
          >
            <label>{category.name}</label>
          </div>
        </Link>
      );
    });
  };

  render() {
    return <nav className="nav">{this.navBtns()}</nav>;
  }
}

export default withRouter(Navigations);
