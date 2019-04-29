define(["exports","./node_modules/@polymer/polymer/polymer-legacy.js","./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js","./node_modules/@polymer/polymer/lib/utils/async.js","./node_modules/@polymer/polymer/lib/utils/flattened-nodes-observer.js","./node_modules/@polymer/iron-resizable-behavior/iron-resizable-behavior.js","./lib/data-table-column.js","./lib/data-table-column-sort.js","./lib/data-table-cell.js","./lib/data-table-row.js","./lib/data-table-checkbox.js","./lib/data-table-row-detail.js","./lib/array-datasource.js"],function(_exports,_polymerLegacy,_polymerDom,async,_flattenedNodesObserver,_ironResizableBehavior,_dataTableColumn,_dataTableColumnSort,_dataTableCell,_dataTableRow,_dataTableCheckbox,_dataTableRowDetail,_arrayDatasource){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.IronDataTable=void 0;async=babelHelpers.interopRequireWildcard(async);function _templateObject_c20faa106a8211e9b34d51e2f4f3ff02(){var data=babelHelpers.taggedTemplateLiteral(["\n    <style is=\"custom-style\">\n      :host {\n        display: block;\n        position: relative;\n        overflow-x: auto;\n        overflow-y: hidden;\n        -webkit-overflow-scrolling: touch;\n        /* Default height just to help users get started in making stuff visible.  */\n        height: 400px;\n        @apply --iron-data-table;\n      }\n\n      #container {\n        position: absolute;\n        left: 0;\n        top: 0;\n        bottom: 0;\n        display: flex;\n        flex-direction: column;\n      }\n\n      #header {\n        box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);\n        transition: box-shadow 200ms;\n        -webkit-transition: box-shadow 200ms;\n        z-index: 1;\n        @apply --iron-data-table-header;\n      }\n\n      #header.scrolled {\n        box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06), 0 2px 0 rgba(0, 0, 0, 0.075),\n          0 3px 0 rgba(0, 0, 0, 0.05), 0 4px 0 rgba(0, 0, 0, 0.015);\n      }\n\n      #list {\n        overflow-x: hidden !important;\n        overflow-y: auto !important;\n        flex: 1;\n        transition: opacity 200ms;\n        -webkit-transition: opacity 200ms;\n      }\n\n      :host([loading]) #list {\n        opacity: 0.25;\n      }\n\n      :host(:not([loading])) paper-spinner-lite {\n        display: none;\n      }\n\n      :host([loading]) paper-spinner-lite {\n        position: absolute;\n        top: 45%;\n        left: 50%;\n        --paper-spinner-color: var(--default-primary-color);\n      }\n    </style>\n    <div id=\"container\">\n      <div id=\"header\">\n        <data-table-row header=\"\">\n          <data-table-checkbox\n            header=\"\"\n            hidden$=\"[[!multiSelection]]\"\n            on-tap=\"_toggleSelectAll\"\n            checked=\"[[_isSelectAllChecked(selectedItems.length, selectedItems.inverted, size)]]\"\n            indeterminate=\"[[_isSelectAllIndeterminate(selectedItems.length, size)]]\"\n          ></data-table-checkbox>\n          <template is=\"dom-repeat\" items=\"[[columns]]\" as=\"column\">\n            <data-table-cell\n              header=\"\"\n              align-right=\"[[column.alignRight]]\"\n              before-bind=\"[[beforeCellBind]]\"\n              column=\"[[column]]\"\n              flex=\"[[column.flex]]\"\n              hidden=\"[[column.hidden]]\"\n              order=\"[[column.order]]\"\n              table=\"[[_this]]\"\n              template=\"[[column.headerTemplate]]\"\n              width=\"[[column.width]]\"\n            >\n              <data-table-column-sort\n                sort-order=\"[[sortOrder]]\"\n                path=\"[[column.sortBy]]\"\n                on-sort-direction-changed=\"_sortDirectionChanged\"\n                hidden$=\"[[!column.sortBy]]\"\n              ></data-table-column-sort>\n            </data-table-cell>\n          </template>\n        </data-table-row>\n      </div>\n\n      <iron-list\n        id=\"list\"\n        as=\"item\"\n        items=\"[[_cachedItems]]\"\n        on-scroll=\"_onVerticalScroll\"\n      >\n        <template>\n          <div class=\"item\">\n            <data-table-row\n              before-bind=\"[[beforeRowBind]]\"\n              even$=\"[[!_isEven(index)]]\"\n              expanded=\"[[_isExpanded(item, _expandedItems, _expandedItems.*)]]\"\n              index=\"[[index]]\"\n              item=\"[[item]]\"\n              tabindex=\"-1\"\n              selected=\"[[_isSelected(item, selectedItems, selectedItems.*)]]\"\n            >\n              <data-table-checkbox\n                hidden$=\"[[!multiSelection]]\"\n                tabindex=\"0\"\n                checked=\"[[_isSelected(item, selectedItems, selectedItems.*)]]\"\n                on-tap=\"_onCheckBoxTap\"\n              ></data-table-checkbox>\n              <template\n                is=\"dom-repeat\"\n                items=\"[[columns]]\"\n                as=\"column\"\n                index-as=\"colIndex\"\n              >\n                <data-table-cell\n                  template=\"[[column.template]]\"\n                  table=\"[[_this]]\"\n                  align-right=\"[[column.alignRight]]\"\n                  column=\"[[column]]\"\n                  expanded=\"[[_isExpanded(item, _expandedItems, _expandedItems.*)]]\"\n                  flex=\"[[column.flex]]\"\n                  hidden=\"[[column.hidden]]\"\n                  index=\"[[index]]\"\n                  item=\"[[item]]\"\n                  on-click=\"_onCellClick\"\n                  order=\"[[column.order]]\"\n                  selected=\"[[_isSelected(item, selectedItems, selectedItems.*)]]\"\n                  width=\"[[column.width]]\"\n                  before-bind=\"[[beforeCellBind]]\"\n                ></data-table-cell>\n              </template>\n              <template\n                is=\"dom-if\"\n                if=\"[[_isExpanded(item, _expandedItems)]]\"\n                on-dom-change=\"_updateSizeForItem\"\n              >\n                <data-table-row-detail\n                  index=\"[[index]]\"\n                  item=\"[[item]]\"\n                  expanded=\"[[_isExpanded(item, _expandedItems, _expandedItems.*)]]\"\n                  selected=\"[[_isSelected(item, selectedItems, selectedItems.*)]]\"\n                  before-bind=\"[[beforeDetailsBind]]\"\n                  table=\"[[_this]]\"\n                  template=\"[[rowDetail]]\"\n                ></data-table-row-detail>\n              </template>\n            </data-table-row>\n          </div>\n        </template>\n      </iron-list>\n    </div>\n    <paper-spinner-lite active=\"\"></paper-spinner-lite>\n    <slot name=\"data-table-column\"></slot>\n    <slot name=\"template[is=row-detail]\"></slot>\n  "],["\n    <style is=\"custom-style\">\n      :host {\n        display: block;\n        position: relative;\n        overflow-x: auto;\n        overflow-y: hidden;\n        -webkit-overflow-scrolling: touch;\n        /* Default height just to help users get started in making stuff visible.  */\n        height: 400px;\n        @apply --iron-data-table;\n      }\n\n      #container {\n        position: absolute;\n        left: 0;\n        top: 0;\n        bottom: 0;\n        display: flex;\n        flex-direction: column;\n      }\n\n      #header {\n        box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);\n        transition: box-shadow 200ms;\n        -webkit-transition: box-shadow 200ms;\n        z-index: 1;\n        @apply --iron-data-table-header;\n      }\n\n      #header.scrolled {\n        box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06), 0 2px 0 rgba(0, 0, 0, 0.075),\n          0 3px 0 rgba(0, 0, 0, 0.05), 0 4px 0 rgba(0, 0, 0, 0.015);\n      }\n\n      #list {\n        overflow-x: hidden !important;\n        overflow-y: auto !important;\n        flex: 1;\n        transition: opacity 200ms;\n        -webkit-transition: opacity 200ms;\n      }\n\n      :host([loading]) #list {\n        opacity: 0.25;\n      }\n\n      :host(:not([loading])) paper-spinner-lite {\n        display: none;\n      }\n\n      :host([loading]) paper-spinner-lite {\n        position: absolute;\n        top: 45%;\n        left: 50%;\n        --paper-spinner-color: var(--default-primary-color);\n      }\n    </style>\n    <div id=\"container\">\n      <div id=\"header\">\n        <data-table-row header=\"\">\n          <data-table-checkbox\n            header=\"\"\n            hidden\\$=\"[[!multiSelection]]\"\n            on-tap=\"_toggleSelectAll\"\n            checked=\"[[_isSelectAllChecked(selectedItems.length, selectedItems.inverted, size)]]\"\n            indeterminate=\"[[_isSelectAllIndeterminate(selectedItems.length, size)]]\"\n          ></data-table-checkbox>\n          <template is=\"dom-repeat\" items=\"[[columns]]\" as=\"column\">\n            <data-table-cell\n              header=\"\"\n              align-right=\"[[column.alignRight]]\"\n              before-bind=\"[[beforeCellBind]]\"\n              column=\"[[column]]\"\n              flex=\"[[column.flex]]\"\n              hidden=\"[[column.hidden]]\"\n              order=\"[[column.order]]\"\n              table=\"[[_this]]\"\n              template=\"[[column.headerTemplate]]\"\n              width=\"[[column.width]]\"\n            >\n              <data-table-column-sort\n                sort-order=\"[[sortOrder]]\"\n                path=\"[[column.sortBy]]\"\n                on-sort-direction-changed=\"_sortDirectionChanged\"\n                hidden\\$=\"[[!column.sortBy]]\"\n              ></data-table-column-sort>\n            </data-table-cell>\n          </template>\n        </data-table-row>\n      </div>\n\n      <iron-list\n        id=\"list\"\n        as=\"item\"\n        items=\"[[_cachedItems]]\"\n        on-scroll=\"_onVerticalScroll\"\n      >\n        <template>\n          <div class=\"item\">\n            <data-table-row\n              before-bind=\"[[beforeRowBind]]\"\n              even\\$=\"[[!_isEven(index)]]\"\n              expanded=\"[[_isExpanded(item, _expandedItems, _expandedItems.*)]]\"\n              index=\"[[index]]\"\n              item=\"[[item]]\"\n              tabindex=\"-1\"\n              selected=\"[[_isSelected(item, selectedItems, selectedItems.*)]]\"\n            >\n              <data-table-checkbox\n                hidden\\$=\"[[!multiSelection]]\"\n                tabindex=\"0\"\n                checked=\"[[_isSelected(item, selectedItems, selectedItems.*)]]\"\n                on-tap=\"_onCheckBoxTap\"\n              ></data-table-checkbox>\n              <template\n                is=\"dom-repeat\"\n                items=\"[[columns]]\"\n                as=\"column\"\n                index-as=\"colIndex\"\n              >\n                <data-table-cell\n                  template=\"[[column.template]]\"\n                  table=\"[[_this]]\"\n                  align-right=\"[[column.alignRight]]\"\n                  column=\"[[column]]\"\n                  expanded=\"[[_isExpanded(item, _expandedItems, _expandedItems.*)]]\"\n                  flex=\"[[column.flex]]\"\n                  hidden=\"[[column.hidden]]\"\n                  index=\"[[index]]\"\n                  item=\"[[item]]\"\n                  on-click=\"_onCellClick\"\n                  order=\"[[column.order]]\"\n                  selected=\"[[_isSelected(item, selectedItems, selectedItems.*)]]\"\n                  width=\"[[column.width]]\"\n                  before-bind=\"[[beforeCellBind]]\"\n                ></data-table-cell>\n              </template>\n              <template\n                is=\"dom-if\"\n                if=\"[[_isExpanded(item, _expandedItems)]]\"\n                on-dom-change=\"_updateSizeForItem\"\n              >\n                <data-table-row-detail\n                  index=\"[[index]]\"\n                  item=\"[[item]]\"\n                  expanded=\"[[_isExpanded(item, _expandedItems, _expandedItems.*)]]\"\n                  selected=\"[[_isSelected(item, selectedItems, selectedItems.*)]]\"\n                  before-bind=\"[[beforeDetailsBind]]\"\n                  table=\"[[_this]]\"\n                  template=\"[[rowDetail]]\"\n                ></data-table-row-detail>\n              </template>\n            </data-table-row>\n          </div>\n        </template>\n      </iron-list>\n    </div>\n    <paper-spinner-lite active=\"\"></paper-spinner-lite>\n    <slot name=\"data-table-column\"></slot>\n    <slot name=\"template[is=row-detail]\"></slot>\n  "]);_templateObject_c20faa106a8211e9b34d51e2f4f3ff02=function _templateObject_c20faa106a8211e9b34d51e2f4f3ff02(){return data};return data}/**
@license
Copyright 2016 Sauli Tähkäpää

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/ /*
`iron-data-table` displays a table or a grid of data.
It builds on top of `iron-list`, which provides the foundation for features like
virtual scrolling and templating.

It contains an array of `data-table-column` elements, which are used to define a template
for the cells on each row item.

Rows use flex layout which enables cells to fit the available space.

Cell elements are placed outside the shadow root of the `iron-data-table` which
allows them to be styled by the user.

### Template model
Column templates should bind to template models of the following structure:
```js
{
  index: 0,        // index in the item array
  selected: false, // true if the current item is selected
  item: {},        // user data corresponding to items[index],
  expanded: false  // true if row details have been expanded for the current item
}
```
For example, given the following `data` array:
##### data.json
```js
[
  {"name": {
    "title": "miss",
    "first": "donna",
    "last": "davis"
  }},
  {"name": {
    "title": "mr",
    "first": "samuel",
    "last": "kelley"
  }},
  {"name": {
    "title": "ms",
    "first": "katie",
    "last": "butler"
  }}
]
```
The following code would render the table (note the name and checked properties are
bound from the model object provided to the template scope):
```html
<template is="dom-bind">
  <iron-ajax url="data.json" last-response="{{data}}" auto></iron-ajax>
  <iron-data-table items="[[data]]">
    <data-table-column name="First Name">
      <template>[[item.name.first]]</template>
    </data-table-column>
    <data-table-column name="Last Name">
      <template>[[item.name.last]]</template>
    </data-table-column>
  </iron-data-table>
</template>
```

### Styling
There are several custom properties and mixins you can use to style the component:

Custom property | Description
----------------|-------------
`--iron-data-table` | Mixin applied to the main element
`--iron-data-table-header` | Mixin applied to the header element
`--iron-data-table-row` | Mixin applied to the row item element
`--iron-data-table-row-hover` | Mixin applied to the row item element when hovered on
`--iron-data-table-row-selected` | Mixin applied to the selected row item elements
`--iron-data-table-row-after` | Mixin applied to :after pseudoelement of the row item element
`--iron-data-table-row-focused` | Mixin applied to the focused row item elements
`--iron-data-table-row-focused-after` | Mixin applied to :after pseudoelement of the focused row item elements

To get started, you can import `default-styles.html` which provides material design
inspired styles to your `iron-data-table`.
*/var IronDataTable=(0,_polymerLegacy.Polymer)({_template:(0,_polymerLegacy.html)(_templateObject_c20faa106a8211e9b34d51e2f4f3ff02()),is:"iron-data-table",behaviors:[_ironResizableBehavior.IronResizableBehavior],listeners:{"column-filter-changed":"_onColumnFilterChanged","iron-resize":"_resizeCellContainers","item-changed":"_itemChanged",scroll:"_onHorizontalScroll"},properties:{/**
     * Timeout after which the data on the currently visible page will be automatically
     * refreshed after an item has been changed through a two-way binding.
     */autoRefresh:Number,/**
     * A function that is called before data is bound to a row or header cell.
     * Can be used to customize the cell element depending on the data.
     * #### Example:
     * ```js
     * function(data, cell) {
     *   cell.toggleClass('custom', data.useCustomClass);
     * }
     * ```
     */beforeCellBind:Object,/**
     * A function that is called before data is bound to a row details element.
     * Can be used to customize the element depending on the data.
     * #### Example:
     * ```js
     * function(data, details) {
     *   details.toggleClass('custom', data.useCustomClass);
     * }
     * ```
     */beforeDetailsBind:Object,/**
     * A function that is called before data is bound to a row.
     * Can be used to customize the row element depending on the data.
     * #### Example:
     * ```js
     * function(data, row) {
     *   row.toggleClass('custom', data.useCustomClass);
     * }
     * ```
     */beforeRowBind:Object,/**
     * An array containing the items which will be stamped to the column template
     * instances.
     */items:{type:Array},/**
     * If `true`, tapping a row will expand the item details, if available.
     */detailsEnabled:{type:Boolean,value:!1},/**
     * An array containing path/filter value pairs that are used to filter the items
     */filter:{type:Array,notify:!0,value:function value(){return[]}},/**
     * When `true`, multiple items may be selected at once (in this case,
     * `selected` is an array of currently selected items).  When `false`,
     * only one item may be selected at a time.
     */multiSelection:{type:Boolean,value:!1},/**
     * Number of items fetched at a time from the datasource.
     */pageSize:{type:Number,value:50},/**
     * If `true`, tapping a row will select the item.
     */selectionEnabled:{type:Boolean,value:!1},/**
     * This is the currently selected item, or `null`
     * if no item is selected.
     */selectedItem:{type:Object,readOnly:!0,notify:!0},/**
     * When `multiSelection` is true, this is an array that contains the selected items.
     * If `selectedItems.inverted` is `true`, the array contains deselected items instead.
     * `selectedItems.filters` contains an array of filters that were active when the selection changed.
     */selectedItems:{type:Object,notify:!0,readOnly:!0,value:function value(){var items=[];items.filters=[];return items}},/**
     * Size of the data set.
     */size:{type:Number,notify:!0,value:0,observer:"_sizeChanged"},/**
     * An array with a path/sortorder ('asc' or 'desc') pairs that are used to sort the items.
     */sortOrder:{type:Array,notify:!0,value:function value(){return[]}},/**
     * An array of `data-table-column` elements which contain the templates
     * to be stamped with items.
     */columns:{type:Array,notify:!0,value:function value(){return[]},observer:"_columnsChanged"},/**
     * Function that provides items lazily. Receives parameters `opts`, `callback`, `err`
     *
     * `opts.page` Requested page index
     *
     * `opts.pageSize` Current page size
     *
     * `opts.filter` Current filter parameters
     *
     * `opts.sortOrder` Current sorting parameters
     */dataSource:{type:Object,notify:!0},_pagesLoading:{type:Array,value:function value(){return[]}},/**
     * `true` if the table is currently loading data from the data source.
     */loading:{type:Boolean,notify:!0,reflectToAttribute:!0,value:!1},_cachedItems:{type:Array,value:function value(){return[]}},_cachedPages:{type:Array,value:function value(){return[]}},_currentPage:{type:Number,value:0},_expandedItems:{type:Array,value:function value(){return[]}},_this:{type:Object,value:function value(){return this}}},observers:["_itemsChanged(items.*)","_currentPageChanged(dataSource, _currentPage)","_resetData(dataSource, filter.*, sortOrder.*)"],created:function created(){var _this=this;this._observer=new _flattenedNodesObserver.FlattenedNodesObserver(this,function(info){var hasColumns=function hasColumns(node){return node.nodeType===Node.ELEMENT_NODE&&"DATA-TABLE-COLUMN"===node.tagName.toUpperCase()},hasDetails=function hasDetails(node){return node.nodeType===Node.ELEMENT_NODE&&"TEMPLATE"===node.tagName.toUpperCase()&&node.hasAttribute("is")&&"row-detail"===node.getAttribute("is")};if(0<info.addedNodes.filter(hasColumns).length||0<info.removedNodes.filter(hasColumns).length){_this.set("columns",_this.shadowRoot.querySelector("[select=data-table-column]").assignedNodes({flatten:!0}).filter(function(n){return n.nodeType===Node.ELEMENT_NODE}));_this.notifyResize()}if(0<info.addedNodes.filter(hasDetails).length){_this.set("rowDetail",_this.shadowRoot.querySelector("[select=\"template[is=row-detail]\"]").assignedNodes({flatten:!0}).filter(function(n){return n.nodeType===Node.ELEMENT_NODE})[0]);// assuming parent element is always a Polymer element.
// set dataHost to the same context the template was declared in
var parent=(0,_polymerDom.dom)(_this.rowDetail).parentNode;_this.rowDetail._rootDataHost=parent.dataHost?parent.dataHost._rootDataHost||parent.dataHost:parent}}).bind(this)},_stopPropagation:function _stopPropagation(e){e.stopImmediatePropagation()},/**
   * Select the list item at the given index.
   *
   * @method selectItem
   * @param {(Object|number)} item The item object or its index
   */selectItem:function selectItem(item){if("number"===typeof item&&0<=item&&this.items&&this.items.length>item){this._selectItem(this.items[item])}else{this._selectItem(item)}},_selectItem:function _selectItem(item){this._setSelectedItem(item);if(this.multiSelection){if(this.selectedItems.inverted){var index;if(-1<(index=this.selectedItems.indexOf(item))){this.splice("selectedItems",index,1)}}else{this.push("selectedItems",item)}}else{this.splice("selectedItems",0,this.selectedItems.length,item)}},/**
   * Deselects the given item list if it is already selected.
   *
   * @method deselect
   * @param {(Object|number)} item The item object or its index
   */deselectItem:function deselectItem(item){if("number"===typeof item&&0<=item&&this.items&&this.items.length>item){this._deselectItem(this.items[item])}else{this._deselectItem(item)}},_deselectItem:function _deselectItem(item){this._setSelectedItem(null);var index=this.selectedItems.indexOf(item);if(this.selectedItems.inverted){if(-1===index){this.push("selectedItems",item)}}else{if(-1<index){this.splice("selectedItems",index,1)}}},_isSelected:function _isSelected(item,selectedItems){var selected=-1<selectedItems.indexOf(item);return selectedItems.inverted?!selected:selected},/*
   * Selects all the items in the list.
   */selectAll:function selectAll(){var selectedItems=[];selectedItems.inverted=!0;// use a copy of filter so that we can safely send separate changed
// notifications for both filter and selectedItems.filter
selectedItems.filters=this.filter.slice(0)||[];this._setSelectedItems(selectedItems)},/**
   * Clears the current selection state.
   */clearSelection:function clearSelection(){var selectedItems=[];selectedItems.inverted=!1;// use a copy of filter so that we can safely send separate changed
// notifications for both filter and selectedItems.filter
selectedItems.filters=this.filter.slice(0)||[];this._setSelectedItems(selectedItems);if(this.selectedItem!==void 0){this._setSelectedItem(null)}},_toggleSelectAll:function _toggleSelectAll(){if(this._isSelectAllChecked(this.selectedItems.length,this.selectedItems.inverted,this.size)){this._fireEvent("deselecting-all-items",{items:this.selectedItems},this.clearSelection)}else{this._fireEvent("selecting-all-items",{items:this.selectedItems},this.selectAll)}},_isSelectAllChecked:function _isSelectAllChecked(selectedItemsLength,inverted,size){return 0<size&&selectedItemsLength===(inverted?0:size)},_isSelectAllIndeterminate:function _isSelectAllIndeterminate(length,size){return 0<size&&0<length&&length<size},_isEven:function _isEven(index){return 0===index%2},_resetData:function _resetData(dataSource,filter,sortOrder){// Resetting scroll position and selection for consistency here. They are
// both reset implicitly when a new _cachedItems is set to iron-list, but
// that doesn't happen when size of the dataset changes only by a few items.
this.clearSelection();this.clearCache();this.$.list.scrollToIndex(0)},_sortDirectionChanged:function _sortDirectionChanged(e){for(var i=0;i<this.sortOrder.length;i++){if(this.sortOrder[i].path===e.detail.path){if(e.detail.direction){this.set("sortOrder."+i+".direction",e.detail.direction)}else{this.splice("sortOrder",i,1)}return}}this.push("sortOrder",{path:e.detail.path,direction:e.detail.direction})},_columnsChanged:function _columnsChanged(columns,oldColumns){if(oldColumns){oldColumns.forEach(function(column){this.unlisten(column,"filter-value-changed")}.bind(this))}if(columns){columns.forEach(function(column){column.table=this;this.listen(column,"filter-value-changed","_onColumnFilterChanged")}.bind(this))}},_onColumnFilterChanged:function _onColumnFilterChanged(e){for(var i=0;i<this.filter.length;i++){if(this.filter[i].path===e.detail.filterBy){this.set("filter."+i+".filter",e.detail.value);// selectedItems.filter is actually already set at this point when
// clearSelection is called after filter is set.
this.set("selectedItems.filters."+i+".filter",e.detail.value);return}}this.push("filter",{path:e.detail.filterBy,filter:e.detail.value});this.push("selectedItems.filters",{path:e.detail.filterBy,filter:e.detail.value})},_resizeCellContainers:function _resizeCellContainers(){var _this2=this;// reset header width first to make the cells and scroll width to reset their widths.
this.$.container.style.width="";async.microTask.run(function(){_this2.$.container.style.width=Math.min(_this2.scrollWidth,_this2.clientWidth+_this2.scrollLeft)+"px";// add scrollbar width as padding
_this2.$.header.style.paddingRight=_this2.$.list.offsetWidth-_this2.$.list.clientWidth+"px"})},_onHorizontalScroll:function _onHorizontalScroll(){if(!this.isDebouncerActive("scrolling")){this.$.container.style.width=this.scrollWidth+"px";this.debounce("scrolling",function(){this.$.container.style.width=Math.min(this.scrollWidth,this.clientWidth+this.scrollLeft)+"px";// long timeout here to prevent jerkiness with the rubberband effect on iOS especially.
},1e3)}},_onVerticalScroll:function _onVerticalScroll(e){// Toggle shadow when at the top
this.toggleClass("scrolled",1<=this.$.list.scrollTop,this.$.header);this._currentPage=Math.max(0,Math.floor(this.$.list.scrollTop/this.$.list._physicalAverage/this.pageSize))},/**
   * Lazy loading
   */_itemsChanged:function _itemsChanged(items){if(("items"===items.path||"items.splices"===items.path)&&Array.isArray(items.base)){this.size=items.base.length;this.dataSource=new ArrayDataSource(items.base)}else if(0===items.path.indexOf("items.#")&&Array.isArray(items.base)){var index=items.path.split(".")[1].substring(1),item=this.items[index],cachedIndex=this._cachedItems.indexOf(item);if(0<=cachedIndex){this.set(items.path.replace("items.","_cachedItems.").replace("#"+index,cachedIndex),items.value)}}},_itemChanged:function _itemChanged(e){if(this.items){var index=this.items.indexOf(e.detail.item);if(0<=index){this.set("items."+index+"."+e.detail.path,e.detail.value)}}if(this.autoRefresh!==void 0){this.debounce("auto-refresh",function(){this.refreshPage(this._currentPage)},this.autoRefresh)}},_currentPageChanged:function _currentPageChanged(dataSource,page){if(!this._isPageCached(page)){this.loading=!0}this.debounce("loading",function(){this._loadPage(dataSource,page);if(page+1<this.size/this.pageSize){this._loadPage(dataSource,page+1)}if(0<page){this._loadPage(dataSource,page-1)}}.bind(this),100)},_isPageLoading:function _isPageLoading(page){return-1<this._pagesLoading.indexOf(page)},_addLoadingPage:function _addLoadingPage(page){if(!this._isPageLoading(page)){this.push("_pagesLoading",page)}this.loading=0<this._pagesLoading.length},_removeLoadingPage:function _removeLoadingPage(page){var index=this._pagesLoading.indexOf(page);if(-1!==index){this.splice("_pagesLoading",index,1)}this.loading=0<this._pagesLoading.length},_isPageCached:function _isPageCached(page){return this._cachedPages&&-1<this._cachedPages.indexOf(page)},_loadPage:function _loadPage(dataSource,page){if(this._isPageCached(page)){this._removeLoadingPage(page)}else if(!this._isPageLoading(page)){this._addLoadingPage(page);var success=function(items,size){this.push("_cachedPages",page);if(size!==void 0){this.size=size}for(var start=page*this.pageSize,i=0;i<this.pageSize;i++){var index=start+i,item=items[i];this.set("_cachedItems."+index,item);// TODO: send an issue/pr to iron-list, that makes sure the internal
// collection stays up-to-date when `items` change.
// When _collection gets out-of-sync things like selection and
// notifying [[item]] bindings break.
this.$.list._collection.store[index]=item;if(item&&"object"==babelHelpers.typeof(item)){this.$.list._collection.omap.set(item,index)}else{this.$.list._collection.pmap[item]=index}}// resize required for variable row height items.
// debouncing for optimizing when multiple requests are running at
// the same time.
this.debounce("resizing",function(){this.$.list.notifyResize()}.bind(this),100);this._removeLoadingPage(page)}.bind(this),err=function(){this._removeLoadingPage(page)}.bind(this);dataSource({page:page,pageSize:this.pageSize,filter:this.filter,sortOrder:this.sortOrder},success,err)}},_sizeChanged:function _sizeChanged(size,oldSize){// Optimization: Calling `set` on _cachedItems will reset the scroll position and selections,
// using `push` and `pop` with large changes (more than 1000 items) is a heavy operation
// that jams things up.
if(this._cachedItems&&Math.abs(this._cachedItems.length-size)<2*this.pageSize){while(this._cachedItems.length<size){this.push("_cachedItems",{})}while(this._cachedItems.length>size){this.pop("_cachedItems")}}else{var items=[];while(items.length<size){items.push({})}this.set("_cachedItems",items)}// when size increases, old last page needs to be refreshed.
if(size>oldSize){var oldLastPage=Math.floor(oldSize/this.pageSize);if(this._isPageCached(oldLastPage)||0===oldLastPage){this.refreshPage(oldLastPage)}}},/**
   * Clears the cached pages and reloads data from datasource when needed.
   */clearCache:function clearCache(){this._cachedPages=[];// Force reload on currently visible pages.
this.refreshPage(this._currentPage)},/**
   * Clears the cache for a page and reloads the data from datasource.
   */refreshPage:function refreshPage(page){if(this._cachedPages){var index=this._cachedPages.indexOf(page);if(-1<index){this.splice("_cachedPages",index,1)}}this._currentPageChanged(this.dataSource,page)},_updateSizeForItem:function _updateSizeForItem(event){if(event.model.get("item")){// notifyResize() doesn't do anything on iOS if the viewport size hasn't changed
// so calling updateSizeForItem(item) is more reliable.
// TODO: However, since we're reusing the same items array in most cases,
// the _collection item map inside <iron-list> gets out of sync and
// that breaks things like selection and updateSizeForItem.
// To mitigate the issue, we'll update height of every row element.
// Can be optimized later if needed to update only the row that has
// expanded or collapsed.
for(var itemSet=[],i=0;i<this.$.list._physicalItems.length;i++){itemSet.push(i)}// extracted from updateSizeFromItem(item) in <iron-list>
this.$.list._updateMetrics(itemSet);this.$.list._positionItems()}},/**
   * Expands the row details for this item, if available.
   */expandItem:function expandItem(item){if(this.rowDetail&&this._expandedItems&&!this._isExpanded(item,this._expandedItems)){// replacing the whole array here to simplify the observers.
this._expandedItems.push(item);this._expandedItems=this._expandedItems.slice(0)}},/**
   * Collapses the row details for this item, if expanded.
   */collapseItem:function collapseItem(item){if(this.rowDetail&&this._expandedItems&&this._isExpanded(item,this._expandedItems)){var index=this._expandedItems.indexOf(item);// replacing the whole array here to simplify the obsevers.
this._expandedItems.splice(index,1);this._expandedItems=this._expandedItems.slice(0)}},_isExpanded:function _isExpanded(item,items){return items&&-1<items.indexOf(item)},_isFocusable:function _isFocusable(target){if((void 0).useNativeShadow){// https://nemisj.com/focusable/
// tabIndex is not reliable in IE.
return 0<=target.tabIndex}else{// unreliable with Shadow, document.activeElement doesn't go inside
// the shadow root.
return target.contains((0,_polymerDom.dom)(document.activeElement).node)||"A"===target.tagName.toUpperCase()}},/**
   * Fired when user clicks on a item to select it.
   *
   * @event selecting-item
   * @param {Object} detail
   * @param {Object} detail.item item to be selected
   */ /**
   * Fired when user clicks on a item to deselect it.
   *
   * @event deselecting-item
   * @param {Object} detail
   * @param {Object} detail.item item to be deselected
   */ /**
   * Fired when user clicks on the select all checkbox to select items.
   *
   * @event selecting-all-items
   * @param {Object} detail
   * @param {Object} detail.items currently selected items
   */ /**
   * Fired when user clicks on the select all checkbox to deselect items.
   *
   * @event deselecting-all-items
   * @param {Object} detail
   * @param {Object} detail.items currently selected items
   */ /**
   * Fired when user clicks on a item to expand it.
   *
   * @event expanding-item
   * @param {Object} detail
   * @param {Object} detail.item item to be expanded
   */ /**
   * Fired when user clicks on a item to collapse it.
   *
   * @event collapsing-item
   * @param {Object} detail
   * @param {Object} detail.item item to be collapsed
   */ // we need to listen to click instead of tap because on mobile safari, the
// document.activeElement has not been updated (focus has not been shifted)
// yet at the point when tap event is being executed.
_onCellClick:function _onCellClick(e){// Prevent item selection if row itself is not focused. This means that
// an element inside the row has been focused.
// Mobile devices don't move focus from body unless it's an input element that is focused, so this element will never get focused.
if(this._isFocusable((0,_polymerDom.dom)(e).localTarget)){return}else{if(this.rowDetail&&this.detailsEnabled){if(this._isExpanded(e.model.item,this._expandedItems)){this._fireEvent("collapsing-item",e.model.item,this.collapseItem)}else{this._fireEvent("expanding-item",e.model.item,this.expandItem)}}if(this.selectionEnabled){if(this._isSelected(e.model.item,this.selectedItems)){this._fireEvent("deselecting-item",e.model.item,this.deselectItem)}else{this._fireEvent("selecting-item",e.model.item,this.selectItem)}}}},_fireEvent:function _fireEvent(eventName,item,defaultAction){var e=this.fire(eventName,{item:item},{cancelable:!0});if(!e.defaultPrevented){defaultAction.call(this,item)}},_onCheckBoxTap:function _onCheckBoxTap(e){if(this._isSelected(e.model.item,this.selectedItems)){this._fireEvent("deselecting-item",e.model.item,this.deselectItem)}else{this._fireEvent("selecting-item",e.model.item,this.selectItem)}}});_exports.IronDataTable=IronDataTable});