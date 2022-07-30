import React from "react";
import gql from "graphql-tag";
import client from "./ApolloClient";

class Navigations extends React.Component {
  constructor(props) {
    super(props);
    this.state = { categories: [] };
  }

  GET_CATEGORIES = () =>
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
    this.GET_CATEGORIES();
  }

  render() {
    return (
      <div className="nav">
        {this.state.categories.map((category, index) => {
          return (
            <div
              className={
                this.props.activeCategory === category.name
                  ? "activeNavButton"
                  : "navButton"
              }
              key={index}
              data-category={category.name}
              onClick={this.props.onclick}
            >
              <label>{category.name.toUpperCase()}</label>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Navigations;
