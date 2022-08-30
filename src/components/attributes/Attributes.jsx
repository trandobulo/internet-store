import React from "react";

class Attributes extends React.Component {
  constructor(props) {
    super(props);
  }

  renderAttributeItem = (attribute) => {
    const renderParam = (item, attrIndex, isSwatch) => {
      const swatchValue = <div style={{ backgroundColor: item.value }}></div>;

      const getParamClass = (item, styles, swatch) => {
        if (this.props.params[attribute.name] === item.value) {
          return swatch ? styles.activeParamSwatch : styles.activeParam;
        } else {
          return swatch ? styles.notActiveParamSwatch : styles.notActiveParam;
        }
      };

      const paramType = () => {
        if (isSwatch) {
          return swatchValue;
        } else {
          return item.value;
        }
      };

      return (
        <div
          onClick={this.props.chooseParam}
          className={getParamClass(item, this.props.styles, isSwatch)}
          key={attrIndex}
          data-name={attribute.name}
          data-id={item.id}
          data-value={item.value}
        >
          {paramType()}
        </div>
      );
    };

    return attribute.items.map((item, attrIndex) =>
      renderParam(item, attrIndex, attribute.type === "swatch")
    );
  };

  renderAttributes = () => {
    const styles = this.props.styles;

    return this.props.attributes.map((attribute, cartIndex) => (
      <label className={styles.attributeName} key={cartIndex}>
        {`${attribute.name} :`}
        <div>{this.renderAttributeItem(attribute)}</div>
      </label>
    ));
  };

  render() {
    return this.renderAttributes();
  }
}

export default Attributes;
