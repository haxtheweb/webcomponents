import { v4 as uuidv4 } from '../../../vendor/uuid/esm-node/index.js';

import fetch from "node-fetch";
import { JSONOutlineSchemaItem } from './JSONOutlineSchemaItem.js';
/**
 * JSONOutlineSchema - An object for interfacing with the JSON Outline schema
 * specification. @see https://github.com/haxtheweb/json-outline-schema
 * for more details. This provides a simple way of loading outlines, parsing
 * and working with the items in them while writing back to the specification
 * accurately.
 */

export class JSONOutlineSchema
{
  /**
   * Establish defaults
   */
    constructor()
  {
      this.file = null;
      this.id = uuidv4();
      this.title = 'New site';
      this.author = '';
      this.description = '';
      this.license = 'by-sa';
      this.metadata = {};
      this.items = [];
      // outside normal spec to allow for request differences when remove loading
      // this helps account for deploy differences in server configuration
      // and are not related to the spec itself but influence how data is resolved
      this.__siteFileBase = 'site.json';
      this.__fetchOptions = {
        method: 'GET'
      }
  }

  /**
   * Get a reasonable license name from the short hand
   */
  getLicenseDetails()
  {
      list = {
          "by": {
              'name':"Creative Commons: Attribution",
              'link':"https://creativecommons.org/licenses/by/4.0/",
              'image':"https://i.creativecommons.org/l/by/4.0/88x31.png"
          },
          "by-sa":{
              'name':"Creative Commons: Attribution Share a like",
              'link':"https://creativecommons.org/licenses/by-sa/4.0/",
              'image':"https://i.creativecommons.org/l/by-sa/4.0/88x31.png"
          },
          "by-nd":{
              'name':"Creative Commons: Attribution No derivatives",
              'link':"https://creativecommons.org/licenses/by-nd/4.0/",
              'image':"https://i.creativecommons.org/l/by-nd/4.0/88x31.png"
          },
          "by-nc":{
              'name':"Creative Commons: Attribution non-commercial",
              'link':"https://creativecommons.org/licenses/by-nc/4.0/",
              'image':"https://i.creativecommons.org/l/by-nc/4.0/88x31.png"
          },
          "by-nc-sa":{
              'name' :
                  "Creative Commons: Attribution non-commercial share a like",
              'link':"https://creativecommons.org/licenses/by-nc-sa/4.0/",
              'image' :
                  "https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png"
          },
          "by-nc-nd":{
              'name' :
                  "Creative Commons: Attribution Non-commercial No derivatives",
              'link':"https://creativecommons.org/licenses/by-nc-nd/4.0/",
              'image' :
                  "https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png"
          }
      };
      if (list[this.license]) {
          return list[this.license];
      }
      return {};
  }
  /**
   * Get a new item matching schema standards
   * @return new JSONOutlineSchemaItem Object
   */
  newItem()
  {
      let item = new JSONOutlineSchemaItem();
      return item;
  }
  /**
   * Add an item to the outline
   * @var item an array of values, keyed to match JSON Outline Schema
   * @return count of items in the array
   */
  addItem(item)
  {
      let safeItem = this.validateItem(item);
      let count = this.items.push(safeItem);
      return count;
  }
  /**
   * Validate that an item matches JSONOutlineSchemaItem format
   * @var item JSONOutlineSchemaItem
   * @return JSONOutlineSchemaItem matching the specification
   */
  validateItem(item)
  {
    // create a generic schema item
    let tmp = new JSONOutlineSchemaItem();
    // crush the item given into a stdClass object
    let ary = (item);
    for (var key in ary) {
      // only set what the element from spec allows into a new object
      if (tmp.hasOwnProperty(key)) {
        tmp[key] = ary[key];
      }
    }
    return tmp;
  }
  /**
   * Remove an item from the outline if it exists
   * @var id an id that's in the array of items
   * @return JSONOutlineSchemaItem or false if not found
   */
  removeItem(id)
  {
    for (var key in this.items) {
      if (this.items[key].id == id) {
        tmp = this.items[key];
        delete this.items[key];
        return tmp;
      }
    }
    return false;
  }
  /**
   * @note Microservice, we don't support saving
   */
  save() {
    return false;
  }
  /**
   * Update an item in the outline
   * @var id an id that's in the array of items
   * @return JSONOutlineSchemaItem or false if not found
   */
  updateItem(item, save = false)
  {
    // verify this is a legit item
    let safeItem = this.validateItem(item);
    for (var key in this.items) {
      // match the current item's ID to our safeItem passed in
      if (this.items[key].id == safeItem.id) {
        // overwrite the item
        this.items[key] = safeItem;
        // if we save, then we let that return the whole file
        if (save) {
          return this.save();
        }
        // this was successful
        return true;
      }
    }
    // we didn't find a match on the ID to bother saving an update
    return false;
  }
  /**
   * Load a schema from a file
   */
  async load(location, options = {method: 'GET'})
  {
    const fileData = await fetch(location, options).then((d) => d.ok ? d.json() : null);
    for (var key in fileData) {
      if ((this[key]) && key != 'items') {
        this[key] = fileData[key];
      }
    }
    this.file = location;
    // check for items and escalate to full JSONOutlineSchemaItem object
    // also ensures data matches only what is supported
    if ((fileData['items'])) {
      for (var key in fileData['items']) {
        let item = fileData['items'][key];
        let newItem = new JSONOutlineSchemaItem();
        newItem.id = item.id;
        newItem.indent = item.indent;
        newItem.location = item.location;
        newItem.slug = item.slug;
        newItem.order = item.order;
        newItem.parent = item.parent;
        newItem.title = item.title;
        newItem.description = item.description;
        // metadata can be anything so whatever
        newItem.metadata = item.metadata;
        this.items[key] = newItem;
      }
    }
    return fileData;
  }
  /**
   * Get an item by ID
   */
  getItemById(matchId) {
    for (var id in this.items) {
      if (this.items[id].id === matchId) {
        return this.items[id];
      }
    }
    return false;
  }

  /**
   * Get an item by property value
   */
  getItemByProperty(propName, value) {
    for (var id in this.items) {
      if (this.items[id][propName] === value) {
        return this.items[id];
      }
    }
    return false;
  }
  /**
   * Filter based on a set of parents built recursively
   */
  findBranch(id) {
    const items = this.orderTree(this.items);
    let decendentIds = [id];
    let children = [];
    children.push(this.getItemById(id));
    // walk items and find things that have parent as present id
    for (var key in items) {
      if (decendentIds.includes(items[key].parent)) {
        children.push(items[key]);
        decendentIds.push(items[key].id);
      }
    }
    return children;
  }
  
  findChildenRecursively(items, activeIds = []) {
    for (var key in items) {
      // we found a kid
      if (activeIds.includes(items[key].parent)) {
    
      }
      let child = this.items[key2];
      if (child.parent == item.id) {
        children.push(child);
      }
    }
    for (var key in currentItems) {
      let item = currentItems[key];
      if (!idList.includes(item.id)) {
        idList.push(item.id);
        found.push(item);
        let children = [];
        for (var key2 in this.items) {
          let child = this.items[key2];
          if (child.parent == item.id) {
            children.push(child);
          }
        }
        // sort the kids
        children.sort( function(a, b) {return a.order - b.order} );
        // only walk deeper if there were children for this page
        if (children.length > 0) {
          this.orderRecurse(children, sorted, idList);
        }
      }
    }
  }
  /**
   * Get an item by ID
   */
  async getContentById(id, cache = false) {
    const item = this.getItemById(id);
    if (cache && process.env.VERCEL_ENV !== 'development') {
      return await fetch(`https://${process.env.VERCEL_URL}/api/apps/haxcms/pageCache?site=${this.file}&uuid=${id}&type=link`, this.__fetchOptions).then((d) => d.ok ? d.text() : '');
    }
    else {
      let location = this.file.replace(this.__siteFileBase, item.location);
      if (this.__siteLocationPathName) {
        location = location.replace(this.__siteLocationPathName + '/', '');
      }
      return await fetch(location, this.__fetchOptions).then((d) => d.ok ? d.text() : '');
    }
  }
  /**
   * Organize the items based on tree order. This makes front end navigation line up correctly
   */
  orderTree(items, orderBy = 'order') {
    let sorted = [];
    items.sort( function(a, b) {
      if (orderBy === 'updated') {
        return a.metadata.updated - b.metadata.updated;
      }
      return parseInt(a[orderBy]) - parseInt(b[orderBy])}
    );
    this.orderRecurse(items, sorted, [], orderBy);
    // sanity check, should always be equal
    if (sorted.length == items.length) {
      return sorted;
    }
    // if it bombed just pass it through... again, sanity
    return items;
  }
  /**
   * Sort a JOS
   */
  orderRecurse(currentItems, sorted = [], idList = [], orderBy = 'order') {
    for (var key in currentItems) {
      let item = currentItems[key];
      if (!idList.includes(item.id)) {
        idList.push(item.id);
        sorted.push(item);
        let children = [];
        for (var key2 in this.items) {
          let child = this.items[key2];
          if (child.parent == item.id) {
            children.push(child);
          }
        }
        // sort the kids
        children.sort( function(a, b) {
          if (orderBy === 'updated') {
            return a.metadata.updated - b.metadata.updated;
          }
          return parseInt(a[orderBy]) - parseInt(b[orderBy])}
          );
        // only walk deeper if there were children for this page
        if (children.length > 0) {
          this.orderRecurse(children, sorted, idList, orderBy);
        }
      }
    }
  }
}