import { CSVtoArray } from "@haxtheweb/utils/utils.js";

export class gSheetInterface {
  constructor(target = null, sheet = null, sheetGids = {}) {
    // sheet
    this.sheet = sheet;
    // machineName you want to use => gid from google
    this.sheetGids = sheetGids;
    // element target
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
        return CSVtoArray(text);
      });
  }
}
