import React from "react";
import gql from "graphql-tag";
import client from "./ApolloClient";

class Currencies extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      islistOpen: false,
      currencies: [],
    };

    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.islistOpen = this.islistOpen.bind(this);
  }

  getCurrencies = () =>
    client
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
        this.setState({ currencies: result });
      });

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      this.setState({ islistOpen: false });
    }
  }

  islistOpen() {
    this.setState({ islistOpen: !this.state.islistOpen });
  }

  componentDidMount() {
    this.getCurrencies(); // how to be sure that element will fetch data before open list
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
          onClick={this.islistOpen}
        >
          {this.props.activeCurrency}
          <svg
            className={this.state.islistOpen ? "notRotated" : "rotated"}
            id="currency"
            width="8"
            height="4"
            viewBox="0 0 8 4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 3.5L4 0.5L7 3.5"
              stroke="black"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        {this.state.islistOpen && (
          <div className="currenciesList">
            {this.state.currencies.data.currencies.map((currency, index) => (
              <div
                className="currenciesListItem"
                key={index}
                onClick={this.props.onclick}
                data-symbol={currency.symbol}
              >
                <span>{currency.symbol}</span>
                <span>{currency.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default Currencies;
