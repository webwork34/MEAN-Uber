module.exports.copyArray = data => {
  return data.map(item => {
    const copy = JSON.parse(JSON.stringify(item));
    delete copy.__v;

    return copy;
  });
};

module.exports.copyObj = data => {
  const copy = JSON.parse(JSON.stringify(data));
  delete copy.__v;

  return copy;
};
