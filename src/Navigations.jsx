import React from "react";
import gql from "graphql-tag";
import client from "./index";

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
            <div className="navButton" key={index} onClick={this.props.click}>
              <label>{category.name.toUpperCase()}</label>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Navigations;
