/**
 * Copyright 2023
 * @license , see License.md for full text.
 */
import { html, css } from "lit";
import { HAXCMSLitElementTheme } from "@lrnwebcomponents/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { HAXCMSRememberRoute } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSRememberRoute.js";
import { HAXCMSThemeParts } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
/**
 * `terrible-themes`
 * `themes inspired by creations by btopro from his youth. legitimate, terrible websites.`
 *
 * @microcopy - language worth noting:
 *  - HAXcms - A headless content management system
 *  - HAXCMSTheme - A super class that provides correct baseline wiring to build a new theme
 *
 * @demo demo/index.html
 * @element terrible-themes
 */
class TerribleOutletThemes extends HAXCMSRememberRoute(HAXCMSThemeParts(HAXCMSLitElementTheme)) {
  /**
   * Add elements to cheat on initial paint here
   */
  constructor() {
    super();

    this.__disposer = [];
    autorun((reaction) => {
      this.activeManifestIndex = toJS(store.activeManifestIndex);
      this.__disposer.push(reaction);
    });
    document.body.style.backgroundColor = "#e6fbff";
  }
  /**
   * LitElement style callback
   */
  static get styles() {
    // support for using in other classes
    let styles = [];
    if (super.styles) {
      styles = super.styles;
    }
    return [
      ...styles,
      css`
        :host {
          display: block;
        }
       
      `,
    ];
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`
<table align="left" border="0" width="750">
<tbody><tr>
	<td colspan="2"><img src="${new URL("lib/assets/header.jpg", import.meta.url).href}/../lips.jpg" width="125" height="74" border="0" alt=""></td>
	<td valign="middle"><h1>Ac|d's Internet Outlet</h1></td>
</tr>
<tr>
	<td colspan="3" height="10"> </td>
</tr>
<tr>
		<td width="125" valign="top">
		<br>
		<a href="index.html" class="sidebar"><b>Home</b></a><br>
		<hr>
		<a href="ilog.html" class="sidebar"><b>ILOG</b></a><br>
		<a href="personalinfo.html" class="sidebar"><b>Personal info</b></a><br>
		<a href="pictures.html" class="sidebar"><b>Pictures</b></a><br>
		<a href="rants.html" class="sidebar"><b>Rants</b></a><br>
		<a href="hhl.html" class="sidebar"><b>HHL All-Stars</b></a><br>
		<a href="gaming.html" class="sidebar"><b>Gaming</b></a><br>
		<a href="random.html" class="sidebar"><b>Random</b></a><br>
		<a href="homie.html" class="sidebar"><b>Homie the Mom</b></a><br>
		<a href="links.html" class="sidebar"><b>Fun links</b></a><br>
		<a href="http://www.cafepress.com/acidscorpio/" class="sidebar" target="_blank"><b>Store</b></a>
		<hr>
		Site Map
		<hr>
		<a href="http://www.personal.psu.edu/bto108/productionz/index.html" class="sidebar"><b>Productionz</b></a>
		<a href="http://www.personal.psu.edu/bto108/portfolio/index.html" class="sidebar"><b>Portfolio</b></a>
		
	</td>
	<td width="10"></td>
	<td valign="top">
	<br>
	<!--Hey look stupid this is where the text go-->
	<main id="contentcontainer">
	<h2>Gaming</h2>
  <section id="slot">
    <slot></slot>
  </section>
  </main>
	
	<br><br><br><br><br><br><br>
	<div align="center"><h5>ŠAc|d-$CoRpI() Productionz 2002-2003</h5></div>
	<br><br>
	</td>
</tr>
</tbody></table>
    `;
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "terrible-outlet-themes";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    super.disconnectedCallback();
  }
  /**
   * Previous page to hook into when prev is hit
   */
  prevPage(e) {
    super.prevPage(e);
  }
  /**
   * Next page to hook into when next is hit
   */
  nextPage(e) {
    super.nextPage(e);
  }
}
customElements.define(TerribleOutletThemes.tag, TerribleOutletThemes);
export { TerribleOutletThemes };