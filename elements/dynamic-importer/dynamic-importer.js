import { pathFromUrl } from "@polymer/polymer/lib/utils/resolve-url.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
// This allows for using import and import.meta to loop through and dynamically import references
export const DynamicImporter = function(SuperClass) {
  return class extends SuperClass {
    /**
     * Connected life cycle so it's a late import and AFTER 1st paint
     */
    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      afterNextRender(this, function() {
        this.runLazyImport();
      });
    }
    /**
     * Object containing the element references (as node modules) to import.
     * Format as tag-name : @path/to/the/file.js
     * This should be defined in the element implementing it
     */
    dynamicImports() {
      return {};
    }
    /**
     * Lazy import things required for this element to operate.
     * This is especially useful when trying to cheat on dom timing
     * to increase the speed to first paint. This is not recommended for everything
     * but for critical path to spin up it can definitely cheat on some timing
     * issues inherit to the way ES Modules work. Namely, spiding the tree before starting
     * to process the JS bundle as a single thing
     */
    runLazyImport() {
      const basePath = pathFromUrl(decodeURIComponent(import.meta.url));
      const imports = this.dynamicImports();
      for (var i in imports) {
        // only import if we don't currently have a global definition for this tag
        if (!window.customElements.get(i)) {
          // we are 3 levels below something else
          import(`${basePath}../../${imports[i]}`)
            .then(response => {
              // this means it worked
              //console.log(response);
            })
            .catch(error => {
              /* Error handling */
              //console.log(error);
            });
        } else {
          //console.log(i + ' already defined, skipped');
        }
      }
    }
  };
};
