export const getItemByKeyMatch = (list, key, matchString) => {
  return (
    list.length &&
    list.find((item) => {
      return item[key] === matchString;
    })
  );
};
