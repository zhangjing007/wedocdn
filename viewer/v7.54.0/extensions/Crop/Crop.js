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

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./extensions/Crop/Crop.css":
/*!***************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./extensions/Crop/Crop.css ***!
  \***************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, ".adsk-viewing-viewer .crop.edge-gizmo:hover {\n  background-color: #0696d7; }\n\n.adsk-viewing-viewer .crop.edge-gizmo.selected {\n  background-color: #0696d7; }\n\n.adsk-viewing-viewer .crop.edge-gizmo {\n  background-color: #505050; }\n", ""]);
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

/***/ "./extensions/Crop/Crop.css":
/*!**********************************!*\
  !*** ./extensions/Crop/Crop.css ***!
  \**********************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Crop_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./Crop.css */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./extensions/Crop/Crop.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Crop_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Crop_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Crop_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Crop_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


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
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*********************************!*\
  !*** ./extensions/Crop/Crop.js ***!
  \*********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Crop_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Crop.css */ "./extensions/Crop/Crop.css");
function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}

var av = Autodesk.Viewing;
var CROP_CONTEXT_NAME = "crop-context";

var Events = {
  CROP_MODIFIED: 'cropModified' };


var namespace = AutodeskNamespace("Autodesk.Crop");

/**
                                                    * 2D Crop Extension
                                                    */var
CropExtension = /*#__PURE__*/function (_av$Extension) {_inherits(CropExtension, _av$Extension);var _super = _createSuper(CropExtension);
  function CropExtension(viewer, options) {var _this;_classCallCheck(this, CropExtension);
    _this = _super.call(this, viewer, options);

    Autodesk.Viewing.EventDispatcher.prototype.apply(_assertThisInitialized(_this));return _this;
  }_createClass(CropExtension, [{ key: "load", value: function () {var _load = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {var DefaultCropStyle;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return (


                  this.viewer.loadExtension("Autodesk.Edit2D"));case 2:this.edit2dExtension = _context.sent;

                // Additional default crop styles could be found in Crop.css
                DefaultCropStyle = new Autodesk.Edit2D.Style({
                  fillAlpha: 0.0,
                  lineColor: "rgb(0, 0, 0)",
                  lineStyle: 10, // Dashes long
                  lineWidth: 1 });


                // Optional crop style. Should be in the form of Edit2D.Style.
                this.cropStyle = this.options.cropStyle || DefaultCropStyle;

                this.tmpBox = new THREE.Box3();

                this.updateContextMatrix = this.updateContextMatrix.bind(this);
                this.updateCropBounds = this.updateCropBounds.bind(this);

                this.viewer.addEventListener(Autodesk.Viewing.MODEL_TRANSFORM_CHANGED_EVENT, this.updateContextMatrix);return _context.abrupt("return",

                true);case 10:case "end":return _context.stop();}}}, _callee, this);}));function load() {return _load.apply(this, arguments);}return load;}() }, { key: "unload", value: function unload()


    {
      this.clearCropEditBox();
      this.clearCropBounds();
      this.destroyUI();

      if (this.rectangleTool) {
        this.viewer.toolController.deregisterTool(this.rectangleTool);
        this.rectangleTool = null;
      }

      if (this.edgeMoveTool) {
        this.viewer.toolController.deregisterTool(this.edgeMoveTool);
        this.edgeMoveTool = null;
      }

      if (this.moveTool) {
        this.viewer.toolController.deregisterTool(this.moveTool);
        this.moveTool = null;
      }

      if (this.ctx) {
        this.edit2dExtension.unregisterTools(CROP_CONTEXT_NAME);
        this.ctx = null;
      }

      this.edit2dExtension = null;

      this.targetModel = null;
      this.tmpBox = null;

      this.viewer.removeEventListener(Autodesk.Viewing.MODEL_TRANSFORM_CHANGED_EVENT, this.updateContextMatrix);

      return true;
    } }, { key: "getEdit2DContext", value: function getEdit2DContext()

    {
      if (this.ctx) {
        return this.ctx;
      }

      this.ctx = this.edit2dExtension.registerTools(CROP_CONTEXT_NAME);

      // Disable selection fill color for the crop rectangle.
      this.ctx.layer.removeStyleModifier(this.ctx.selection.modifier);

      // Ignore cutplanes.
      this.ctx.layer.setCutPlanesEnabled(false);
      this.ctx.gizmoLayer.setCutPlanesEnabled(false);

      // EdgeMoveTool
      this.edgeMoveTool = new Autodesk.Edit2D.EdgeMoveTool(this.ctx, { edgeHighlightStyle: this.cropStyle, gizmoClassName: "crop" });
      this.viewer.toolController.registerTool(this.edgeMoveTool);

      if (!this.options.disableMoveTool) {
        // MoveTool
        this.moveTool = new Autodesk.Edit2D.MoveTool(this.ctx);
        this.viewer.toolController.registerTool(this.moveTool);
      }

      // RectangleTool
      this.rectangleTool = new Autodesk.Edit2D.RectangleTool(this.ctx, this.cropStyle);
      this.rectangleTool.getCursor = function () {return "crosshair";}; // TODO: Add a 'Crop' cursor?
      this.viewer.toolController.registerTool(this.rectangleTool);

      return this.ctx;
    }

    // Set models that will get affected by the crop bounds.
  }, { key: "setModel", value: function setModel(model) {
      if (model === this.targetModel) {
        return;
      }

      this.clearCropBounds();

      this.targetModel = model;

      this.updateContextMatrix();
    } }, { key: "updateContextMatrix", value: function updateContextMatrix()

    {
      if (this.targetModel) {
        var matrix = this.targetModel.getModelToViewerTransform() || new THREE.Matrix4();
        this.getEdit2DContext().setMatrix(matrix);
      }

      this.updateCropBounds();
    }

    // Calculate & update viewport bounds for all target models, according to current crop.
  }, { key: "updateCropBounds", value: function updateCropBounds() {
      if (!this.cropRect || !this.targetModel) {
        this.clearCropBounds();
        return;
      }

      this.cropRect.computeBBox();
      var bbox = this.cropRect.bbox;

      this.viewer.impl.setViewportBounds(this.targetModel, bbox);
    } }, { key: "setCropRect", value: function setCropRect(

    shape) {var _this2 = this;
      this.cropRect = shape;

      if (this.cropRect) {
        this.cropRect.addEventListener(Autodesk.Edit2D.Shape.Events.MODIFIED, function () {
          _this2.updateCropBounds();
          _this2.fireEvent({ type: Events.CROP_MODIFIED, cropRegion: _this2.getCurrentCropRegion() });
        });
      }

      this.updateCropBounds();
    } }, { key: "getCurrentCropRegion", value: function getCurrentCropRegion()

    {
      if (!this.targetModel || !this.cropRect) {
        return null;
      }

      this.cropRect.computeBBox();
      var cropRegion = new CropRegion(this.cropRect.bbox, this.targetModel.getUnitString());

      return cropRegion;
    } }, { key: "activate", value: function activate()

    {var _this3 = this,_this$cropButton;
      // In case there is already a cropRect, just use it as a starting point. (Don't start from scratch)
      var cropRegion = this.getCurrentCropRegion();

      if (cropRegion) {
        this.loadCropRegion(cropRegion, true);
        return;
      }

      this.getEdit2DContext().gizmoLayer.addEventListener(Autodesk.Edit2D.EditLayer.SHAPE_ADDED, function (_ref) {var shape = _ref.shape;
        _this3.setCropRect(shape);
      }, { once: true });

      // Start drawing a new rectangle
      this.viewer.toolController.activateTool(this.rectangleTool.getName());

      // Rectangle created (endDrag)
      this.rectangleTool.undoStack.addEventListener(Autodesk.Edit2D.UndoStack.AFTER_ACTION, function () {
        _this3.startCropEditing();
      }, { once: true });

      (_this$cropButton = this.cropButton) === null || _this$cropButton === void 0 ? void 0 : _this$cropButton.setState(Autodesk.Viewing.UI.Button.State.ACTIVE);

      this.activeStatus = true;
    }

    // Make the current cropRect draggable, if exists.
  }, { key: "startCropEditing", value: function startCropEditing() {var _this$cropButton2;
      if (!this.cropRect) {
        return;
      }

      (_this$cropButton2 = this.cropButton) === null || _this$cropButton2 === void 0 ? void 0 : _this$cropButton2.setState(Autodesk.Viewing.UI.Button.State.ACTIVE);

      var ctx = this.getEdit2DContext();
      if (!ctx.layer.hasShape(this.cropRect)) {
        ctx.layer.addShape(this.cropRect);
      }

      if (this.viewer.toolController.isToolActivated(this.rectangleTool.getName())) {
        this.viewer.toolController.deactivateTool(this.rectangleTool.getName());
      }

      if (this.moveTool) {
        this.viewer.toolController.activateTool(this.moveTool.getName());
      }

      this.viewer.toolController.activateTool(this.edgeMoveTool.getName());

      ctx.selection.selectOnly(this.cropRect); // Select rect
    }

    // Disable crop editing. Keeps the applied viewportBounds.
  }, { key: "deactivate", value: function deactivate() {var _this$cropButton3;
      if (this.rectangleTool && this.viewer.toolController.isToolActivated(this.rectangleTool.getName())) {
        this.viewer.toolController.deactivateTool(this.rectangleTool.getName());
      }

      if (this.edgeMoveTool && this.viewer.toolController.isToolActivated(this.edgeMoveTool.getName())) {
        this.viewer.toolController.deactivateTool(this.edgeMoveTool.getName());
      }

      if (this.moveTool && this.viewer.toolController.isToolActivated(this.moveTool.getName())) {
        this.viewer.toolController.deactivateTool(this.moveTool.getName());
      }

      this.clearCropEditBox();

      (_this$cropButton3 = this.cropButton) === null || _this$cropButton3 === void 0 ? void 0 : _this$cropButton3.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);

      this.activeStatus = false;
    } }, { key: "clearCropEditBox", value: function clearCropEditBox()

    {var _this$ctx;
      (_this$ctx = this.ctx) === null || _this$ctx === void 0 ? void 0 : _this$ctx.clearLayer(false);
    }

    // Clear the effect of the cropping - removes viewportBounds from all the target models.
  }, { key: "clearCropBounds", value: function clearCropBounds() {
      if (this.targetModel) {
        this.viewer.impl.setViewportBounds(this.targetModel, null);
      }
    }

    // Given a cropRegion, apply crop based on it.
  }, { key: "loadCropRegion", value: function loadCropRegion(cropRegion, startEditing) {
      this.deactivate();

      // cropRegion is a plane object - need to convert it to a CropRegion class.
      if (!cropRegion.getCropInUnits) {
        cropRegion = new CropRegion(cropRegion.bbox, cropRegion.units, cropRegion);
      }

      var cropInModelUnits = cropRegion.getCropInUnits(this.targetModel.getUnitString());
      var rect = new Autodesk.Edit2D.Polygon(undefined, this.cropStyle).fromBox2(cropInModelUnits);
      this.setCropRect(rect);

      if (startEditing) {
        this.startCropEditing();
      }
    }

    // Stops crop editing, and clears viewportBounds.
  }, { key: "reset", value: function reset() {
      this.setCropRect(null);
      this.deactivate();
    }

    // Notice - for F2D, the bounding box is without the shadow.
  }, { key: "cropToModelBounds", value: function cropToModelBounds(startEditing) {
      var bbox = this.targetModel.getBoundingBox(true, true);

      var cropRegion = new CropRegion(bbox, this.targetModel.getUnitString());
      this.loadCropRegion(cropRegion, startEditing);
    } }, { key: "onToolbarCreated", value: function onToolbarCreated()

    {
      if (this.options.createButton) {
        this.createUI();
      }
    }

    // Add toolbar button.
  }, { key: "createUI", value: function createUI() {var _this4 = this;
      var toolbar = this.viewer.getToolbar && this.viewer.getToolbar();

      if (!toolbar || this.cropButton) {
        return;
      }

      var toolbarName = Autodesk.Viewing.TOOLBAR.SETTINGSTOOLSID;
      var toolbarGroup = toolbar.getControl(toolbarName);

      if (!toolbarGroup) {
        return;
      }

      // Create the button first.
      this.cropButton = new Autodesk.Viewing.UI.Button("toolbar-crop-button");
      this.cropButton.setToolTip(Autodesk.Viewing.i18n.translate("Crop"));
      this.cropButton.setIcon("adsk-icon-box");

      this.cropButton.onClick = function () {
        if (_this4.cropButton.getState() === Autodesk.Viewing.UI.Button.State.INACTIVE) {
          _this4.activate();
        } else {
          _this4.deactivate();
        }
      };

      toolbarGroup.addControl(this.cropButton);
    }

    // Remove toolbar button
  }, { key: "destroyUI", value: function destroyUI() {
      if (!this.cropButton) {
        return;
      }

      var toolbar = this.viewer.getToolbar && this.viewer.getToolbar();

      if (!toolbar) {
        return;
      }

      this.cropButton.removeFromParent();
      this.cropButton = null;
    } }]);return CropExtension;}(av.Extension);


// A crop region is defined by a bounding box and units.
var CropRegion = /*#__PURE__*/function () {
  function CropRegion(bbox, units) {_classCallCheck(this, CropRegion);
    this.bbox = bbox;
    this.units = units;
  }

  // Used in order to convert the bbox to a specific target units.
  _createClass(CropRegion, [{ key: "getCropInUnits", value: function getCropInUnits(targetUnits) {
      // If we don't have units information for some reason, just return bbox as is.
      if (!targetUnits || !this.units) {
        return this.bbox;
      }

      var factor = Autodesk.Viewing.Private.convertUnits(this.units, targetUnits, 1, 1);

      var bbox = this.bbox.clone();
      bbox.min.multiplyScalar(factor);
      bbox.max.multiplyScalar(factor);

      return bbox;
    } }]);return CropRegion;}();


// The ExtensionManager requires an extension to be registered.
av.theExtensionManager.registerExtension('Autodesk.Crop', CropExtension);

namespace.Events = Events;
})();

Autodesk.Extensions.Crop = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=Crop.js.map