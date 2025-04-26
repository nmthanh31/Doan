const fs = require("fs");
const { parse } = require("csv-parse/sync");
const { stringify } = require("csv-stringify/sync");

const readCSV = (filePath) => {
  const content = fs.readFileSync(filePath);
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
  });
};

const writeCSV = (filePath, data) => {
  const csv = stringify(data, { header: true });
  fs.writeFileSync(filePath, csv);
};

module.exports = { readCSV, writeCSV };
