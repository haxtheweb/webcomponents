define(["exports","./lib/json-outline-schema-item.js"],function(_exports,_jsonOutlineSchemaItem){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});Object.defineProperty(_exports,"JSONOutlineSchemaItem",{enumerable:!0,get:function get(){return _jsonOutlineSchemaItem.JSONOutlineSchemaItem}});_exports.JsonOutlineSchema=void 0;/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */ // register globally so we can make sure there is only one
window.JSONOutlineSchema=window.JSONOutlineSchema||{};// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same json-outline-schema element, making it a singleton.
window.JSONOutlineSchema.requestAvailability=function(){// if there is no single instance, generate one and append it to end of the document
if(!window.JSONOutlineSchema.instance){window.JSONOutlineSchema.instance=document.createElement("json-outline-schema");document.body.appendChild(window.JSONOutlineSchema.instance)}return window.JSONOutlineSchema.instance};/**
 * `json-outline-schema`
 * `JS based state management helper for the json outline schema spec`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @demo demo/index.html
 */var JsonOutlineSchema=/*#__PURE__*/function(_HTMLElement){babelHelpers.inherits(JsonOutlineSchema,_HTMLElement);babelHelpers.createClass(JsonOutlineSchema,[{key:"html",// render function
get:function get(){return"\n<style>:host {\n  display: block;\n}\n:host([debug]) {\n  font-family: monospace;\n  white-space: pre;\n  margin: 16px 0px;\n}\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"}// properties available to the custom element for data binding
}],[{key:"properties",get:function get(){return{}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"json-outline-schema"}/**
   * life cycle
   */}]);function JsonOutlineSchema(){var _this,delayRender=0<arguments.length&&arguments[0]!==void 0?arguments[0]:!1;babelHelpers.classCallCheck(this,JsonOutlineSchema);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(JsonOutlineSchema).call(this));// set tag for later use
_this.tag=JsonOutlineSchema.tag;// optional queue for future use
_this._queue=[];_this.template=document.createElement("template");_this.attachShadow({mode:"open"});if(!delayRender){_this.render()}_this.__ready=!1;_this.file=null;_this.id=_this.generateUUID();_this.title="New site";_this.author="";_this.description="";_this.license="by-sa";_this.metadata={};_this.items=[];_this.debug=!1;window.JSONOutlineSchema.instance=babelHelpers.assertThisInitialized(_this);return _this}/**
   * life cycle, element is afixed to the DOM
   */babelHelpers.createClass(JsonOutlineSchema,[{key:"connectedCallback",value:function connectedCallback(){if(window.ShadyCSS){window.ShadyCSS.styleElement(this)}if(this._queue.length){this._processQueue()}window.addEventListener("json-outline-schema-debug-toggle",this._toggleDebug.bind(this));var evt=new CustomEvent("json-outline-schema-ready",{bubbles:!0,cancelable:!1,detail:!0});this.dispatchEvent(evt);this.__ready=!0}},{key:"_copyAttribute",value:function _copyAttribute(name,to){var recipients=this.shadowRoot.querySelectorAll(to),value=this.getAttribute(name),fname=null==value?"removeAttribute":"setAttribute",_iteratorNormalCompletion=!0,_didIteratorError=!1,_iteratorError=void 0;try{for(var _iterator=recipients[Symbol.iterator](),_step,node;!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=!0){node=_step.value;node[fname](name,value)}}catch(err){_didIteratorError=!0;_iteratorError=err}finally{try{if(!_iteratorNormalCompletion&&null!=_iterator.return){_iterator.return()}}finally{if(_didIteratorError){throw _iteratorError}}}}},{key:"_queueAction",value:function _queueAction(action){this._queue.push(action)}},{key:"_processQueue",value:function _processQueue(){var _this2=this;this._queue.forEach(function(action){_this2["_".concat(action.type)](action.data)});this._queue=[]}},{key:"_setProperty",value:function _setProperty(_ref){var name=_ref.name,value=_ref.value;this[name]=value}},{key:"render",value:function render(){this.shadowRoot.innerHTML=null;this.template.innerHTML=this.html;if(window.ShadyCSS){window.ShadyCSS.prepareTemplate(this.template,this.tag)}this.shadowRoot.appendChild(this.template.content.cloneNode(!0))}/**
   * life cycle, element is removed from the DOM
   */},{key:"disconnectedCallback",value:function disconnectedCallback(){window.removeEventListener("json-outline-schema-debug-toggle",this._toggleDebug.bind(this));var evt=new CustomEvent("json-outline-schema-unready",{bubbles:!0,cancelable:!1,detail:!0});this.dispatchEvent(evt)}/**
   * Get a clone of this JSONOutlineSchema object
   * @return Object
   */},{key:"clone",value:function clone(){var schema={id:this.id,title:this.title,author:this.author,description:this.description,license:this.license,metadata:this.metadata,items:this.items},obj=JSON.parse(JSON.stringify(schema));return obj}/**
   * Get a new item matching schema standards
   * @return new JSONOutlineSchemaItem Object
   */},{key:"newItem",value:function newItem(){return new _jsonOutlineSchemaItem.JSONOutlineSchemaItem}/**
   * Add an item to the outline
   * @var item an array of values, keyed to match JSON Outline Schema
   * @return count of items in the array
   */},{key:"addItem",value:function addItem(item){var safeItem=this.validateItem(item);count=array_push(this.items,safeItem);return count}/**
   * Validate that an item matches JSONOutlineSchemaItem format
   * @var item JSONOutlineSchemaItem
   * @return JSONOutlineSchemaItem matching the specification
   */},{key:"validateItem",value:function validateItem(item){// create a generic schema item
var tmp=new _jsonOutlineSchemaItem.JSONOutlineSchemaItem;for(var key in tmp){// only set what the element from spec allows into a new object
if(babelHelpers.typeof(item[key])!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){tmp[key]=item[key]}}return tmp}/**
   * Remove an item from the outline if it exists
   * @var id an id that's in the array of items
   * @return JSONOutlineSchemaItem or false if not found
   */},{key:"removeItem",value:function removeItem(id){for(var key in this.items){if(this.items[key].id==id){var tmp=this.items[key];delete this.items[key];return tmp}}return!1}/**
   * Remove an item from the outline if it exists
   * @var id an id that's in the array of items
   * @return JSONOutlineSchemaItem or false if not found
   */},{key:"updateItem",value:function updateItem(item){var save=1<arguments.length&&arguments[1]!==void 0?arguments[1]:!1,safeItem=this.validateItem(item);for(var key in this.items){// match the current item's ID to our safeItem passed in
if(this.items[key].id==safeItem.id){// overwrite the item
this.items[key]=safeItem;// if we save, then we let that return the whole file
if(save){return this.save()}// this was successful
return!0}}// we didn't find a match on the ID to bother saving an update
return!1}/**
   * Load a schema from a file
   */},{key:"load",value:function load(location){if(location){this.file=location;var fileData=json_decode(file_get_contents(location));for(var key in fileData){if(babelHelpers.typeof(this[key])!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))&&"items"!==key){this[key]=fileData[key]}}// check for items and escalate to full JSONOutlineSchemaItem object
// also ensures data matches only what is supported
if(isset(fileData.items)){for(var key in fileData.items){var newItem=new _jsonOutlineSchemaItem.JSONOutlineSchemaItem;newItem.id=item.id;newItem.indent=item.indent;newItem.location=item.location;newItem.order=item.order;newItem.parent=item.parent;newItem.title=item.title;newItem.description=item.description;// metadata can be anything so whatever
newItem.metadata=item.metadata;this.items[key]=newItem}}return!0}return!1}/**
   * Save data back to the file system location
   */},{key:"save",value:function save(){var schema={id:this.id,title:this.title,author:this.author,description:this.description,license:this.license,metadata:this.metadata,items:this.items};// @todo write contents
//return @file_put_contents(this.file, JSON.stringify(schema, null, 2));
return JSON.stringify(schema,null,2)}/**
   * Generate a UUID
   */},{key:"generateUUID",value:function generateUUID(){return"ss-s-s-s-sss".replace(/s/g,this._uuidPart)}},{key:"_uuidPart",value:function _uuidPart(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}/**
   * Allow toggling of debug mode which visualizes the outline and writes it to console.
   */},{key:"_toggleDebug",value:function _toggleDebug(e){this.debug=!this.debug;this._triggerDebugPaint(this.debug)}/**
   * Paint the slot in order to debug the object inside
   */},{key:"_triggerDebugPaint",value:function _triggerDebugPaint(debug){if(debug){var obj={file:this.file,id:this.id,title:this.title,author:this.author,description:this.description,license:this.license,metadata:this.metadata,items:this.items},span=document.createElement("span");span.innerHTML=JSON.stringify(obj,null,2);this.shadowRoot.appendChild(span.cloneNode(!0))}else{this.render()}}},{key:"attributeChangedCallback",value:function attributeChangedCallback(attr,oldValue,newValue){if(this.debug){this.render();this._triggerDebugPaint(this.debug)}}},{key:"updateMetadata",/**
   * Set individual key values pairs on metdata so we can notice it change
   */value:function updateMetadata(key,value){this.metadata[key]=value;if(this.debug){this.render();this._triggerDebugPaint(this.debug)}}/**
   * Return some items populated correctly
   */},{key:"getItemValues",value:function getItemValues(item){var parent=1<arguments.length&&arguments[1]!==void 0?arguments[1]:!1,valid;if(item){valid=this.validateItem(item)}else{valid=new _jsonOutlineSchemaItem.JSONOutlineSchemaItem}// treat this item as the parent
if(parent){valid.parent=parent.id}return valid}/**
   * Return valid JSON Schema relative to what asked for
   */},{key:"getItemSchema",value:function getItemSchema(){var requested=0<arguments.length&&arguments[0]!==void 0?arguments[0]:"item",schema={$schema:"http://json-schema.org/schema#",title:this.title,type:"object",properties:{}},obj;if("item"==requested){obj=new _jsonOutlineSchemaItem.JSONOutlineSchemaItem}else{// current object definition but without the outline
obj={file:this.file,id:this.id,title:this.title,author:this.author,description:this.description,license:this.license,metadata:this.metadata};// support this as fallback
if("outline"==requested){obj.items=this.items}}for(var key in obj){var props={title:key,type:"string",value:obj[key]};switch(key){case"file":case"id":case"title":case"author":case"description":case"license":case"location":// @todo break parent out into selector
case"parent":props.component={name:"paper-input",valueProperty:"value",properties:{required:!0}};break;case"indent":case"order":props.component={name:"paper-input",valueProperty:"value",properties:{required:!0},attributes:{type:"number"}};case"metadata":case"items":props.type="array";props.items={type:"object",properties:{key:{title:"key",type:"string",component:{name:"paper-input",valueProperty:"value",properties:{required:!0}}},value:{title:"value",type:"string",component:{name:"paper-input",valueProperty:"value",properties:{required:!0}}}}};break;default:console.log(key);break;}schema.properties[key]=props}return schema}/**
   * Take the items of the manifest (or passed in) and generate an HTML list hierarchy from it
   */},{key:"itemsToNodes",value:function itemsToNodes(items){items="undefined"!==typeof items?items:this.items;var tree=this.unflattenItems(items);return this.treeToNodes(tree,document.createElement("ul"))}},{key:"treeToNodes",value:function treeToNodes(tree,appendTarget){for(var i in tree){var li=document.createElement("li");li.innerText=tree[i].title;li.setAttribute("data-jos-id",tree[i].id);if(tree[i].location){li.setAttribute("data-jos-location",tree[i].location)}appendTarget.appendChild(li);if(tree[i].children&&0<tree[i].children.length){appendTarget.appendChild(this.treeToNodes(tree[i].children,document.createElement("ul")))}}return appendTarget}/**
   * Helper to unflatten an array and make it into a tree
   */},{key:"unflattenItems",value:function unflattenItems(items,parent,tree){var _this3=this;tree="undefined"!==typeof tree?tree:[];parent="undefined"!==typeof parent?parent:{id:null};var children=items.filter(function(child){return child.parent===parent.id});if(children.length){if(!parent.id){tree=children}else{parent.children=children}children.forEach(function(child){_this3.unflattenItems(items,child)})}return tree}/**
   * Scrubs data-jos metadata from node and any children of the node.
   * Useful when dealing with text based data being turned into nodes (like a paste)
   */},{key:"scrubElementJOSData",value:function scrubElementJOSData(node){// attempt to replace things inside very aggressively
for(var i in node.children){node.removeAttribute("data-jos-id");node.removeAttribute("data-jos-location");// deep scrub child references
if(node.children[i].children){this.scrubElementJOSData(node.children[i])}}}/**
   * Take an HTML node and convert it into a JSON Outline Schema based
   * on parent child relationshios found in the node. Commonly used with ul / ol
   */},{key:"nodesToItems",value:function nodesToItems(node){var save=1<arguments.length&&arguments[1]!==void 0?arguments[1]:!1,items=this.getChildOutline(node);if(save){this.items=items;// update if debugging is turned on
if(this.debug){this.render();this._triggerDebugPaint(this.debug)}}return items}/**
   * Generate a flat listing of items in JSON OUtline Schema format
   * from a hierarchy of HTML nodes
   */},{key:"getChildOutline",value:function getChildOutline(node){var order=1<arguments.length&&arguments[1]!==void 0?arguments[1]:0,indent=2<arguments.length&&arguments[2]!==void 0?arguments[2]:0,parent=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null,clone=node.cloneNode(!0),items=[],item={};while(null!==clone.firstChild){// only work on things if they are valid HTML nodes
if(babelHelpers.typeof(clone.firstChild.tagName)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){var child=clone.firstChild;// walk deeper as this element has a child element
if(null!==child.firstChild&&babelHelpers.typeof(child.firstChild.tagName)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){// usually this will happen but it's possible to have a corrupted
// structure in HTML where there are lots of ULs with no immediate children
// in this case we defer to whoever the parent of this item was
// This means on a recall that the visual issue would be corrected
// but it also means the data will technically transform the HTML structure
// which for our purposes, is a good thing.
var parentPassdown=parent;// ensure this is set
if(babelHelpers.typeof(item.id)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){parentPassdown=item.id}// recursive; dive in using the current child as the starting point
// and merge in everything we dig up from there
items=items.concat(this.getChildOutline(child,0,indent+1,parentPassdown))}else{item=new _jsonOutlineSchemaItem.JSONOutlineSchemaItem;// allow for DOM to have defined an id ahead of time
if(child.getAttribute("data-jos-id")){item.id=child.getAttribute("data-jos-id")}if(child.getAttribute("data-jos-location")){item.location=child.getAttribute("data-jos-location")}else{item.location=""}item.indent=indent;item.order=order;order=order+1;// @todo mayyyyyy work but if nested structures may not for text
// @todo need to look for a textNode that has the element content
item.title=child.innerText;item.parent=parent;items.push(item)}}clone.removeChild(clone.firstChild)}return items}/**
   * Get Next Page
   */},{key:"nextPage",value:function nextPage(manifest,activeItem){manifest.items=manifest.items// top level
.sort(function(a,b){})}},{key:"file",get:function get(){return this.getAttribute("file")},set:function set(newValue){if(this.__ready){this.setAttribute("file",newValue)}}},{key:"id",get:function get(){return this.getAttribute("id")},set:function set(newValue){if(this.__ready){this.setAttribute("id",newValue)}}},{key:"title",get:function get(){return this.getAttribute("title")},set:function set(newValue){if(this.__ready){this.setAttribute("title",newValue)}}},{key:"author",get:function get(){return this.getAttribute("author")},set:function set(newValue){if(this.__ready){this.setAttribute("author",newValue)}}},{key:"description",get:function get(){return this.getAttribute("description")},set:function set(newValue){if(this.__ready){this.setAttribute("description",newValue)}}},{key:"license",get:function get(){return this.getAttribute("license")},set:function set(newValue){if(this.__ready){this.setAttribute("license",newValue)}}},{key:"debug",get:function get(){return this.getAttribute("debug")},set:function set(newValue){if(this.__ready&&newValue){this.setAttribute("debug",newValue)}else{this.removeAttribute("debug")}}}],[{key:"observedAttributes",get:function get(){return["file","id","title","author","description","license","debug"]}}]);return JsonOutlineSchema}(babelHelpers.wrapNativeSuper(HTMLElement));_exports.JsonOutlineSchema=JsonOutlineSchema;window.customElements.define(JsonOutlineSchema.tag,JsonOutlineSchema)});