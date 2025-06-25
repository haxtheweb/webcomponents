/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";

/**
 * `glossy-portfolio-grid`
 * 
 * @demo index.html
 * @element glossy-portfolio-grid
 */
export class GlossyPortfolioGrid extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "glossy-portfolio-grid";
  }

  constructor() {
    super();

    this.filtersList = [],
    this.filteredData = [];
    this.activeFilter = '';
    this.__disposer = this.__disposer || [];

    
    // get children, related content, or prev and next pages
    autorun((reaction) => {
      const activeItem = toJS(store.activeItem);
      
      if (activeItem) {
        this.activeItem = activeItem;
        // find parent of activeItem
        this.activeParent = store.findItem(activeItem.parent)||"";
        const children = store.getItemChildren(store.activeId);
        this.title = "";
        this.data = [];
        let tmpData = [];

        if (children && children.length > 0) { //display children if available
          this.data = [...children];
          this.title = this.activeItem?.title || ""; // Use optional chaining and a fallback value       
        
        } else if(this.activeItem.metadata.relatedItems) { //display related items if available

          this.title = "Related Content";
          let relatedItem = store.findItem(activeItem.metadata.relatedItems);      
          if (!this.data.some((item) => item.id === relatedItem.id)) { //check for duplicates
           tmpData.push(relatedItem);
          }
          this.data = [...tmpData];

        } else if(this.activeParent) { //display prev and next pages if available
          this.title = "Related Content";
          let siblingsArray = [...store.getItemChildren(this.activeParent.id)];
          let activeIndex = siblingsArray.findIndex((item) => item.id === this.activeItem.id);
          if (siblingsArray[activeIndex - 1]) { //check for previous item
            tmpData.push(siblingsArray[activeIndex - 1]);
          }
          if (siblingsArray[activeIndex + 1]) { //check for next item
            tmpData.push(siblingsArray[activeIndex + 1]);
          }
          this.data = [...tmpData];
        }
          this.__disposer.push(reaction);
      } 
    });
    
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      filteredData: { type: Array },
      data: { type: Array },
      filtersList: { type: Array },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--text-color);
        z-index: 2;
        width: 100%;

      }
      *{
        box-sizing: border-box;
      }
      button {
        all: unset;
        cursor: pointer;
      }

      .container-background{
        margin: auto;
        max-width: var(--max-width); 
        background-color: var(--bg-color);

        width: 100%;
        padding: var(--page-padding);
        padding-bottom: 30px;
      }
      .projects-header{
        display: flex;
        justify-content: space-between;
        padding: 30px 0;
        height: 35px;
        align-items: center;
        box-sizing: content-box;
        max-width: 100%;
      }
      .grid-title{
        font-size: 1rem;
        font-weight: 800;
        letter-spacing: 1.7px;

      }
      .filters{
        display: flex;
        flex-wrap: wrap;

      }
      .filter:hover, .filter:active, .filter:focus-visible {
        cursor: pointer;
        background-color: #1f1f1f;
  
      }

      .filter{
        font-family: "Inter", "Inter Placeholder", sans-serif;
        font-size: 1rem;
        color: rgb(153, 153, 153);
        padding: 8px 12px;
        border-radius: 24px;
      }
      .card-container {
        display: grid;
        grid-template-columns: repeat(2, minmax(200px, 1fr));
        gap: 45px;
        justify-content: center;
        overflow: hidden;
        max-width: var(--max-width); 
      }

      glossy-portfolio-card{
        height: auto;
      }


      h3 span {
        font-size: var(--glossy-portfolio-label-font-size, var(--ddd-font-size-s));
      }
      .filter.active {
        font-weight: bold;
      }

      @media (max-width: 575.98px) {
        .projects-header{
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
          height: auto;
        }
        .card-container {
         grid-template-columns: 1fr;
         gap: 25px;

        }

      }

    `];
  }

  // Lit render the HTML
  render() {
return html`
${this.data.length > 0 ?   html`        
  <div class="container-background">
    <div class="projects-header">

      <div class="grid-title">${this.title.toUpperCase()}</div>
      <div class="filters">
        ${this.displayFilters()}
      </div>

    </div>
    <div class="card-container">
      ${this.filteredData.map((item)=>{ return html`
          <glossy-portfolio-card class="card" 
          title="${item.title}" 
          thumbnail=${item.metadata.image?
          item.metadata.image
          :store.manifest.metadata.site.logo}
          slug="${item.slug}"
          >
        </glossy-portfolio-card>
        `})}
      </div> 
  </div> `
  :  html``
  }
`;}

  displayFilters() {
    //display/print filters (top left of the grid)

    if(this.filtersList.length > 0){
      return html`
      <button class="filter active" name="all" @click="${this.updateFilter}">All</button>
      ${Array.from(this.filtersList).map((filter) => html`
        <button @click="${this.updateFilter}" name="${filter}"  class="filter"> 
          ${this.capitalizeWords(filter)} 
        </button>
      `)}
    `;
    }

 
  }

  capitalizeWords(sentence) {
    return sentence
      .split(" ")                             
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) 
      .join(" ");                             
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has("data")) {

      // Reset filters and filteredData when data changes (when changing pages)
      if(this.filtersList.length > 0){
        this.activeFilter = "all";
        let all = this.renderRoot.querySelector('[name="all"]');
        all.classList.add('active'); //set active filter to "all"
      }

      
      if(this.data && this.data.length > 0){  
        // if there is data, set filteredData to data and populate filtersList
        this.filteredData = this.data; 
        this.filtersList = [];
        
        this.data.forEach((d) => {
          if (d.metadata.tags !== undefined && d.metadata.tags !== null && d.metadata.tags.split(',').length > 0) {
            const firstTag = d.metadata.tags.split(",")[0];
            if (!this.filtersList.includes(firstTag)) { //check for duplicate
              this.filtersList.push(firstTag);
            }
          }
        });
      }
      
    }

  }

  //called when a filter is clicked
  updateFilter(e){
    const currentTarget = e.currentTarget;
    if (globalThis.document.startViewTransition) {
      globalThis.document.startViewTransition(() => {
        this._updateFilter(currentTarget);
      });
    }
    else {
      this._updateFilter(target, currentTarget);
    }
  }
  _updateFilter(currentTarget){   

    //bold active filter
    const filters = this.renderRoot.querySelectorAll('.filter');
    filters.forEach(el => el.classList.remove('active')); //remove active class from all filters
    currentTarget.classList.add('active');

    //set activeFilter to the name of the clicked filter and call filterData
    this.activeFilter = currentTarget.getAttribute("name"); //filter name: "All" or "Blo"
    this.filterData(this.activeFilter);
  }
      
  // Filter data based on activeFilter
  filterData(){

    if(this.activeFilter === 'all'){
      this.filteredData=this.data;
    } else{
      this.filteredData = [];
      this.filteredData = this.data.filter((item) => 
        item.metadata.tags && item.metadata.tags.includes(this.activeFilter)
      );
    
    }
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(GlossyPortfolioGrid.tag, GlossyPortfolioGrid);