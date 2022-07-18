import React from "react";
import gql from "graphql-tag";
import client from "./index";

class Currencies extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listOpen: false,
    };

    this.currencies = [];

    this.wrapperRef = React.createRef(); // don't fully understood how it work
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  GET_CURRENCIES = async () =>
    await client
      .query({
        query: gql`
          query {
            currencies {
              label
              symbol
            }
          }
        `,
      })

      .then((result) => {
        this.currencies = result; // isn't it be better to write it into the state ?
      });

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      this.setState({ listOpen: false });
    }
  }

  componentDidMount() {
    this.GET_CURRENCIES(); // how to be sure that element will fetch data before open list
    document.addEventListener("click", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  }

  render() {
    return (
      <div className="currencySwitcher">
        <div
          className="currency"
          ref={this.wrapperRef}
          onClick={() => {
            this.setState({ listOpen: !this.state.listOpen });
          }}
        >
          {this.props.activeCurrency}
        </div>
        {this.state.listOpen && (
          <div className="currenciesList">
            {this.currencies.data.currencies.map((currency, index) => {
              return (
                <div key={index} onClick={this.props.click}>
                  <div className="currenciesListItem">
                    <span>{currency.symbol}</span>
                    <span>{currency.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

export default Currencies;
