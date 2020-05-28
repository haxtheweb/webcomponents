/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
/**
 * `json-outline-schema-item`
 * @element json-outline-schema-item
 * `A single item inside of json outline schema's items array`
 *
 * @microcopy - language worth noting:
 *  - outline-schema - a schema for expressing the relationship between structured content items
 *  - item - one item within an outline with reference to a resource to load the contents of the item
 */
class JSONOutlineSchemaItem {
  /**
   * Establish defaults for a new item
   */
  constructor() {
    this.id = "item-" + this.generateUUID();
    this.title = "New item";
    this.location = "";
    this.slug = "";
    this.description = "";
    this.parent = "";
    this.metadata = {};
    this.order = 0;
    this.indent = 0;
  }
  /**
   * Load data from the location specified
   */
  readLocation(basePath = "") {
    // @todo read location and return contents of it
    //    if (file_exists(basePath + this.location)) {
    //      return file_get_contents(basePath + this.location);
    //    }
    return FALSE;
  }
  /**
   * Load data from the location specified
   */
  writeLocation(body, basePath = "") {
    //    if (file_exists(basePath + this.location)) {
    //      return file_put_contents(basePath + this.location, body);
    //    }
    return FALSE;
  }
  /**
   * Generate a UUID
   */
  generateUUID() {
    return "ss-s-s-s-sss".replace(/s/g, this._uuidPart);
  }
  _uuidPart() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
}
export { JSONOutlineSchemaItem };
