import fs from 'fs';
import { parse } from 'csv-parse/sync'; 
import { stringify } from 'csv-stringify/sync';


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

export { readCSV, writeCSV };
