/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { pathFromUrl } from "@polymer/polymer/lib/utils/resolve-url.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";

/**
 * `h5p-element`
 * `h5p wrapper for loading and presenting .h5p files`
 *
 * @microcopy - language worth noting:
 *  - h5p is it's own eco system, we're just trying to wrap it a bit
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
class H5PElement extends LitElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "h5p-element";
  }

  // life cycle
  constructor() {
    super();
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(H5PElement.haxProperties, H5PElement.tag, this);
    // make a random ID for the targeting
    this.contentId = this.generateUUID();
    // should kick off all dependencies to start loading on window
    this.H5PDepsLoader();
  }
  /**
   * This breaks shadowRoot in LitElement
   */
  createRenderRoot() {
    return this;
  }
  /**
   * load dependencies that need to be global in scope
   */
  async H5PDepsLoader() {
    window.ESGlobalBridge.requestAvailability();
    const basePath =
      pathFromUrl(decodeURIComponent(import.meta.url)) + "lib/h5p/";
    this.h5pJSDeps = [
      basePath + "js/jquery.js",
      basePath + "js/h5p.js",
      basePath + "js/h5p-event-dispatcher.js",
      basePath + "js/h5p-content-type.js",
      basePath + "js/h5p-action-bar.js",
      basePath + "js/h5p-confirmation-dialog.js",
      basePath + "js/h5p-x-api-event.js",
      basePath + "js/h5p-x-api.js"
    ];
    this.__h5pDepsLength = this.h5pJSDeps.length - 1;
    await window.ESGlobalBridge.instance.load(
      "h5p-jquery",
      basePath + "js/jquery.js"
    );
    window.addEventListener(
      "es-bridge-h5p-jquery-loaded",
      this.h5pJqueryReady.bind(this)
    );
    window.addEventListener(
      "es-bridge-h5p-" + this.__h5pDepsLength + "-loaded",
      this.h5pReadyCallback.bind(this)
    );
  }
  generateUUID() {
    return "item-sss-ss-ss".replace(/s/g, this._uuidPart);
  }
  _uuidPart() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  firstUpdated() {
    if (
      window.ESGlobalBridge.imports["h5p-" + this.__h5pDepsLength] &&
      this.contentId
    ) {
      this.setupH5P(this.contentId);
    }
  }
  async h5pJqueryReady(e) {
    for (var i in this.h5pJSDeps) {
      await window.ESGlobalBridge.instance.load("h5p-" + i, this.h5pJSDeps[i]);
    }
  }
  h5pReadyCallback(e) {
    if (this.contentId) {
      this.setupH5P(this.contentId);
    }
  }
  /**
   * This does the heavy lifting to kick it off
   */
  async setupH5P(id = 1, displayOptions = {}) {
    ({
      frame: displayOptions.frame = false,
      copyright: displayOptions.copyright = false,
      embed: displayOptions.embed = false,
      download: displayOptions.download = false,
      icon: displayOptions.icon = false,
      export: displayOptions.export = false
    } = displayOptions);
    const basePath =
      pathFromUrl(decodeURIComponent(import.meta.url)) + "lib/h5p/";

    H5PIntegration.core = {
      styles: [
        basePath + "styles/h5p.css",
        basePath + "styles/h5p-confirmation-dialog.css",
        basePath + "styles/h5p-core-button.css"
      ],
      scripts: this.h5pJSDeps
    };
    let frag = document.createRange().createContextualFragment(`
    <div class="h5p-iframe-wrapper" style="background-color:#DDD;">
      <iframe id="h5p-iframe-${id}" class="h5p-iframe" data-content-id="${id}" style="width: 100%; height: 100%; border: none; display: block;" src="about:blank" frameBorder="0"></iframe>
    </div>
    `);
    this.querySelector(
      '[data-content-id="wrapper-' + this.contentId + '"'
    ).appendChild(frag);

    let stand = await new H5PStandalone(id, this.source, displayOptions);
    await stand.init();
    // clear previous calls to this exact thing
    // this accounts for multiples on the DOM and the exccess
    // file parsing required per each in order to use this thing
    clearTimeout(window.__H5PBridgeTimeOut);
    window.__H5PBridgeTimeOut = setTimeout(() => {
      window.H5P.init();
    }, 100);
  }
  /**
   * life cycle, element removed from DOM
   */
  disconnectedCallback() {
    window.removeEventListener(
      "es-bridge-h5p-" + this.__h5pDepsLength + "-loaded",
      this.h5pReadyCallback.bind(this)
    );
    window.removeEventListener(
      "es-bridge-h5p-jquery-loaded",
      this.h5pJqueryReady.bind(this)
    );
    super.disconnectedCallback();
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {});
  }
}
customElements.define("h5p-element", H5PElement);
window.H5P = window.H5P || {};

window.H5PIntegration = window.H5PIntegration || {};

H5PIntegration.l10n = {
  H5P: {
    advancedHelp:
      "Include this script on your website if you want dynamic sizing of the embedded content:",
    author: "Author",
    by: "by",
    close: "Close",
    contentChanged: "This content has changed since you last used it.",
    copyrightInformation: "Rights of use",
    copyrights: "Rights of use",
    copyrightsDescription: "View copyright information for this content.",
    disableFullscreen: "Disable fullscreen",
    download: "Download",
    downloadDescription: "Download this content as a H5P file.",
    embed: "Embed",
    embedDescription: "View the embed code for this content.",
    fullscreen: "Fullscreen",
    h5pDescription: "Visit H5P.org to check out more cool content.",
    hideAdvanced: "Hide advanced",
    license: "License",
    noCopyrights: "No copyright information available for this content.",
    showAdvanced: "Show advanced",
    showLess: "Show less",
    showMore: "Show more",
    size: "Size",
    source: "Source",
    startingOver: "You'll be starting over.",
    subLevel: "Sublevel",
    thumbnail: "Thumbnail",
    title: "Title",
    year: "Year"
  }
};

class H5PStandalone {
  constructor(id = 1, pathToContent, displayOptions) {
    this.id = id;
    this.path = pathToContent;
    this.displayOptions = displayOptions;
    return true;
  }
  getJSONPromise(url) {
    return fetch(url).then(function(response) {
      return response.json();
    });
  }
  /**
   * Initialize the H5P
   */
  async init() {
    this.h5p = await this.getJSONPromise(`${this.path}/h5p.json`);
    this.content = JSON.stringify(
      await this.getJSONPromise(`${this.path}/content/content.json`)
    );
    window.H5PIntegration.pathIncludesVersion = this.pathIncludesVersion = await this.checkIfPathIncludesVersion();

    this.mainLibrary = await this.findMainLibrary();

    const dependencies = await this.findAllDependencies();

    const { styles, scripts } = await this.sortDependencies(dependencies);

    H5PIntegration.url = this.path;
    H5PIntegration.contents = H5PIntegration.contents
      ? H5PIntegration.contents
      : {};
    H5PIntegration.contents["cid-" + this.id] = {
      library: `${this.mainLibrary.machineName} ${
        this.mainLibrary.majorVersion
      }.${this.mainLibrary.minorVersion}`,
      jsonContent: this.content,
      styles: styles,
      scripts: scripts,
      displayOptions: this.displayOptions
    };
    return true;
  }

  /**
   * Check if the library folder include the version or not
   * This was changed at some point in H5P and we need to be backwards compatible
   *
   * @return {boolean}
   */
  async checkIfPathIncludesVersion() {
    let dependency = this.h5p.preloadedDependencies[0];
    let machinePath =
      dependency.machineName +
      "-" +
      dependency.majorVersion +
      "." +
      dependency.minorVersion;

    let pathIncludesVersion;

    try {
      await this.getJSONPromise(`${this.path}/${machinePath}/library.json`);
      pathIncludesVersion = true;
    } catch (e) {
      pathIncludesVersion = false;
    }
    return pathIncludesVersion;
  }

  /**
   * return the path to a library
   * @param {object} library
   * @return {string}
   */
  libraryPath(library) {
    return (
      library.machineName +
      (this.pathIncludesVersion
        ? "-" + library.majorVersion + "." + library.minorVersion
        : "")
    );
  }

  /**
   * FInd the main library for this H5P
   * @return {Promise}
   */
  findMainLibrary() {
    const mainLibraryInfo = this.h5p.preloadedDependencies.find(
      dep => dep.machineName === this.h5p.mainLibrary
    );

    this.mainLibraryPath =
      this.h5p.mainLibrary +
      (this.pathIncludesVersion
        ? "-" +
          mainLibraryInfo.majorVersion +
          "." +
          mainLibraryInfo.minorVersion
        : "");
    return this.getJSONPromise(
      `${this.path}/${this.mainLibraryPath}/library.json`
    );
  }

  /**
   * find all the libraries used in this H5P
   * @return {Promise}
   */
  findAllDependencies() {
    const directDependencyNames = this.h5p.preloadedDependencies.map(
      dependency => this.libraryPath(dependency)
    );

    return this.loadDependencies(directDependencyNames, []);
  }

  /**
   * searches through all supplied libraries for dependencies, this is recursive and repeats until all deep dependencies have been found
   * @param {string[]} toFind list of libraries to find the dependencies of
   * @param {string[]} alreadyFound the dependencies that have already been found
   */
  async loadDependencies(toFind, alreadyFound) {
    // dependencyDepth++;
    let dependencies = alreadyFound;
    let findNext = [];
    let newDependencies = await Promise.all(
      toFind.map(libraryName => this.findLibraryDependencies(libraryName))
    );
    // loop over newly found libraries
    newDependencies.forEach(library => {
      // push into found list
      dependencies.push(library);
      // check if any dependencies haven't been found yet
      library.dependencies.forEach(dependency => {
        if (
          !dependencies.find(
            foundLibrary => foundLibrary.libraryPath === dependency
          ) &&
          !newDependencies.find(
            foundLibrary => foundLibrary.libraryPath === dependency
          )
        ) {
          findNext.push(dependency);
        }
      });
    });

    if (findNext.length > 0) {
      return this.loadDependencies(findNext, dependencies);
    }
    return dependencies;
  }

  /**
   * Loads a dependencies library.json and finds the libraries it dependson as well ass the JS and CSS it needs
   * @param {string} libraryName
   */
  async findLibraryDependencies(libraryName) {
    const library = await this.getJSONPromise(
      `${this.path}/${libraryName}/library.json`
    );
    const libraryPath = this.libraryPath(library);

    let dependencies = [];
    if (library.preloadedDependencies) {
      dependencies = library.preloadedDependencies.map(dependency =>
        this.libraryPath(dependency)
      );
    }

    return {
      libraryPath,
      dependencies,
      preloadedCss: library.preloadedCss,
      preloadedJs: library.preloadedJs
    };
  }

  /**
   * Resolves the library dependency tree and sorts the JS and CSS files into order
   * @param {object[]} dependencies
   * @return {object}
   */
  async sortDependencies(dependencies) {
    const dependencySorter = new Toposort();
    let CSSDependencies = {};
    let JSDependencies = {};

    dependencies.forEach(dependency => {
      dependencySorter.add(dependency.libraryPath, dependency.dependencies);

      if (dependency.preloadedCss) {
        CSSDependencies[dependency.libraryPath] = CSSDependencies[
          dependency.libraryPath
        ]
          ? CSSDependencies[dependency.libraryPath]
          : [];
        dependency.preloadedCss.forEach(style => {
          CSSDependencies[dependency.libraryPath].push(
            `${this.path}/${dependency.libraryPath}/${style.path}`
          );
        });
      }

      if (dependency.preloadedJs) {
        JSDependencies[dependency.libraryPath] = JSDependencies[
          dependency.libraryPath
        ]
          ? JSDependencies[dependency.libraryPath]
          : [];
        dependency.preloadedJs.forEach(script => {
          JSDependencies[dependency.libraryPath].push(
            `${this.path}/${dependency.libraryPath}/${script.path}`
          );
        });
      }
    });

    let styles = [];
    let scripts = [];

    dependencySorter
      .sort()
      .reverse()
      .forEach(function(dependencyName) {
        Array.prototype.push.apply(styles, CSSDependencies[dependencyName]);
        Array.prototype.push.apply(scripts, JSDependencies[dependencyName]);
      });

    Array.prototype.push.apply(
      styles,
      this.mainLibrary.preloadedCss.map(
        style => `${this.path}/${this.mainLibraryPath}/${style.path}`
      )
    );
    Array.prototype.push.apply(
      scripts,
      this.mainLibrary.preloadedJs.map(
        script => `${this.path}/${this.mainLibraryPath}/${script.path}`
      )
    );

    return { styles, scripts };
  }
}

class Toposort {
  constructor() {
    this.edges = [];
  }
  /**
   * Adds dependency edges.
   *
   * @since   0.1.0
   * @param   {String} item               An dependent name. Must be an string and not empty
   * @param   {String[]|String} [deps]    An dependency or array of dependencies
   * @returns {Toposort}                  The Toposort instance
   */
  add(item, deps) {
    if (typeof item !== "string" || !item) {
      throw new TypeError("Dependent name must be given as a not empty string");
    }

    deps = Array.isArray(deps) ? deps : [deps];

    if (deps.length > 0) {
      for (let dep of deps) {
        if (typeof dep !== "string" || !dep) {
          throw new TypeError(
            "Dependency name must be given as a not empty string"
          );
        }

        this.edges.push([item, dep]);
      }
    } else {
      this.edges.push([item]);
    }

    return this;
  }

  /**
   * Runs the toposorting and return an ordered array of strings
   *
   * @since   0.1.0
   * @returns {String[]}  The list of items topologically sorted.
   */
  sort() {
    let nodes = [];

    //accumulate unique nodes into a large list
    for (let edge of this.edges) {
      for (let node of edge) {
        if (nodes.indexOf(node) === -1) {
          nodes.push(node);
        }
      }
    }

    //initialize the placement of nodes into the sorted array at the end
    let place = nodes.length;

    //initialize the sorted array with the same length as the unique nodes array
    let sorted = new Array(nodes.length);

    //define a visitor function that recursively traverses dependencies.
    var visit = (node, predecessors) => {
      //check if a node is dependent of itself
      if (predecessors.length !== 0 && predecessors.indexOf(node) !== -1) {
        throw new Error(
          `Cyclic dependency found. ${node} is dependent of itself.\nDependency chain: ${predecessors.join(
            " -> "
          )} => ${node}`
        );
      }

      let index = nodes.indexOf(node);

      //if the node still exists, traverse its dependencies
      if (index !== -1) {
        let copy = false;

        //mark the node as false to exclude it from future iterations
        nodes[index] = false;

        //loop through all edges and follow dependencies of the current node
        for (let edge of this.edges) {
          if (edge[0] === node) {
            //lazily create a copy of predecessors with the current node concatenated onto it
            copy = copy || predecessors.concat([node]);

            //recurse to node dependencies
            visit(edge[1], copy);
          }
        }

        //add the node to the next place in the sorted array
        sorted[--place] = node;
      }
    };

    for (let i = 0; i < nodes.length; i++) {
      let node = nodes[i];

      //ignore nodes that have been excluded
      if (node !== false) {
        //mark the node as false to exclude it from future iterations
        nodes[i] = false;

        //loop through all edges and follow dependencies of the current node
        for (let edge of this.edges) {
          if (edge[0] === node) {
            //recurse to node dependencies
            visit(edge[1], [node]);
          }
        }

        //add the node to the next place in the sorted array
        sorted[--place] = node;
      }
    }

    return sorted;
  }

  /**
   * Clears edges
   *
   * @since   0.4.0
   * @returns {Toposort}                  The Toposort instance
   */
  clear() {
    this.edges = [];

    return this;
  }
}

export { H5PElement, H5PStandalone, Toposort };
