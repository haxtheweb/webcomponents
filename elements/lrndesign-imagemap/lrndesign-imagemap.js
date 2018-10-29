import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "@lrnwebcomponents/relative-heading/relative-heading.js";
import "./lib/lrndesign-imagemap-hotspot.js";
/**
 * `lrndesign-imagemap`
 * creates an accessible image map
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
      :host #buttons {
        position: absolute;
        left: -999999px;
        top: 0;
        overflow: hidden;
        opacity: 0;
      }
      :host paper-dialog {
        border: 1px solid #000;
        border-radius: 0.25em;
      }
      :host paper-dialog > #title, 
      :host paper-dialog > #desc {
        padding: 15px;
        margin: 0;
      }
      :host paper-dialog > #title {
        position: absolute;
        left: -9999px;
        overflow: hidden;
        height: 0;
        width: 0;
      }
      :host paper-dialog > #title > * {
        margin: 0;
      }
      /*::slotted([hotspot]) {
        display: none;
      }*/
      @media print {
        :host > #svg {
          display: none;
        }
        /*::slotted(#screen-only) {
          display: none;
        }
        ::slotted([hotspot]) {
          display: block;
        }*/
      }
    </style>
    <relative-heading hidden\$="[[!label]]" id="heading" subtopic-of\$="[[subtopicOf]]" tag\$="[[tag]]" text\$="[[label]]">
    </relative-heading>
    <div id="desc"><slot name="desc"></slot></div>
    <div id="svg"></div>
    <div id="buttons"></div>
    <slot></slot>
    <paper-dialog id="hdetails">
      <div id="title"></div>
      <div id="desc"></div>
    </paper-dialog>
    <iron-ajax auto="" id="get_svg" url="[[src]]" handle-as="text" on-response="_getSVGHandler"></iron-ajax>
`,

  is: "lrndesign-imagemap",

  properties: {
    /**
     * Label for the imagemap
     */
    label: {
      type: String,
      value: null
    },
    /**
     * The path of the SVG
     */
    src: {
      type: String,
      value: null
    },
    /**
     * The path of the SVG
     */
    hotspotDetails: {
      type: Array,
      value: []
    },
    /* 
     * optional: the id of the heading element that this imagemap is a subtopic of 
     */
    subtopicOf: {
      type: String,
      value: null,
      reflectToAttribute: true
    },
    /* 
     * optional: if subtopicOf is not set, start the content at a heading tag, eg. <h1/>, <h2/> ...
     */
    tag: {
      type: String,
      value: null,
      reflectToAttribute: true
    }
  },

  /**
   * when ready, set an event for when the hdetails dialog is mouseout or blur
   */
  ready: function() {
    let root = this;
    this.$.hdetails.addEventListener("blur", function() {
      root.closeHotspot();
    });
    this.$.hdetails.addEventListener("mouseout", function() {
      root.closeHotspot();
    });
    this.$.hdetails.addEventListener("keyup", function(e) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        root.closeHotspot();
      }
    });
    /*window.addEventListener('keypress',function(e){
     if (e.target.getAttribute('aria-controls') === 'hdetails' || e.target.getAttribute('id') == 'hdetails'){
       e.preventDefault();
     }
   });*/
  },

  /**
   * Convert from svg text to an array in the table function
   */
  _getSVGHandler: function(e) {
    let root = this,
      temp = document.createElement("div"),
      getID = function(element, alt) {
        if (element.getAttribute("id") === null)
          element.setAttribute("id", alt);
        return element.getAttribute("id");
      };
    let setAriaLabelledBy = function(source, target, prefix) {
      // adds title and desc elements to target and sets the aria-labelledby attribute
      let svgElem = function(nodename) {
        source = source !== null ? source : root;
        //adds title or desc element to target
        let attr = nodename === "title" ? "label" : nodename,
          query = source.querySelector("#" + attr);
        var label = target.querySelector(nodename);
        //if the target doesn't have the element, add it
        if (label === null) {
          label = document.createElement(nodename);
          target.prepend(label);
        }
        //populates the element with data from the source element
        if (source.getAttribute(attr) !== null) {
          label.innerHTML = source.getAttribute(attr);
        } else if (query !== null && query.innerHTML !== "") {
          label.innerHTML = query.innerHTML;
        }
        //returns the new element's id
        return getID(label, prefix + "-" + attr);
      };
      //set aria-labelledby to the id's for title and descriptions
      target.setAttribute(
        "aria-labelledby",
        svgElem("desc") + " " + svgElem("label")
      );
    };
    //set up main svg and append to document
    temp.innerHTML = e.detail.response;
    let svg = temp.querySelector("svg"),
      svgid = getID(svg, "svg-" + Date.now()),
      hdata = dom(root).querySelectorAll("lrndesign-imagemap-hotspot");
    setAriaLabelledBy(root, svg, svgid);
    this.$.svg.appendChild(svg);

    for (let i = 0; i < hdata.length; i++) {
      let hid = hdata[i].getAttribute("hotspot-id"),
        hotspot = svg.querySelector("#" + hid),
        clone = svg.cloneNode(true);

      //clone svg for print versions and show hotspot as selected
      setAriaLabelledBy(hdata[i], clone, hid);
      hdata[i].appendChild(clone);
      hdata[i].querySelector("#" + hid).classList.add("selected");
      hdata[i].setParentHeading(root.$.heading);
      for (let j = 0; j < hdata.length; j++) {
        hdata[i]
          .querySelector("#" + hdata[j].getAttribute("hotspot-id"))
          .classList.add("hotspot");
      }

      //configure hotspot on main (interactive) svg
      let hbutton = document.createElement("button");
      hbutton.setAttribute("aria-controls", "hdetails");
      hbutton.setAttribute("tabindex", 0);
      hbutton.setAttribute("aria-label", hdata[i].label);
      root.$.buttons.appendChild(hbutton);
      hbutton.addEventListener("focus", function() {
        console.log("focus", i, hotspot);
        hotspot.classList.add("focus");
      });
      hbutton.addEventListener("blur", function() {
        hotspot.classList.remove("focus");
      });
      hotspot.classList.add("hotspot");
      hotspot.addEventListener("click", function(e) {
        root.openHotspot(hotspot, hdata[i]);
      });
      hbutton.addEventListener("keyup", function(e) {
        if (e.keyCode === 13 || e.keyCode === 32) {
          if (!hotspot.classList.contains("selected")) {
            root.openHotspot(hotspot, hdata[i]);
          }
        }
      });
    }
  },

  /**
   * Selects a hotspot and opens hdetails dialog with details about it.
   */
  openHotspot: function(hotspot, details) {
    let root = this,
      node = dom(root).querySelector(
        'lrndesign-imagemap-hotspot[hotspot-id="' +
          hotspot.getAttribute("id") +
          '"]'
      );
    this.$.hdetails.querySelector("#title").innerHTML = details.getAttribute(
      "label"
    );
    this.$.hdetails.querySelector("#desc").innerHTML = details.querySelector(
      "#desc"
    ).innerHTML;
    this.$.hdetails.positionTarget = hotspot;
    this.__activeHotspot = hotspot;
    this.$.hdetails.open();
    this.resetHotspots();
    hotspot.classList.add("selected");
  },

  /**
   * Closes a hotspot.
   */
  closeHotspot: function() {
    this.$.hdetails.querySelector("#title").innerHTML = "";
    this.$.hdetails.querySelector("#desc").innerHTML = "";
    this.resetHotspots();
    this.$.hdetails.close();
    this.__activeHotspot.focus();
  },

  /**
   * Closes hdetails dialog and deselects all hotspots.
   */
  resetHotspots: function() {
    let hotspots = this.querySelectorAll('.hotspot[role="button"]');
    for (let i = 0; i < hotspots.length; i++) {
      hotspots[i].classList.remove("selected");
    }
  }
});
