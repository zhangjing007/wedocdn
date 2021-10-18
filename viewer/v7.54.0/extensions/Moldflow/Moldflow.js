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

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./extensions/Moldflow/Moldflow.css":
/*!***********************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./extensions/Moldflow/Moldflow.css ***!
  \***********************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, ".adsk-mf-legend-container {\n  top: calc(25%);\n  left: 20px;\n  height: calc(50%);\n  position: absolute;\n  min-height: 100px;\n  pointer-events: none; }\n\n.adsk-mf-legend-title {\n  height: 20px;\n  text-align: left;\n  color: black; }\n\n.adsk-mf-legend-colour-container {\n  display: inline-block;\n  position: relative;\n  height: calc(100% - 20px); }\n\n.adsk-mf-legend-colour-bar {\n  float: left;\n  width: 20px;\n  height: calc(100% - 16px);\n  margin: 7px 0 0 5px; }\n\n.adsk-mf-legend-colour-band {\n  width: 20px; }\n\n.adsk-mf-legend-label-container {\n  display: inline-block;\n  height: 100%;\n  position: relative; }\n\n.adsk-mf-legend-label {\n  text-align: left;\n  margin-left: 3px;\n  font-size: 14px;\n  white-space: nowrap;\n  color: black; }\n\n.adsk-mf-scalebar {\n  bottom: 60px;\n  height: 60px;\n  width: 400px;\n  left: calc(50% - 200px);\n  position: absolute;\n  pointer-events: none; }\n\n.adsk-mf-scalebar-ruler {\n  height: 25%;\n  width: 100%;\n  margin-left: auto;\n  margin-right: auto;\n  border-bottom: 2px solid gray;\n  border-left: 2px solid gray;\n  border-right: 2px solid gray;\n  margin-bottom: 5px; }\n\n.adsk-mf-scalebar-tick {\n  float: left;\n  width: 2px;\n  background: gray;\n  height: 100%;\n  margin-left: calc(20%); }\n\n.adsk-mf-scalebar-label {\n  height: 50%;\n  width: auto;\n  text-align: center;\n  font-size: 14px;\n  color: black; }\n", ""]);
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

/***/ "./extensions/Moldflow/Moldflow.css":
/*!******************************************!*\
  !*** ./extensions/Moldflow/Moldflow.css ***!
  \******************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Moldflow_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./Moldflow.css */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./extensions/Moldflow/Moldflow.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Moldflow_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Moldflow_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Moldflow_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Moldflow_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


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
/*!*****************************************!*\
  !*** ./extensions/Moldflow/Moldflow.js ***!
  \*****************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MoldflowExtension": () => (/* binding */ MoldflowExtension)
/* harmony export */ });
/* harmony import */ var _Moldflow_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Moldflow.css */ "./extensions/Moldflow/Moldflow.css");
 // IMPORTANT!!

/*
* load/unload moldflow visualization extension to/from the viewer.
*/
'use strict';

var _av = Autodesk.Viewing;
var _ave = _av.Extension;
var _avemgr = _av.theExtensionManager;

/**
                                        * MoldflowExtension adds a legendbar and scalebar to the main viewer.
                                        * @constructor
                                        * @see {@link Autodesk.Viewing.Extension} for common inherited methods.
                                        * @param {Autodesk.Viewing.Viewer3D} viewer - Viewer instance.
                                        * @param {Object} options - Not used.
                                        */

// define a const string to hold name of our extension.
var MoldflowExtString = 'Autodesk.Moldflow';

function MoldflowExtension(viewer, options) {
  _ave.call(this, viewer, options);
  //hook viewer events we are interested in.
  this.onGeometryLoaded = this.onGeometryLoaded.bind(this);
  this.onCameraChanged = this.onCameraChanged.bind(this);
}

MoldflowExtension.prototype = Object.create(_ave.prototype);
MoldflowExtension.prototype.constructor = MoldflowExtension;

/**
                                                              * Override load to create the legend and scale bars in the viewer.
                                                              */
MoldflowExtension.prototype.load = function () {
  var that = this;

  //make sure the model exists, then init base moldflow view elements upon result data.
  //otherwise, hook event to create it later.
  if (that.viewer.model) {
    that.initBaseMFView();
  } else {
    that.viewer.addEventListener(_av.GEOMETRY_LOADED_EVENT, that.onGeometryLoaded);
  }

  that.viewer.addEventListener(_av.CAMERA_CHANGE_EVENT, this.onCameraChanged);

  return true;
};


/**
    * Override unload to release whatever we created on this viewer.
    */
MoldflowExtension.prototype.unload = function () {
  var that = this;

  //Remove all Moldflow extension UI elements.
  if (that.legendContainer) {
    that.viewer.container.removeChild(that.legendContainer);
  }

  if (that.scalebarContainer) {
    that.viewer.container.removeChild(that.scalebarContainer);
  }

  return true;
};


/**
    * event hook when geometry loaded.
    */
MoldflowExtension.prototype.onGeometryLoaded = function () {
  this.viewer.removeEventListener(_av.GEOMETRY_LOADED_EVENT, self.onGeometryLoaded);
  self.onGometryLoaded = null;
  this.initBaseMFView();
};

var legendBarData = function legendBarData(title, unit, smooth, colourArr, labelArr) {
  this.title = title;
  this.unit = unit;
  this.smooth = smooth;
  this.colourArr = colourArr;
  this.labelArr = labelArr;
};


/**
    * create moldflow extension UI components.
    */
MoldflowExtension.prototype.initBaseMFView = function () {
  var that = this;

  var lbData = new legendBarData("", "", 0, 0, 0, [0]);

  // get legend bar control parameters. If not found, don't display legend bar.
  var pdb = that.viewer.model.getPropertyDb();

  // uses 'lbVer' as key value to determine search for table containing entries.
  pdb.findProperty('lbVer').then(function (myIdArr) {
    // if multiple database id's returned, use only last database.
    var j = myIdArr.length - 1;
    if (j === -1) return;
    {
      pdb.getProperties(myIdArr[j], function (result) {

        var rawRGBAStr = "";
        var rawRGBALen = 0;
        var rawLabelsStr = "";
        var rawLabelsLen = 0;

        for (var i = 0; i < result.properties.length; ++i) {
          var myProp = result.properties[i];
          switch (myProp.displayName) {
            case 'lbTitle':
              lbData.title = myProp.displayValue;
              break;
            case 'lbUnit':
              lbData.unit = myProp.displayValue;
              break;
            case 'lbRGBA':
              rawRGBAStr = myProp.displayValue;
              break;
            case 'lbRGBAcount':
              rawRGBALen = myProp.displayValue;
              break;
            case 'lbSmooth':
              lbData.smooth = myProp.displayValue;
              break;
            case 'lbLabels':
              rawLabelsStr = myProp.displayValue;
              break;
            case 'lbLabelCount':
              rawLabelsLen = myProp.displayValue;
              break;
            default:
              break;}

        }

        // convert RGB string to array.
        if (rawRGBALen != 0) {
          lbData.colourArr = new Array(rawRGBALen);
          lbData.colourArr = rawRGBAStr.split(',', rawRGBALen);
        }

        // Get the Label array.
        if (rawLabelsLen != 0) {
          lbData.labelArr = new Array(rawLabelsLen);
          lbData.labelArr = rawLabelsStr.split('&', rawLabelsLen);
        }

        that.createLegendBar(lbData);
      });
    }
  });

  // use 'sbVer' as key value to switch scale bar on
  pdb.findProperty('sbVer').then(function (myIdArr) {
    if (myIdArr.length <= 0)
    return;
    that.createScaleBar();
  });
};


/** -------------------------------------------------
    *
    * Legend Bar related variables/functions.
    *
    *  ------------------------------------------------- */

/**
                                                             * create legend colour bar.
                                                             */
MoldflowExtension.prototype.createLegendBar = function (lbData) {

  var _document = this.getDocument();
  //create colour legend container - with 2 elements: title + colour container
  var legendContainer = _document.createElement('div');
  legendContainer.classList.add('adsk-mf-legend-container');
  var legendTitle = _document.createElement('div');
  legendTitle.classList.add('adsk-mf-legend-title');
  var colourContainer = _document.createElement('div');
  colourContainer.classList.add('adsk-mf-legend-colour-container');

  // Set legend title
  if (!lbData.unit)
  lbData.unit = '';
  legendTitle.innerHTML = _av.i18n.translate(lbData.title + " " + lbData.unit);

  // colour container is split into two components: colour bar + label containers
  // Create either: a) smoothed colour bar b) banded colour bar
  if (lbData.smooth == true) {
    var smoothColourBar = _document.createElement('div');
    smoothColourBar.classList.add('adsk-mf-legend-colour-bar');
    var backgroundGradient = '';
    if (lbData.colourArr.length > 0) {
      backgroundGradient = "linear-gradient(to bottom";
      for (var i = lbData.colourArr.length - 1; i > -1; i--) {
        // Chrome understands rgba hex, Edge + IE11 DO NOT! Truncate hex rgba to std rgb
        backgroundGradient += ", " + lbData.colourArr[i].substring(0, 7);
      }
      backgroundGradient += ")";
    }
    smoothColourBar.style.background = backgroundGradient;
    colourContainer.appendChild(smoothColourBar);
  } else

  {// banded colour bar - reverse order to match definition
    var colourSegments = new Array(lbData.colourArr.length);
    var colourHeight = "calc(100%/" + lbData.colourArr.length + ")";
    var bandedColourBar = _document.createElement('div');
    bandedColourBar.classList.add('adsk-mf-legend-colour-bar');
    for (var j = lbData.colourArr.length - 1; j > -1; j--) {
      colourSegments[j] = _document.createElement('div');
      colourSegments[j].classList.add('adsk-mf-legend-colour-band');
      bandedColourBar.appendChild(colourSegments[j]);
      colourSegments[j].style.background = lbData.colourArr[j];
      colourSegments[j].style.height = colourHeight;
    }
    colourContainer.appendChild(bandedColourBar);
  }

  // Add labels to label container - in reverse order to match colour mapping.
  var labelContainer = _document.createElement('div');
  labelContainer.classList.add('adsk-mf-legend-label-container');
  var labels = new Array(lbData.labelArr.length);

  var labelHeight = "calc((100% - 20px)/" + (lbData.labelArr.length - 1) + ")";
  for (var k = lbData.labelArr.length - 1; k > -1; k--) {
    labels[k] = _document.createElement('div');
    labels[k].classList.add('adsk-mf-legend-label');
    labelContainer.appendChild(labels[k]);
    labels[k].innerHTML = lbData.labelArr[k];
    labels[k].style.height = labelHeight;
  }
  colourContainer.appendChild(labelContainer);

  // append constructed Title + colour containers to legend.
  legendContainer.appendChild(legendTitle);
  legendContainer.appendChild(colourContainer);

  this.viewer.container.appendChild(legendContainer);
};


/** -------------------------------------------------
    *
    * Scale Bar related variables/functions.
    *
    *  ------------------------------------------------- */

var previousScale = 1.0;
var maxRulerLen = 1000;
var numOfTicks = 1;

var pixcel2LenFactor = 2.5; // This is approximate and to be improved.


/**
 * event hook when camera changed.
 */
MoldflowExtension.prototype.onCameraChanged = function () {
  //TBD: what's the right way to compute the true scale of the viewer? 
  //
  var vec = this.viewer.navigation.getEyeToCenterOfBoundsVec(this.viewer.model.getBoundingBox());
  var scale = vec.length();
  if (previousScale == scale)
  return;else

  previousScale = scale;

  if (scale != 0.0)
  scale = 1.0 / scale;
  this.updateScaleBar(scale, "mm");
};

/**
    * create scale bar.
    */
MoldflowExtension.prototype.createScaleBar = function () {
  var _document = this.getDocument();
  //create scale bar.
  this.scalebarContainer = _document.createElement('div');
  this.scalebarContainer.classList.add('adsk-mf-scalebar');
  this.scalebarRuler = _document.createElement('div');
  this.scalebarRuler.classList.add('adsk-mf-scalebar-ruler');
  this.scalebarLabel = _document.createElement('div');
  this.scalebarLabel.classList.add('adsk-mf-scalebar-label');
  this.scalebarLabel.innerHTML = 'Scale(' + 100 + 'mm)'; //TODO: a fake default value.

  this.scalebarRulerTicks = [];
  for (var i = 0; i < 4; i++) {
    var divTick = _document.createElement('div');

    divTick.classList.add('adsk-mf-scalebar-tick');
    this.scalebarRulerTicks[i] = divTick;
    this.scalebarRuler.appendChild(divTick);
  }

  this.scalebarContainer.appendChild(this.scalebarRuler);
  this.scalebarContainer.appendChild(this.scalebarLabel);

  // Update scale before displaying.
  var scale = this.viewer.navigation.getEyeToCenterOfBoundsVec(this.viewer.model.getBoundingBox()).length();
  previousScale = scale;

  if (scale != 0.0)
  scale = 1.0 / scale;


  this.updateScaleBar(scale, "mm");

  // display
  this.viewer.container.appendChild(this.scalebarContainer);
};

/**
    * Update scale bar.
    */
MoldflowExtension.prototype.updateScaleBar = function (scale, unit) {

  var _document = this.getDocument();
  var maxLen = maxRulerLen / scale / pixcel2LenFactor;

  var precision = 1.0;
  var normlizedMaxLen = maxLen;
  while (normlizedMaxLen < 1 || normlizedMaxLen >= 10) {
    if (normlizedMaxLen < 1) {
      precision *= 0.1;
      normlizedMaxLen *= 10.0;
    } else if (normlizedMaxLen >= 10) {
      precision *= 10.0;
      normlizedMaxLen *= 0.1;
    }
  }

  numOfTicks = Math.floor(normlizedMaxLen);
  var rulerWidth = Math.floor(maxRulerLen / normlizedMaxLen) * numOfTicks;
  // can only update if the item is defined (asynchronous creation varies by browser)
  if (this.scalebarContainer != undefined) {
    this.scalebarContainer.style.width = rulerWidth + 'px';
    this.scalebarContainer.style.left = this.viewer.container.clientWidth / 2 - 0.5 * rulerWidth - 2 + 'px';
    var result = numOfTicks * precision;
    result = parseFloat(result.toPrecision(1));
    this.scalebarLabel.innerHTML = 'Scale(' + result + ' ' + unit + ')';

    this.scalebarRulerTicks = [];
    this.scalebarRuler.innerHTML = "";

    for (var i = 0; i < numOfTicks - 1; i++) {
      var divTick = _document.createElement('div');

      divTick.classList.add('adsk-mf-scalebar-tick');
      divTick.style.marginLeft = rulerWidth / numOfTicks - 2 + 'px';
      this.scalebarRulerTicks[i] = divTick;
      this.scalebarRuler.appendChild(divTick);
    }
  }
};

/**
    * Register the extension with the extension manager.
    */
_avemgr.registerExtension(MoldflowExtString, MoldflowExtension);
})();

Autodesk.Extensions.Moldflow = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=Moldflow.js.map