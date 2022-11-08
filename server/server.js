import express from "express";
import fs from "fs";
import { validateStateZipcodeCombination } from "../lib/validations/state-zip-mapping.js";

const app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
const port = 3001;

let pincodeDataCache;

const getAllPincodeData = async () => {
  if (pincodeDataCache) {
    return pincodeDataCache;
  }

  const pincodeData = JSON.parse(
    fs.readFileSync("./mock-db/states-zip-mappings.json")
  );
  pincodeDataCache = pincodeData;
  return pincodeData;
};

app.get("/pincodes", async (req, res) => {
  const allPincodeData = await getAllPincodeData();
  if (allPincodeData) {
    res.json(allPincodeData).status(200);
    return;
  }
  res.send("No data found").status(400);
});

app.post("/stateFormSubmit", async (req, res) => {
  const requestParams = req.body;

  if (!requestParams) {
    res.status(400).send("Invalid request");
    return;
  }

  if (!requestParams.zip || !requestParams.state) {
    res.status(400).send("Invalid request");
    return;
  }

  const pincodeData = await getAllPincodeData();
  const zipStateValidationResult = validateStateZipcodeCombination(
    Number(requestParams.zip),
    requestParams.state,
    pincodeData
  );

  if (!zipStateValidationResult) {
    res.status(400).send("Invalid request");
    return;
  }

  res.send("Form submitted successfully!").status(200);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
