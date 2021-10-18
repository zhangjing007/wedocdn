/*!
 * LMV v7.54.0
 *
 * Copyright 2021 Autodesk, Inc.
 * All rights reserved.
 *
 * This computer source code and related instructions and comments are the
 * unpublished confidential and proprietary information of Autodesk, Inc.
 * and are protected under Federal copyright and state trade secret law.
 * They may not be disclosed to, copied or used by any third party without
 * the prior written consent of Autodesk, Inc.
 *
 * Autodesk Forge Viewer Usage Limitations:
 *
 * The Autodesk Forge Viewer JavaScript must be delivered from an
 * Autodesk-hosted URL.
 */
/******/ (() => { // webpackBootstrap
/******/ 	// runtime can't be in strict mode because a global variable is assign and maybe created.
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./extensions/DocumentBrowser/Panel.css":
/*!***************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./extensions/DocumentBrowser/Panel.css ***!
  \***************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! res/icon-view-3d-dark.svg */ "./extensions/DocumentBrowser/res/icon-view-3d-dark.svg"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(/*! res/icon-view-2d-dark.svg */ "./extensions/DocumentBrowser/res/icon-view-2d-dark.svg"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_2___ = new URL(/* asset import */ __webpack_require__(/*! res/icon-view-3d-light.svg */ "./extensions/DocumentBrowser/res/icon-view-3d-light.svg"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_3___ = new URL(/* asset import */ __webpack_require__(/*! res/icon-view-2d-light.svg */ "./extensions/DocumentBrowser/res/icon-view-2d-light.svg"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
var ___CSS_LOADER_URL_REPLACEMENT_2___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_2___);
var ___CSS_LOADER_URL_REPLACEMENT_3___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_3___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/**\n * Geometry icons, we have 2 of them:\n  * - A cube for 3D geometries\n  * - A tileset-thingy for 2D sheets\n */\n.adsk-viewing-viewer leaf > lmvheader > geom_icon,\n.adsk-viewing-viewer group > lmvheader > geom_icon {\n  display: inline-block;\n  background-repeat: no-repeat;\n  width: 24px;\n  height: 24px;\n  padding-left: 5px;\n  transform: translateY(6px); }\n\n.adsk-viewing-viewer .viewer-document-browser .settings-tabs ul li,\n.adsk-viewing-viewer .viewer-document-browser .settings-tabs ul li a {\n  width: 50%; }\n\n/**\n * DARK THEME\n */\n.adsk-viewing-viewer.dark-theme leaf.geometry_3d > lmvheader > geom_icon,\n.adsk-viewing-viewer.dark-theme group.geometry_3d > lmvheader > geom_icon {\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + "); }\n\n.adsk-viewing-viewer.dark-theme leaf.geometry_2d > lmvheader > geom_icon,\n.adsk-viewing-viewer.dark-theme group.geometry_2d > lmvheader > geom_icon {\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_1___ + "); }\n\n.adsk-viewing-viewer.dark-theme .mb-ext-tab-bar {\n  background-color: rgba(34, 34, 34, 0.9);\n  text-align: center; }\n\n.adsk-viewing-viewer.dark-theme .mb-ext-tab-bar-btn {\n  width: 40%;\n  height: 60%;\n  margin: auto; }\n\n/**\n * LIGHT THEME\n */\n.adsk-viewing-viewer.light-theme leaf.geometry_3d > lmvheader > geom_icon,\n.adsk-viewing-viewer.light-theme group.geometry_3d > lmvheader > geom_icon {\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_2___ + "); }\n\n.adsk-viewing-viewer.light-theme leaf.geometry_2d > lmvheader > geom_icon,\n.adsk-viewing-viewer.light-theme group.geometry_2d > lmvheader > geom_icon {\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_3___ + "); }\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./extensions/DocumentBrowser/ThumbnailList.css":
/*!***********************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./extensions/DocumentBrowser/ThumbnailList.css ***!
  \***********************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".viewer-ext-docbrowser-thumbnail {\n  border: 1px solid black;\n  background-color: #e8e8e8;\n  margin: 6px auto;\n  cursor: pointer; }\n\n.viewer-ext-docbrowser-thumbnail-selected {\n  border: solid 3px #1dc7f3;\n  border-radius: 4px; }\n\n/* the label */\n.viewer-ext-docbrowser-thumbnail-selected > div {\n  background-color: #1dc7f3;\n  color: black; }\n\n/* hide label when hovering image */\n.viewer-ext-docbrowser-thumbnail:hover > div {\n  opacity: 0; }\n\n.viewer-ext-docbrowser-thumbnail-spinner {\n  animation: loading-spinner-perpetual-motion 1s infinite linear;\n  /* from styles.css */\n  margin: 65px auto;\n  width: 60px; }\n\n.viewer-ext-docbrowser-thumbnail-label {\n  background: #c7c7d4;\n  color: #0a131c;\n  position: relative;\n  transform: translate(0, -100%);\n  bottom: 5px; }\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./extensions/DocumentBrowser/uiController.css":
/*!**********************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./extensions/DocumentBrowser/uiController.css ***!
  \**********************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! res/folder-16-dark.svg */ "./extensions/DocumentBrowser/res/folder-16-dark.svg"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(/*! res/folder-16-active.svg */ "./extensions/DocumentBrowser/res/folder-16-active.svg"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_2___ = new URL(/* asset import */ __webpack_require__(/*! res/folder-16-light.svg */ "./extensions/DocumentBrowser/res/folder-16-light.svg"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
var ___CSS_LOADER_URL_REPLACEMENT_2___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_2___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".adsk-viewing-viewer .adsk-icon-documentModels {\n  background-repeat: no-repeat !important;\n  background-size: 80% !important;\n  margin-left: 4px;\n  margin-top: 3px; }\n\n/**\n * DARK THEME\n */\n.adsk-viewing-viewer.dark-theme .adsk-icon-documentModels {\n  background: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + "); }\n\n.adsk-viewing-viewer.dark-theme .adsk-icon-documentModels:hover,\n.adsk-viewing-viewer.dark-theme .active .adsk-icon-documentModels {\n  background: url(" + ___CSS_LOADER_URL_REPLACEMENT_1___ + "); }\n\n/**\n * LIGHT THEME\n */\n.adsk-viewing-viewer.light-theme .adsk-icon-documentModels {\n  background: url(" + ___CSS_LOADER_URL_REPLACEMENT_2___ + "); }\n\n.adsk-viewing-viewer.light-theme .adsk-icon-documentModels:hover,\n.adsk-viewing-viewer.light-theme .active .adsk-icon-documentModels {\n  background: url(" + ___CSS_LOADER_URL_REPLACEMENT_1___ + "); }\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var _i = 0; _i < this.length; _i++) {
        var id = this[_i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i2 = 0; _i2 < modules.length; _i2++) {
      var item = [].concat(modules[_i2]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js":
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (url, options) {
  if (!options) {
    options = {};
  }

  if (!url) {
    return url;
  }

  url = String(url.__esModule ? url.default : url); // If url is already wrapped in quotes, remove them

  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }

  if (options.hash) {
    url += options.hash;
  } // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls


  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }

  return url;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/noSourceMaps.js":
/*!**************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/noSourceMaps.js ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (i) {
  return i[1];
};

/***/ }),

/***/ "./extensions/DocumentBrowser/Panel.js":
/*!*********************************************!*\
  !*** ./extensions/DocumentBrowser/Panel.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Panel": () => (/* binding */ Panel)
/* harmony export */ });
/* harmony import */ var _Panel_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Panel.css */ "./extensions/DocumentBrowser/Panel.css");
/* harmony import */ var _TreeViewDelegate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TreeViewDelegate */ "./extensions/DocumentBrowser/TreeViewDelegate.js");
/* harmony import */ var _ThumbnailList__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ThumbnailList */ "./extensions/DocumentBrowser/ThumbnailList.js");
function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _get(target, property, receiver) {if (typeof Reflect !== "undefined" && Reflect.get) {_get = Reflect.get;} else {_get = function _get(target, property, receiver) {var base = _superPropBase(target, property);if (!base) return;var desc = Object.getOwnPropertyDescriptor(base, property);if (desc.get) {return desc.get.call(receiver);}return desc.value;};}return _get(target, property, receiver || target);}function _superPropBase(object, property) {while (!Object.prototype.hasOwnProperty.call(object, property)) {object = _getPrototypeOf(object);if (object === null) break;}return object;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}




var av = Autodesk.Viewing;
var avu = Autodesk.Viewing.UI;

var TAB_ID_TREE = 'tree';
var TAB_ID_THUMBS = 'thumbnails';

var HEIGHT_ADJUSTMENT = 50 /*title-bar*/ + 40 /*tab-bar*/ + 20 /*footer*/;


// avu.SettingsPanel will not be available in headless mode, 
// so we switch to an empty super class to prevent an exception 
// thrown by babel env preset - "TypeError: Super expression must either be null or a function"
var SuperClass = avu.SettingsPanel || /*#__PURE__*/function () {function _class() {_classCallCheck(this, _class);}return _class;}();

var Panel = /*#__PURE__*/function (_SuperClass) {_inherits(Panel, _SuperClass);var _super = _createSuper(Panel);

  function Panel(viewer, currNode) {var _this;_classCallCheck(this, Panel);
    _this = _super.call(this, viewer.container, 'lmv-document-extension_' + viewer.id, 'Document Browser', { heightAdjustment: HEIGHT_ADJUSTMENT });
    _this.setGlobalManager(viewer.globalManager);

    _this.title.classList.add("docking-panel-delimiter-shadow");
    _this.container.classList.add("viewer-document-browser");
    _this.container.classList.add('viewer-settings-panel');

    _this.currNode = currNode;
    _this.viewer = viewer;
    _this._created = false;
    _this._showThumbnails = true; // Show the thumbnails tab.
    return _this;}_createClass(Panel, [{ key: "setChangeModelHandler", value: function setChangeModelHandler(

    changeModelFn) {
      this._changeModelFn = changeModelFn;
    } }, { key: "setThumbnailVisibility", value: function setThumbnailVisibility(

    value) {
      this._showThumbnails = value;
    } }, { key: "toggleVisibility", value: function toggleVisibility()

    {
      if (this._created) {
        var isVisible = this.container.style.display !== 'none';
        this.setVisible(!isVisible);

        // Add or remove the thumbail tab depending on the set variable.
        if (this._showThumbnails) {
          this.addTab(TAB_ID_THUMBS, "Thumbnails", {});
        } else {
          this.selectTab(TAB_ID_TREE);
          this.removeTab(TAB_ID_THUMBS);
        }

      } else {
        // Create UI for the first time.
        this.addTab(TAB_ID_TREE, "Tree", {});
        if (this._showThumbnails) {
          this.addTab(TAB_ID_THUMBS, "Thumbnails", {});
        }
        this.selectTab(TAB_ID_TREE);
        this.setVisible(true);
        this.container.style.top = '30px';
        this.container.style.width = '400px';
        this.resizeToContent();
        this._created = true;
      }
    } }, { key: "destroy", value: function destroy()

    {
      if (this.myThumbnailList) {
        this.myThumbnailList.destroy();
        this.myThumbnailList = null;
      }
      if (this.myTree) {
        this.myTree.destroy();
        this.myTree = null;
      }
      if (this.container) {
        this.container.parentElement.removeChild(this.container);
        this.container = null;
      }
    } }, { key: "setVisible", value: function setVisible(

    show) {
      _get(_getPrototypeOf(Panel.prototype), "setVisible", this).call(this, show);
    }

    /** 
       * @param {BubbleNode} currNode - Node to be highlighted on the list 
       */ }, { key: "setCurrentNode", value: function setCurrentNode(
    currNode) {
      this.currNode = currNode;
      this._updateTreeSelection(currNode);
    }

    /**
       * Overrides base class implementation so that the thumbnail
       * list view gets created the first time the tab is selected.
       */ }, { key: "selectTab", value: function selectTab(
    tabId) {

      // Create UI first time it gets used.
      switch (tabId) {
        case TAB_ID_TREE:
          this._createTreeView();
          break;

        case TAB_ID_THUMBS:
          this._createThumbnailView();
          break;}


      var ret = _get(_getPrototypeOf(Panel.prototype), "selectTab", this).call(this, tabId);
      this._updateTreeSelection(this.currNode, tabId);
      this._scrollToSelection(tabId);
      return ret;
    }

    /**
       * @private
       */ }, { key: "_getTabDiv", value: function _getTabDiv(
    tabId) {
      var index = this.tabIdToIndex[tabId];
      if (index === undefined)
      return null;

      var table = this.tablesContainer.childNodes[index];
      return table.tBodies[0];
    }

    /**
       * @private
       */ }, { key: "_createTreeView", value: function _createTreeView()
    {
      if (this.myTree) return;

      var rootNode = this.currNode.getRootNode();
      var delegate = (0,_TreeViewDelegate__WEBPACK_IMPORTED_MODULE_1__.createTreeViewDelegate)(rootNode, this);
      var options = {
        leafClassName: 'docBrowserLeaf',
        selectedClassName: 'selected-ex' };


      var container = this._getTabDiv(TAB_ID_TREE);

      this.myTree = new Autodesk.Viewing.UI.Tree(
      delegate,
      rootNode,
      container,
      options);

    }

    /**
       * @private
       */ }, { key: "_createThumbnailView", value: function _createThumbnailView()
    {

      if (this.myThumbnailList) return;

      var container = this._getTabDiv(TAB_ID_THUMBS);
      var rootNode = this.currNode.getRootNode();
      this.myThumbnailList = new _ThumbnailList__WEBPACK_IMPORTED_MODULE_2__.ThumbnailListView(container, rootNode, this);
      this.myThumbnailList.setGlobalManager(this.globalManager);
      this.myThumbnailList.initialize();
    }

    /**
       * @param {BubbleNode} bubbleNode
       * @param {string} [tabId] - optional, the specific tabId to update.
       * @private
       */ }, { key: "_updateTreeSelection", value: function _updateTreeSelection(
    bubbleNode, tabId) {
      var geomNode = this.currNode.findParentGeom2Dor3D();
      var selection = [geomNode];
      if (geomNode !== bubbleNode) {
        selection.push(bubbleNode);
      }

      tabId = tabId || this.getSelectedTabId();
      switch (tabId) {
        case TAB_ID_TREE:
          this.myTree.setSelection(selection);
          break;

        case TAB_ID_THUMBS:
          this.myThumbnailList.setSelection(selection);
          break;}

    }

    /**
       * @private
       */ }, { key: "_scrollToSelection", value: function _scrollToSelection(
    tabId) {
      switch (tabId) {
        case TAB_ID_TREE:
          this.myTree.scrollTo(this.myTree.getSelection()[0]);
          break;

        case TAB_ID_THUMBS:
          this.myThumbnailList.scrollToSelection();
          break;}

    }

    /**
       * @private
       */ }, { key: "_tryLoad", value: function _tryLoad(
    bubbleNode) {var _this2 = this;

      // Avoid loading the same model
      var currGeomNode = this.currNode.findParentGeom2Dor3D();
      var nextGeomNode = bubbleNode.findParentGeom2Dor3D({ fallbackParent: currGeomNode });

      // Click on something that doesn't represent a geometry, like a folder.
      if (!nextGeomNode)
      return;

      // The next model is different, load it.
      if (currGeomNode !== nextGeomNode) {

        this.currNode = bubbleNode;
        this._updateTreeSelection(bubbleNode);
        this._changeModelFn(bubbleNode).
        then(function () {
          _this2._hookUnselectCameraChange(bubbleNode);
        });
        return;
      }

      // Same model

      // view?
      if (bubbleNode.isViewPreset()) {
        this._updateTreeSelection(bubbleNode);
        this.viewer.setView(bubbleNode);
        this._hookUnselectViewAfterTransition(bubbleNode);
        return;
      }

      if (bubbleNode.isGeometry()) {
        this._updateTreeSelection(bubbleNode);
        this.viewer.setViewFromFile(this.viewer.model);
        return;
      }

    }

    /**
       * Unselects a `view` node when the camera changes.
       * No point in having a view selected once a camera interaction takes place.
       * 
       * @param {BubbleNode} bubbleNode
       *
       * @private
       */ }, { key: "_hookUnselectViewAfterTransition", value: function _hookUnselectViewAfterTransition(
    bubbleNode) {var _this3 = this;
      if (!bubbleNode || bubbleNode.type() !== 'view')
      return;

      this.viewer.addEventListener(av.CAMERA_TRANSITION_COMPLETED, function () {
        _this3._hookUnselectCameraChange(bubbleNode);
      }, { once: true });
    }

    /**
       * Unselects a `view` node when the camera changes.
       * No point in having a view selected once a camera interaction takes place.
       * 
       * @param {Autodesk.Viewing.BubbleNode} bubbleNode
       *
       * @private
       */ }, { key: "_hookUnselectCameraChange", value: function _hookUnselectCameraChange(
    bubbleNode) {var _this4 = this;
      if (!bubbleNode || bubbleNode.type() !== 'view')
      return;

      // Need to delay the hook...
      setTimeout(function () {
        _this4.viewer.addEventListener(av.CAMERA_CHANGE_EVENT, function () {
          _this4.myTree.removeFromSelection([bubbleNode]);
        }, { once: true });
      }, 200);
    } }]);return Panel;}(SuperClass);

/***/ }),

/***/ "./extensions/DocumentBrowser/ThumbnailList.js":
/*!*****************************************************!*\
  !*** ./extensions/DocumentBrowser/ThumbnailList.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ThumbnailListView": () => (/* binding */ ThumbnailListView)
/* harmony export */ });
/* harmony import */ var _ThumbnailList_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ThumbnailList.css */ "./extensions/DocumentBrowser/ThumbnailList.css");
function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}
var av = Autodesk.Viewing;
var avp = av.Private;

var THUMBNAIL_SIZE = 200;



var ThumbnailListView = /*#__PURE__*/function () {

  function ThumbnailListView(container, rootNode, panel) {_classCallCheck(this, ThumbnailListView);

    this._parentDiv = container;
    this._rootNode = rootNode;
    this._panelRef = panel;
    this._requestNextThumbnail = this._requestNextThumbnail.bind(this);
    this._onThumbnailClick = this._onThumbnailClick.bind(this);
    this._selection = null;
  }_createClass(ThumbnailListView, [{ key: "initialize", value: function initialize()

    {

      var _document = this.getDocument();
      var _window = this.getWindow();
      this._container = _document.createElement('div');
      this._container.style['text-align'] = 'center';

      this._pendingImage = [];
      this._mapping = {}; // Keeps a map from BubbleNode.guid() into the BubbleNode instance.
      var geometries = this._rootNode.search({ type: 'geometry' });
      for (var i = 0, len = geometries.length; i < len; ++i) {

        var bubbleNode = geometries[i];
        var _guid = bubbleNode.guid();

        if (!_guid)
        continue;

        var thumbnail = this._createThumbnail(bubbleNode);
        this._container.appendChild(thumbnail);
        this._pendingImage.push(bubbleNode);

        this._mapping[_guid] = {
          bubbleNode: bubbleNode,
          div: thumbnail };


      }

      this._container.addEventListener('click', this._onThumbnailClick);

      this._parentDiv.appendChild(this._container);
      _window.requestAnimationFrame(this._requestNextThumbnail);
    } }, { key: "destroy", value: function destroy()

    {

      if (this._parentDiv) {
        this._parentDiv.removeChild(this._container);
        this._container.removeEventListener('click', this._onThumbnailClick);
        this._container = null;
        this._parentDiv = null;
      }

      this._selection = null;
      this._rootNode = null;
      this._panelRef = null;
      this._mapping = null;
    } }, { key: "isVisible", value: function isVisible()

    {
      return this._container.style.display !== 'none';
    } }, { key: "show", value: function show(

    visible) {
      this._container.style.display = visible ? '' : 'none';
      if (visible) {
        this._requestNextThumbnail(); // resume thumbnails (if any)
      }
    } }, { key: "setSelection", value: function setSelection(

    bubbleNodeList) {
      var bubbleNode = bubbleNodeList[0]; // TODO: Can do better
      this._selection = bubbleNode;

      // Iterate over all divs and update selection CSS
      for (var key in this._mapping) {
        var data = this._mapping[key];
        var bSelected = data.bubbleNode === bubbleNode;
        if (bSelected) {
          data.div.classList.add('viewer-ext-docbrowser-thumbnail-selected');
        } else {
          data.div.classList.remove('viewer-ext-docbrowser-thumbnail-selected');
        }
      }
    } }, { key: "scrollToSelection", value: function scrollToSelection()

    {
      if (!this._selection)
      return;
      // Get the div element
      var guid = this._selection.guid();
      var elem = this._mapping[guid].div;
      // Find scroll value and scroll
      var total = elem.offsetTop;
      elem = elem.parentNode;
      while (elem && elem != this._parentDiv) {
        total += elem.offsetTop;
        elem = elem.parentNode;
      }
      this._panelRef.scrollContainer.scrollTop = total;
    }

    /**
       * @private
       */ }, { key: "_onThumbnailClick", value: function _onThumbnailClick(
    event) {
      if (event.target === this._container)
      return;

      var guid;
      var target = event.target;
      do {
        guid = target.getAttribute('bubble-guid');
        target = target.parentElement;
      } while (target !== this._container && !guid);

      if (guid) {
        var bubbleNode = this._mapping[guid].bubbleNode;
        this._panelRef._tryLoad(bubbleNode);
      }
    }

    /**
       * Creates and returns a <div> containing a loading spinner and a label
       * showing the name associated to the bubbleNode.
       *
       * @private
       */ }, { key: "_createThumbnail", value: function _createThumbnail(
    bubbleNode) {

      var _document = this.getDocument();
      // container
      var div = _document.createElement('div');
      div.classList.add('viewer-ext-docbrowser-thumbnail');
      div.setAttribute('bubble-guid', bubbleNode.guid());
      div.style.width = THUMBNAIL_SIZE + 'px';
      div.style.height = THUMBNAIL_SIZE + 'px';

      // loading spinner
      var img = _document.createElement('img');
      img.src = avp.getResourceUrl('res/ui/spinner.png');
      img.classList.add('viewer-ext-docbrowser-thumbnail-spinner');
      div.appendChild(img);

      // label
      var label = _document.createElement('div');
      label.innerText = bubbleNode.name();
      label.classList.add('viewer-ext-docbrowser-thumbnail-label');
      div.appendChild(label);

      return div;
    }

    /**
       * @private
       */ }, { key: "_requestNextThumbnail", value: function _requestNextThumbnail()
    {var _this = this;

      if (this._requestingThumbnail)
      return;

      if (!this.isVisible())
      return;

      var bubbleNode = this._getNextThumbnailRequest();
      if (!bubbleNode)
      return;

      this._requestingThumbnail = true;
      av.Thumbnails.getUrlForBubbleNode(bubbleNode).
      then(function (srcUrl) {
        _this._onThumbnailUrlReady(srcUrl, bubbleNode);
      }).
      catch(function (err) {
        _this._onThumbnailUrlError(err, bubbleNode);
      });
    }

    /**
       * Returns a BubbleNode associated to a thumbnail <div> that is visible to 
       * the user and has not had its thumbnail fetched yet.
       *
       * @private
       */ }, { key: "_getNextThumbnailRequest", value: function _getNextThumbnailRequest()
    {
      // TODO: figure out which thumbnails are currently visible to the user
      // and return one of those.
      // If none are visible, then return any other thumbnail.
      return this._pendingImage.shift();
    }

    /**
       * Removes spinner and replaces it with the thumbnail image.
       * It then requests the next thumbnail.
       *
       * @private
       */ }, { key: "_onThumbnailUrlReady", value: function _onThumbnailUrlReady(
    srcUrl, bubbleNode) {

      // Check to see if the class has been destroyed.
      if (!this._mapping) {
        return;
      }

      var _guid = bubbleNode.guid();
      var nodeData = this._mapping[_guid];
      var thumbnail = nodeData.div;

      // Remove spinner
      var spinnerImg = thumbnail.querySelector('img');
      thumbnail.removeChild(spinnerImg);

      // Add thumbnail image
      var _document = this.getDocument();
      var _window = this.getWindow();
      var img = _document.createElement('img');
      img.style.width = THUMBNAIL_SIZE + 'px';
      img.style.height = THUMBNAIL_SIZE + 'px';
      img.src = srcUrl;
      thumbnail.insertBefore(img, thumbnail.firstChild);

      // Next thumbnail
      this._requestingThumbnail = false;
      _window.requestAnimationFrame(this._requestNextThumbnail);
    }

    /**
       * Removes spinner animation and replaces it with an error-thumbnail.
       * It then requests the next thumbnail.
       *
       * @private
       */ }, { key: "_onThumbnailUrlError", value: function _onThumbnailUrlError(
    err, bubbleNode) {

      // Check to see if the class has been destroyed.
      if (!this._mapping) {
        return;
      }

      var _guid = bubbleNode.guid();
      var nodeData = this._mapping[_guid];
      var thumbnail = nodeData.div;

      // Remove spinner
      var spinnerImg = thumbnail.querySelector('img');
      thumbnail.removeChild(spinnerImg);

      // Inform user that thumbnail is unavailable
      thumbnail.style['background-color'] = '#c5c2c2'; // TODO: Can do better

      // Next thumbnail
      this._requestingThumbnail = false;
      var _window = this.getWindow();
      _window.requestAnimationFrame(this._requestNextThumbnail);
    } }]);return ThumbnailListView;}();



av.GlobalManagerMixin.call(ThumbnailListView.prototype);

/***/ }),

/***/ "./extensions/DocumentBrowser/TreeViewDelegate.js":
/*!********************************************************!*\
  !*** ./extensions/DocumentBrowser/TreeViewDelegate.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createTreeViewDelegate": () => (/* binding */ createTreeViewDelegate)
/* harmony export */ });

var TREE_VIEW_LEAF = 'leaf';
var TREE_VIEW_GROUP = 'group';

/**
                                * Creates a Tree delegate, used to render the Model Browser's Tree View.
                                */
function createTreeViewDelegate(rootNode, panel) {

  // Iterate through all BubbleNodes and identify which ones are
  // going to be displayed by the Tree view.
  var treeViewData = collectTreeViewData(rootNode);

  var delegate = new Autodesk.Viewing.UI.TreeDelegate();
  delegate.setGlobalManager(panel.globalManager);
  delegate.getTreeNodeId = function (node) {
    return node.guid();
  };
  delegate.getTreeNodeLabel = function (node) {
    // Just the name for now, but can display any info from the node.
    //
    return node.name() || node._raw().type;
  };
  delegate.getTreeNodeClass = function (node) {
    // Return the type of the node.  This way, in css, the designer can specify
    // custom styling per type like this:
    //
    // group.design > icon.collapsed {
    //    background: url("design_open.png") no-repeat;
    //
    // group.design > icon.expanded {
    //    background: url("design_open") no-repeat;
    //
    return node.isGeometry() ? node._raw().type + '_' + node._raw().role : node._raw().type;
  };
  delegate.isTreeNodeGroup = function (node) {

    var guid = node.guid();
    var nodeType = treeViewData[guid];
    return nodeType === TREE_VIEW_GROUP;
  };
  delegate.shouldCreateTreeNode = function (node) {

    var guid = node.guid();
    var nodeType = treeViewData[guid];
    return !!nodeType;
  };
  delegate.onTreeNodeClick = function (tree, node, event) {
    panel._tryLoad(node);
  };
  delegate.createTreeNode = function (node, parent, options, type, depth) {
    var label = Autodesk.Viewing.UI.TreeDelegate.prototype.createTreeNode.call(this, node, parent, options);

    // Custom offset logic
    var offset = 10 + 15 * depth + (type === 'leaf' ? 15 : 0);
    parent.style.paddingLeft = offset + 'px';

    // Add icon representing geometry or sheet when appropriate.
    if (node.isGeometry()) {

      var _document = this.getDocument();
      var geomTypeIcon = _document.createElement('geom_icon'); // Refer to the CSS property

      // Insert after the existing <icon>
      label.parentElement.insertBefore(geomTypeIcon, label.parentElement.children[1]);

      // Reset for geometry elements.
      parent.style.paddingTop = '0';
    }

    return label;
  };
  delegate.getScrollContainer = function () {
    return panel.scrollContainer;
  };

  return delegate;
}

/**
   * Identifies all leaf nodes and then traverses-up all parents
   * and marks them to be shown by the Tree view.
   * 
   * @param {BubbleNode} rootNode 
   */
function collectTreeViewData(rootNode) {

  // Returns a map from guid into strings 'leaf' or 'group'
  var treeViewData = {};

  rootNode.traverse(function (node) {

    if (node.isGeometry()) {
      if (node.is2D() || node.is3D()) {
        exposeTreeLeaf(treeViewData, node);
      }
    }

    if (node.isViewPreset()) {
      // For Views contained in Geometries, check for multiple views.
      // If there is only one view, make sure the name is different than
      // the parent geometry node (UX requirement).
      var parent = node.parent;
      var views = parent.search({ "type": "view" });
      if (views.length > 1) {
        exposeTreeLeaf(treeViewData, node);
        return;
      } else
      if (views.length === 1) {

        // For 2D sheets don't show the view.
        if (views[0].is2D())
        return;

        // For 3D, show the view when the name is different than the geometry's.
        var sameName = node.name() === views[0].name();
        if (!sameName) {// it's not a group if they have the same name.
          exposeTreeLeaf(treeViewData, node);
        }
      }
    }
  });

  return treeViewData;
}


/**
   * @param {Object} treeViewData - Map from guid to string
   * @param {BubbleNode} node 
   */
function exposeTreeLeaf(treeViewData, node) {

  var guid = node.guid();
  treeViewData[guid] = TREE_VIEW_LEAF;

  var p = node.parent;
  while (p) {
    guid = p.guid();
    treeViewData[guid] = TREE_VIEW_GROUP;
    p = p.parent;
  }
}

/***/ }),

/***/ "./extensions/DocumentBrowser/uiController.js":
/*!****************************************************!*\
  !*** ./extensions/DocumentBrowser/uiController.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UiController": () => (/* binding */ UiController)
/* harmony export */ });
/* harmony import */ var _Panel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Panel */ "./extensions/DocumentBrowser/Panel.js");
/* harmony import */ var _uiController_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./uiController.css */ "./extensions/DocumentBrowser/uiController.css");
function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}


var av = Autodesk.Viewing;
var avu = av.UI;

var UiController = /*#__PURE__*/function () {

  function UiController(viewer) {_classCallCheck(this, UiController);
    this.viewer = viewer;
    this.setGlobalManager(viewer.globalManager);
    this._onPanelVisibilityChange = this._onPanelVisibilityChange.bind(this);
  }_createClass(UiController, [{ key: "setChangeModelHandler", value: function setChangeModelHandler(

    changeModelFn) {
      this._changeModelFn = changeModelFn;
      this.panel && this.panel.setChangeModelHandler(changeModelFn);
    }

    /**
       * Creates the UI.
       * @param {Autodesk.Viewing.BubbleNode} currNode  - The node loaded into the Viewer
       * @param {Object} [options]
       * @param {bool} [options.openDocumentBrowserOnLoad=false] - Whether the panel is opened when the extension loads.
       * @param {bool} [options.showThumbnails=true] - show or hide thumbnails in the document browser. By default, thumbnails will be shown.
       */ }, { key: "createUi", value: function createUi(
    currNode, options) {

      this.currNode = currNode;
      this._addToolbarButton();

      if (!this.panel) {
        this.panel = new _Panel__WEBPACK_IMPORTED_MODULE_0__.Panel(this.viewer, this.currNode);
        this.panel.setChangeModelHandler(this._changeModelFn);
        this.panel.addVisibilityListener(this._onPanelVisibilityChange);

        // Show or hide the thumbnails
        if (options && options.showThumbnails !== undefined) {
          this.panel.setThumbnailVisibility(options.showThumbnails);
        }

        if (options && options.openDocumentBrowserOnLoad) {
          this.panel.toggleVisibility();
        }
      } else {
        // Some UI change to sync the selection status change triggered by hyperlink
        this.panel.setCurrentNode(currNode);
      }

      this._updateButtonState();
    }

    /**
       * Removes all the UI from the DOM.
       */ }, { key: "destroy", value: function destroy()
    {

      this._removeToolbarButton();
      if (this.panel) {
        this.panel.destroy();
        this.panel = null;
      }
    } }, { key: "togglePanel", value: function togglePanel()

    {
      this.panel.toggleVisibility();
    } }, { key: "notifyStash", value: function notifyStash()

    {
      this.toolbarButton = null; // Free the reference, the viewer will remove all buttons from toolbar.
    } }, { key: "_addToolbarButton", value: function _addToolbarButton()

    {var _this = this;

      if (!this.viewer.getToolbar) return;
      var toolbar = this.viewer.getToolbar();
      if (!toolbar) return;
      var modelTools = toolbar.getControl(Autodesk.Viewing.TOOLBAR.MODELTOOLSID);
      if (!modelTools) return;

      var button = new avu.Button('toolbar-documentModels');
      button.setIcon("adsk-icon-documentModels");
      button.setToolTip("Document Browser");
      modelTools.addControl(button);
      this.toolbarButton = button;

      button.onClick = function () {
        _this.togglePanel();
      };
    } }, { key: "_removeToolbarButton", value: function _removeToolbarButton()

    {
      if (!this.toolbarButton) return;
      this.toolbarButton.removeFromParent();
      this.toolbarButton = null;
    } }, { key: "_updateButtonState", value: function _updateButtonState()

    {
      if (!this.toolbarButton) return;
      var panelVisible = this.panel ? this.panel.isVisible() : false;
      this.toolbarButton.setState(panelVisible ? avu.Button.State.ACTIVE : avu.Button.State.INACTIVE);
    } }, { key: "_onPanelVisibilityChange", value: function _onPanelVisibilityChange()

    /*event*/{
      this._updateButtonState();
    } }]);return UiController;}();


av.GlobalManagerMixin.call(UiController.prototype);

/***/ }),

/***/ "./extensions/DocumentBrowser/Panel.css":
/*!**********************************************!*\
  !*** ./extensions/DocumentBrowser/Panel.css ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Panel_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./Panel.css */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./extensions/DocumentBrowser/Panel.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Panel_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Panel_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Panel_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Panel_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./extensions/DocumentBrowser/ThumbnailList.css":
/*!******************************************************!*\
  !*** ./extensions/DocumentBrowser/ThumbnailList.css ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_ThumbnailList_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./ThumbnailList.css */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./extensions/DocumentBrowser/ThumbnailList.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_ThumbnailList_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_ThumbnailList_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_ThumbnailList_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_ThumbnailList_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./extensions/DocumentBrowser/uiController.css":
/*!*****************************************************!*\
  !*** ./extensions/DocumentBrowser/uiController.css ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_uiController_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./uiController.css */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./extensions/DocumentBrowser/uiController.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_uiController_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_uiController_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_uiController_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_uiController_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";


var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";


var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var style = document.createElement("style");
  options.setAttributes(style, options.attributes);
  options.insert(style);
  return style;
}

module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(style) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    style.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function apply(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute("media", media);
  } else {
    style.removeAttribute("media");
  }

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, style);
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


function domAPI(options) {
  var style = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(style, options, obj);
    },
    remove: function remove() {
      removeStyleElement(style);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, style) {
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ }),

/***/ "./extensions/DocumentBrowser/res/folder-16-active.svg":
/*!*************************************************************!*\
  !*** ./extensions/DocumentBrowser/res/folder-16-active.svg ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "eb93f0381e5cfbfcb966.svg";

/***/ }),

/***/ "./extensions/DocumentBrowser/res/folder-16-dark.svg":
/*!***********************************************************!*\
  !*** ./extensions/DocumentBrowser/res/folder-16-dark.svg ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "43cc4ceb1574aaaced3c.svg";

/***/ }),

/***/ "./extensions/DocumentBrowser/res/folder-16-light.svg":
/*!************************************************************!*\
  !*** ./extensions/DocumentBrowser/res/folder-16-light.svg ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "985157591963ec975896.svg";

/***/ }),

/***/ "./extensions/DocumentBrowser/res/icon-view-2d-dark.svg":
/*!**************************************************************!*\
  !*** ./extensions/DocumentBrowser/res/icon-view-2d-dark.svg ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "649d2b0746ff7983ebde.svg";

/***/ }),

/***/ "./extensions/DocumentBrowser/res/icon-view-2d-light.svg":
/*!***************************************************************!*\
  !*** ./extensions/DocumentBrowser/res/icon-view-2d-light.svg ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "8fb69c82f91c0fa604e6.svg";

/***/ }),

/***/ "./extensions/DocumentBrowser/res/icon-view-3d-dark.svg":
/*!**************************************************************!*\
  !*** ./extensions/DocumentBrowser/res/icon-view-3d-dark.svg ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "74fe9e588d1a1f3ea266.svg";

/***/ }),

/***/ "./extensions/DocumentBrowser/res/icon-view-3d-light.svg":
/*!***************************************************************!*\
  !*** ./extensions/DocumentBrowser/res/icon-view-3d-light.svg ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "ad59723784ea771f0e31.svg";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl + "../";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"DocumentBrowser": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*********************************************!*\
  !*** ./extensions/DocumentBrowser/index.js ***!
  \*********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DocumentBrowser": () => (/* binding */ DocumentBrowser)
/* harmony export */ });
/* harmony import */ var _uiController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./uiController */ "./extensions/DocumentBrowser/uiController.js");
function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}


var av = Autodesk.Viewing;

/**
                            * Adds a toolbar button that opens a Panel displaying all models
                            * and views available from the loaded Document. The panel allows
                            * navigating to any model referenced by the Document.
                            *
                            * The extension id is: `Autodesk.DocumentBrowser`
                            *
                            * @example
                            *   viewer.loadExtension('Autodesk.DocumentBrowser')
                            *
                            * @memberof Autodesk.Viewing.Extensions
                            * @alias Autodesk.Viewing.Extensions.DocumentBrowser
                            * @see {@link Autodesk.Viewing.Extension} for common inherited methods.
                            * @class
                            */

var DocumentBrowser = /*#__PURE__*/function (_av$Extension) {_inherits(DocumentBrowser, _av$Extension);var _super = _createSuper(DocumentBrowser);

  function DocumentBrowser(viewer, options) {var _this;_classCallCheck(this, DocumentBrowser);
    _this = _super.call(this, viewer, options);
    _this.onHyperlinkListener = _this.onHyperlinkListener.bind(_assertThisInitialized(_this));return _this;
  }_createClass(DocumentBrowser, [{ key: "load", value: function load()

    {
      this.viewer.addEventListener(av.HYPERLINK_EVENT, this.onHyperlinkListener);
      // Extension does all its initialization as soon as the toolbar ui is present.
      return true;
    } }, { key: "unload", value: function unload()

    {
      if (this.ui) {
        this.ui.destroy();
        this.ui = null;
      }
      this.viewer.removeEventListener(av.HYPERLINK_EVENT, this.onHyperlinkListener);
      return true;
    } }, { key: "onHyperlinkListener", value: function onHyperlinkListener()

    {
      this._stashUI();
    } }, { key: "onToolbarCreated", value: function onToolbarCreated()

    {var _this2 = this;

      if (this.viewer.model) {
        this._hookToModel(this.viewer.model);
      } else {
        this.viewer.addEventListener(av.MODEL_ROOT_LOADED_EVENT, function (event) {
          _this2._hookToModel(event.model);
        }, { once: true });
      }
    }

    /**
       * Unloads the current model and then loads the next model in the Document.
       * It may reload the same model if the Document contains only 1 model.
       *
       * @param {object} [viewerConfig]
       * @param {object} [loadOptions]
       * 
       * @alias Autodesk.Viewing.Extensions.DocumentBrowser#loadNextModel
       */ }, { key: "loadNextModel", value: function loadNextModel(
    viewerConfig, loadOptions) {
      if (!this.currNode) return;

      var index = this.geometries.indexOf(this.currNode);
      var nextIndex = (index + 1) % this.geometries.length;
      var nextNode = this.geometries[nextIndex];

      this.viewer.loadDocumentNode(this.rootNode.getDocument(), nextNode, loadOptions);
    }

    /**
       * Unloads the current model and then loads the previous model in the Document.
       * It may reload the same model if the Document contains only 1 model.
       *
       * @param {object} [viewerConfig]
       * @param {object} [loadOptions]
       * 
       * @alias Autodesk.Viewing.Extensions.DocumentBrowser#loadPrevModel
       */ }, { key: "loadPrevModel", value: function loadPrevModel(
    viewerConfig, loadOptions) {
      if (!this.currNode) return;

      var index = this.geometries.indexOf(this.currNode);
      var prevIndex = index === 0 ? this.geometries.length - 1 : index - 1;
      var prevNode = this.geometries[prevIndex];

      this.viewer.loadDocumentNode(this.rootNode.getDocument(), prevNode, loadOptions);
    }


    /**
       * 
       * @param {Autodesk.Viewing.BubbleNode} bubbleNode
       * @returns {Promise} - Resolves when the model has been loaded.
       * @private
       */ }, { key: "_changeModel", value: function _changeModel(
    bubbleNode) {

      var rootNode = bubbleNode.getRootNode();

      var nextConfig = this.viewer.config;
      if (!Array.isArray(nextConfig.extensions)) {
        nextConfig.extensions = [];
      }
      if (nextConfig.extensions.indexOf('Autodesk.DocumentBrowser') === -1) {
        nextConfig.extensions.push('Autodesk.DocumentBrowser');
      }

      this._stashUI();

      return this.viewer.loadDocumentNode(rootNode.getDocument(), bubbleNode);
    }

    /**
       * @param model
       * @private
       */ }, { key: "_hookToModel", value: function _hookToModel(
    model) {
      var docNode = model.getDocumentNode();
      if (!docNode) return;

      this.currNode = docNode.findParentGeom2Dor3D();
      this.rootNode = docNode.getRootNode();
      this.geometries = this.rootNode.search({ 'type': 'geometry' });

      var cache = this.getCache();
      if (cache.ui) {
        this.ui = cache.ui;
        cache.ui = null;
      } else {
        this.ui = new _uiController__WEBPACK_IMPORTED_MODULE_0__.UiController(this.viewer);
      }
      this.ui.createUi(this.currNode, this.options);
      this.ui.setChangeModelHandler(this._changeModel.bind(this));
    }

    /**
       * @private
       */ }, { key: "_stashUI", value: function _stashUI()
    {
      var cache = this.getCache();
      if (this.ui) {
        this.ui.notifyStash();
        cache.ui = this.ui;
        this.ui = null;
      }
    } }]);return DocumentBrowser;}(av.Extension);


av.theExtensionManager.registerExtension('Autodesk.DocumentBrowser', DocumentBrowser);
})();

Autodesk.Extensions.DocumentBrowser = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=DocumentBrowser.js.map