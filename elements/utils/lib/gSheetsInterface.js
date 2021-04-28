import { CSVtoArray } from "@lrnwebcomponents/utils/utils.js";

export class gSheetInterface {
  constructor(target = null, sheetGids = {}) {
    // machineName you want to use => gid from google
    this.sheetGids = sheetGids;
    // sheet
    this.sheet = null;
    this.target = target;
  }
  /**
   * load data from sheet via API
   */
  async loadSheetData(page) {
    return await this.loadCSVData(
      `https://docs.google.com/spreadsheets/d/e/${this.sheet}/pub?output=csv&gid=${this.sheetGids[page]}`,
      page
    );
  }
  /**
   * generate appstore query
   */
  async loadCSVData(source, sheet) {
    return await fetch(source, {
      method: this.method,
    })
      .then((response) => {
        if (response.ok) return response.text();
      })
      .then((text) => {
        return this.handleResponse(text, sheet);
      });
  }
  /**
   * Convert from csv text to an array in the table function
   */
  async handleResponse(text, sheet) {
    // Set helps performantly assemble possible collapsed areas
    let table = CSVtoArray(text);
    let tmp = table.shift();
    let headings = {};
    let data = [];
    for (var i in tmp) {
      headings[tmp[i]] = i;
    }
    for (var i in table) {
      let item = {};
      for (var j in headings) {
        item[j] = table[i][headings[j]];
      }
      // push data onto the database of all data we have now as objects
      data.push(item);
    }
    // allow for deeper processing on the data or just return the data found
    return typeof this.target[`process${sheet}Data`] === "function"
      ? this.target[`process${sheet}Data`](table, headings, data)
      : data;
  }
}
