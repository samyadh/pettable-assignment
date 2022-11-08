import { getItemByKeyMatch } from "../utils/get-item-by-key-match.js";

export const validateStateZipcodeCombination = (zip, state, statesData) => {
  const zipData = getItemByKeyMatch(statesData, "zip", zip);
  if (zipData) {
    return zipData.state_name === state;
  }
  return false;
};
