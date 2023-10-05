import { v4 as uuidv4 } from '../../../vendor/uuid/esm-node/index.js';
/**
 * JSONOutlineSchemaItem - a single item without an outline of items.
 */
export class JSONOutlineSchemaItem
{
  /**
   * Establish defaults for a new item
   */
  constructor() {
    this.id = 'item-' + uuidv4();
    this.indent = 0;
    this.location = '';
    this.slug = '';
    this.order = 0;
    this.parent = null;
    this.title = 'New item';
    this.description = '';
    this.metadata = {};
    this.contents = null;
  }
}