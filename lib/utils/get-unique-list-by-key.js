export const getUniqueListByKey = (list, key) => {
  return [...new Set(list.map((item) => item[key]))];
};
