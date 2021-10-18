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

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./extensions/Debug/Debug.css":
/*!*****************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./extensions/Debug/Debug.css ***!
  \*****************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, ".adsk-viewing-viewer .debug-ext-UI {\n  position: absolute;\n  top: 0px;\n  left: 0px; }\n\n.adsk-viewing-viewer .debug-ext-UI .debug-ext-icon {\n  cursor: pointer;\n  position: absolute;\n  outline: none;\n  left: 6px;\n  top: 10px;\n  padding-left: 6px;\n  padding-top: 5px;\n  width: 30px;\n  height: 30px;\n  background-size: 30px;\n  z-index: 1; }\n\n.adsk-viewing-viewer .debug-ext-infoPanel {\n  display: none;\n  position: absolute;\n  padding: 20px;\n  font-weight: bold;\n  left: 15px;\n  top: 50px;\n  width: 180px;\n  font-size: 14px;\n  word-wrap: break-word; }\n\n.adsk-viewing-viewer .debug-ext-infoPanel .debug-ext-version-display {\n  font-weight: normal;\n  display: block;\n  width: 170px;\n  font-size: 14px;\n  word-wrap: break-word; }\n\n.adsk-viewing-viewer .lmv-get-debug-url {\n  background-color: white;\n  color: black; }\n\n::-webkit-scrollbar-thumb {\n  border-radius: 5px;\n  background-color: rgba(0, 0, 0, 0.5);\n  -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5); }\n\n.adsk-viewing-viewer .show {\n  display: block; }\n", ""]);
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

/***/ "./extensions/Debug/res/debug-ui.html":
/*!********************************************!*\
  !*** ./extensions/Debug/res/debug-ui.html ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<div class = \"debug-ext-UI\">\n    <div class=\"adsk-control-group debug-ext-icon adsk-button-icon adsk-icon-bug\"></div>\n    <div class =\"debug-ext-infoPanel adsk-control adsk-control-group\">\n        <div class=\"debug-ext-version-display\"></div>\n        <div class=\"debug-ext-dev-debugger docking-panel-primary-button\">Launch debugger</div>\n        <table>\n            <tbody>\n                <tr class=\"switch-slider-row\">\n                    <td><input type=\"checkbox\" id=\"lmv-get-state-filter-viewport\" checked></td>\n                    <td>\n                        &nbsp\n                        Viewport\n                    </td>\n                </tr>\n                <tr class=\"switch-slider-row\">\n                    <td><input type=\"checkbox\" id=\"lmv-get-state-filter-selection\" checked></td>\n                    <td>\n                        &nbsp\n                        Selection, isolation\n                    </td>\n                </tr>\n                <tr>\n                    <td colspan=2>\n                        <input type=\"text\" id=\"lmv-get-debug-url\">\n                    </td>\n                </tr>\n            </tbody>\n        </table>\n    </div>\n</div>\n\n");

/***/ }),

/***/ "./extensions/Debug/Debug.css":
/*!************************************!*\
  !*** ./extensions/Debug/Debug.css ***!
  \************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Debug_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./Debug.css */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./extensions/Debug/Debug.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Debug_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Debug_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Debug_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Debug_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


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
/*!***********************************!*\
  !*** ./extensions/Debug/Debug.js ***!
  \***********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DebugExtension": () => (/* binding */ DebugExtension)
/* harmony export */ });
/* harmony import */ var _Debug_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Debug.css */ "./extensions/Debug/Debug.css");
/* harmony import */ var _res_debug_ui_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./res/debug-ui.html */ "./extensions/Debug/res/debug-ui.html");




var aved = AutodeskNamespace('Autodesk.Viewing.Extensions.Debug');


var DEFAULT_DEBUG_URL = "http://localhost:8000";

function DebugExtension(viewer, options) {
  Autodesk.Viewing.Extension.call(this, viewer, options);
  this.viewer = viewer;
  this.container = null;
  this.onTemplate = this.onTemplate.bind(this);
  this.name = "debug";
  this.debugToolsInitialized = false;

  // localhost debugging environment
  this.localhostEnv = DEFAULT_DEBUG_URL;

  this.toggleActive = this.toggleActive.bind(this);
  this.launchDebugger = this.launchDebugger.bind(this);

}

DebugExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
DebugExtension.prototype.constructor = DebugExtension;

var proto = DebugExtension.prototype;

proto.load = function () {

  this.onTemplate();
  return true;
};

proto.unload = function () {
  //removes the debug ext ui to complete unloading
  if (this.debugToolsInitialized) {
    this.debugToolsInitialized = false;
    this.viewer.removeDebugTools();
  }
  this.container.remove();
  this.container = null;
  this.debugButton = null;
  this.debugWindow = null;
  this.svfWindow = null;
  return true;
};

proto.onToolbarCreated = function (toolbar) {
  this.viewer.showRenderingOptions(true);
};

proto.onTemplate = function () {

  var viewer = this.viewer;

  var _document = this.getDocument();
  var tmp = _document.createElement('div');
  tmp.innerHTML = _res_debug_ui_html__WEBPACK_IMPORTED_MODULE_1__["default"];
  this.viewer.container.appendChild(tmp.childNodes[0]); // Assumes template has only 1 root node.

  this.container = this.viewer.container.querySelector('.debug-ext-UI');
  this.debugWindow = this.container.querySelector('.debug-ext-infoPanel');
  this.svfWindow = this.container.querySelector('.debug-ext-SVF-panel');
  this.debugButton = this.container.querySelector('.debug-ext-icon');

  var btnLunchDebugger = this.debugWindow.querySelector('.debug-ext-dev-debugger');
  btnLunchDebugger.addEventListener("click", this.launchDebugger);

  this.versionDisplay = this.debugWindow.querySelector('.debug-ext-version-display');
  this.versionDisplay.innerHTML = "Version:  " + whichVersion();

  this.debugButton.addEventListener('click', this.toggleActive);

  this.filterViewport = this.debugWindow.querySelector('#lmv-get-state-filter-viewport');
  this.filterSelection = this.debugWindow.querySelector('#lmv-get-state-filter-selection');


  var host = Autodesk.Viewing.Private.LocalStorage.getItem('lmv_debug_host');
  if (host) {
    this.localhostEnv = host;
  }
  this.hostTextInput = this.debugWindow.querySelector('#lmv-get-debug-url');
  this.hostTextInput.value = this.localhostEnv;


  if (viewer.initDebugTools) {
    this.debugToolsInitialized = viewer.initDebugTools();
  }

};

/**
    * @returns true if the panel gets shown
    */
proto.toggleActive = function () {
  if (this.debugWindow.classList.contains("show")) {
    this.debugWindow.classList.remove("show");
    return false;
  }

  this.debugWindow.classList.add("show");
  return true;
};


/**
    * Opens a new tab for developer debugging.
    */
proto.launchDebugger = function () {

  var value = this.hostTextInput.value;
  if (value) {
    this.localhostEnv = value;
  } else {
    this.localhostEnv = DEFAULT_DEBUG_URL;
    this.hostTextInput.value = this.localhostEnv;
  }

  // urn or svf/f2d
  var svf;
  var urn = this.viewer.model.getData().urn;
  var qi = urn.indexOf('?');
  if (qi !== -1) {
    urn = urn.substr(0, qi);
  }
  if (urn.endsWith('.svf') || urn.endsWith('.f2d')) {
    svf = urn;
    urn = undefined;
  }

  // urn with guid?
  var guid;
  var docNode = this.viewer.model.getDocumentNode();
  if (docNode) {
    guid = docNode.guid();
  }

  // html and others
  var html = 'index.html';
  var env = Autodesk.Viewing.getEnv();
  var token = Autodesk.Viewing.token.accessToken;
  var apiFlavor = Autodesk.Viewing.endpoint.getApiFlavor();

  // ViewerState
  var stateObj;
  var bViewport = this.filterViewport.checked;
  var bSelection = this.filterSelection.checked;
  if (bViewport || bSelection) {
    stateObj = this.viewer.getState({
      viewport: bViewport,
      objectSet: bSelection });

  }

  // Construct URL
  var url = this.localhostEnv;

  // add index.html for localhost (default) debugging path
  if (url.indexOf('http://localhost') === 0) {
    url += '/' + html;
  }

  // Add query parameters
  url += '?';

  if (urn) {
    url += 'document=urn:' + urn;
    if (guid) {
      url += '&' + 'item=' + guid;
    }
  } else {
    url += 'svf=' + svf;
  }

  url += '&' + 'env=' + env;

  if (token) {
    url += '&' + 'api=' + apiFlavor;
    url += '&' + 'accessToken=' + token;
  }

  if (stateObj) {
    var state = btoa(JSON.stringify(stateObj));
    url += '&' + 'viewerstate=' + state;
  }

  url += '&' + 'version=' + whichVersion();

  window.open(url);

  // store url host in localstorage for future use
  Autodesk.Viewing.Private.LocalStorage.setItem('lmv_debug_host', this.localhostEnv);
};


function whichVersion() {
  var version = LMV_VIEWER_VERSION;
  if (version.charAt(0) === "@") {
    version = "None";
  }
  return version;
}


function exportMesh(viewer, useWorldSpace) {

  var VE = Autodesk.Viewing.Private.VertexEnumerator;

  var res = viewer.getAggregateSelection();

  var mtx = new Autodesk.Viewing.Private.LmvMatrix4(true);

  var obj = ["# Produced by LMV OBJ export", "\n\n\n"];var _loop = function _loop() {



    var model = res[i].model;
    var fl = model.getFragmentList();
    var it = model.getInstanceTree();

    var selection = res[i].selection;

    var baseVertexIndex = 1; //OBJ indices are 1-based

    selection.forEach(function (dbId) {

      obj.push("o ".concat(dbId));

      it.enumNodeFragments(dbId, function (fragId) {

        obj.push("g ".concat(fragId));

        var geom = fl.getGeometry(fragId);

        fl.getOriginalWorldMatrix(fragId, mtx);

        var vcount = 0;
        var hasN = false;
        var hasUV = false;

        VE.enumMeshVertices(geom, function (p, n, uv, idx) {

          vcount++;

          if (p) {
            obj.push("v ".concat(p.x, " ").concat(p.y, " ").concat(p.z));
          }

          if (n) {
            obj.push("vn ".concat(n.x, " ").concat(n.y, " ").concat(n.z));
            hasN = true;
          }

          if (uv) {
            obj.push("vt ".concat(uv.x, " ").concat(uv.y));
            hasUV = true;
          }
        },
        useWorldSpace ? mtx : undefined);

        obj.push("\n");

        VE.enumMeshIndices(geom, function (a, b, c) {
          a += baseVertexIndex;
          b += baseVertexIndex;
          c += baseVertexIndex;

          if (hasN && hasUV) {
            obj.push("f ".concat(a, "/").concat(a, "/").concat(a, " ").concat(b, "/").concat(b, "/").concat(b, " ").concat(c, "/").concat(c, "/").concat(c));
          } else if (hasN) {
            obj.push("f ".concat(a, "//").concat(a, " ").concat(b, "//").concat(b, " ").concat(c, "//").concat(c));
          } else if (hasUV) {
            obj.push("f ".concat(a, "/").concat(a, " ").concat(b, "/").concat(b, " ").concat(c, "/").concat(c));
          } else {
            obj.push("f ".concat(a, " ").concat(b, " ").concat(c));
          }
        });

        baseVertexIndex += vcount;

      }, true);
    });};for (var i = 0; i < res.length; i++) {_loop();
  }

  var blob = URL.createObjectURL(new Blob([obj.join("\n")], { type: "text/plan" }));
  window.open(blob);
}

aved.exportMesh = exportMesh;


Autodesk.Viewing.theExtensionManager.registerExtension('Autodesk.Debug', DebugExtension);
})();

Autodesk.Extensions.Debug = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=Debug.js.map