/* eslint-disable */
const fs = require("fs");
const path = require("path");

const target = path.join("src/api/back/models/index.ts");

fs.appendFileSync(target, 'export * from "../../mapped-models"');
