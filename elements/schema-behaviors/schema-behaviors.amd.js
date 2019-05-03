define(["exports"],function(_exports){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.SchemaBehaviors=void 0;/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */ // ensure SchemaBehaviors exists
window.SchemaBehaviors=window.SchemaBehaviors||{};/**
 * `SchemaBehaviors`
 *
 * makes it easier to wire custom elements for
 * schematic metadata by allowing prefixes to be defined in an object
 * structure. This makes it easier to add and remove them then working
 * against the attribute directly. It also helps with generating
 * resource IDs automatically if they don't already exist on the element.
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @polymer
 * @polymerBehavior SchemaBehaviors.Schema
 */window.SchemaBehaviors.Schema={properties:{/**
     * Unique Resource ID, generated when schemaMap processes.
     */schemaResourceID:{type:String,value:""},/**
     * Schema Map for this element.
     */schemaMap:{type:Object,value:{prefix:{oer:"http://oerschema.org/",schema:"http://schema.org/",dc:"http://purl.org/dc/terms/",foaf:"http://xmlns.com/foaf/0.1/",cc:"http://creativecommons.org/ns#",bib:"http://bib.schema.org"}},observer:"_schemaMapChanged"}},/**
   * Generate a uinque ID
   */generateResourceID:function generateResourceID(){function idPart(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}return"#"+idPart()+idPart()+"-"+idPart()+"-"+idPart()+"-"+idPart()},/**
   * Notice the schema map has changed, reprocess attributes.
   */_schemaMapChanged:function _schemaMapChanged(newValue,oldValue){if(babelHelpers.typeof(newValue)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){// use this to tie into schemaResourceID build
this.schemaResourceID=this.getAttribute("resource");// if it still doesn't have one then we have to check
if(""==this.schemaResourceID||null==this.schemaResourceID){this.schemaResourceID=this.generateResourceID();this.setAttribute("resource",this.schemaResourceID)}var prefixes=newValue.prefix,prefix="";// build prefix string
for(var property in prefixes){if(prefixes.hasOwnProperty(property)){prefix+=property+":"+prefixes[property]+" "}}// set prefix on the main element itself
if(""!=prefix){this.setAttribute("prefix",prefix)}}}};var SchemaBehaviors=function SchemaBehaviors(SuperClass){return(/*#__PURE__*/function(_SuperClass){babelHelpers.inherits(_class,_SuperClass);function _class(){babelHelpers.classCallCheck(this,_class);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(_class).apply(this,arguments))}babelHelpers.createClass(_class,[{key:"generateResourceID",/**
     * Generate a uinque ID
     */value:function generateResourceID(){function idPart(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}return"#"+idPart()+idPart()+"-"+idPart()+"-"+idPart()+"-"+idPart()}/**
     * Notice the schema map has changed, reprocess attributes.
     */},{key:"_schemaMapChanged",value:function _schemaMapChanged(newValue,oldValue){if(babelHelpers.typeof(newValue)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){// use this to tie into schemaResourceID build
this.schemaResourceID=this.getAttribute("resource");// if it still doesn't have one then we have to check
if(""==this.schemaResourceID||null==this.schemaResourceID){this.schemaResourceID=this.generateResourceID();this.setAttribute("resource",this.schemaResourceID)}var prefixes=newValue.prefix,prefix="";// build prefix string
for(var property in prefixes){if(prefixes.hasOwnProperty(property)){prefix+=property+":"+prefixes[property]+" "}}// set prefix on the main element itself
if(""!=prefix){this.setAttribute("prefix",prefix)}}}}],[{key:"properties",get:function get(){return{/**
         * Unique Resource ID, generated when schemaMap processes.
         */schemaResourceID:{type:String,value:""},/**
         * Schema Map for this element.
         */schemaMap:{type:Object,value:{prefix:{oer:"http://oerschema.org/",schema:"http://schema.org/",dc:"http://purl.org/dc/terms/",foaf:"http://xmlns.com/foaf/0.1/",cc:"http://creativecommons.org/ns#",bib:"http://bib.schema.org"}},observer:"_schemaMapChanged"}}}}]);return _class}(SuperClass))};_exports.SchemaBehaviors=SchemaBehaviors});