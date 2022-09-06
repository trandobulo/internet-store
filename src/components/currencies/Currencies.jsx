import React from "react";
import gql from "graphql-tag";
import client from "../../apolloClient";
import { ReactComponent as CurrencyChevron } from "../../svg/currencyChevron.svg";
import "./Currencies.css";

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

  currencyBtn = () => {
    return (
      <button
        className="currency"
        ref={this.wrapperRef}
        onClick={this.isListOpen}
      >
        {this.props.activeCurrency}
        <CurrencyChevron
          className={this.state.isListOpen ? "rotated" : "notRotated"}
        />
      </button>
    );
  };

  currencyList = () => {
    const list = this.state.currencies.data.currencies.map(
      (currency, index) => (
        <div
          className="currenciesListItem"
          key={index}
          onClick={this.props.onclick}
          data-symbol={currency.symbol}
        >
          {`${currency.symbol} ${currency.label}`}
        </div>
      )
    );

    return <div className="currenciesList">{list}</div>;
  };

  render() {
    return (
      <div className="currencySwitcher">
        {this.currencyBtn()}
        {this.state.isListOpen && this.currencyList()}
      </div>
    );
  }
}

export default Currencies;
