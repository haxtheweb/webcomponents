/**
 * UUID Manager for Skeleton Generation
 * Handles UUID generation, mapping, and rewriting for skeleton templates
 */

export class SkeletonUuidManager {
  constructor() {
    this.uuidMap = new Map();
    this.usedUuids = new Set();
  }

  /**
   * Generate a new UUID v4
   * @returns {string} UUID
   */
  generateUuid() {
    // Simple UUID v4 generation without crypto dependency
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Get or create UUID for an item
   * @param {string} originalId - Original item ID
   * @returns {string} UUID
   */
  getUuidForItem(originalId) {
    if (this.uuidMap.has(originalId)) {
      return this.uuidMap.get(originalId);
    }

    let newUuid;
    do {
      newUuid = this.generateUuid();
    } while (this.usedUuids.has(newUuid));

    this.uuidMap.set(originalId, newUuid);
    this.usedUuids.add(newUuid);
    return newUuid;
  }

  /**
   * Create mapping for parent-child relationships
   * @param {Array} items - Site items
   * @returns {Object} UUID mapping with relationships
   */
  createRelationshipMap(items) {
    const relationships = {};
    
    items.forEach(item => {
      const itemUuid = this.getUuidForItem(item.id);
      relationships[itemUuid] = {
        originalId: item.id,
        uuid: itemUuid,
        parentUuid: item.parent ? this.getUuidForItem(item.parent) : null,
        children: []
      };
    });

    // Build children arrays
    Object.values(relationships).forEach(item => {
      if (item.parentUuid && relationships[item.parentUuid]) {
        relationships[item.parentUuid].children.push(item.uuid);
      }
    });

    return relationships;
  }

  /**
   * Rewrite UUIDs in skeleton data for new site creation
   * @param {Object} skeleton - Skeleton data
   * @returns {Object} Skeleton with new UUIDs
   */
  rewriteSkeletonUuids(skeleton) {
    const newManager = new SkeletonUuidManager();
    const oldToNewMap = new Map();

    // Create new UUIDs for all items
    skeleton.structure.forEach(item => {
      if (item.uuid) {
        const newUuid = newManager.generateUuid();
        oldToNewMap.set(item.uuid, newUuid);
      }
    });

    // Rewrite structure with new UUIDs
    const newStructure = skeleton.structure.map(item => {
      const newItem = { ...item };
      
      if (item.uuid) {
        newItem.uuid = oldToNewMap.get(item.uuid);
      }
      
      if (item.parentUuid && oldToNewMap.has(item.parentUuid)) {
        newItem.parentUuid = oldToNewMap.get(item.parentUuid);
      }

      return newItem;
    });

    return {
      ...skeleton,
      structure: newStructure,
      meta: {
        ...skeleton.meta,
        created: new Date().toISOString(),
        sourceUuids: 'rewritten'
      }
    };
  }

  /**
   * Reset the manager
   */
  reset() {
    this.uuidMap.clear();
    this.usedUuids.clear();
  }
}

export default SkeletonUuidManager;