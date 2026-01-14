/**
 * Site Skeleton Generator - Part of HAXcms Elements
 * Extracts live site data into reusable skeleton templates
 */

import { store } from "../haxcms-site-store.js";
import { toJS } from "mobx";
import { generateResourceID } from "@haxtheweb/utils/utils.js";

export class SiteSkeletonGenerator {
  /**
   * Generate skeleton from current live site
   * @param {boolean} confirmed - Whether user confirmed for large sites
   * @returns {Object} Skeleton schema
   */
  static async generateFromCurrentSite(confirmed = false) {
    const manifest = toJS(store.manifest);

    if (!manifest || !manifest.items) {
      throw new Error("No site data available to generate skeleton");
    }

    // Check for large sites and get confirmation
    if (manifest.items.length > 20 && !confirmed) {
      const shouldContinue = confirm(
        `This site has ${manifest.items.length} pages. Generating a skeleton may take a while and create a large file. Continue?`,
      );
      if (!shouldContinue) {
        throw new Error("Skeleton generation cancelled by user");
      }
    }

    const themeConfig = this.extractThemeConfiguration(manifest);
    const structure = await this.extractSiteStructure(manifest.items);
    const files = await this.extractSiteFiles();

    // Format skeleton to match createSite API structure directly
    const skeleton = {
      // Metadata for discoverability and template management
      meta: {
        name: this.getSiteMetaName(manifest),
        description: this.getSiteDescription(manifest),
        version: "1.0.0",
        created: new Date().toISOString(),
        type: "skeleton",
        sourceUrl: globalThis.location.href,
        // Fields used by app-hax v2 presentation layer
        useCaseTitle: this.getSiteMetaName(manifest),
        useCaseDescription: this.getSiteDescription(manifest),
        useCaseImage: `@haxtheweb/haxcms-elements/lib/theme-screenshots/theme-${themeConfig.element}-thumb.jpg` , // optional preview image; can be set later
        category: this.extractSiteCategories(manifest) || [],
        tags: this.extractSiteTags(manifest) || [],
        attributes: [], // optional icon badges [{icon, tooltip}]
      },

      // Direct mapping to createSite API format
      site: {
        name: this.getSiteMetaName(manifest),
        description: this.getSiteDescription(manifest),
        theme: themeConfig.element || "clean-one",
      },

      build: {
        type: "skeleton",
        structure: "from-skeleton",
        items: structure,
        files: files.map((filePath) => ({ path: filePath })),
      },

      theme: {
        // Include theme variables from original site if available
        ...(themeConfig.variables || {}),
        // Include theme settings/colors from original
        ...(themeConfig.settings || {}),
      },

      // Additional metadata for template system
      _skeleton: {
        originalMetadata: this.extractSiteMetadata(manifest),
        originalSettings: this.extractSiteSettings(manifest),
        fullThemeConfig: themeConfig,
      },
    };

    return skeleton;
  }

  /**
   * Get site meta name safely
   * @param {Object} manifest - Site manifest
   * @returns {string} Site name
   */
  static getSiteMetaName(manifest) {
    if (
      manifest.metadata &&
      manifest.metadata.site &&
      manifest.metadata.site.name
    ) {
      return manifest.metadata.site.name;
    }
    return "Untitled Skeleton";
  }

  /**
   * Get site description safely
   * @param {Object} manifest - Site manifest
   * @returns {string} Site description
   */
  static getSiteDescription(manifest) {
    if (manifest.description) {
      return `Template based on ${manifest.description}`;
    }
    if (manifest.title) {
      return `Template based on ${manifest.title}`;
    }
    return "Template based on HAX Site";
  }

  /**
   * Extract site metadata for template
   * @param {Object} manifest - Site manifest
   * @returns {Object} Site metadata template
   */
  static extractSiteMetadata(manifest) {
    const metadata = manifest.metadata || {};
    const siteData = metadata.site || {};

    return {
      site: {
        category: siteData.category || [],
        tags: siteData.tags || [],
        settings: this.cleanSiteSettings(siteData.settings || {}),
      },
      licensing: metadata.licensing || {},
      node: metadata.node || {},
      platform: metadata.platform || {},
    };
  }

  /**
   * Clean site settings removing instance-specific data
   * @param {Object} settings - Original settings
   * @returns {Object} Cleaned settings
   */
  static cleanSiteSettings(settings) {
    const cleaned = { ...settings };
    // Remove instance-specific timestamps
    delete cleaned.created;
    delete cleaned.updated;
    return cleaned;
  }

  /**
   * Extract theme configuration
   * @param {Object} manifest - Site manifest
   * @returns {Object} Theme configuration
   */
  static extractThemeConfiguration(manifest) {
    const metadata = manifest.metadata || {};
    const theme = metadata.theme || {};

    return {
      element: theme.element || "clean-one",
      variables: theme.variables || {},
      settings: {
        hexCode: theme.hexCode,
        cssVariable: theme.cssVariable,
        icon: theme.icon,
        image: theme.image,
        // Extract any other theme properties
        ...this.extractCustomThemeProperties(theme),
      },
    };
  }

  /**
   * Extract custom theme properties
   * @param {Object} theme - Theme object
   * @returns {Object} Custom properties
   */
  static extractCustomThemeProperties(theme) {
    const custom = {};
    const standardProps = [
      "element",
      "variables",
      "hexCode",
      "cssVariable",
      "icon",
      "image",
    ];

    Object.keys(theme).forEach((key) => {
      if (!standardProps.includes(key)) {
        custom[key] = theme[key];
      }
    });

    return custom;
  }

  /**
   * Extract site structure with UUIDs for relationships and content
   * @param {Array} items - Site items/pages
   * @returns {Array} Structure template
   */
  static async extractSiteStructure(items) {
    // Create UUID mappings for items
    const uuidMap = new Map();
    items.forEach((item) => {
      uuidMap.set(item.id, generateResourceID(''));
    });

    const structure = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // Get page content using store helper method
      let content = "";
      try {
        // Use the store's loadItemContent method to get page content
        content = await store.loadItemContent(item.id);
      } catch (error) {
        console.warn(`Could not fetch content for page ${item.id}:`, error);
        content = "";
      }

      structure.push({
        id: uuidMap.get(item.id),
        title: item.title,
        slug: item.slug,
        order: item.order || i,
        parent: item.parent ? uuidMap.get(item.parent) : null,
        indent: item.indent || 0,
        content: content,
        metadata: {
          published: this.getMetadataValue(item, "published", true),
          hideInMenu: this.getMetadataValue(item, "hideInMenu", false),
          tags: this.getMetadataValue(item, "tags", []),
          ...this.extractRelevantMetadata(item.metadata || {}),
        },
      });
    }

    return structure;
  }

  /**
   * Extract file references in the site
   * @returns {Array} Array of file paths referenced in the site content
   */
  static async extractSiteFiles() {
    const fileReferences = new Set();
    const manifest = toJS(store.manifest);
    const filesBaseUrl = "files/";

    // Get all page content and look for file references
    for (const item of manifest.items) {
      try {
        const content = await store.loadItemContent(item.id);
        if (content) {
          // Look for local file references in the content
          const fileRefs = this.extractFileReferences(content, filesBaseUrl);
          fileRefs.forEach((ref) => fileReferences.add(ref.path));
        }
      } catch (error) {
        console.warn(`Could not process files for page ${item.id}:`, error);
      }
    }

    return Array.from(fileReferences);
  }

  /**
   * Extract file references from content
   * @param {string} content - HTML content
   * @param {string} filesBaseUrl - Base URL for files folder
   * @returns {Array} Array of file references
   */
  static extractFileReferences(content, filesBaseUrl) {
    const fileRefs = [];
    // Look for attributes like src="files/..." or href="files/..." etc.
    // Ensure the path ends with a file extension
    const fileRegex = /\w+="files\/([^"'\s>]+\.[a-zA-Z0-9]+)"/gi;

    let match;
    while ((match = fileRegex.exec(content)) !== null) {
      const filePath = match[1];

      fileRefs.push({
        path: filePath,
      });
    }

    return fileRefs;
  }

  /**
   * Safely get metadata value
   * @param {Object} item - Site item
   * @param {string} key - Metadata key
   * @param {*} defaultValue - Default value
   * @returns {*} Metadata value
   */
  static getMetadataValue(item, key, defaultValue) {
    if (item.metadata && item.metadata[key] !== undefined) {
      return item.metadata[key];
    }
    return defaultValue;
  }

  /**
   * Extract relevant metadata for templates
   * @param {Object} metadata - Original metadata
   * @returns {Object} Template-relevant metadata
   */
  static extractRelevantMetadata(metadata) {
    const relevant = {};
    const preserveFields = [
      "wordCount",
      "difficulty",
      "audience",
      "contentType",
    ];

    preserveFields.forEach((field) => {
      if (metadata[field] !== undefined) {
        relevant[field] = metadata[field];
      }
    });

    return relevant;
  }

  /**
   * Extract site categories for template discoverability
   * @param {Object} manifest - Site manifest
   * @returns {Array} Categories array
   */
  static extractSiteCategories(manifest) {
    const metadata = manifest.metadata || {};
    const siteData = metadata.site || {};
    return siteData.category || [];
  }

  /**
   * Extract site tags for template discoverability
   * @param {Object} manifest - Site manifest
   * @returns {Array} Tags array
   */
  static extractSiteTags(manifest) {
    const metadata = manifest.metadata || {};
    const siteData = metadata.site || {};
    return siteData.tags || [];
  }

  /**
   * Extract site settings
   * @param {Object} manifest - Site manifest
   * @returns {Object} Site settings template
   */
  static extractSiteSettings(manifest) {
    const metadata = manifest.metadata || {};
    const siteData = metadata.site || {};
    const settings = siteData.settings || {};

    const extractedSettings = {};

    // Only include non-empty settings
    Object.keys(settings).forEach((key) => {
      const value = settings[key];
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0) &&
        !(typeof value === "object" && Object.keys(value).length === 0)
      ) {
        extractedSettings[key] = value;
      }
    });

    return extractedSettings;
  }

  /**
   * Generate downloadable skeleton file
   * @param {Object} skeleton - Skeleton schema
   * @returns {Blob} Downloadable file
   */
  static generateDownloadableFile(skeleton) {
    const content = JSON.stringify(skeleton, null, 2);
    return new Blob([content], { type: "application/json" });
  }

  /**
   * Download skeleton as file
   * @param {Object} skeleton - Skeleton schema
   * @param {string} filename - Download filename
   */
  static downloadSkeleton(skeleton, filename) {
    const defaultFilename = `${skeleton.meta.name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-skeleton.json`;
    const blob = this.generateDownloadableFile(skeleton);
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename || defaultFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Convert skeleton to app-hax v2 format (now direct since skeleton matches API)
   * @param {Object} skeleton - Skeleton schema
   * @param {Object} customizations - User customizations
   * @returns {Object} App-hax v2 compatible format
   */
  static toAppHaxFormat(skeleton, customizations = {}) {
    // Since skeleton now directly matches createSite API format,
    // just apply any user customizations and return
    const apiData = {
      site: {
        name: customizations.siteName || skeleton.site.name,
        description:
          customizations.siteDescription || skeleton.site.description,
        theme: customizations.theme || skeleton.site.theme,
      },
      build: {
        ...skeleton.build,
        // Update items with new timestamps for creation
        items: skeleton.build.items.map((item) => ({
          ...item,
          metadata: {
            ...item.metadata,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
          },
        })),
      },
      theme: {
        ...skeleton.theme,
        // Apply any user customizations
        ...(customizations.color ? { color: customizations.color } : {}),
        ...(customizations.icon ? { icon: customizations.icon } : {}),
        ...customizations.themeSettings,
      },
    };

    return apiData;
  }

  /**
   * Generate files from skeleton structure
   * @param {Object} skeleton - Skeleton schema
   * @param {Object} customizations - User customizations
   * @returns {Object} File map
   */
  static generateFilesFromSkeleton(skeleton, customizations = {}) {
    const files = {};

    // Add page content files
    skeleton.structure.forEach((item) => {
      const location = `pages/${item.slug}/index.html`;
      files[location] = item.content || "";
    });

    // Reference skeleton files for backend to fetch
    if (skeleton.files && skeleton.files.length > 0) {
      skeleton.files.forEach((filePath) => {
        files[`files/${filePath}`] = `[SKELETON_FILE_REFERENCE:${filePath}]`;
      });
    }

    return files;
  }

  /**
   * Rewrite skeleton UUIDs for new site creation
   * @param {Object} skeleton - Original skeleton
   * @returns {Object} Skeleton with new UUIDs
   */
  static rewriteSkeletonUuids(skeleton) {
    const oldToNewMap = new Map();

    // Create new UUIDs for all items first
    skeleton.structure.forEach((item) => {
      if (item.id) {
        oldToNewMap.set(item.id, generateResourceID(''));
      }
    });

    // Rewrite structure with new UUIDs and update parent references
    const newStructure = skeleton.structure.map((item) => {
      const newItem = { ...item };

      if (item.id) {
        newItem.id = oldToNewMap.get(item.id);
      }

      if (item.parent && oldToNewMap.has(item.parent)) {
        newItem.parent = oldToNewMap.get(item.parent);
      }

      return newItem;
    });

    // Also rewrite UUIDs in theme settings regions if they exist
    const newTheme = { ...skeleton.theme };
    if (newTheme.settings && newTheme.settings.regions) {
      const newRegions = { ...newTheme.settings.regions };
      Object.keys(newRegions).forEach((regionKey) => {
        const region = newRegions[regionKey];
        if (region && typeof region === "object") {
          // Check if region has UUID references that need updating
          Object.keys(region).forEach((prop) => {
            const value = region[prop];
            if (typeof value === "string" && oldToNewMap.has(value)) {
              region[prop] = oldToNewMap.get(value);
            } else if (Array.isArray(value)) {
              // Handle arrays that might contain UUIDs
              region[prop] = value.map((item) =>
                typeof item === "string" && oldToNewMap.has(item)
                  ? oldToNewMap.get(item)
                  : item,
              );
            }
          });
        }
      });
      newTheme.settings.regions = newRegions;
    }

    return {
      ...skeleton,
      structure: newStructure,
      theme: newTheme,
      meta: {
        ...skeleton.meta,
        created: new Date().toISOString(),
        sourceUuids: "rewritten",
      },
    };
  }
}

export default SiteSkeletonGenerator;
