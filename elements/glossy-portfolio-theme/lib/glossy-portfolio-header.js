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
 * `glossy-portfolio-header`
 * 
 * @demo index.html
 * @element glossy-portfolio-header
 */
function getPostLogo(item) {
  // Check if item has a logo, otherwise use the image from metadata
  if (item.metadata.image) {
    return item.metadata.image;
  } else if (store.manifest.metadata.theme.variables.image) {
    return toJS(store.manifest.metadata.theme.variables.image);
  } else {
    // Fallback to the site's default image
    return toJS(store.manifest.metadata.site.logo);
  }
}
export class GlossyPortfolioHeader extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "glossy-portfolio-header";
  }

  constructor() {
    super();
    this.title = "Title";
    this.homeLink = "";
    this.__disposer = this.__disposer || [];
    this.isOverflow = false;
    this.isOpen = false;

    //get top level items (items shown on header -- they have no parent)
    autorun((reaction) => {
      let items = store.getItemChildren(null); 
      if (items && items.length > 0) {
        this.topItems = [...items];
      }
      this.__disposer.push(reaction);

    });

    // get home link (lading page slug)
    autorun((reaction) => {
      
      this.homeLink = toJS(store.homeLink);
      this.__disposer.push(reaction);
    });
    //get logo
    autorun((reaction) => {
      this.logo = toJS(store.logo);
      this.__disposer.push(reaction);
    });
  }
  

  
  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      thumbnail: {type: String},
      link: {type: String},
      topItems: {type: Array},
      isOverflow: {type: Boolean},
      isOpen: {type: Boolean, reflect: true},
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`


      :host {
        display: block;
        
        /* min-width: 400px; */
        height: auto;
        /* background-color: #1d1d1d; */
      }


      *{
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        --nav-bar-height: 80px;
        
      }

      ul{
        margin: 0;
        padding: 0;
      }

      .container.desktop{
        background: transparent;
              
        background: linear-gradient(180deg, rgba(17, 17, 17, 1) 0%, rgba(17, 17, 17, 0) 100%);
        
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 10;
        width: 100vw;

        padding: 50px 50px 40px 50px;
        max-height: var(--nav-bar-height);
        font-family: var(--main-font);  
        /* overflow-x: scroll; */
        /* overflow-y: scroll; */

      }
      .container{
        
      }

      .logo, .logo-link{
        max-height: 40px;
        flex: 0 0 auto;
        position: relative;
        z-index: 10;
      }
      

      ul{
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 50px;
        list-style: none;
      }
      .nav-links li{
        font-weight: 700;
        font-family: var(--main-font);
        flex: 0 1 auto;
        text-align: center;

      }
    

 
      a, div.header-link{
        all: unset;
        color: white;
        text-decoration: none;
        font-weight: 500;
        font-size: 1rem;

      }

      /* white underline when hover */
      a:hover{
        color: white;

      }

      /* ----MOBILE HEADER---- */
      .hamburger{
        width: 40px;
        height: 40px;
      }

      button{
        all: unset;
        cursor: pointer;
        border-radius: 15%; 


      }

      a:focus-visible, button:focus-visible{
        border: 1px solid white;

      }

      .logo-hamburger.mobile{
        display: flex;
        justify-content: space-between;
        width: 100%;
        align-items: center;
        padding: 0 50px ;
        height: var(--nav-bar-height);
        /* max-height: 60px; */
      }



      .container.mobile{
        background-color: var(--bg-color);
        display: flex;
        flex-direction: column;
        width: 100vw;

        height: auto;
      }

      ul.mobile{
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0;
      }
   
   
      /* nav links */
      li.mobile, a.right-side-item.mobile{
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100vw;
        text-align: center; /* Centers the text horizontally */
        height: 80px;
        
      }

      a.right-side-item.mobile:active, a.right-side-item.mobile:hover, a.right-side-item.mobile:focus-visible{
        background-color: #1d1d1d;
        text-decoration: none; /* Ensures underline is removed on hover */

      }  
      :host([isOpen]) dialog {
      
      }
      .nav-menu{
        display: none;
      }

          /* Extra small devices (phones) */
          /* Make padding, logo and hamburger smaller*/
      @media (max-width: 575.98px) {
        *{
          --nav-bar-height: 60px;
        }
        .hamburger{
          display: block;
          height: 30px;
        }
        /* svg.logo{
          max-height: 60px;
        } */

        .container{
          padding: 15px 15px ;
        }
      }


    `];
  }

  // Lit render the HTML
  render() {
    return html`

      <!-- ------------DESKTOP HEADER--------------- -->
      <div class="container desktop" >
\        <div class="logo-hamburger desktop">
          <a class="logo-link desktop" href="${this.homeLink}">
            <img class="logo desktop" src="${store.manifest.metadata.site.logo}" @error=${this.handleImageError} alt="Logo" />
          </a>
        </div>
        <ul class="nav-links desktop">
          ${Array.from(this.topItems).map((item) => html`
              <li><a class="right-side-item desktop" href="${item.slug}"><div class="header-link desktop">${item.title}</div></a></li>
            `)}
        </ul>
      </div>
      
      <!-- -----------MOBILE HEADER--------------- -->
      <div class="container mobile">
        <div class="logo-hamburger mobile">
          <a class="logo-link mobile" href="${this.homeLink}">
            <img class="logo mobile" src="${store.manifest.metadata.site.logo}" @error=${this.handleImageError} alt="Logo" />
          </a> 
          <button @click="${this.toggleHamburger}">
            <!-- <img @click="" class="hamburger" src="../lib/components/hamburger.svg" width="70px"> -->
            <svg class="hamburger mobile"  width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" stroke-width="0"/>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
              <g id="SVGRepo_iconCarrier"> <path d="M4 18L20 18" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/> <path d="M4 12L20 12" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/> <path d="M4 6L20 6" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/> </g>
            </svg>
            
          </button>

        </div>
        <div class="mobile nav-menu" >
          
          <ul class="nav-links mobile">
            ${Array.from(this.topItems).map((item) => html`
                <li class="mobile"><a class="right-side-item mobile" href="${item.slug}" @click="${this.toggleHamburger}"><div class="header-link mobile">${item.title}</div></a></li>
              `)}
          </ul>
    </div>
      </div>
    `;
  }


toggleHamburger() {
  this._checkOverflow();
  let nav = this.renderRoot.querySelector('.nav-menu');
  console.log("toggleHamburger", this.isOpen, nav);
  if (this.isOpen === true){
    console.log(2);
    nav.style.display = "none"; // Hide the mobile menu
    document.body.classList.remove('no-scroll'); // Re-enable scrolling on the body
    this.isOpen = false; // 
  } else if (this.isOpen === false) {
    console.log(1);
    nav.style.display = "flex"; // Show the mobile menu
    document.body.classList.add('no-scroll'); // Disable scrolling on the body
    this.isOpen = true; // 

  }


}



  firstUpdated(changedProperties) {
      // window resize observer for mobile menu
    // NOTE: an event listener works for this too, but only for manual resizing and not in
    //       certain cases when the window is popped out via minimize or dragging
    const desktopHeader = this.renderRoot.querySelector('.container.desktop');
    if (desktopHeader) {
      this._resizeObserver = new ResizeObserver(() => {
        this._checkOverflow();
      });
      this._resizeObserver.observe(desktopHeader);
    }
    requestAnimationFrame(() => this._checkOverflow());
  }

 
  
  // checks children of nav on resize for mobile menu
  _checkOverflow() {
    const desktopHeader = this.renderRoot.querySelector('.container.desktop');
    const mobileHeader = this.renderRoot.querySelector('.container.mobile');


    if (desktopHeader) {

      const items = Array.from(desktopHeader.children);
      const availableWidth = desktopHeader.clientWidth - 100;

      let usedWidth = 0;
      // render();
      for (const item of items) {
        usedWidth += item.offsetWidth + 25;

       
        if (usedWidth > availableWidth) {
          this.isOverflow = true;
          desktopHeader.style.visibility = "hidden"; // Hide desktop header
          desktopHeader.style.height = "0px"; // Hide desktop header
          desktopHeader.style.padding = "0px 50px"; // Hide desktop header
          mobileHeader.style.display = "flex"; // Show mobile header
        } else {
          this.isOverflow = false;
          desktopHeader.style.visibility = "visible"; // Show desktop header
          desktopHeader.style.padding = "50px 50px 40px 50px"; // Hide desktop header
          desktopHeader.style.height = "auto"; // Show desktop header
          

          mobileHeader.style.display = "none"; // Hide mobile header
          document.body.classList.remove('no-scroll');
        }

        this.requestUpdate();
      }
    }
  }

  //show home icon if it fails to load
  handleImageError(event) {
    const img = event.target;
    img.src='https://img.icons8.com/m_sharp/512/FFFFFF/home.png';
  
  }
  
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(GlossyPortfolioHeader.tag, GlossyPortfolioHeader);