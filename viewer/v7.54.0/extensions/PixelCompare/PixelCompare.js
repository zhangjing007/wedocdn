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
/******/ 	var __webpack_modules__ = ({

/***/ "./extensions/PixelCompare/shaders/diff_frag.glsl":
/*!********************************************************!*\
  !*** ./extensions/PixelCompare/shaders/diff_frag.glsl ***!
  \********************************************************/
/***/ ((module) => {

module.exports = "#define OVERLAY 0\n#define SIDE_BY_SIDE 1\n#define FXAA_EDGE_SHARPNESS (8.0)\n#define FXAA_EDGE_THRESHOLD (0.125)\n#define FXAA_EDGE_THRESHOLD_MIN (0.05)\n#define FXAA_RCP_FRAME_OPT (0.5)\n#define FXAA_RCP_FRAME_OPT2 (2.0)\nuniform sampler2D texture1;\nuniform sampler2D texture2;\nuniform float diff_threshold;\nuniform highp vec2 resolution;\nuniform int diffMode;\nuniform float colorIntensity;\nuniform bool mainModelHidden;\nuniform bool secondaryModelHidden;\nuniform vec4 visibleModelBounds;\nvarying vec2 vUv;\nuniform float splitPosition;\nuniform highp float splitLineWidth;\nuniform vec3 splitLineColor;\nuniform highp float t;\nfloat toGrayscale(vec4 v) {\n    return dot(v.rgb, vec3(0.299, 0.587, 0.114));\n}\nfloat getGrayAt(sampler2D texInput, float i, float j) {\n    vec4 tex = texture2D(texInput, vUv + resolution*vec2(i, j));\n    float gray = toGrayscale(tex);\n    return gray;\n}\nfloat getDarkestGray(float i, float j) {\n    float gray1 = mainModelHidden ? 1.0 : getGrayAt(texture1, i, j);\n    float gray2 = secondaryModelHidden ? 1.0 : getGrayAt(texture2, i, j);\n    return min(gray1, gray2);\n}\nfloat getDeltaAt(float i, float j) {\n    float gray1 = mainModelHidden ? 1.0 : getGrayAt(texture1, i, j);\n    float gray2 = secondaryModelHidden ? 1.0 : getGrayAt(texture2, i, j);\n    return gray1 - gray2;\n}\nvec4 getColorAt(float i, float j) {\n    if (mainModelHidden || secondaryModelHidden) {\n        if (vUv.x <= visibleModelBounds.x || vUv.y <= visibleModelBounds.y || vUv.x >= visibleModelBounds.z || vUv.y >= visibleModelBounds.w) {\n            if (mainModelHidden) {\n                return texture2D(texture2, vUv);\n            } else {\n                return texture2D(texture1, vUv);\n            }            \n        }\n    }\n    float maxGray = getDarkestGray(i, j);\n    float delta = getDeltaAt(i, j);\n    if (abs(delta) > diff_threshold) {\n        if (delta < 0.0) {\n            return vec4(colorIntensity, 0.0, 0.0, 1.0);\n        }\n        return vec4(0.0, 0.0, colorIntensity, 1.0);\n    }\n    return vec4(vec3(maxGray), 1.0);\n}\n#ifdef ANTI_ALIASING\n    void applyAntiAliasing() {\n        \n        float lumaNw = toGrayscale(getColorAt(-0.5, -0.5));\n        float lumaSw = toGrayscale(getColorAt(0.5, -0.5));\n        float lumaNe = toGrayscale(getColorAt(-0.5, 0.5)) + 1.0/384.0;\n        float lumaSe = toGrayscale(getColorAt(0.5, 0.5));\n        vec4 rgbaM = getColorAt(0.0, 0.0);\n        float lumaM = toGrayscale(rgbaM);\n        float lumaMax = max(max(lumaNe, lumaSe), max(lumaNw, lumaSw));\n        float lumaMin = min(min(lumaNe, lumaSe), min(lumaNw, lumaSw));\n        float lumaMaxSubMinM = max(lumaMax, lumaM) - min(lumaMin, lumaM);\n        float lumaMaxScaledClamped = max(FXAA_EDGE_THRESHOLD_MIN, lumaMax * FXAA_EDGE_THRESHOLD);\n        if (lumaMaxSubMinM < lumaMaxScaledClamped) {\n            gl_FragColor = rgbaM;\n            return;\n        }\n        float dirSwMinusNe = lumaSw - lumaNe;\n        float dirSeMinusNw = lumaSe - lumaNw;\n        vec2 dir1 = normalize(vec2(dirSwMinusNe + dirSeMinusNw, dirSwMinusNe - dirSeMinusNw));\n        vec3 rgbN1 = getColorAt((-dir1 * FXAA_RCP_FRAME_OPT).x ,(-dir1 * FXAA_RCP_FRAME_OPT).y).rgb;\n        vec3 rgbP1 = getColorAt((dir1 * FXAA_RCP_FRAME_OPT).x ,(dir1 * FXAA_RCP_FRAME_OPT).y).rgb;\n        float dirAbsMinTimesC = min(abs(dir1.x), abs(dir1.y)) * FXAA_EDGE_SHARPNESS;\n        vec2 dir2 = clamp(dir1.xy / dirAbsMinTimesC, -2.0, 2.0);\n        \n        vec3 rgbN2 = getColorAt((-dir2 * FXAA_RCP_FRAME_OPT2).x ,(-dir2 * FXAA_RCP_FRAME_OPT2).y).rgb;\n        vec3 rgbP2 = getColorAt((dir2 * FXAA_RCP_FRAME_OPT2).x ,(dir2 * FXAA_RCP_FRAME_OPT2).y).rgb;\n        vec3 rgbA = rgbN1 + rgbP1;\n        vec3 rgbB = ((rgbN2 + rgbP2) * 0.25) + (rgbA * 0.25);\n        float lumaB = toGrayscale(vec4(rgbB, 1.0));\n        float alpha = rgbaM.a;\n        \n        if ((lumaB < lumaMin) || (lumaB > lumaMax))\n            gl_FragColor = vec4(rgbA * 0.5, rgbaM.a);\n        else\n            gl_FragColor = vec4(rgbB, rgbaM.a);\n    }\n#endif\nvoid main() {\n    vec4 tex1 = texture2D(texture1, vUv);\n    \n    if (diffMode == SIDE_BY_SIDE) {\n        if (abs(vUv.x - splitPosition) <= splitLineWidth) {\n            gl_FragColor = vec4(mix(tex1.rgb, splitLineColor, t), 1.0);\n        } else {\n            vec4 tex = vUv.x < splitPosition ? tex1 : texture2D(texture2, vUv);\n            gl_FragColor = vec4(mix(tex1.rgb, tex.rgb, t), 1.0);\n        }\n    } else if (diffMode == OVERLAY) {\n        gl_FragColor = vec4(mix(tex1.rgb, getColorAt(0.0, 0.0).rgb, t), 1.0);\n        \n        #ifdef ANTI_ALIASING\n            float delta = getDeltaAt(0.0, 0.0);\n            if (abs(delta) > diff_threshold) {\n                return;\n            }\n            for (int i = -1; i <= 1; i++) {\n                for (int j = -1; j <= 1; j++) {\n                    if (i != 0 && j!= 0) {\n                        float delta = getDeltaAt(float(i), float(j));\n                        if (abs(delta) > diff_threshold) {\n                            applyAntiAliasing();\n                            return;\n                        }\n                    }\n                }\n            }\n        #endif\n    }\n}";

/***/ }),

/***/ "./extensions/PixelCompare/shaders/diff_vert.glsl":
/*!********************************************************!*\
  !*** ./extensions/PixelCompare/shaders/diff_vert.glsl ***!
  \********************************************************/
/***/ ((module) => {

module.exports = "varying vec2 vUv;\nuniform vec2 resolution;\nvoid main() {\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}";

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./extensions/PixelCompare/PixelCompareUI.scss":
/*!**********************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./extensions/PixelCompare/PixelCompareUI.scss ***!
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



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! data:application/font-woff;charset=utf-8;base64,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 */ "data:application/font-woff;charset=utf-8;base64,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"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".pixelCompareFont-compare-btn:before {\n  content: \"\\e93c\"; }\n\n.pixelCompareFont-overlay-btn:before {\n  content: \"\\e93e\"; }\n\n.pixelCompareFont-sidebyside-btn:before {\n  content: \"\\e93f\"; }\n\n.pixelCompareFont-exit-compare-btn:before {\n  content: \"\\e93d\"; }\n\n.pixelCompareFont-panel-btn:before {\n  content: \"\\e940\"; }\n\n.pixelCompareFont-show-colors-btn:before {\n  content: \"\\e941\"; }\n\n.pixelCompareFont-hide-colors-btn:before {\n  content: \"\\e942\"; }\n\n.pixelCompareFont-move-btn:before {\n  content: \"\\e943\"; }\n\n.CompareUI__toolbar {\n  z-index: 5; }\n\n.CompareUI__label {\n  position: absolute;\n  display: block;\n  border-radius: 5px;\n  background-color: rgba(78, 78, 78, 0.95);\n  top: 0px;\n  font-size: 12px;\n  color: #FFFFFF;\n  text-align: center;\n  margin: 10px;\n  padding: 10px;\n  white-space: pre;\n  pointer-events: none;\n  z-index: 5; }\n\n.docking-panel.ComparePanel {\n  top: 25%;\n  left: 10%;\n  width: 340px;\n  height: initial;\n  resize: none;\n  z-index: 5; }\n  .docking-panel.ComparePanel .adsk-button {\n    box-sizing: content-box; }\n  .docking-panel.ComparePanel .adsk-control-tooltip {\n    bottom: auto;\n    top: 120%; }\n  .docking-panel.ComparePanel .ComparePanel__main-container {\n    display: flex;\n    flex-direction: column; }\n    .docking-panel.ComparePanel .ComparePanel__main-container .ComparePanel__buttons-container {\n      background-color: rgba(0, 0, 0, 0.05);\n      padding: 10px;\n      text-align: center; }\n      .docking-panel.ComparePanel .ComparePanel__main-container .ComparePanel__buttons-container .adsk-button.inactive {\n        border: 1px solid #cccccc;\n        border-radius: 3px; }\n    .docking-panel.ComparePanel .ComparePanel__main-container .ComparePanel__items-container {\n      padding: 10px;\n      padding-top: 0px;\n      display: flex;\n      flex-direction: column; }\n      .docking-panel.ComparePanel .ComparePanel__main-container .ComparePanel__items-container .ComparePanel__document-container {\n        padding-left: 5px;\n        margin-left: -2px;\n        margin-top: 10px;\n        border: 1px solid rgba(0, 0, 0, 0); }\n        .docking-panel.ComparePanel .ComparePanel__main-container .ComparePanel__items-container .ComparePanel__document-container.align {\n          border: 1px solid #cccccc;\n          border-radius: 3px;\n          background-color: rgba(0, 0, 0, 0.05); }\n        .docking-panel.ComparePanel .ComparePanel__main-container .ComparePanel__items-container .ComparePanel__document-container .ComparePanel__doc-version {\n          display: flex;\n          width: 42px;\n          min-height: 30px;\n          border: 1px solid #cccccc;\n          border-radius: 3px;\n          background-color: rgba(0, 0, 0, 0.05);\n          margin-right: 10px;\n          font-weight: bold; }\n        .docking-panel.ComparePanel .ComparePanel__main-container .ComparePanel__items-container .ComparePanel__document-container .ComparePanel__doc-visibility {\n          display: flex;\n          width: 42px;\n          min-height: 30px;\n          border: 1px solid #cccccc;\n          border-radius: 3px;\n          background-color: rgba(0, 0, 0, 0.05);\n          margin-right: 10px;\n          font-weight: bold; }\n        .docking-panel.ComparePanel .ComparePanel__main-container .ComparePanel__items-container .ComparePanel__document-container .ComparePanel__doc-description-data {\n          margin-right: 40px; }\n        .docking-panel.ComparePanel .ComparePanel__main-container .ComparePanel__items-container .ComparePanel__document-container .ComparePanel__doc-version-text {\n          display: flex;\n          justify-content: center;\n          align-items: center;\n          width: 30px;\n          padding-left: 2px; }\n        .docking-panel.ComparePanel .ComparePanel__main-container .ComparePanel__items-container .ComparePanel__document-container .ComparePanel__doc-color {\n          border-radius: 3px 0 0 3px;\n          width: 100%;\n          height: 100%;\n          border-left: solid 5px transparent; }\n        .docking-panel.ComparePanel .ComparePanel__main-container .ComparePanel__items-container .ComparePanel__document-container .ComparePanel__doc-color.blue.active {\n          border-left: solid 5px #0696D7; }\n        .docking-panel.ComparePanel .ComparePanel__main-container .ComparePanel__items-container .ComparePanel__document-container .ComparePanel__doc-color.red.active {\n          border-left: solid 5px #FF0000; }\n        .docking-panel.ComparePanel .ComparePanel__main-container .ComparePanel__items-container .ComparePanel__document-container .ComparePanel__doc-title {\n          font-size: 15px;\n          font-weight: bold;\n          padding-bottom: 5px;\n          padding-left: 5px;\n          word-break: break-all; }\n        .docking-panel.ComparePanel .ComparePanel__main-container .ComparePanel__items-container .ComparePanel__document-container .ComparePanel__doc-description {\n          font-size: 13px;\n          line-height: 1.2;\n          font-weight: 300;\n          padding: 5px 0px;\n          padding-left: 5px;\n          display: flex;\n          flex-direction: row; }\n\n@font-face {\n  font-family: 'pixelCompareFont';\n  src: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ") format(\"woff\");\n  font-weight: normal;\n  font-style: normal; }\n\n[class^=\"pixelCompareFont-\"], [class*=\" pixelCompareFont-\"] {\n  font-family: 'pixelCompareFont';\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  line-height: 1;\n  padding-top: 2px;\n  speak: none;\n  text-transform: none;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale; }\n", ""]);
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

/***/ "./extensions/PixelCompare/PixelCompareConstants.js":
/*!**********************************************************!*\
  !*** ./extensions/PixelCompare/PixelCompareConstants.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DIFF_MODES": () => (/* binding */ DIFF_MODES),
/* harmony export */   "DIFF_MODES_SHADER": () => (/* binding */ DIFF_MODES_SHADER),
/* harmony export */   "EVENTS": () => (/* binding */ EVENTS),
/* harmony export */   "DEFAULTS": () => (/* binding */ DEFAULTS),
/* harmony export */   "DIFF_CONTROL_GROUP_ID": () => (/* binding */ DIFF_CONTROL_GROUP_ID)
/* harmony export */ });
var _DIFF_MODES_SHADER;function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;} // Values correspond to the ones inside Design-Diff
var DIFF_MODES = {
  OVERLAY: 'overlay',
  SIDE_BY_SIDE: 'sidebyside' };


// Values correspond to the the diff fragment shader.
var DIFF_MODES_SHADER = (_DIFF_MODES_SHADER = {}, _defineProperty(_DIFF_MODES_SHADER,
DIFF_MODES.OVERLAY, 0), _defineProperty(_DIFF_MODES_SHADER,
DIFF_MODES.SIDE_BY_SIDE, 1), _DIFF_MODES_SHADER);


var EVENTS = {
  DIFF_TOOL_DIFF_MODE_CHANGED: 'diff.tool.diff.mode.changed',
  DIFF_TOOL_DEACTIVATED: 'diff.tool.deactivated',
  DIFF_TOOL_MODEL_VISIBILITY_CHANGED: 'diff.tool.model.visibility.changed' };


var DEFAULTS = {
  SPLIT_LINE_MARGIN: 50,
  SPLIT_LINE_POSITION: 0.5,
  SPLIT_LINE_WIDTH: 1,
  SPLIT_LINE_COLOR: 0x73a9e8,
  ANIMATION_DURATION: 0.3,
  DEFAULT_DIFF_MODE: DIFF_MODES.OVERLAY };


var DIFF_CONTROL_GROUP_ID = 'pixel_compare_control_group';

/***/ }),

/***/ "./extensions/PixelCompare/PixelCompareTool.js":
/*!*****************************************************!*\
  !*** ./extensions/PixelCompare/PixelCompareTool.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PixelCompareTool)
/* harmony export */ });
/* harmony import */ var _PixelCompareConstants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PixelCompareConstants */ "./extensions/PixelCompare/PixelCompareConstants.js");
function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

var av = Autodesk.Viewing;var

PixelCompareTool = /*#__PURE__*/function () {
  function PixelCompareTool(extension) {_classCallCheck(this, PixelCompareTool);
    this.extension = extension;
    this.viewer = extension.viewer;
    this.options = extension.options;

    this.setGlobalManager(this.viewer.globalManager);

    this.names = ['pixelCompare'];

    this.splitLineMinTouchArea = Autodesk.Viewing.isMobileDevice() ? 44 : 10; // Amount of minimum touch area pixels for the split line.
    this.splitLineLimit = _PixelCompareConstants__WEBPACK_IMPORTED_MODULE_0__.DEFAULTS.SPLIT_LINE_MARGIN; // Limit of pixels from each side of the canvas.

    this.lastDragPos = new THREE.Vector2();
  }_createClass(PixelCompareTool, [{ key: "getNames", value: function getNames()

    {
      return this.names;
    } }, { key: "getName", value: function getName()

    {
      return this.names[0];
    } }, { key: "getCursor", value: function getCursor()

    {
      if (this.lastMouseEvent) {
        if (this.extension.diffMode === _PixelCompareConstants__WEBPACK_IMPORTED_MODULE_0__.DIFF_MODES.SIDE_BY_SIDE && this.intersectSplitLine(this.lastMouseEvent)) {
          return 'col-resize';
        }
      }

      if (this.extension.changeOffsetMode) {
        return 'move';
      }

      return null;
    } }, { key: "isActive", value: function isActive()

    {
      return this.isActive;
    } }, { key: "activate", value: function activate(

    name) {
      if (name === this.getName() && !this.isActive) {
        this.isActive = true;

      }
    } }, { key: "deactivate", value: function deactivate(

    name) {
      if (name === this.getName() && this.isActive) {
        this.isActive = false;

      }
    } }, { key: "getRelativeX", value: function getRelativeX(

    event) {
      var rect = this.viewer.impl.getCanvasBoundingClientRect();
      var posRatio = event.canvasX / rect.width;
      return posRatio;
    } }, { key: "intersectSplitLine", value: function intersectSplitLine(

    event) {
      var pos = this.getRelativeX(event);var _this$viewer$impl$get =
      this.viewer.impl.getCanvasBoundingClientRect(),width = _this$viewer$impl$get.width;

      return Math.abs(pos - this.extension.splitPosition) * width < Math.max(this.extension.splitLineWidth, this.splitLineMinTouchArea);
    } }, { key: "handleButtonDown", value: function handleButtonDown(

    event, button) {
      if (this.extension.diffMode === _PixelCompareConstants__WEBPACK_IMPORTED_MODULE_0__.DIFF_MODES.SIDE_BY_SIDE && this.intersectSplitLine(event)) {
        this.draggingSplitLine = true;

        return true;
      }

      if (this.extension.changeOffsetMode && !Autodesk.Viewing.Private.isRightClick(event, this.viewer.navigation)) {
        this.draggingOffset = true;
        this.lastDragPos.set(event.canvasX, event.canvasY);

        return true;
      }

      return false;
    } }, { key: "handleButtonUp", value: function handleButtonUp(

    event, button) {
      var consume = false;

      if (this.extension.diffMode === _PixelCompareConstants__WEBPACK_IMPORTED_MODULE_0__.DIFF_MODES.SIDE_BY_SIDE) {
        consume = this.draggingSplitLine;
        this.draggingSplitLine = false;
      }

      if (this.draggingOffset) {
        this.draggingOffset = false;
        consume = true;
      }

      return consume;
    } }, { key: "handleMouseMove", value: function handleMouseMove(

    event) {
      var consume = false;

      this.lastMouseEvent = event;

      if (this.draggingSplitLine && this.extension.diffMode === _PixelCompareConstants__WEBPACK_IMPORTED_MODULE_0__.DIFF_MODES.SIDE_BY_SIDE) {
        var relativePos = this.getRelativeX(event);var _this$viewer$impl$get2 =

        this.viewer.impl.getCanvasBoundingClientRect(),width = _this$viewer$impl$get2.width;
        var absolutePos = relativePos * width;

        if (absolutePos >= this.splitLineLimit && absolutePos <= width - this.splitLineLimit) {
          this.extension.setSplitPosition(relativePos);
        }

        consume = true;
      }

      if (this.draggingOffset) {
        var point = new THREE.Vector2(event.canvasX, event.canvasY);
        this.translateSecondaryModel(point.clone().sub(this.lastDragPos));
        this.lastDragPos = point;

        consume = true;
      }

      return consume;
    } }, { key: "handleKeyDown", value: function handleKeyDown(

    event, keyCode) {
      if (!this.extension.changeOffsetMode) {
        return;
      }

      var translation;

      switch (keyCode) {
        case Autodesk.Viewing.KeyCode.LEFT:
        case Autodesk.Viewing.KeyCode.a:
          translation = new THREE.Vector3(-1, 0, 0);
          break;
        case Autodesk.Viewing.KeyCode.RIGHT:
        case Autodesk.Viewing.KeyCode.d:
          translation = new THREE.Vector3(1, 0, 0);
          break;
        case Autodesk.Viewing.KeyCode.UP:
        case Autodesk.Viewing.KeyCode.w:
          translation = new THREE.Vector3(0, -1, 0);
          break;
        case Autodesk.Viewing.KeyCode.DOWN:
        case Autodesk.Viewing.KeyCode.s:
          translation = new THREE.Vector3(0, 1, 0);
          break;}


      // When pressing the arrows, move the secondary model by one pixel.
      if (translation) {
        this.translateSecondaryModel(translation);
        return true;
      }

      return false;
    } }, { key: "translateSecondaryModel", value: function translateSecondaryModel(

    translation) {
      // Convert client coords (pixels) to world coords
      var p1 = this.viewer.clientToWorld(translation.x, translation.y, false, true).point;
      var p2 = this.viewer.clientToWorld(0, 0, false, true).point;
      var worldTranslation = p1.sub(p2);
      this.extension.translateSecondaryModel(worldTranslation);
    } }, { key: "handleGesture", value: function handleGesture(

    event) {
      switch (event.type) {

        case 'dragstart':
          return this.handleButtonDown(event);

        case 'dragmove':
          return this.handleMouseMove(event);

        case 'dragend':
          return this.handleButtonUp(event);}

      return false;
    } }]);return PixelCompareTool;}();


av.GlobalManagerMixin.call(PixelCompareTool.prototype);

/***/ }),

/***/ "./extensions/PixelCompare/PixelCompareUI.js":
/*!***************************************************!*\
  !*** ./extensions/PixelCompare/PixelCompareUI.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PixelCompareUI)
/* harmony export */ });
/* harmony import */ var _PixelCompareConstants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PixelCompareConstants */ "./extensions/PixelCompare/PixelCompareConstants.js");
/* harmony import */ var _PixelCompareUI_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PixelCompareUI.scss */ "./extensions/PixelCompare/PixelCompareUI.scss");
function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}


var av = Autodesk.Viewing;var

PixelCompareUI = /*#__PURE__*/function () {
  function PixelCompareUI(extension) {_classCallCheck(this, PixelCompareUI);
    this.extension = extension;
    this.viewer = extension.viewer;
    this.options = extension.options;
    this.viewerContainer = this.viewer.container;
    this.setGlobalManager(this.viewer.globalManager);
  }_createClass(PixelCompareUI, [{ key: "createUI", value: function createUI()

    {var _this = this;
      var _document = this.getDocument();
      this.documents = [this.extension.mainModelInfo, this.extension.secondaryModelInfo];

      var title = Autodesk.Viewing.i18n.translate('Compared Documents');
      this.panel = new Autodesk.Viewing.UI.DockingPanel(this.viewerContainer, 'ComparePanel', title, { addFooter: false });

      this.panel.container.classList.add('ComparePanel');

      var scrollContainer = this.panel.createScrollContainer();
      this.mainContainer = _document.createElement('div');
      this.mainContainer.className = 'ComparePanel__main-container';

      this.createButtonsContainer();

      this.itemsContainer = _document.createElement('div');
      this.itemsContainer.className = 'ComparePanel__items-container';
      this.mainContainer.appendChild(this.itemsContainer);

      this.colorStrips = [];
      this.documentContainers = [];
      this.visibilityButtons = [];
      this.labels = [];
      this.colorButtonStateBackup = undefined;

      this.documents.forEach(function (doc, i) {
        _this.createDocumentContainer(doc, i);
      });

      this.onDiffModeChanged();

      scrollContainer.appendChild(this.mainContainer);

      this.panel.setVisible(true);

      this.toolbarVisibilityBackup = {};

      this.addToolbar();

      this.toggleColorStrips(true);

      this.panel.addVisibilityListener(function (visible) {
        var state = visible ? Autodesk.Viewing.UI.Button.State.ACTIVE : Autodesk.Viewing.UI.Button.State.INACTIVE;
        _this.toolbarControls.showPanelButton.setState(state);

        var tooltip = visible ? 'Close Panel' : 'Open Panel';
        _this.toolbarControls.showPanelButton.setToolTip(Autodesk.Viewing.i18n.t(tooltip));
      });

      this.onDiffModeChangedBinded = this.onDiffModeChanged.bind(this);
      this.updateVisibilityButtonsBinded = this.updateVisibilityButtons.bind(this);

      this.viewer.addEventListener(_PixelCompareConstants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.DIFF_TOOL_DIFF_MODE_CHANGED, this.onDiffModeChangedBinded);
      this.viewer.addEventListener(_PixelCompareConstants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.DIFF_TOOL_MODEL_VISIBILITY_CHANGED, this.updateVisibilityButtonsBinded);
    } }, { key: "destroyUI", value: function destroyUI()

    {
      this.panel.uninitialize();

      if (!this.hadToolbar) {
        this.viewerContainer.removeChild(this.toolbar.container);
        this.viewer.toolbar = undefined;
      } else {
        this.toolbar.removeControl(_PixelCompareConstants__WEBPACK_IMPORTED_MODULE_0__.DIFF_CONTROL_GROUP_ID);
      }

      this.toolbar = null;
      this.clearLabels();
      this.colorStrips = null;
      this.documentContainer = null;
      this.documents = null;
      this.colorButtonStateBackup = undefined;

      this.restoreLMVToolbar();

      this.toolbarVisibilityBackup = {};

      this.viewer.removeEventListener(_PixelCompareConstants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.DIFF_TOOL_DIFF_MODE_CHANGED, this.onDiffModeChangedBinded);
      this.viewer.removeEventListener(_PixelCompareConstants__WEBPACK_IMPORTED_MODULE_0__.EVENTS.DIFF_TOOL_MODEL_VISIBILITY_CHANGED, this.updateVisibilityButtonsBinded);
    } }, { key: "hideLMVToolbar", value: function hideLMVToolbar()

    {var _this2 = this;
      var lmvToolbar = this.viewer.getToolbar && this.viewer.getToolbar();

      if (lmvToolbar) {
        lmvToolbar._controls.forEach(function (control) {
          _this2.toolbarVisibilityBackup[control.getId()] = control.isVisible();

          // keep only navigation tools
          if (control.getId() !== Autodesk.Viewing.TOOLBAR.NAVTOOLSID) {
            control.setVisible(false);
          }
        });
      }
    } }, { key: "restoreLMVToolbar", value: function restoreLMVToolbar()

    {var _this3 = this;
      var lmvToolbar = this.viewer.getToolbar && this.viewer.getToolbar();

      if (lmvToolbar) {
        lmvToolbar._controls.forEach(function (control) {
          control.setVisible(_this3.toolbarVisibilityBackup[control.getId()]);
        });
      }
    } }, { key: "createButtonsContainer", value: function createButtonsContainer()

    {
      var _document = this.getDocument();
      var buttonsContainer = _document.createElement('div');
      buttonsContainer.className = 'ComparePanel__buttons-container';
      this.mainContainer.appendChild(buttonsContainer);

      this.colorButton = this.createColorButton();
      buttonsContainer.appendChild(this.colorButton.container);

      this.moveButton = this.createMoveButton();
      buttonsContainer.appendChild(this.moveButton.container);
    } }, { key: "toggleColorStrips", value: function toggleColorStrips(

    show) {
      this.colorStrips.forEach(function (colorStrip) {
        if (show) {
          colorStrip.classList.add('active');
        } else {
          colorStrip.classList.remove('active');
        }
      });

      this.extension.changeColorIntensity(show ? 1.0 : 0.0);
    } }, { key: "colorButtonOnClick", value: function colorButtonOnClick()

    {
      var currentState = this.colorButton.getState();
      if (currentState === Autodesk.Viewing.UI.Button.State.ACTIVE) {
        this.toggleColorStrips(false);
        this.colorButton.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
        this.colorButton.setIcon('pixelCompareFont-show-colors-btn');
        this.colorButton.setToolTip(Autodesk.Viewing.i18n.translate('Show colors'));
      } else {
        this.toggleColorStrips(true);
        this.colorButton.setState(Autodesk.Viewing.UI.Button.State.ACTIVE);
        this.colorButton.setIcon('pixelCompareFont-hide-colors-btn');
        this.colorButton.setToolTip(Autodesk.Viewing.i18n.translate('Hide colors'));
      }
    } }, { key: "createColorButton", value: function createColorButton()

    {
      var colorButton = new Autodesk.Viewing.UI.Button('compare-panel-color-button');
      colorButton.setIcon('pixelCompareFont-show-colors-btn');
      colorButton.setToolTip(Autodesk.Viewing.i18n.translate('Show colors'));
      colorButton.addEventListener('click', this.colorButtonOnClick.bind(this));
      colorButton.setState(Autodesk.Viewing.UI.Button.State.ACTIVE);

      return colorButton;
    } }, { key: "isMoveActive", value: function isMoveActive()

    {
      return this.moveButton && this.moveButton.getState() === Autodesk.Viewing.UI.Button.State.ACTIVE;
    } }, { key: "moveButtonOnClick", value: function moveButtonOnClick()

    {
      var currentState = this.moveButton.getState();
      if (currentState === Autodesk.Viewing.UI.Button.State.INACTIVE) {
        this.moveButton.setState(Autodesk.Viewing.UI.Button.State.ACTIVE);
        this.documentContainers[0].classList.add('align');
        this.extension.setChangeOffsetMode(true);
        this.moveButton.setToolTip(Autodesk.Viewing.i18n.translate('Finish align'));
      } else if (currentState === Autodesk.Viewing.UI.Button.State.ACTIVE) {
        this.moveButton.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
        this.extension.setChangeOffsetMode(false);
        this.documentContainers[0].classList.remove('align');
        this.moveButton.setToolTip(Autodesk.Viewing.i18n.translate('Align'));
      }
    } }, { key: "createMoveButton", value: function createMoveButton()

    {
      var moveButton = new Autodesk.Viewing.UI.Button('compare-panel-move-button');
      moveButton.setIcon('pixelCompareFont-move-btn');
      moveButton.setToolTip(Autodesk.Viewing.i18n.translate('Align'));
      moveButton.addEventListener('click', this.moveButtonOnClick.bind(this));

      return moveButton;
    } }, { key: "createDocumentContainer", value: function createDocumentContainer(

    doc, index) {var _this4 = this;

      var _document = this.getDocument();
      var documentContainer = _document.createElement('div');
      documentContainer.className = 'ComparePanel__document-container';
      this.itemsContainer.appendChild(documentContainer);
      this.documentContainers.push(documentContainer);

      var colors = ["red", "blue"];

      var colorStrip = _document.createElement("div");
      colorStrip.className = "ComparePanel__doc-color";
      colorStrip.classList.add(colors[index]);
      documentContainer.appendChild(colorStrip);

      this.colorStrips.push(colorStrip);

      var title = _document.createElement('div');
      title.className = 'ComparePanel__doc-title';
      var titleFormatted = doc.title && "".concat(doc.title, " ").concat(this.getFormattedVersionLabel(doc));
      title.textContent = titleFormatted || "".concat(Autodesk.Viewing.i18n.translate('Document'), " ").concat(index + 1);
      colorStrip.appendChild(title);

      var descriptionContainer = _document.createElement('div');
      descriptionContainer.className = 'ComparePanel__doc-description treeview';
      colorStrip.appendChild(descriptionContainer);

      var descriptionData = _document.createElement('div');
      descriptionData.className = 'ComparePanel__doc-description-data';
      descriptionContainer.appendChild(descriptionData);

      if (doc.creator && doc.creationTime) {
        var creator = _document.createElement('div');
        creator.textContent = "".concat(Autodesk.Viewing.i18n.translate('Uploaded By'), ": ").concat(doc.creator);
        descriptionData.appendChild(creator);

        var date = _document.createElement('div');
        var formattedDate = doc.creationTime;
        date.textContent = "".concat(Autodesk.Viewing.i18n.translate('At'), ": ").concat(formattedDate);
        descriptionData.appendChild(date);
      }

      if (doc.issuanceDate) {
        var _date = _document.createElement('div');
        _date.textContent = "".concat(Autodesk.Viewing.i18n.translate('Issuance date'), ": ").concat(doc.issuanceDate);
        descriptionData.appendChild(_date);
      }

      var visibilityButton = _document.createElement('div');
      visibilityButton.className = 'visibility';
      visibilityButton.id = "pixelCompare-visibility-button-".concat(index);
      visibilityButton.addEventListener('click', function () {
        if (index === 0) {
          _this4.extension.changeMainModelVisibility(!_this4.extension.getMainModelVisibility());
        } else {
          _this4.extension.changeSecondaryModelVisibility(!_this4.extension.getSecondaryModelVisibility());
        }
      });

      var visibilityButtonContainer = _document.createElement('div');
      visibilityButtonContainer.appendChild(visibilityButton);

      this.visibilityButtons.push(visibilityButtonContainer);
      descriptionContainer.appendChild(visibilityButtonContainer);
    } }, { key: "clearLabels", value: function clearLabels()

    {var _this5 = this;
      this.labels.forEach(function (label) {
        _this5.viewerContainer.removeChild(label);
      });

      this.labels = [];
    } }, { key: "getFormattedVersionLabel", value: function getFormattedVersionLabel(

    doc) {
      var versionFormatted = doc.version && "v".concat(doc.version);
      var versionSetFormatted = doc.versionSet && "(".concat(doc.versionSet, ")");
      var formattedVersionLabel = versionFormatted || versionSetFormatted || '';
      return formattedVersionLabel;
    } }, { key: "onDiffModeChanged", value: function onDiffModeChanged()

    {var _this6 = this;
      var getDocText = function getDocText(index) {
        if (_this6.documents[index].title) {
          var formattedVersionLabel = _this6.getFormattedVersionLabel(_this6.documents[index]);
          return "".concat(_this6.documents[index].title, " ").concat(formattedVersionLabel);
        } else {
          return "".concat(Autodesk.Viewing.i18n.translate('Document'), " ").concat(index + 1);
        }
      };

      var positions = ['left', 'right'];

      this.clearLabels();

      if (this.extension.getDiffMode() === _PixelCompareConstants__WEBPACK_IMPORTED_MODULE_0__.DIFF_MODES.SIDE_BY_SIDE) {
        this.documents.forEach(function (doc, i) {
          _this6.createLabel(getDocText(i), positions[i]);
        });

        var currentState = this.colorButton.getState();

        // Backup current state only if it's not disabled.
        if (currentState !== Autodesk.Viewing.UI.Button.State.DISABLED) {
          this.colorButtonStateBackup = currentState;
        }

        // Disable button if it's currently active. Colors are not allowed on side-by-side mode.
        if (currentState === Autodesk.Viewing.UI.Button.State.ACTIVE) {
          this.colorButtonOnClick();
        }

        this.colorButton.setState(Autodesk.Viewing.UI.Button.State.DISABLED);
      } else {
        this.createLabel("".concat(getDocText(0), " vs. ").concat(getDocText(1)), 'left');

        if (this.colorButtonStateBackup !== undefined) {
          if (this.colorButtonStateBackup === Autodesk.Viewing.UI.Button.State.ACTIVE) {
            this.colorButtonOnClick();
          }

          this.colorButton.setState(this.colorButtonStateBackup);
        }
      }

      this.updateVisibilityButtons();
    } }, { key: "updateVisibilityButtons", value: function updateVisibilityButtons()

    {
      for (var i = 0; i <= 1; i++) {
        this.visibilityButtons[i].className = this.extension.modelHiddenMap[i] ? 'dim' : '';
        this.visibilityButtons[i].style.opacity = this.extension.getDiffMode() === _PixelCompareConstants__WEBPACK_IMPORTED_MODULE_0__.DIFF_MODES.SIDE_BY_SIDE ? 0.3 : 1.0;
      }
    } }, { key: "createLabel", value: function createLabel(

    text, pos) {
      var _document = this.getDocument();
      var label = _document.createElement('div');
      label.className = 'CompareUI__label';
      label.textContent = text;

      if (pos === 'left') {
        label.style.left = '0px';
      } else {
        label.style.right = '0px';
      }

      this.viewerContainer.appendChild(label);
      this.labels.push(label);
    } }, { key: "sideBySideButtonOnClick", value: function sideBySideButtonOnClick()

    {
      var state = this.toolbarControls.sideBySideButton.getState();
      if (state === Autodesk.Viewing.UI.Button.State.INACTIVE) {
        this.toolbarControls.sideBySideButton.setState(Autodesk.Viewing.UI.Button.State.ACTIVE);
        this.showDiffButton.setIcon('pixelCompareFont-sidebyside-btn');
        this.extension.setDiffMode(_PixelCompareConstants__WEBPACK_IMPORTED_MODULE_0__.DIFF_MODES.SIDE_BY_SIDE);

        if (this.isMoveActive()) {
          this.moveButtonOnClick();
        }
      }

      this.showDiffButton.onClick = this.showDiffButton.arrowButton.onClick;
    } }, { key: "overlayButtonOnClick", value: function overlayButtonOnClick()

    {
      var state = this.toolbarControls.overlayButton.getState();
      if (state === Autodesk.Viewing.UI.Button.State.INACTIVE) {
        this.toolbarControls.overlayButton.setState(Autodesk.Viewing.UI.Button.State.ACTIVE);
        this.showDiffButton.setIcon('pixelCompareFont-overlay-btn');
        this.extension.setDiffMode(_PixelCompareConstants__WEBPACK_IMPORTED_MODULE_0__.DIFF_MODES.OVERLAY);
      }

      this.showDiffButton.onClick = this.showDiffButton.arrowButton.onClick;
    } }, { key: "showPanelOnClick", value: function showPanelOnClick()

    {
      var isVisible = this.panel.isVisible();
      this.panel.setVisible(!isVisible);
    } }, { key: "exitButtonOnClick", value: function exitButtonOnClick()

    {
      var state = this.toolbarControls.exitButton.getState();
      if (state === Autodesk.Viewing.UI.Button.State.INACTIVE) {
        this.toolbarControls.exitButton.setState(Autodesk.Viewing.UI.Button.State.ACTIVE);
        this.extension.deactivate();
      } else {
        this.toolbarControls.exitButton.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
      }
    } }, { key: "addToolbar", value: function addToolbar()

    {
      this.hadToolbar = !!this.viewer.getToolbar();

      if (!this.hadToolbar) {
        this.viewer._createToolbar();
        this.viewer.loadExtension('Autodesk.DefaultTools.NavTools', this.viewer.config);
      }

      this.hideLMVToolbar();

      this.toolbar = this.viewer.getToolbar();

      this.toolbarControls = {};

      this.viewerToolbarDiffGroup = new Autodesk.Viewing.UI.ControlGroup(_PixelCompareConstants__WEBPACK_IMPORTED_MODULE_0__.DIFF_CONTROL_GROUP_ID);
      this.toolbar.addControl(this.viewerToolbarDiffGroup);
      this.toolbar.container.classList.add('CompareUI__toolbar');
      this.viewerContainer.appendChild(this.toolbar.container);

      this.showDiffButton = new Autodesk.Viewing.UI.ComboButton('diff-tool-button-combo');
      this.showDiffButton.setIcon('pixelCompareFont-overlay-btn');
      this.showDiffButton.setToolTip(Autodesk.Viewing.i18n.translate('Show Differences'));
      this.showDiffButton.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
      this.showDiffButton.setDisplay('block');
      this.viewerToolbarDiffGroup.addControl(this.showDiffButton);

      this.toolbarControls.sideBySideButton = new Autodesk.Viewing.UI.Button('diff-tool-button-sidebyside-diff');
      this.toolbarControls.sideBySideButton.setIcon('pixelCompareFont-sidebyside-btn');
      this.toolbarControls.sideBySideButton.setToolTip(Autodesk.Viewing.i18n.translate('Side by Side'));
      this.toolbarControls.sideBySideButton.onClick = this.sideBySideButtonOnClick.bind(this);

      this.showDiffButton.addControl(this.toolbarControls.sideBySideButton);

      this.toolbarControls.overlayButton = new Autodesk.Viewing.UI.Button('diff-tool-button-overlay-diff');
      this.toolbarControls.overlayButton.setIcon('pixelCompareFont-overlay-btn');
      this.toolbarControls.overlayButton.setToolTip(Autodesk.Viewing.i18n.translate('Overlay'));
      this.toolbarControls.overlayButton.onClick = this.overlayButtonOnClick.bind(this);

      this.showDiffButton.addControl(this.toolbarControls.overlayButton);

      if (this.extension.getDiffMode() === _PixelCompareConstants__WEBPACK_IMPORTED_MODULE_0__.DIFF_MODES.SIDE_BY_SIDE) {
        this.toolbarControls.sideBySideButton.onClick();
      } else {
        this.toolbarControls.overlayButton.onClick();
      }

      this.toolbarControls.showPanelButton = new Autodesk.Viewing.UI.Button('diff-tool-button-changes');
      this.toolbarControls.showPanelButton.setIcon('pixelCompareFont-panel-btn');
      this.toolbarControls.showPanelButton.onClick = this.showPanelOnClick.bind(this);

      this.toolbarControls.showPanelButton.setToolTip(Autodesk.Viewing.i18n.translate('Close Panel'));
      this.toolbarControls.showPanelButton.setState(Autodesk.Viewing.UI.Button.State.ACTIVE);
      this.viewerToolbarDiffGroup.addControl(this.toolbarControls.showPanelButton);

      this.toolbarControls.exitButton = new Autodesk.Viewing.UI.Button('diff-tool-button-exit');
      this.toolbarControls.exitButton.setIcon('pixelCompareFont-exit-compare-btn');
      this.toolbarControls.exitButton.setToolTip(Autodesk.Viewing.i18n.translate('Exit comparing'));

      this.toolbarControls.exitButton.onClick = this.exitButtonOnClick.bind(this);

      this.viewerToolbarDiffGroup.addControl(this.toolbarControls.exitButton);
    } }]);return PixelCompareUI;}();


av.GlobalManagerMixin.call(PixelCompareUI.prototype);

/***/ }),

/***/ "./extensions/PixelCompare/shaders/DiffShader.js":
/*!*******************************************************!*\
  !*** ./extensions/PixelCompare/shaders/DiffShader.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DiffShader": () => (/* binding */ DiffShader)
/* harmony export */ });
/* harmony import */ var _diff_vert_glsl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./diff_vert.glsl */ "./extensions/PixelCompare/shaders/diff_vert.glsl");
/* harmony import */ var _diff_vert_glsl__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_diff_vert_glsl__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _diff_frag_glsl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./diff_frag.glsl */ "./extensions/PixelCompare/shaders/diff_frag.glsl");
/* harmony import */ var _diff_frag_glsl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_diff_frag_glsl__WEBPACK_IMPORTED_MODULE_1__);



var avp = Autodesk.Viewing.Private;
var chunks = avp.ShaderChunks;

var DiffShader = {

  uniforms: THREE.UniformsUtils.merge([

  chunks.DepthTextureUniforms,

  {
    diff_threshold: { type: 'f', value: 0.1 },
    texture1: { type: 't', value: null },
    texture2: { type: 't', value: null },
    resolution: { type: "v2", value: new THREE.Vector2(1 / 1024, 1 / 512) },
    splitPosition: { type: 'f', value: 0.0 },
    splitLineColor: { type: 'c', value: null },
    diffMode: { type: 'i', value: 0 },
    splitLineWidth: { type: 'f', value: 1.0 },
    colorIntensity: { type: 'f', value: 1.0 },
    t: { type: 'f', value: 1.0 },
    mainModelHidden: { type: 'i', value: 0 },
    secondaryModelHidden: { type: 'i', value: 0 },
    visibleModelBounds: { type: 'v4', value: new THREE.Vector4() } }]),



  vertexShader: (_diff_vert_glsl__WEBPACK_IMPORTED_MODULE_0___default()),
  fragmentShader: (_diff_frag_glsl__WEBPACK_IMPORTED_MODULE_1___default()) };

/***/ }),

/***/ "./extensions/PixelCompare/PixelCompareUI.scss":
/*!*****************************************************!*\
  !*** ./extensions/PixelCompare/PixelCompareUI.scss ***!
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_PixelCompareUI_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./PixelCompareUI.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./extensions/PixelCompare/PixelCompareUI.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_PixelCompareUI_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_PixelCompareUI_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_PixelCompareUI_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_PixelCompareUI_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


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

/***/ "data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAlUAA0AAAAADOwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAAJOAAAABwAAAAcgdOIaEdERUYAAAkcAAAAHAAAAB4AJwAXT1MvMgAAAaAAAAA/AAAAYA8TBkpjbWFwAAACBAAAAGAAAAFuAJHDXGdhc3AAAAkUAAAACAAAAAgAAAAQZ2x5ZgAAAogAAAVHAAAGuDC/sv9oZWFkAAABMAAAADUAAAA2EOq202hoZWEAAAFoAAAAIAAAACQH0wPGaG10eAAAAeAAAAAiAAAALgxlAspsb2NhAAACZAAAACQAAAAkCv4MnG1heHAAAAGIAAAAGAAAACAAGABabmFtZQAAB9AAAADlAAABv5krYsVwb3N0AAAIuAAAAFwAAACzVE7OgXicY2BkYGAA4g+t7hzx/DZfGbhZGEDgiucOSxB9s3CXLAPD/wMsAswHgFwOBiaQKAAgRwpEAAAAeJxjYGRgYD7w/wADAwsDA8P//ywCDEARFMAGAHhdBKF4nGNgZGBgEGSIYGBjAAEmBjQAAAtOAHN4nGNgZr7NOIGBlYGBaSbTGQYGhn4IzfiawZiRkwEVMAqgCTA4MDC+dGE+8P8AgwMzEIPUIMkqMDACAHGjC2gAeJxjYYAAxlAIzQTELBDmMiDuZggFw1cMaQxRDAwANtcEOwAAeJxjYGBgZoBgGQZGBhDIAPIYwXwWBh8gzcfAwcDEwAYUU3jJ+NLkpcv/v///g1UqvGQA8m0g/P9PxFnFLoudAevmY0AGjCDzGdmAmBkqwAQkmBgY0FQBLRzeAABnkBOjAAAAAAAIAAgAEAAYAJgA7AEyAYIBugHSAfACIAJYAsADGgNceJyFVE1sE0cUnrfj7DZO1s7au3ZsiO21sV2cYCde2xvnx3ECUVMof42dlqhBIUGEkFaAKghVC7htqIQgFbTKgYJS0UpUSiiQW2+hTShp1UiVKirEBfUQVEEPPZUe7E3frgk9VV3tm503773Z75v5ZgiQtYchJM2Q//NNhKw+NRF6kawjcdJOXiMEQn4rRCHgtzBckwecHCs6HXEVUokwJDKMEnc4uQiGWWk9SFwilHTGU8lEKMx5QAlGQf9KooUJ+MtD8QyjNtFp3s8vhrdH+qbPjPjqBtJTPI8jdAvPl6bk5q2RmgCvmlja0ttsWm7pZelNXjQzxDeaLZir9bi7QRzYuLfRKKcTPL9oronnj2bThyJTOA/P0+5qP6956repPpZTc2nKUdUerJnMpc0if5Oyk9kjkYK90aknVJv31tiasBpXgaKNmQjzgEikgaSRvU5bNnh6GEmOUrvBJcokZQ81yMgBkUVyyUQKl0JiiIEJFB1lZGuzDIpv5Mz0+JqrLetun5GkLWd7W1p6dWMe6PB1NHpi9mg+ri3pnk/dVo9ekw6vnNnbou+WiVwjr9BJeo3wxEZqST0hQRlBCIhCdgoiC4IshJ2yoEgKfRZoBSkgyElFElma01Iun88FnhWfVgc/LjzUVtNLS5rq9nrd0Sj8kPb+7XUzbS7finbE7WWOlRbhnYUVgKXSOZ+baXV706U7mza5fc+UQwZQM6PEiZohwLEeiHegPmIQsoDDC7KfFR0KyLhaKIyArGYMTbGiFxzxDITp9UscWERugcNXsgB3uTRvtlrN2iMmU1HJmazm0vxlzJDKGSJmgO8z/HKLnMQuGLWXrDicN3GVFWbLJU60ct9xIrf4AkZwT8+RbbRAs4RDhDIh9kBSScqCTFGzAiKTUbACAqOyJHPODpTst6kUc7Y0XmVzuWzM53r7pxaCB6dC1+3zIei/f780zsy7bKV9awna1VQ5aKxHnrjpFB0iFaQS10NSBEUA/B98UXxavM04So/p0BPtE2ZP8Rsmomsuj80sLRj5PCGyItSDENQr0BgiSZJ2CApaAX7VW1ooFiTaV5yhfYTFWglrx3AWjlQRK7EjRwKKEABZ51g2w0ejZHa2lC/Xlg36Zma0mdlZJgv1WiyvPclrj/rgHjpoOpfHpJ7W0mEikA04r4c1TrKKurdQiXXoJyBKYwBFV2N6U8TOrk8Mdp0eBdi9LxDclVNh4uP97zdyDc0729cJtM6/daB/eE+uW6kben37L1+Nx05Nf909+l5q8MT5iYk3NjiQxYHVIj1M95P1JEq24B/VGHB4BFkP43Rg3wL+cBTUlE11qmtgEhlQLaY1NBWI5p7QJQhNI6M1VXy4L1ubBmCFhoqD3YL06a74eQOqWLEuOdh1ahR2D/nrMj1qCM5M7n67zWN2K4n2mENgnvB5hyPz5cpAYnhnuspkkhwAYDt98DjUvtnRHtgxNHhwb3+P6jkw8Opvc++Ghz768GLrWx+ENu8ZOzI+NvKyx6mfDZb0oxau0QO4t1biIl6ykSjIKiC0gsA5VVRbDKxgRzZe/MbwimkH2amGVX3YC8GwGu4APWTI4Jhtxw6bbdB413p/Mb+Xak9UHz9eXX3B7b4Afzzv0hdLjczP/4Y08Xm3+B+TkfIduHrbVENvG5rCXa+kQYQKHmA5C170YRUXOqUfYtyJgBRWpbgDWqBVu6N9Dy1zc3MwlWtry2Wu5g8P92x+qetkU2c02tl0smt5OX+VuaXd1e5C+tYtzIvmHj7MZTpTPR6lsfPGjc7G+JXln650EvIPpdRymQB4nI2QMQrCQBBFfzQqRrASC6v1AkHBxgsIFiJYWNjFOISA7EqMingMD+AN7Ow9lbU/y/S6MMvbP//PLgugiycCVCtAhL5yDS2MlevUl8oh+aDcQAd35Sb1l3KEAT5MBWGbSs9PqLjGu4bKdepT5ZC8UW7wBTflJvWHcoQJ3jgjh+DCKkgpHCxwzuUiRZ468oqtDCfskdCClWSnfUL4GfxpWPvWkc2qZfg5MUaUpTjmzppxPPpjyMxLJeMZTdYbE54FO2pbXLnPfXDBqrwxQ86WJhMrRVLKzmyvZp66hXM2xhcXcEmzAAAAeJx9y7kOQGAUhNE7v32PN7m4jdryKkhENApvL2Fq05xM8YmT/9UicOLgiQcfAUJEiJEgRYYcBUpU4bLf59pE17Gp6uvUq1L+zuhARzrR+dPYGTtraUftATY7H90AAQAB//8AD3icY2BkYGDgAWIxIGZiYARCASBmAfMYAAROAD8AAAABAAAAANQYFhEAAAAA1Em4OQAAAADZcbod":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAlUAA0AAAAADOwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAAJOAAAABwAAAAcgdOIaEdERUYAAAkcAAAAHAAAAB4AJwAXT1MvMgAAAaAAAAA/AAAAYA8TBkpjbWFwAAACBAAAAGAAAAFuAJHDXGdhc3AAAAkUAAAACAAAAAgAAAAQZ2x5ZgAAAogAAAVHAAAGuDC/sv9oZWFkAAABMAAAADUAAAA2EOq202hoZWEAAAFoAAAAIAAAACQH0wPGaG10eAAAAeAAAAAiAAAALgxlAspsb2NhAAACZAAAACQAAAAkCv4MnG1heHAAAAGIAAAAGAAAACAAGABabmFtZQAAB9AAAADlAAABv5krYsVwb3N0AAAIuAAAAFwAAACzVE7OgXicY2BkYGAA4g+t7hzx/DZfGbhZGEDgiucOSxB9s3CXLAPD/wMsAswHgFwOBiaQKAAgRwpEAAAAeJxjYGRgYD7w/wADAwsDA8P//ywCDEARFMAGAHhdBKF4nGNgZGBgEGSIYGBjAAEmBjQAAAtOAHN4nGNgZr7NOIGBlYGBaSbTGQYGhn4IzfiawZiRkwEVMAqgCTA4MDC+dGE+8P8AgwMzEIPUIMkqMDACAHGjC2gAeJxjYYAAxlAIzQTELBDmMiDuZggFw1cMaQxRDAwANtcEOwAAeJxjYGBgZoBgGQZGBhDIAPIYwXwWBh8gzcfAwcDEwAYUU3jJ+NLkpcv/v///g1UqvGQA8m0g/P9PxFnFLoudAevmY0AGjCDzGdmAmBkqwAQkmBgY0FQBLRzeAABnkBOjAAAAAAAIAAgAEAAYAJgA7AEyAYIBugHSAfACIAJYAsADGgNceJyFVE1sE0cUnrfj7DZO1s7au3ZsiO21sV2cYCde2xvnx3ECUVMof42dlqhBIUGEkFaAKghVC7htqIQgFbTKgYJS0UpUSiiQW2+hTShp1UiVKirEBfUQVEEPPZUe7E3frgk9VV3tm503773Z75v5ZgiQtYchJM2Q//NNhKw+NRF6kawjcdJOXiMEQn4rRCHgtzBckwecHCs6HXEVUokwJDKMEnc4uQiGWWk9SFwilHTGU8lEKMx5QAlGQf9KooUJ+MtD8QyjNtFp3s8vhrdH+qbPjPjqBtJTPI8jdAvPl6bk5q2RmgCvmlja0ttsWm7pZelNXjQzxDeaLZir9bi7QRzYuLfRKKcTPL9oronnj2bThyJTOA/P0+5qP6956repPpZTc2nKUdUerJnMpc0if5Oyk9kjkYK90aknVJv31tiasBpXgaKNmQjzgEikgaSRvU5bNnh6GEmOUrvBJcokZQ81yMgBkUVyyUQKl0JiiIEJFB1lZGuzDIpv5Mz0+JqrLetun5GkLWd7W1p6dWMe6PB1NHpi9mg+ri3pnk/dVo9ekw6vnNnbou+WiVwjr9BJeo3wxEZqST0hQRlBCIhCdgoiC4IshJ2yoEgKfRZoBSkgyElFElma01Iun88FnhWfVgc/LjzUVtNLS5rq9nrd0Sj8kPb+7XUzbS7finbE7WWOlRbhnYUVgKXSOZ+baXV706U7mza5fc+UQwZQM6PEiZohwLEeiHegPmIQsoDDC7KfFR0KyLhaKIyArGYMTbGiFxzxDITp9UscWERugcNXsgB3uTRvtlrN2iMmU1HJmazm0vxlzJDKGSJmgO8z/HKLnMQuGLWXrDicN3GVFWbLJU60ct9xIrf4AkZwT8+RbbRAs4RDhDIh9kBSScqCTFGzAiKTUbACAqOyJHPODpTst6kUc7Y0XmVzuWzM53r7pxaCB6dC1+3zIei/f780zsy7bKV9awna1VQ5aKxHnrjpFB0iFaQS10NSBEUA/B98UXxavM04So/p0BPtE2ZP8Rsmomsuj80sLRj5PCGyItSDENQr0BgiSZJ2CApaAX7VW1ooFiTaV5yhfYTFWglrx3AWjlQRK7EjRwKKEABZ51g2w0ejZHa2lC/Xlg36Zma0mdlZJgv1WiyvPclrj/rgHjpoOpfHpJ7W0mEikA04r4c1TrKKurdQiXXoJyBKYwBFV2N6U8TOrk8Mdp0eBdi9LxDclVNh4uP97zdyDc0729cJtM6/daB/eE+uW6kben37L1+Nx05Nf909+l5q8MT5iYk3NjiQxYHVIj1M95P1JEq24B/VGHB4BFkP43Rg3wL+cBTUlE11qmtgEhlQLaY1NBWI5p7QJQhNI6M1VXy4L1ubBmCFhoqD3YL06a74eQOqWLEuOdh1ahR2D/nrMj1qCM5M7n67zWN2K4n2mENgnvB5hyPz5cpAYnhnuspkkhwAYDt98DjUvtnRHtgxNHhwb3+P6jkw8Opvc++Ghz768GLrWx+ENu8ZOzI+NvKyx6mfDZb0oxau0QO4t1biIl6ykSjIKiC0gsA5VVRbDKxgRzZe/MbwimkH2amGVX3YC8GwGu4APWTI4Jhtxw6bbdB413p/Mb+Xak9UHz9eXX3B7b4Afzzv0hdLjczP/4Y08Xm3+B+TkfIduHrbVENvG5rCXa+kQYQKHmA5C170YRUXOqUfYtyJgBRWpbgDWqBVu6N9Dy1zc3MwlWtry2Wu5g8P92x+qetkU2c02tl0smt5OX+VuaXd1e5C+tYtzIvmHj7MZTpTPR6lsfPGjc7G+JXln650EvIPpdRymQB4nI2QMQrCQBBFfzQqRrASC6v1AkHBxgsIFiJYWNjFOISA7EqMingMD+AN7Ow9lbU/y/S6MMvbP//PLgugiycCVCtAhL5yDS2MlevUl8oh+aDcQAd35Sb1l3KEAT5MBWGbSs9PqLjGu4bKdepT5ZC8UW7wBTflJvWHcoQJ3jgjh+DCKkgpHCxwzuUiRZ468oqtDCfskdCClWSnfUL4GfxpWPvWkc2qZfg5MUaUpTjmzppxPPpjyMxLJeMZTdYbE54FO2pbXLnPfXDBqrwxQ86WJhMrRVLKzmyvZp66hXM2xhcXcEmzAAAAeJx9y7kOQGAUhNE7v32PN7m4jdryKkhENApvL2Fq05xM8YmT/9UicOLgiQcfAUJEiJEgRYYcBUpU4bLf59pE17Gp6uvUq1L+zuhARzrR+dPYGTtraUftATY7H90AAQAB//8AD3icY2BkYGDgAWIxIGZiYARCASBmAfMYAAROAD8AAAABAAAAANQYFhEAAAAA1Em4OQAAAADZcbod ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAlUAA0AAAAADOwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAAJOAAAABwAAAAcgdOIaEdERUYAAAkcAAAAHAAAAB4AJwAXT1MvMgAAAaAAAAA/AAAAYA8TBkpjbWFwAAACBAAAAGAAAAFuAJHDXGdhc3AAAAkUAAAACAAAAAgAAAAQZ2x5ZgAAAogAAAVHAAAGuDC/sv9oZWFkAAABMAAAADUAAAA2EOq202hoZWEAAAFoAAAAIAAAACQH0wPGaG10eAAAAeAAAAAiAAAALgxlAspsb2NhAAACZAAAACQAAAAkCv4MnG1heHAAAAGIAAAAGAAAACAAGABabmFtZQAAB9AAAADlAAABv5krYsVwb3N0AAAIuAAAAFwAAACzVE7OgXicY2BkYGAA4g+t7hzx/DZfGbhZGEDgiucOSxB9s3CXLAPD/wMsAswHgFwOBiaQKAAgRwpEAAAAeJxjYGRgYD7w/wADAwsDA8P//ywCDEARFMAGAHhdBKF4nGNgZGBgEGSIYGBjAAEmBjQAAAtOAHN4nGNgZr7NOIGBlYGBaSbTGQYGhn4IzfiawZiRkwEVMAqgCTA4MDC+dGE+8P8AgwMzEIPUIMkqMDACAHGjC2gAeJxjYYAAxlAIzQTELBDmMiDuZggFw1cMaQxRDAwANtcEOwAAeJxjYGBgZoBgGQZGBhDIAPIYwXwWBh8gzcfAwcDEwAYUU3jJ+NLkpcv/v///g1UqvGQA8m0g/P9PxFnFLoudAevmY0AGjCDzGdmAmBkqwAQkmBgY0FQBLRzeAABnkBOjAAAAAAAIAAgAEAAYAJgA7AEyAYIBugHSAfACIAJYAsADGgNceJyFVE1sE0cUnrfj7DZO1s7au3ZsiO21sV2cYCde2xvnx3ECUVMof42dlqhBIUGEkFaAKghVC7htqIQgFbTKgYJS0UpUSiiQW2+hTShp1UiVKirEBfUQVEEPPZUe7E3frgk9VV3tm503773Z75v5ZgiQtYchJM2Q//NNhKw+NRF6kawjcdJOXiMEQn4rRCHgtzBckwecHCs6HXEVUokwJDKMEnc4uQiGWWk9SFwilHTGU8lEKMx5QAlGQf9KooUJ+MtD8QyjNtFp3s8vhrdH+qbPjPjqBtJTPI8jdAvPl6bk5q2RmgCvmlja0ttsWm7pZelNXjQzxDeaLZir9bi7QRzYuLfRKKcTPL9oronnj2bThyJTOA/P0+5qP6956repPpZTc2nKUdUerJnMpc0if5Oyk9kjkYK90aknVJv31tiasBpXgaKNmQjzgEikgaSRvU5bNnh6GEmOUrvBJcokZQ81yMgBkUVyyUQKl0JiiIEJFB1lZGuzDIpv5Mz0+JqrLetun5GkLWd7W1p6dWMe6PB1NHpi9mg+ri3pnk/dVo9ekw6vnNnbou+WiVwjr9BJeo3wxEZqST0hQRlBCIhCdgoiC4IshJ2yoEgKfRZoBSkgyElFElma01Iun88FnhWfVgc/LjzUVtNLS5rq9nrd0Sj8kPb+7XUzbS7finbE7WWOlRbhnYUVgKXSOZ+baXV706U7mza5fc+UQwZQM6PEiZohwLEeiHegPmIQsoDDC7KfFR0KyLhaKIyArGYMTbGiFxzxDITp9UscWERugcNXsgB3uTRvtlrN2iMmU1HJmazm0vxlzJDKGSJmgO8z/HKLnMQuGLWXrDicN3GVFWbLJU60ct9xIrf4AkZwT8+RbbRAs4RDhDIh9kBSScqCTFGzAiKTUbACAqOyJHPODpTst6kUc7Y0XmVzuWzM53r7pxaCB6dC1+3zIei/f780zsy7bKV9awna1VQ5aKxHnrjpFB0iFaQS10NSBEUA/B98UXxavM04So/p0BPtE2ZP8Rsmomsuj80sLRj5PCGyItSDENQr0BgiSZJ2CApaAX7VW1ooFiTaV5yhfYTFWglrx3AWjlQRK7EjRwKKEABZ51g2w0ejZHa2lC/Xlg36Zma0mdlZJgv1WiyvPclrj/rgHjpoOpfHpJ7W0mEikA04r4c1TrKKurdQiXXoJyBKYwBFV2N6U8TOrk8Mdp0eBdi9LxDclVNh4uP97zdyDc0729cJtM6/daB/eE+uW6kben37L1+Nx05Nf909+l5q8MT5iYk3NjiQxYHVIj1M95P1JEq24B/VGHB4BFkP43Rg3wL+cBTUlE11qmtgEhlQLaY1NBWI5p7QJQhNI6M1VXy4L1ubBmCFhoqD3YL06a74eQOqWLEuOdh1ahR2D/nrMj1qCM5M7n67zWN2K4n2mENgnvB5hyPz5cpAYnhnuspkkhwAYDt98DjUvtnRHtgxNHhwb3+P6jkw8Opvc++Ghz768GLrWx+ENu8ZOzI+NvKyx6mfDZb0oxau0QO4t1biIl6ykSjIKiC0gsA5VVRbDKxgRzZe/MbwimkH2amGVX3YC8GwGu4APWTI4Jhtxw6bbdB413p/Mb+Xak9UHz9eXX3B7b4Afzzv0hdLjczP/4Y08Xm3+B+TkfIduHrbVENvG5rCXa+kQYQKHmA5C170YRUXOqUfYtyJgBRWpbgDWqBVu6N9Dy1zc3MwlWtry2Wu5g8P92x+qetkU2c02tl0smt5OX+VuaXd1e5C+tYtzIvmHj7MZTpTPR6lsfPGjc7G+JXln650EvIPpdRymQB4nI2QMQrCQBBFfzQqRrASC6v1AkHBxgsIFiJYWNjFOISA7EqMingMD+AN7Ow9lbU/y/S6MMvbP//PLgugiycCVCtAhL5yDS2MlevUl8oh+aDcQAd35Sb1l3KEAT5MBWGbSs9PqLjGu4bKdepT5ZC8UW7wBTflJvWHcoQJ3jgjh+DCKkgpHCxwzuUiRZ468oqtDCfskdCClWSnfUL4GfxpWPvWkc2qZfg5MUaUpTjmzppxPPpjyMxLJeMZTdYbE54FO2pbXLnPfXDBqrwxQ86WJhMrRVLKzmyvZp66hXM2xhcXcEmzAAAAeJx9y7kOQGAUhNE7v32PN7m4jdryKkhENApvL2Fq05xM8YmT/9UicOLgiQcfAUJEiJEgRYYcBUpU4bLf59pE17Gp6uvUq1L+zuhARzrR+dPYGTtraUftATY7H90AAQAB//8AD3icY2BkYGDgAWIxIGZiYARCASBmAfMYAAROAD8AAAABAAAAANQYFhEAAAAA1Em4OQAAAADZcbod";

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
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"PixelCompare": 0
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
/*!*************************************************!*\
  !*** ./extensions/PixelCompare/PixelCompare.js ***!
  \*************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PixelCompare)
/* harmony export */ });
/* harmony import */ var _shaders_DiffShader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shaders/DiffShader */ "./extensions/PixelCompare/shaders/DiffShader.js");
/* harmony import */ var _PixelCompareConstants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PixelCompareConstants */ "./extensions/PixelCompare/PixelCompareConstants.js");
/* harmony import */ var _PixelCompareTool__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./PixelCompareTool */ "./extensions/PixelCompare/PixelCompareTool.js");
/* harmony import */ var _PixelCompareUI__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./PixelCompareUI */ "./extensions/PixelCompare/PixelCompareUI.js");
function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}




var ShaderPass = Autodesk.Viewing.Private.ShaderPass;var
PixelCompare = /*#__PURE__*/function (_Autodesk$Viewing$Ext) {_inherits(PixelCompare, _Autodesk$Viewing$Ext);var _super = _createSuper(PixelCompare);
  function PixelCompare(viewer) {var _this;var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};_classCallCheck(this, PixelCompare);
    _this = _super.call(this, viewer, options);
    _this.viewer = viewer;
    _this.options = options;

    _this.mainModel = null;
    _this.secondaryModel = null;

    _this.secondaryRenderContext = null;
    _this.mainModelVisibilityBackup = false; // Save the visibility state of the main model.
    _this.secondaryModelVisibilityBackup = false; // Save the visibility state of the secondary model.

    _this.splitPosition = _PixelCompareConstants__WEBPACK_IMPORTED_MODULE_1__.DEFAULTS.SPLIT_LINE_POSITION;
    _this.splitLineWidth = _PixelCompareConstants__WEBPACK_IMPORTED_MODULE_1__.DEFAULTS.SPLIT_LINE_WIDTH;
    _this.splitLineColor = new THREE.Color(_PixelCompareConstants__WEBPACK_IMPORTED_MODULE_1__.DEFAULTS.SPLIT_LINE_COLOR);
    _this.duration = _PixelCompareConstants__WEBPACK_IMPORTED_MODULE_1__.DEFAULTS.ANIMATION_DURATION;
    _this.transitionVal = 0.0;

    _this.changeOffsetMode = false;

    _this.diffMode = options.diffMode;
    _this.defaultDiffMode = _PixelCompareConstants__WEBPACK_IMPORTED_MODULE_1__.DEFAULTS.DEFAULT_DIFF_MODE;
    _this.colorIntensity = 1.0;
    _this.modelHiddenMap = {}; // Used for toggle model visibility.

    _this.tool = new _PixelCompareTool__WEBPACK_IMPORTED_MODULE_2__["default"](_assertThisInitialized(_this));

    if (!_this.viewer.config.headlessViewer) {
      _this.compareUI = new _PixelCompareUI__WEBPACK_IMPORTED_MODULE_3__["default"](_assertThisInitialized(_this));
    }

    _this.diffPass = new ShaderPass(_shaders_DiffShader__WEBPACK_IMPORTED_MODULE_0__.DiffShader);
    _this.renderer = _this.viewer.impl.renderer();
    _this.glrenderer = _this.viewer.impl.glrenderer();

    _this.frustum = new Autodesk.Viewing.Private.FrustumIntersector();

    _this.renderSecondaryModelBinded = _this.renderSecondaryModel.bind(_assertThisInitialized(_this));
    _this.initDiffBinded = _this.initDiff.bind(_assertThisInitialized(_this));
    _this.onResizeBinded = _this.onResize.bind(_assertThisInitialized(_this));return _this;
  }

  /**
     * @param model
     * @private
     */_createClass(PixelCompare, [{ key: "getModel", value: function getModel(
    model) {
      return typeof model === 'number' ? this.viewer.impl.findModel(model, true) : model;
    }

    /**
       * Compare two models.
       *
       * @param {Autodesk.Viewing.Model|number} mainModel - Main model instance or id.
       * @param {Autodesk.Viewing.Model|number} secondaryModel - Secondary model instance or id.
       * @param {object} mainModelInfo - Main model info. Info can contain 'title', 'version', 'creationTime' & 'creator'.
       * @param {object} secondaryModelInfo - Secondary model info. Info can contain 'title', 'version', 'creationTime' & 'creator'.
       * 
       * @alias Autodesk.Viewing.Extensions.PixelCompare#compareTwoModels
       */ }, { key: "compareTwoModels", value: function compareTwoModels(
    mainModel, secondaryModel) {var _this2 = this;var mainModelInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};var secondaryModelInfo = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      // If already comparing these two models, don't do anything.
      if (this.getModel(mainModel) === this.mainModel && this.getModel(secondaryModel) === this.secondaryModel) {
        return;
      }

      this.deactivate().then(function () {
        _this2.mainModel = _this2.getModel(mainModel);
        _this2.secondaryModel = _this2.getModel(secondaryModel);

        _this2.mainModelInfo = mainModelInfo;
        _this2.secondaryModelInfo = secondaryModelInfo;

        _this2.activate();
      });
    } }, { key: "unload", value: function unload()

    {
      this.deactivate();

      return true;
    }

    /**
       * @private
       */ }, { key: "activate", value: function activate()
    {
      if (!this.mainModel || !this.secondaryModel) {
        console.warn('Pixel Compare requires two models. Use compareTwoModels and supply the models.');
        return false;
      }

      if (!this.isActive()) {
        this.initDiff();
        this.viewer.toolController.registerTool(this.tool);
        this.viewer.toolController.activateTool(this.tool.getName());
        return true;
      }
    }

    /**
       * Deactivate the comparison.
       * 
       * @alias Autodesk.Viewing.Extensions.PixelCompare#deactivate
       */ }, { key: "deactivate", value: function deactivate()
    {var _this3 = this;
      if (!this.isActive()) {
        return Promise.resolve();
      }

      return new Promise(function (resolve) {
        _this3.exitPreviousDiffMode(function () {
          _this3.activeStatus = false;
          _this3.diffMode = null;

          _this3.viewer.impl.setPlacementTransform(_this3.secondaryModel, _this3.secondaryModelTransformBackup);

          if (!_this3.mainModelVisibilityBackup) {
            _this3.viewer.hideModel(_this3.mainModel);
          }

          if (_this3.options.restoreModelVisibilityOnExit && _this3.secondaryModelVisibilityBackup) {
            _this3.viewer.showModel(_this3.secondaryModel);
          }

          _this3.viewer.toolController.deregisterTool(_this3.tool);

          _this3.viewer.removeEventListener(Autodesk.Viewing.RENDER_PRESENTED_EVENT, _this3.renderSecondaryModelBinded);
          _this3.viewer.removeEventListener(Autodesk.Viewing.VIEWER_RESIZE_EVENT, _this3.onResizeBinded);

          if (_this3.clearColorTopBackup && _this3.clearColorBottomBackup) {
            _this3.viewer.setBackgroundColor(
            _this3.clearColorTopBackup.x, _this3.clearColorTopBackup.y, _this3.clearColorTopBackup.z,
            _this3.clearColorBottomBackup.x, _this3.clearColorBottomBackup.y, _this3.clearColorBottomBackup.z);

          }

          _this3.viewer.impl.toggleSwapBlackAndWhite(_this3.swapBlackAndWhiteBackup);

          _this3.cleanRenderContext();
          _this3.invalidate();

          if (_this3.compareUI) {
            _this3.compareUI.destroyUI();
          }

          _this3.mainModel = null;
          _this3.secondaryModel = null;
          _this3.secondaryModelTransformBackup = null;

          _this3.mainModelInfo = null;
          _this3.secondaryModelInfo = null;

          _this3.modelHiddenMap = {};

          _this3.viewer.dispatchEvent({ type: _PixelCompareConstants__WEBPACK_IMPORTED_MODULE_1__.EVENTS.DIFF_TOOL_DEACTIVATED }),

          resolve();
        });
      });
    }

    /**
       * @param model
       * @private
       */ }, { key: "isModelVisible", value: function isModelVisible(
    model) {
      return !!this.viewer.impl.findModel(model.id);
    } }, { key: "alignSecondaryModel", value: function alignSecondaryModel()

    {
      // It's important to get the trimmed bounds, without the annoying paper shadow, so in case there is one model with a shadow,
      // and another one without - it won't cause a different scale.
      var mainBounds = this.mainModel.getBoundingBox(false, true);
      var secondaryBounds = this.secondaryModel.getBoundingBox(false, true);

      this.modelsRatio = mainBounds.getSize(new THREE.Vector3()).divide(secondaryBounds.getSize(new THREE.Vector3()));

      var translationToOrigin = new THREE.Matrix4().makeTranslation(-secondaryBounds.min.x, -secondaryBounds.min.y, 0);

      // We use modelsRatio.y also for Z coordinate (instead of 1), so that getMaxScaleOnAxis will always return a relevant value, and won't
      // return a fixed 1 in case we are scaling down the model.
      var scaleMatrix = new THREE.Matrix4().makeScale(this.modelsRatio.x, this.modelsRatio.y, this.modelsRatio.y);
      var translationToModelOrigin = new THREE.Matrix4().makeTranslation(mainBounds.min.x, mainBounds.min.y, 0);
      var originalTransform = this.secondaryModel.getPlacementTransform();

      var matrix = translationToModelOrigin.multiply(scaleMatrix).multiply(translationToOrigin).multiply(originalTransform);

      this.viewer.impl.setPlacementTransform(this.secondaryModel, matrix);
    }

    /**
       * @private
       */ }, { key: "initDiff", value: function initDiff()
    {
      if (this.viewer.impl.modelQueue().getModels().concat(this.viewer.impl.modelQueue().getHiddenModels()).some(function (model) {return !model.isLoadDone();})) {
        this.viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, this.initDiffBinded, { once: true });
      } else {
        this.activeStatus = true;

        this.mainModelVisibilityBackup = this.isModelVisible(this.mainModel);
        this.secondaryModelVisibilityBackup = this.isModelVisible(this.secondaryModel);

        if (!this.mainModelVisibilityBackup) {
          this.viewer.showModel(this.mainModel); // Main model has to be visible when activating diff.
        }

        if (this.secondaryModelVisibilityBackup) {
          this.viewer.hideModel(this.secondaryModel); // Secondary model has to be hidden during diff.
        }

        // Backup original transform, in order to restore it later on cleanup.
        this.secondaryModelTransformBackup = this.secondaryModel.getPlacementTransform().clone();
        this.alignSecondaryModel();

        this.clearColorTopBackup = this.viewer.impl.clearColorTop.clone().multiplyScalar(255);
        this.clearColorBottomBackup = this.viewer.impl.clearColorBottom.clone().multiplyScalar(255);

        // If one of the models has no background, we have to give it a white background - otherwise the diff will fail.
        if (this.mainModel.getMetadata('page_dimensions', 'hide_paper') || this.secondaryModel.getMetadata('page_dimensions', 'hide_paper')) {
          this.viewer.setBackgroundColor(255, 255, 255, 255, 255, 255);
        }

        this.setDiffMode(this.diffMode || this.defaultDiffMode);

        this.swapBlackAndWhiteBackup = this.viewer.impl.swapBlackAndWhite;
        this.viewer.impl.toggleSwapBlackAndWhite(false);

        if (this.compareUI) {
          this.compareUI.createUI();
        }

        this.viewer.addEventListener(Autodesk.Viewing.RENDER_PRESENTED_EVENT, this.renderSecondaryModelBinded);
        this.viewer.addEventListener(Autodesk.Viewing.VIEWER_RESIZE_EVENT, this.onResizeBinded);
      }
    }

    /**
       * @private
       */ }, { key: "renderDiff", value: function renderDiff()
    {
      var pixelRatio = this.glrenderer.getPixelRatio();
      var resolution = {
        x: 1 / (this.viewer.canvas.clientWidth * pixelRatio),
        y: 1 / (this.viewer.canvas.clientHeight * pixelRatio) };


      this.diffPass.uniforms['texture1'].value = this.renderer.getColorTarget();
      this.diffPass.uniforms['diffMode'].value = _PixelCompareConstants__WEBPACK_IMPORTED_MODULE_1__.DIFF_MODES_SHADER[this.diffMode];
      this.diffPass.uniforms['splitPosition'].value = this.splitPosition;
      this.diffPass.uniforms['splitLineWidth'].value = this.splitLineWidth / this.viewer.getCamera().clientWidth;
      this.diffPass.uniforms['splitLineColor'].value = this.splitLineColor;
      this.diffPass.uniforms['t'].value = this.transitionVal;
      this.diffPass.uniforms['resolution'].value = resolution;
      this.diffPass.uniforms['colorIntensity'].value = this.colorIntensity;
      this.diffPass.uniforms['mainModelHidden'].value = this.modelHiddenMap[0];
      this.diffPass.uniforms['secondaryModelHidden'].value = this.modelHiddenMap[1];

      if (this.modelHiddenMap[1]) {
        this.diffPass.uniforms['visibleModelBounds'].value = this.getModelNormalizedProjectedBounds(this.mainModel);
      } else if (this.modelHiddenMap[0]) {
        this.diffPass.uniforms['visibleModelBounds'].value = this.getModelNormalizedProjectedBounds(this.secondaryModel);
      }

      this.renderer.presentBuffer(this.diffPass);
    }

    /**
       * @private
       */ }, { key: "hideAllModels", value: function hideAllModels()
    {var _this4 = this;
      var models = this.viewer.getVisibleModels();
      models.forEach(function (model) {
        _this4.viewer.hideModel(model.id);
      });
    }

    /**
       *  Needed when size of the canvas is changing.
       *
       * @private
       */ }, { key: "cleanRenderContext", value: function cleanRenderContext()
    {
      this.secondaryRenderContext && this.secondaryRenderContext.cleanup();
      this.secondaryRenderContext = null;
    }

    /**
       * Normalized bounds needed for shader.
       * 
       * @param model
       * @private
      */ }, { key: "getModelNormalizedProjectedBounds", value: function getModelNormalizedProjectedBounds(
    model) {
      var bounds = model.getBoundingBox(false, true);

      var min = this.worldToClient(bounds.min);
      var max = this.worldToClient(bounds.max);

      return new THREE.Vector4(min.x, min.y, max.x, max.y);
    }

    /**
       * @param point
       * @private
      */ }, { key: "worldToClient", value: function worldToClient(
    point) {
      var camera = this.viewer.getCamera();
      var p = point.clone().project(camera);

      return new THREE.Vector3((p.x + 1) / 2, (p.y + 1) / 2, 0);
    }

    /**
       * @private
       */ }, { key: "onResize", value: function onResize()
    {
      this.cleanRenderContext();
    }

    /**
       * @private
      */ }, { key: "renderSecondaryModel", value: function renderSecondaryModel()
    {var _this5 = this;
      var canvasBounds = this.viewer.impl.getCanvasBoundingClientRect();
      var pixelRatio = this.glrenderer.getPixelRatio();
      var width = canvasBounds.width * pixelRatio;
      var height = canvasBounds.height * pixelRatio;

      var onFinished = function onFinished(ctx, target) {
        _this5.diffPass.uniforms['texture2'].value = target;
        _this5.secondaryRenderContext = ctx;
        _this5.renderDiff();
      };

      var options = {
        returnAsTarget: true,
        models: [this.secondaryModel],
        renderContext: this.secondaryRenderContext,
        dontWaitForLeafletTiles: true };


      // In case that the secondary model is leaflet - we do want that the diff will be rendered even if
      // The tiles are not fully refined. This is why we use `dontWaitForLeafletTiles`.
      // However, in order for them to get refined eventually, we need to call invalidate, so even if the main model
      // is fully loaded, the secondary model will continue loading.
      if (this.secondaryModel.isLeaflet()) {
        var camera = this.viewer.getCamera();
        this.frustum.reset(camera);

        if (!this.secondaryModel.getIterator().reset(this.frustum, camera)) {
          this.invalidate();
        }
      }

      Autodesk.Viewing.ScreenShot.getScreenShot(width, height, onFinished, options, this.viewer.impl);
    }

    /**
       * @private
       */ }, { key: "invalidate", value: function invalidate()
    {
      this.viewer.impl.invalidate(true, true, false);
    }

    /**
       * Change split line position.
       *
       * @param {number} value - Value between 0 to 1.
       * 
       * @alias Autodesk.Viewing.Extensions.PixelCompare#setSplitPosition
       */ }, { key: "setSplitPosition", value: function setSplitPosition(
    value) {
      this.splitPosition = value;
      this.invalidate();
    }

    /**
       * Get split line position.
       *
       * @returns {number}
       * @alias Autodesk.Viewing.Extensions.PixelCompare#getSplitPosition
       */ }, { key: "getSplitPosition", value: function getSplitPosition()
    {
      return this.splitPosition;
    }

    /**
       * Change diff mode. Options are split mode & color mode.
       *
       * @param {number} value - Autodesk.PixelCompare.DIFF_MODES.OVERLAY | Autodesk.PixelCompare.DIFF_MODES.SIDE_BY_SIDE
       * 
       * @alias Autodesk.Viewing.Extensions.PixelCompare#setDiffMode
       */ }, { key: "setDiffMode", value: function setDiffMode(
    value) {var _this6 = this;
      if (!this.isActive()) {
        console.warn('Pixel Compare is not active.');
        return;
      }

      if (this.diffMode === value && this.transitionVal !== 0) {
        return;
      }

      this.exitPreviousDiffMode(function () {
        _this6.enterNewDiffMode(value);
      });
    }

    /**
       * @param cb
       * @param immediate
       * @private
       */ }, { key: "exitPreviousDiffMode", value: function exitPreviousDiffMode(
    cb, immediate) {var _this7 = this;
      if (immediate || this.diffMode === null || this.diffMode === undefined) {
        this.transitionVal = 0.0;
        cb();
      } else {
        Autodesk.Viewing.Private.fadeValue(this.transitionVal, 0.0, this.duration, function (value) {
          _this7.transitionVal = value;
          _this7.invalidate();
        }, cb);
      }
    }

    /**
       * @param diffMode
       * @param immediate
       * @private
       */ }, { key: "enterNewDiffMode", value: function enterNewDiffMode(
    diffMode, immediate) {var _this8 = this;
      this.diffMode = diffMode;

      this.viewer.dispatchEvent({
        type: _PixelCompareConstants__WEBPACK_IMPORTED_MODULE_1__.EVENTS.DIFF_TOOL_DIFF_MODE_CHANGED,
        newDiffMode: this.diffMode });


      if (immediate) {
        this.transitionVal = 1.0;
        this.invalidate();
      }

      // Don't allow hiding models on side by side mode.
      if (diffMode === _PixelCompareConstants__WEBPACK_IMPORTED_MODULE_1__.DIFF_MODES.SIDE_BY_SIDE) {
        this.changeMainModelVisibility(true);
        this.changeSecondaryModelVisibility(true);
      }

      Autodesk.Viewing.Private.fadeValue(this.transitionVal, 1.0, this.duration, function (value) {
        _this8.transitionVal = value;
        _this8.invalidate();
      });
    }

    /**
       * Get diff mode.
       *
       * @returns {number}
       * @alias Autodesk.Viewing.Extensions.PixelCompare#getDiffMode
       */ }, { key: "getDiffMode", value: function getDiffMode()
    {
      return this.diffMode;
    }

    /**
       * Change split line width.
       *
       * @param {number} value - width in pixels.
       * 
       * @alias Autodesk.Viewing.Extensions.PixelCompare#setSplitLineWidth
       */ }, { key: "setSplitLineWidth", value: function setSplitLineWidth(
    value) {
      this.splitLineWidth = value;
      this.invalidate();
    }

    /**
       * Change split line color.
       *
       * @param {number} value - color in hex.
       * 
       * @alias Autodesk.Viewing.Extensions.PixelCompare#setSplitLineColor
       */ }, { key: "setSplitLineColor", value: function setSplitLineColor(
    value) {
      this.splitLineColor = new THREE.Color(value);
      this.invalidate();
    }

    /**
       * Enable / Disable offfset mode.
       *
       * @param {boolean} enable - enable / disable.
       * @alias Autodesk.Viewing.Extensions.PixelCompare#setChangeOffsetMode
       */ }, { key: "setChangeOffsetMode", value: function setChangeOffsetMode(
    enable) {
      this.changeOffsetMode = enable;
    }

    /**
       * Reset offset to initial position.
       * 
       * @alias Autodesk.Viewing.Extensions.PixelCompare#resetOffset
       */ }, { key: "resetOffset", value: function resetOffset()
    {
      this.alignSecondaryModel();
    }

    /**
       * Change color intensity value of overlay mode.
       *
       * @param {number} value - number between 0 to 1.
       * 
       * @alias Autodesk.Viewing.Extensions.PixelCompare#changeColorIntensity
       */ }, { key: "changeColorIntensity", value: function changeColorIntensity(
    value) {
      this.colorIntensity = value;
      this.invalidate();
    }


    /**
       * Translates secondary model.
       * @private
       */ }, { key: "translateSecondaryModel", value: function translateSecondaryModel(
    translation) {
      var translationMatrix = new THREE.Matrix4().makeTranslation(translation.x, translation.y, 0);
      var currentMatrix = this.secondaryModel.getPlacementTransform().clone();
      this.viewer.impl.setPlacementTransform(this.secondaryModel, translationMatrix.multiply(currentMatrix));
    }

    /**
       * @param index
       * @param visible
       * @private
       */ }, { key: "changeModelVisibility", value: function changeModelVisibility(
    index, visible) {
      // Don't allow hiding models on side by side mode.
      if (!visible && this.getDiffMode() === _PixelCompareConstants__WEBPACK_IMPORTED_MODULE_1__.DIFF_MODES.SIDE_BY_SIDE) {
        return;
      }

      this.modelHiddenMap[index] = !visible;

      // Make sure at least one model stays visible.
      if (!visible && this.modelHiddenMap[1 - index]) {
        this.changeModelVisibility(1 - index, true);
      }

      this.viewer.dispatchEvent({
        type: _PixelCompareConstants__WEBPACK_IMPORTED_MODULE_1__.EVENTS.DIFF_TOOL_MODEL_VISIBILITY_CHANGED });


      this.invalidate();
    }

    /**
       * Show / Hide main model inside diff mode.
       *
       * @param {boolean} visible - visible / invisible.
       * @alias Autodesk.Viewing.Extensions.PixelCompare#changeMainModelVisibility
       */ }, { key: "changeMainModelVisibility", value: function changeMainModelVisibility(
    visible) {
      this.changeModelVisibility(0, visible);
    }

    /**
       * Show / Hide secondary model inside diff mode.
       *
       * @param {boolean} visible - visible / invisible.
       * @alias Autodesk.Viewing.Extensions.PixelCompare#changeSecondaryModelVisibility
       */ }, { key: "changeSecondaryModelVisibility", value: function changeSecondaryModelVisibility(
    visible) {
      this.changeModelVisibility(1, visible);
    }

    /**
       * Get main model visibility.
       *
       * @returns {boolean}
       * @alias Autodesk.Viewing.Extensions.PixelCompare#getMainModelVisibility
       */ }, { key: "getMainModelVisibility", value: function getMainModelVisibility()
    {
      return !this.modelHiddenMap[0];
    }

    /**
       * Get secondary model visibility.
       *
       * @returns {boolean}
       * @alias Autodesk.Viewing.Extensions.PixelCompare#getMainModelVisibility
       */ }, { key: "getSecondaryModelVisibility", value: function getSecondaryModelVisibility()
    {
      return !this.modelHiddenMap[1];
    } }]);return PixelCompare;}(Autodesk.Viewing.Extension);


var namespace = AutodeskNamespace('Autodesk.Viewing.PixelCompare');
namespace.DIFF_MODES = Object.assign({}, _PixelCompareConstants__WEBPACK_IMPORTED_MODULE_1__.DIFF_MODES);
namespace.EVENTS = Object.assign({}, _PixelCompareConstants__WEBPACK_IMPORTED_MODULE_1__.EVENTS);

// Register the extension with the extension manager.
Autodesk.Viewing.theExtensionManager.registerExtension('Autodesk.Viewing.PixelCompare', PixelCompare);
})();

Autodesk.Extensions.PixelCompare = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=PixelCompare.js.map