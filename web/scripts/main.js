import "https://code.jquery.com/jquery-3.6.1.min.js";
import {
  getStatesData,
  handleOnStateSelected,
  handleZipChanged,
  handleStateFormSubmit,
} from "./state-zip-form.js";

$(document).ready(() => {
  getStatesData();
  $("#state").on("change", handleOnStateSelected);
  $("#zip").on("keyup", handleZipChanged);
  $("#wf-form-state").on("submit", handleStateFormSubmit);
});
