/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
 import { LitElement, html, css } from "lit-element/lit-element.js";

 /**
  * `end-user-doc`
  * `given an array of feature documentation, will generate end user documentation (good for modular, customizable tools where documentation whould be based on what is enabled or added on)`
  * @demo demo/index.html
  * @demo demo/demo.html demo-mode
  * @demo demo/schema.html schema
  * @element end-user-doc
  */
 class EndUserDoc extends LitElement {
   //styles function
   static get styles() {
     return [
       css`
         :host {
           display: block;
           color: #444;
           font-weight: 300;
           font-family: sans-serif;
         }
         :host([hidden]) {
           display: none;
         }
         h1,h2,h3,h4,h5,h6,caption {
          font-family: serif;
         }
         ol[part=upper-roman]{
           list-style: upper-roman;
         }
         ol[part=upper-alpha]{
           list-style: upper-alpha;
         }
         ol[part=lower-alpha]{
           list-style: lower-alpha;
         }
         ol[part=lower-roman]{
           list-style: lower-roman;
         }
         table {
          border-collapse: collapse;
         }
         caption {
           color: #000; 
           text-align: left;
           font-weight: bold;
         }
         th {
           font-weight: 400;
         }
         th,td {
           border: 1px solid #999;
           padding: 2px 5px;
         }
         thead tr {
           background-color: #f0f0f0;
           color: #000; 
         }
         tbody tr:nth-child(2n+1){
           background-color: #f8f8f8;
         }
         figure {
          display: inline-flex;
          width: min-content;
          flex-direction: column;
         }
         figcaption {
           font-size: 85%;
         }
         img[part=image] {
           display: block;
         }
         table, 
         figure, 
         img[part=image], 
         p, 
         ol {
          margin: 1em 0;
         }
         li > ol {
          margin: 0.25em 0 0.5em;
         }
         img[part=image],figure,table {
           max-width: 100%;
         }
         table:first-child, 
         figure:first-child, 
         img[part=image]:first-child,
         p:first-child, 
         ol:first-child {
          margin-top: 0 ;
         }
         table:last-child, 
         figure:last-child, 
         img[part=image]:last-child,
         p:last-child, 
         ol:last-child, 
         li:last-child > ol {
          margin-bottom: 0;
         }
         li > ol:last-child {
          margin-bottom: 0.5em;
         }
       `,
     ];
   }
  /**
   * a schema object that can be rendered in demo mode
   *
   * @readonly
   * @memberof EndUserDoc
   */
  get demoContents(){
    return {
    id: "demo",
    title: "End User Documentation",
    contents: [
      { 
        id: "laptop-banner",
        alt: "laptop computer with coffee and sketch notebook",
        src: "https://picsum.photos/id/2/400/150", 
        srcset: "https://picsum.photos/id/2/400/150 400w, https://picsum.photos/id/2/800/175 800w, https://picsum.photos/id/2/1200/200 1200w, https://picsum.photos/id/2/1600/225 1600w",
        sizes: "(max-width: 400px) 400px, (max-width: 800px) 800px, (max-width: 1200px) 1200px, 1600px",
      },
      html`<p>Welcome!</p>`,
      {
        id: "gettingstarted",
        title: "Getting Started",
        contents: [
          { alt: "", src: ""},
          {
            listStyle: "decimal lower-alpha",
            steps: [
              "Step one.",
              [
                "step 1a.",
                "step 1b.",
              ],
              "Step two.", 
              "Step three."
            ]
          }
        ]
      },
      {
        id: "keyboardshortcuts",
        title: "Keyboard Shortcuts",
        cheatsheet: {
          columns: ["Shortcut","Description"],
          rows: [
            [html`<kbd>ctrl+x</kbd>`,"cut"],
            [html`<kbd>ctrl+x</kbd>`,"copy"],
            [html`<kbd>ctrl+x</kbd>`,"paste"]
          ]
        },
      },
      {
        id: "feature",
        title: "Feature",
        contents: [
          html`<p>Overview of this feature</p>`,
          { 
            id: "laptop",
            alt: "laptop computer with coff and mobile phone", 
            src: "https://picsum.photos/id/0/400/300", 
            caption: "Features you can access on your laptop"
          },
          {
            id: "feature-usecase-x",
            title: "Using Feature to X",
            contents: [
              {
                steps: [
                  "Step one.",
                  "Step two.",
                  [
                    "step 2a.",
                    "step 2b."
                  ],
                  "Step three."
                ]
              }
            ]
          },
          {
            id: "feature-usecase-y",
            title: "Using Feature to y",
            contents: [
              {
                listStyle: "upper-alpha",
                steps: [
                  "Step A.",
                  "Step B."
                ]
              }
            ]
          }
        ]
      }
      
    ]
  }
  }
  /**
   * creates an object that lists content by id
   *
   * @readonly
   * @memberof EndUserDoc
   */
  get contentsById(){
    let contentById = {},
      getIDs = (contents) => {
        //get content id but only if it is unique so far
        if(contents.id && !contentById[contents.id]) contentById[contents.id] = contents;
        //get subsection content as well
        if(typeof contents == "object") (contents.contents || []).forEach(item=>getIDs(item));
      };
    if(this.contents) getIDs(this.contents);
  return contentById;
  }
  /**
   * creates an object that lists parents by id of its content
   *
   * @readonly
   * @memberof EndUserDoc
   */
  get parentByContentId(){
    let contentById = {},
      getIDs = (contents,parent) => {
        //get content id but only if it has a parent and is unique so far
        if(parent && contents.id && !contentById[contents.id]) contentById[contents.id] = parent;
        //get subsection content as well
        if(typeof contents == "object") (contents.contents || []).forEach(item=>getIDs(item,contents));
      };
    if(this.contents) getIDs(this.contents,undefined);
  return contentById;
  }
  /**
   * adds new content at beginiing of section with given id
   * @param {object} schema schema of content to be added
   * @param {string} sectionId section id where content will be appended 
   * @returns {boolean} whether successful
   */
  appendToSection(schema,sectionId){
    return this.insertIntoSection(schema,sectionId);
  }
  /**
   * 
   * adds new content at end of section with given id
   * @param {object} schema schema of content to be added
   * @param {string} sectionId section id where content will be prepended 
   * @returns {boolean} whether successful
   */
  prependToSection(schema,sectionId){
    return this.insertIntoSection(schema,sectionId,0);
  }
  /**
   * 
   * inserts content before a sibling with given id
   * @param {object} schema schema of content to be added
   * @param {string} siblingId sibling id of before which content will be inserted
   * @returns {boolean} whether successful
   */
  insertIntoSectionBefore(schema,siblingId) {
    let section = siblingId && this.parentByContentId[siblingId] 
        ? this.parentByContentId[siblingId]
        : undefined,
      index = this._getContentIndexById(siblingId,section);
    return index && this.insertIntoSection(schema,section.id,index);
  }
  /**
   * inserts content after a sibling with given id
   * @param {object} schema schema of content to be added
   * @param {string} siblingId sibling id of after which content will be inserted
   * @returns {boolean} whether successful
   */
  insertIntoSectionAfter(schema,siblingId){
    let section = siblingId && this.parentByContentId[siblingId] 
        ? this.parentByContentId[siblingId]
        : undefined,
      index = this._getContentIndexById(siblingId,section);
      return index && this.insertIntoSection(schema,section.id,index+1);
  }
  /**
   * 
   * replaces content of a given in a section with given id
   * @param {object} schema schema of content to be added
   * @param {string} replaceId sibling id of after which content will be inserted
   * @returns {boolean} whether successful
   */
  replaceSectionContent(schema,replaceId){
    let section = replaceId && this.parentByContentId[replaceId] 
        ? this.parentByContentId[replaceId]
        : undefined,
      index = this._getContentIndexById(replaceId,section);
      return index && this.insertIntoSection(schema,section.id,index,true);
  }
  /**
   * removes content with a given Id
   * @param {string} id id of content to remove
   * @returns {boolean} whether successful
   */
  removeSectionContent(id){
    let section = id && this.parentByContentId[id] 
        ? this.parentByContentId[id] 
        : undefined,
      index = this._getContentIndexById(id,section);
    return index && this.insertIntoSection([],section.id,index,true);
  }
  /**
   * 
   * adds new content into section with given id at a given index
   * @param {object} schema schema of content to be added
   * @param {*} sectionId id of section where section content will be inserted
   * @param {*} index index where section content will be inserted
   * @param {boolean} replace if given, replaces idem currently at index
   * @returns {boolean} whether successful
   */
  insertIntoSection(schema,sectionId,index,replace=false){
    if(!schema) return false;
    let section = sectionId && this.contentsById[sectionId] 
      ? this.contentsById[sectionId]
      : undefined;
    const sectionContents = section && section.id && section.contents
      ? [...section.contents]
      : undefined;
    let replaceItems = replace ? 1 : 0;
    if(!sectionContents) return false;
    if(typeof index == typeof undefined || index > sectionContents.length) index = sectionContents.length;
    if(Array.isArray(schema)){
      sectionContents.splice(index,replaceItems,...schema);
    } else {
      sectionContents.splice(index,replaceItems,schema);
    }
    this.contentsById[sectionId].contents = [...sectionContents];
    this.requestUpdate();
    return true;
  }

  /**
   * index of where content appears in section
   * @param {string} id unique Id of content
   * @param {object} section section that contains content
   * @returns {number} 
   */
  _getContentIndexById(id,section){
    let parentContents = section && section.id && section.contents
        ? section.contents
        : undefined,
      content = this.contentsById[id];
    return content && parentContents && parentContents.indexOf(content) 
        ? parentContents.indexOf(content) 
        : undefined;
  }

  /**
   * adds cheat to end of a cheat sheet
   * @param {array} cheat array of row info for a cheat on cheatsheet table
   * @param {string} sheetId id of cheatsheet where cheat row will be inserted
   * @returns {boolean} whether successful
   */
  appendCheat(cheat,sheetId){
    if(!cheat || !Array.isArray(cheat) || cheat.length < 1) return false;
    return this.insertCheatAt(cheat,sheetId);
  }
  /**
   * adds cheat to beginning of a cheat sheet
   * @param {array} cheat array of row info for a cheat on cheatsheet table
   * @param {string} sheetId id of cheatsheet where cheat row will be inserted
   * @returns {boolean} whether successful
   */
  prependCheat(cheat,sheetId){
    if(!cheat || !Array.isArray(cheat) || cheat.length < 1) return false;
    return this.insertCheatAt(cheat,sheetId,0);
  }
  /**
   * adds cheat to a sheet with given id before a given sibling
   * @param {array} cheat array of row info for a cheat on cheatsheet table
   * @param {array} sibling array of row info for a reference cheat next to the one to be inserted
   * @param {string} sheetId id of cheatsheet where cheat row will be inserted
   * @returns {boolean} whether successful
   */
  insertCheatBefore(cheat,sibling,sheetId){
    if(!cheat || !Array.isArray(cheat) || cheat.length < 1) return false;
    let index = this._getCheatIndexById(sibling,sheetId);
    return index && this.insertCheatAt(cheat,sheetId,index);
  }
  /**
   * adds cheat to a sheet with given id after a given sibling
   * @param {array} cheat array of row info for a cheat on cheatsheet table
   * @param {array} sibling array of row info for a reference cheat next to the one to be inserted
   * @param {string} sheetId id of cheatsheet where cheat row will be inserted
   * @returns {boolean} whether successful
   */
  insertCheatAfter(cheat,sibling,sheetId){
    if(!cheat || !Array.isArray(cheat) || cheat.length < 1) return false;
    let index = this._getCheatIndexById(sibling,sheetId);
    return index && this.insertCheatAt(cheat,sheetId,index+1);
  }
  /**
   * 
   * replaces cheat on a sheet with given id
   * @param {array} newCheat array of row info for a cheat on cheatsheet table
   * @param {array} oldCheat array of row info for a cheat to replace on cheatsheet table
   * @param {string} sheetId id of cheatsheet where cheat row will be inserted
   * @returns {boolean} whether successful
   */
  replaceCheat(newCheat,replaceCheat,sheetId){
    if(!newCheat || !Array.isArray(newCheat) || newCheat.length < 1) return false;
    let index = this._getCheatIndexById(replaceCheat,sheetId,true);
    return index && this.insertCheatAt(newCheat,sheetId,index,true);
  }
  /**
   * adds cheat to a sheet with given id at a given index
   * @param {array} cheat array of row info for a cheat on cheatsheet table
   * @param {string} sheetId id of cheatsheet where cheat row will be inserted
   * @param {number} index index where cheat will be inserted
   * @param {boolean} replace if given, replaces idem currently at index
   * @returns {boolean} whether successful
   */
  insertCheatAt(cheat,sheetId, index, replace=false){
    let rows = this._getRowsBySheetId(sheetId),
      replaceItems = replace ? 1 : 0;
    if(!rows) return false;
    if(typeof index == typeof undefined || index > rows.length) index = rows.length;
    if(cheat.length == 0 || cheat[0] && Array.isArray(cheat[0])) {
      rows.splice(index,replaceItems,...cheat);
    } else {
      rows.splice(index,replaceItems,cheat);
    }
    this.requestUpdate();
    return true;
  }
  /**
   * removes a given cheat from cheatsheet with a given Id
   * @param {array} cheat array of row info for a cheat on cheatsheet table
   * @param {string} sheetId id of cheatsheet where cheat row will be removed
   * @returns {boolean} whether successful
   */
  removeCheat(cheat,sheetId){
    let index = this._getCheatIndexById(cheat,sheetId,true);
    return index && this.insertCheatAt([],sheetId,index,true);
  }
  /**
   * gets cheatsheet rows array if given cheatsheet id
   * @param {string} id unique Id of cheatsheet
   * @returns {array}
   */
  _getRowsBySheetId(id){
    let sheet = id && this.contentsById[id] 
        && this.contentsById[id].cheatsheet 
        ? this.contentsById[id].cheatsheet 
        : undefined;
     return sheet && sheet.rows 
        && Array.isArray(sheet.rows) 
        ? sheet.rows
        : undefined;
  }

  /**
   * index of where cheat appears in cheatsheet
   * @param {object} section section that contains content
   * @param {string} id unique Id of cheatsheet
   * @param {boolean} stringMatch index of doesn't have to be the exact item from the array
   * @returns {number} 
   */
  _getCheatIndexById(cheat,id,stringMatch=false){
    let rows = this._getRowsBySheetId(id),
      findIndex = rows && cheat,
      matchedString = findIndex
        && rows.map(item=>JSON.stringify(item)).indexOf(JSON.stringify(cheat))
        ? rows.map(item=>JSON.stringify(item)).indexOf(JSON.stringify(cheat)) 
        : undefined;
    return matchedString 
      ? matchedString 
      : findIndex && rows.indexOf(cheat) > -1 
      ? rows.indexOf(cheat) 
      : undefined;
  }
 
  // Template return function
  render() {
    let contents = this.demoMode ? this.demoContents : this.contents ? this.contents : undefined;
    return !contents ? '' : this._section(contents,1);
  }
  /**
   * determins if an item is lit html
   * @param {object} item 
   * @returns {boolean}
   */
  _isHTML(item){
    return !!item && typeof item == "object" && item["_$litType$"] && item["_$litType$"] == 1
  }
  /**
   * renders section
   * @param {object} section schema for a section
   * @param {number} level heading level
   * @returns {object} 
   */
  _section(section = {},level = 1){
    return html`
      ${this._heading(section,level)}
      ${this._body(section.contents,level)}
    `;
  }
  /**
   * renders section body content, including any subsections
   * @param {array} section schema for a section contents
   * @param {number} level heading level
   * @returns {object} 
   */
  _body(contents = [],level = 1){
    return html`${(contents).map(item=>
      this._isHTML(item)
        ? item
        : typeof item == "string"
        ? html`<div>${item}</div>`
        : item.steps
        ? this._steps(item.steps,item.listStyle)
        : item.cheatsheet 
        ? this._cheatsheet(item)
        : item.src
        ? this._image(item)
        : item.contents
        ? this._section(item,level+1)
        : ''
      )}`;
  }
  /**
   * renders image
   * @param {object} image schema for image or figure
   * @param {number} level heading level
   * @returns {object} 
   */
  _image(image){
    let img = html`<img 
      part="${image.caption ? 'figure-image' : 'image'}" 
      alt="${image.alt}" 
      src="${image.src}" 
      .srcset="${image.srcset ? image.srcset : ""}"
      .sizes="${image.sizes ? image.sizes : ""}"
      loading="lazy">`;
    return image.caption 
      ? html`
          <div>
            <figure part="figure">
              ${img}
              <figcaption>${image.caption}</figcaption>
            </figure>
          </div>
        `
      : img;
  }

  /**
   * renders cheatsheet table
   * @param {object} item schema for a cheatsheet
   * @returns {object} 
   */
  _cheatsheet(item){
    let cheatsheet = item.cheatsheet;
    return html`
      <table part="cheatsheet">
        ${!item.title ? '' : html`<caption id="${item.id}">${item.title}</caption>`}
        ${!cheatsheet.columns 
          ? '' 
          : html`
            <thead>
              <tr>${cheatsheet.columns.map(column=>html`<th scope="col">${column}</th>`)}</tr>
            </thead>
          `}
        ${!cheatsheet.rows 
          ? '' 
          : html`
            <tbody>
              ${cheatsheet.rows.map(rows=>html`
              <tr>${rows.map(row=>html`<td>${row}</td>`)}</tr>
            `)}
        </tbody>
          `}
      </table>
    `;
  }
  /**
   * renders step-by-step list, including substeps
   * @param {array} steps array of steps that may include nested sybstep arrays
   * @param {string} [listStyles="decimal lower-alpha lower-roman"] numbering style as a space-separated list styles in order of least nested to most nested
   * @returns {object}
   */
  _steps(steps = [],listStyles = "decimal lower-alpha lower-roman"){
    let listArray = listStyles.split(' '),
      childArray = listArray.slice(0 - (listArray.length - 1));

    return !steps || steps.length < 1 ? '' : html`
      <ol part="${listArray[0]}">
        ${steps.map((step,i)=>
          this._isHTML(step) || typeof step == "string" 
          ? html`<li>
            ${step}
            ${typeof steps[i+1] == "object" ? this._steps(steps[i+1],childArray.join(' ')) : ''}
          </li>` 
          : ''
        )}
      </ol>
    `;
  }
  /**
   * renders section heading and/or anchors based on section schema
   * @param {array} section schema for a section contents
   * @param {number} level heading level
   * @returns 
   */
  _heading(section = {},level){
    return section.title && level == 1
      ? html`<h1 id="${section.id}" part="section-heading">${section.title}</h1>`
      : section.title && level == 2
      ? html`<h2 id="${section.id}" part="section-heading">${section.title}</h2>`
      : section.title && level == 3
      ? html`<h3 id="${section.id}" part="section-heading">${section.title}</h3>`
      : section.title && level == 4
      ? html`<h4 id="${section.id}" part="section-heading">${section.title}</h4>`
      : section.title && level == 5
      ? html`<h5 id="${section.id}" part="section-heading">${section.title}</h5>`
      : section.title
      ? html`<h6 id="${section.id}" part="section-heading">${section.title}</h6>`
      : section.id 
      ? html`<a id="${section.id}"></a>` 
      : '';
  }
 
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      /** 
       * schema object of content to be rendered
       */
      contents: {
        attribute: "contents",
        type: Object
      },
      /** 
       * render demo contents instead of contents
       */
      demoMode: {
        attribute: "demo-mode",
        type: Boolean,
        reflect: true
      }
    };
  }
 
   /**
    * Convention we use
    */
   static get tag() {
     return "end-user-doc";
   }
 
   /**
    * HTMLElement
    */
   constructor() {
     super();
   }
   /**
    * LitElement ready
    */
   firstUpdated(changedProperties) {}
   /**
    * LitElement life cycle - property changed
    */
   updated(changedProperties) {
     changedProperties.forEach((oldValue, propName) => {
     });
   }
 }
 customElements.define(EndUserDoc.tag, EndUserDoc);
 export { EndUserDoc };
 