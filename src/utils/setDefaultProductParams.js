const setDefaultProductParams = (attributes) => {
  let obj = {};
  for (let attribute of attributes) {
    obj[attribute.name] = attribute.items[0].value;
  }
  return obj;
};

export default setDefaultProductParams;
