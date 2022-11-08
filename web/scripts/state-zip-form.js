import { getUniqueListByKey } from "../../lib/utils/get-unique-list-by-key.js";
import { validateStateZipcodeCombination } from "../../lib/validations/state-zip-mapping.js";

const cache = {};
let stateSelected;

export const getStatesData = () => {
  if (cache["statesData"]) {
    populateStateOptions(cache["statesData"]);
    return;
  }

  $.get({
    url: "http://localhost:3001/pincodes",
    beforeSend: function (xhr) {
      // set headers especially authorization stuff.
    },
    success: function (data, status, xhr) {
      cache["statesData"] = data;
      populateStateOptions(data);
    },
  });
};

export const handleStateFormSubmit = (event) => {
  event.preventDefault();
  toggleFailMessage(false);
  toggleSuccessMessage(false);

  const formData = {
    state: $("#state").val(),
    zip: $("#zip").val(),
  };

  $.post({
    url: "http://localhost:3001/stateFormSubmit",
    data: JSON.stringify(formData),
    contentType: "application/json",
    success: function (data, status, xhr) {
      toggleSuccessMessage(true);
    },
    error: function () {
      toggleFailMessage(true);
    },
  });
};

const populateStateOptions = (statesData) => {
  const states = getUniqueListByKey(statesData, "state_name");
  if (states.length) {
    $("#state").html(``);
    $("#state").append(`<option value="">Select one...</option>`);
    states.sort().forEach((state) => {
      $("#state").append(`<option value="${state}">${state}</option>`);
    });
  }
};

const toggleSuccessMessage = (show) => {
  if (show) {
    $(".w-form-done").css("display", "block");
    return;
  }
  $(".w-form-done").css("display", "none");
};

const toggleFailMessage = (show) => {
  if (show) {
    $(".w-form-fail").css("display", "block");
    return;
  }
  $(".w-form-fail").css("display", "none");
};

const clearInputField = (fieldSelector) => {
  $(fieldSelector).val(null);
};

export const handleOnStateSelected = (selectedStateValue) => {
  clearInputField("#zip");
  toggleFailMessage(false);
  toggleSuccessMessage(false);
  stateSelected = selectedStateValue.target.value;
};

export const handleZipChanged = (zipEnteredValue) => {
  toggleFailMessage(false);
  toggleSuccessMessage(false);
  const zipStateValidationResult = validateStateZipcodeCombination(
    Number(zipEnteredValue.target.value),
    stateSelected,
    cache["statesData"]
  );

  if (!zipStateValidationResult) {
    toggleFailMessage(true);
  }
};
