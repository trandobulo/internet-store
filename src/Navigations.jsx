import React from "react";
import gql from "graphql-tag";
import client from "./apolloClient";
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

  render() {
    return (
      <div className="nav">
        {this.state.categories.map((category, index) => {
          return (
            <Link to={`/categories/${category.name}`} key={index}>
              <div
                className={
                  this.props.location.pathname
                    .split("/")
                    .find((item) => item === category.name)
                    ? "activeNavButton"
                    : "navButton"
                }
                data-category={category.name}
                onClick={this.props.onclick}
              >
                <label>{category.name}</label>
              </div>
            </Link>
          );
        })}
      </div>
    );
  }
}

export default withRouter(Navigations);
