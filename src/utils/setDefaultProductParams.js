const setDefaultProductParams = (attributes, choosenAttributes) => {
  let obj = {};
  for (let attribute of attributes) {
    if (!choosenAttributes[attribute.name]) {
      obj[attribute.name] = attribute.items[0].value;
    } else {
      obj[attribute.name] = choosenAttributes[attribute.name];
    }
  }
  return obj;
};

export default setDefaultProductParams;
