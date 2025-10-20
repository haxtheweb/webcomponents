/**
 * Skeleton Loader Utility
 * 
 * Handles loading and processing skeleton files for the app-hax v2 system.
 * Since skeleton files now match the createSite API format directly,
 * this utility focuses on loading, validation, and metadata extraction.
 */

export class SkeletonLoader {
  
  /**
   * Load skeleton from JSON data and prepare for app-hax usage
   * @param {Object} skeletonData - Raw skeleton JSON data
   * @param {Object} options - Loading options
   * @returns {Object} Processed skeleton ready for app-hax
   */
  static loadSkeleton(skeletonData, options = {}) {
    // Validate skeleton format
    if (!this.isValidSkeleton(skeletonData)) {
      throw new Error('Invalid skeleton format');
    }
    
    // Extract metadata for app-hax use case display
    const useCaseData = {
      dataType: 'skeleton',
      useCaseTitle: skeletonData.meta.useCaseTitle || skeletonData.meta.name,
      useCaseDescription: skeletonData.meta.useCaseDescription || skeletonData.meta.description,
      useCaseImage: skeletonData.meta.useCaseImage || options.defaultImage || '',
      useCaseIcon: options.defaultIcons || [{ icon: 'hax:site', tooltip: 'Site Template' }],
      useCaseTag: this.extractTags(skeletonData),
      demoLink: skeletonData.meta.sourceUrl || '#',
      originalData: skeletonData,
      
      // App-hax specific properties
      isSelected: false,
      showContinue: false
    };
    
    return {
      // Use case display data
      ...useCaseData,
      
      // Direct createSite API data (no transformation needed)
      createSiteData: {
        site: skeletonData.site,
        build: skeletonData.build,
        theme: skeletonData.theme
      }
    };
  }
  
  /**
   * Extract tags for filtering from skeleton
   * @param {Object} skeleton - Skeleton data
   * @returns {Array} Tags array
   */
  static extractTags(skeleton) {
    const tags = [];
    
    // Add categories and tags from meta
    if (skeleton.meta.category && Array.isArray(skeleton.meta.category)) {
      tags.push(...skeleton.meta.category);
    }
    if (skeleton.meta.tags && Array.isArray(skeleton.meta.tags)) {
      tags.push(...skeleton.meta.tags);
    }
    
    // Add build type as tag
    if (skeleton.build && skeleton.build.type) {
      tags.push(skeleton.build.type);
    }
    
    // Add theme as tag
    if (skeleton.site && skeleton.site.theme) {
      tags.push(`theme-${skeleton.site.theme}`);
    }
    
    // Deduplicate and filter empty
    return [...new Set(tags.filter(tag => tag && tag.trim() !== ''))];
  }
  
  /**
   * Validate skeleton format
   * @param {Object} skeleton - Skeleton to validate
   * @returns {boolean} Is valid skeleton
   */
  static isValidSkeleton(skeleton) {
    if (!skeleton || typeof skeleton !== 'object') return false;
    
    // Check required top-level structure
    if (!skeleton.meta || skeleton.meta.type !== 'skeleton') return false;
    if (!skeleton.site || !skeleton.build) return false;
    
    // Check site structure
    if (!skeleton.site.name || !skeleton.site.theme) return false;
    
    // Check build structure  
    if (!skeleton.build.items || !Array.isArray(skeleton.build.items)) return false;
    
    return true;
  }
  
  /**
   * Load multiple skeletons from an array of skeleton data
   * @param {Array} skeletonArray - Array of skeleton JSON objects
   * @param {Object} options - Loading options
   * @returns {Array} Array of processed skeletons
   */
  static loadSkeletons(skeletonArray, options = {}) {
    if (!Array.isArray(skeletonArray)) {
      throw new Error('Expected array of skeletons');
    }
    
    return skeletonArray
      .map((skeleton, index) => {
        try {
          return this.loadSkeleton(skeleton, {
            ...options,
            index
          });
        } catch (error) {
          console.warn(`Failed to load skeleton at index ${index}:`, error);
          return null;
        }
      })
      .filter(Boolean); // Remove failed loads
  }
  
  /**
   * Apply user customizations to skeleton createSite data
   * @param {Object} skeleton - Processed skeleton from loadSkeleton()
   * @param {Object} customizations - User customizations
   * @returns {Object} CreateSite data with customizations applied
   */
  static applyCustomizations(skeleton, customizations = {}) {
    const createSiteData = JSON.parse(JSON.stringify(skeleton.createSiteData)); // Deep clone
    
    // Apply site customizations
    if (customizations.siteName) {
      createSiteData.site.name = customizations.siteName;
    }
    if (customizations.siteDescription) {
      createSiteData.site.description = customizations.siteDescription;
    }
    if (customizations.theme) {
      createSiteData.site.theme = customizations.theme;
    }
    
    // Apply theme customizations
    if (customizations.color) {
      createSiteData.theme.color = customizations.color;
    }
    if (customizations.icon) {
      createSiteData.theme.icon = customizations.icon;
    }
    
    // Apply any additional theme settings
    if (customizations.themeSettings) {
      Object.assign(createSiteData.theme, customizations.themeSettings);
    }
    
    return createSiteData;
  }
  
  /**
   * Generate skeleton metadata for directory processing
   * @param {Object} skeleton - Skeleton data
   * @returns {Object} Metadata for backend use
   */
  static generateSkeletonMetadata(skeleton) {
    return {
      name: skeleton.meta.name,
      title: skeleton.meta.useCaseTitle || skeleton.meta.name,
      description: skeleton.meta.useCaseDescription || skeleton.meta.description,
      type: skeleton.build.type || 'skeleton',
      theme: skeleton.site.theme,
      itemCount: skeleton.build.items ? skeleton.build.items.length : 0,
      fileCount: skeleton.build.files ? skeleton.build.files.length : 0,
      created: skeleton.meta.created,
      tags: this.extractTags(skeleton),
      sourceUrl: skeleton.meta.sourceUrl || null
    };
  }
}

export default SkeletonLoader;