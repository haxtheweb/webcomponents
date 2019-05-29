define(["exports"],function(_exports){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.SchemaBehaviors=void 0;/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */var SchemaBehaviors=function SchemaBehaviors(SuperClass){return(/*#__PURE__*/function(_SuperClass){babelHelpers.inherits(_class,_SuperClass);function _class(){babelHelpers.classCallCheck(this,_class);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(_class).apply(this,arguments))}babelHelpers.createClass(_class,[{key:"generateResourceID",/**
     * Generate a uinque ID
     */value:function generateResourceID(){function idPart(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}return"#"+idPart()+idPart()+"-"+idPart()+"-"+idPart()+"-"+idPart()}/**
     * Notice the schema map has changed, reprocess attributes.
     */},{key:"_schemaMapChanged",value:function _schemaMapChanged(newValue,oldValue){if(babelHelpers.typeof(newValue)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){// use this to tie into schemaResourceID build
this.schemaResourceID=this.getAttribute("resource");// if it still doesn't have one then we have to check
if(""==this.schemaResourceID||null==this.schemaResourceID){this.schemaResourceID=this.generateResourceID();this.setAttribute("resource",this.schemaResourceID)}var prefixes=newValue.prefix,prefix="";// build prefix string
for(var property in prefixes){if(prefixes.hasOwnProperty(property)){prefix+=property+":"+prefixes[property]+" "}}// set prefix on the main element itself
if(""!=prefix){this.setAttribute("prefix",prefix)}}}}],[{key:"properties",get:function get(){var props={/**
         * Unique Resource ID, generated when schemaMap processes.
         */schemaResourceID:{type:String,value:""},/**
         * Schema Map for the element, used to generate a valid prefix on the fly
         */schemaMap:{type:Object,readOnly:!0,value:{prefix:{oer:"http://oerschema.org/",schema:"http://schema.org/",dc:"http://purl.org/dc/terms/",foaf:"http://xmlns.com/foaf/0.1/",cc:"http://creativecommons.org/ns#",bib:"http://bib.schema.org"}},observer:"_schemaMapChanged"}};if(babelHelpers.get(babelHelpers.getPrototypeOf(_class),"properties",this)){props=Object.assign(props,babelHelpers.get(babelHelpers.getPrototypeOf(_class),"properties",this))}return props}}]);return _class}(SuperClass))};_exports.SchemaBehaviors=SchemaBehaviors});