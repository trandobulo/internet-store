import React from "react";
import gql from "graphql-tag";
import client from "./apolloClient";
import currencyRow from "./currencyRow";

class Currencies extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isListOpen: false,
      currencies: [],
    };

    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.isListOpen = this.isListOpen.bind(this);
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
      this.setState({ isListOpen: false });
    }
  }

  isListOpen() {
    this.setState({ isListOpen: !this.state.isListOpen });
  }

  componentDidMount() {
    this.getCurrencies();
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
          onClick={this.isListOpen}
        >
          {this.props.activeCurrency}
          {currencyRow(this.state.isListOpen)}
        </div>
        {this.state.isListOpen && (
          <div className="currenciesList">
            {this.state.currencies.data.currencies.map((currency, index) => (
              <div
                className="currenciesListItem"
                key={index}
                onClick={this.props.onclick}
                data-symbol={currency.symbol}
              >
                {`${currency.symbol} ${currency.label}`}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default Currencies;
