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

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./extensions/Fusion360/AnimationToolbar.scss":
/*!*********************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./extensions/Fusion360/AnimationToolbar.scss ***!
  \*********************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, ".adsk-viewing-viewer {\n  /**\n * Animation toolbar\n **/ }\n  .adsk-viewing-viewer .adsk-toolbar.toolbar-animation-subtoolbar {\n    font-size: 12px;\n    height: 50px;\n    bottom: 70px;\n    z-index: 4; }\n  .adsk-viewing-viewer .toolbar-animation-subtoolbar .toolbar-animation-forward-icon {\n    min-width: 28px;\n    min-height: 16px; }\n  .adsk-viewing-viewer .toolbar-animation-subtoolbar .toolbar-animation-backward-icon {\n    min-width: 28px;\n    min-height: 16px; }\n  .adsk-viewing-viewer .toolbar-animation-subtoolbar .toolbar-animation-timeline {\n    top: 0;\n    margin: 2px 0 0 0; }\n  .adsk-viewing-viewer .toolbar-animation-subtoolbar .animation-timeline {\n    outline: none; }\n  .adsk-viewing-viewer .toolbar-animation-subtoolbar .animation-time-lapse {\n    outline: none;\n    border-width: 0;\n    width: 48px;\n    position: relative;\n    z-index: 0;\n    background: rgba(34, 34, 34, 0);\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    -khtml-user-select: none;\n    -ms-user-select: none; }\n  .adsk-viewing-viewer .toolbar-animation-subtoolbar .toolbar-animation-menu-placer {\n    bottom: 46px; }\n  .adsk-viewing-viewer .toolbar-animation-subtoolbar .toolbar-animation-button {\n    float: left;\n    cursor: pointer;\n    border-radius: 5px;\n    padding: 0;\n    width: auto;\n    height: auto;\n    min-width: 48px;\n    min-height: 48px; }\n  .adsk-viewing-viewer .toolbar-animation-subtoolbar .toolbar-animation-button {\n    border: none !important; }\n  .adsk-viewing-viewer .toolbar-animation-subtoolbar .toolbar-animation-button:hover {\n    border: none !important; }\n  .adsk-viewing-viewer .toolbar-animation-subtoolbar .toolbar-animation-close-button {\n    top: -14px;\n    width: 25px;\n    height: 48px;\n    min-width: 0;\n    min-height: 0;\n    position: relative; }\n  .adsk-viewing-viewer .toolbar-animation-subtoolbar .toolbar-animation-close-button.docking-panel-close {\n    background-position: 5px 19px; }\n  .adsk-viewing-viewer .toolbar-animation-subtoolbar .toolbar-animation-button > input {\n    margin-top: 5px;\n    width: 80px;\n    text-align: center; }\n  .adsk-viewing-viewer .toolbar-menu-collapsed .toolbar-animation-subtoolbar {\n    display: none; }\n  .adsk-viewing-viewer .toolbar-animation-subtoolbar .adsk-control-group {\n    padding-top: 10px;\n    height: calc(100% - 10px);\n    position: relative; }\n", ""]);
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

/***/ "./extensions/Fusion360/AnimationLocales.js":
/*!**************************************************!*\
  !*** ./extensions/Fusion360/AnimationLocales.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "locales": () => (/* binding */ locales)
/* harmony export */ });
/* harmony import */ var _res_locales_en_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../res/locales/en/nobundle-animation.loc.json */ "./res/locales/en/nobundle-animation.loc.json");
/* harmony import */ var _res_locales_en_GB_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../res/locales/en-GB/nobundle-animation.loc.json */ "./res/locales/en-GB/nobundle-animation.loc.json");
/* harmony import */ var _res_locales_cs_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../res/locales/cs/nobundle-animation.loc.json */ "./res/locales/cs/nobundle-animation.loc.json");
/* harmony import */ var _res_locales_de_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../res/locales/de/nobundle-animation.loc.json */ "./res/locales/de/nobundle-animation.loc.json");
/* harmony import */ var _res_locales_es_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../res/locales/es/nobundle-animation.loc.json */ "./res/locales/es/nobundle-animation.loc.json");
/* harmony import */ var _res_locales_fr_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../res/locales/fr/nobundle-animation.loc.json */ "./res/locales/fr/nobundle-animation.loc.json");
/* harmony import */ var _res_locales_fr_CA_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../res/locales/fr-CA/nobundle-animation.loc.json */ "./res/locales/fr-CA/nobundle-animation.loc.json");
/* harmony import */ var _res_locales_it_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../res/locales/it/nobundle-animation.loc.json */ "./res/locales/it/nobundle-animation.loc.json");
/* harmony import */ var _res_locales_ja_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../res/locales/ja/nobundle-animation.loc.json */ "./res/locales/ja/nobundle-animation.loc.json");
/* harmony import */ var _res_locales_ko_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../res/locales/ko/nobundle-animation.loc.json */ "./res/locales/ko/nobundle-animation.loc.json");
/* harmony import */ var _res_locales_pl_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../res/locales/pl/nobundle-animation.loc.json */ "./res/locales/pl/nobundle-animation.loc.json");
/* harmony import */ var _res_locales_pt_BR_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../res/locales/pt-BR/nobundle-animation.loc.json */ "./res/locales/pt-BR/nobundle-animation.loc.json");
/* harmony import */ var _res_locales_ru_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../res/locales/ru/nobundle-animation.loc.json */ "./res/locales/ru/nobundle-animation.loc.json");
/* harmony import */ var _res_locales_tr_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../res/locales/tr/nobundle-animation.loc.json */ "./res/locales/tr/nobundle-animation.loc.json");
/* harmony import */ var _res_locales_zh_HANS_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../res/locales/zh-HANS/nobundle-animation.loc.json */ "./res/locales/zh-HANS/nobundle-animation.loc.json");
/* harmony import */ var _res_locales_zh_HANT_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../res/locales/zh-HANT/nobundle-animation.loc.json */ "./res/locales/zh-HANT/nobundle-animation.loc.json");
/* harmony import */ var _res_locales_zh_HK_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../res/locales/zh-HK/nobundle-animation.loc.json */ "./res/locales/zh-HK/nobundle-animation.loc.json");
/* harmony import */ var _res_locales_nl_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../res/locales/nl/nobundle-animation.loc.json */ "./res/locales/nl/nobundle-animation.loc.json");
/* harmony import */ var _res_locales_sv_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../res/locales/sv/nobundle-animation.loc.json */ "./res/locales/sv/nobundle-animation.loc.json");
/* harmony import */ var _res_locales_da_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../res/locales/da/nobundle-animation.loc.json */ "./res/locales/da/nobundle-animation.loc.json");
/* harmony import */ var _res_locales_no_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../res/locales/no/nobundle-animation.loc.json */ "./res/locales/no/nobundle-animation.loc.json");
/**
 * Include each locale json file and return it in an object
 * that can be consumed by i18n
 */























var locales = {
  en: _res_locales_en_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_0__,
  "en-GB": _res_locales_en_GB_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_1__,
  cs: _res_locales_cs_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_2__,
  de: _res_locales_de_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_3__,
  es: _res_locales_es_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_4__,
  fr: _res_locales_fr_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_5__,
  "fr-CA": _res_locales_fr_CA_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_6__,
  it: _res_locales_it_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_7__,
  ja: _res_locales_ja_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_8__,
  ko: _res_locales_ko_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_9__,
  pl: _res_locales_pl_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_10__,
  "pt-BR": _res_locales_pt_BR_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_11__,
  ru: _res_locales_ru_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_12__,
  tr: _res_locales_tr_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_13__,
  "zh-HANS": _res_locales_zh_HANS_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_14__,
  "zh-HANT": _res_locales_zh_HANT_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_15__,
  "zh-HK": _res_locales_zh_HK_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_16__,
  nl: _res_locales_nl_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_17__,
  sv: _res_locales_sv_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_18__,
  da: _res_locales_da_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_19__,
  no: _res_locales_no_nobundle_animation_loc_json__WEBPACK_IMPORTED_MODULE_20__ };

/***/ }),

/***/ "./extensions/Fusion360/AnimationPanel.js":
/*!************************************************!*\
  !*** ./extensions/Fusion360/AnimationPanel.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AnimationPanel": () => (/* binding */ AnimationPanel)
/* harmony export */ });



var TAB_ID = 'configTab';
var TAB_LABEL = 'Configuration';
var PAUSE_ON_ORBIT_LABEL = 'Animate camera';
var PAUSE_ON_ORBIT_DESCR = 'When checked, animation pauses whenever the user interacts with camera';
var SLIDER_LABEL = 'Speed modifier';
var SLIDER_MIN_VALUE = 0.1;
var SLIDER_MAX_VALUE = 4;
var LOOP_LABEL = 'Loop';
var LOOP_DESCR = 'Rewind and play as soon as the animation completes';


var AnimationPanel = function AnimationPanel(viewer, extension, title) {

  var PANEL_ID = 'adsk_fusion_animation_panel_' + viewer.id;
  var opts = { heightAdjustment: 90, width: 460 };
  Autodesk.Viewing.UI.SettingsPanel.call(this, viewer.container, PANEL_ID, title, opts);
  this.container.classList.add('viewer-settings-panel');

  this.viewer = viewer;

  // Add a default tab called Configuration
  this.addTab(TAB_ID, TAB_LABEL, { className: 'config' });
  this.selectTab(TAB_ID);

  // Checkbox "follow camera"
  var initValue = extension.isFollowingCamera();
  this.addCheckbox(TAB_ID, PAUSE_ON_ORBIT_LABEL, initValue, function (checked) {
    extension.setFollowCamera(checked);
  }, PAUSE_ON_ORBIT_DESCR);


  // Slider "Speed modifier"
  initValue = extension.getSpeedModifier();
  this.addSlider(TAB_ID, SLIDER_LABEL,
  SLIDER_MIN_VALUE, SLIDER_MAX_VALUE, initValue,
  function (event) {
    var value = event.detail.value;
    extension.setSpeedModifier(Number(value));
  },
  { step: 0.1 });


  // Checkbox "Loop"
  initValue = extension.isLooping();
  this.addCheckbox(TAB_ID, LOOP_LABEL, initValue, function (checked) {
    extension.setLooping(checked);
  }, LOOP_DESCR);


  this.createFooter();
};

AnimationPanel.prototype = Object.create(Autodesk.Viewing.UI.SettingsPanel.prototype);
AnimationPanel.prototype.constructor = AnimationPanel;

/***/ }),

/***/ "./extensions/Fusion360/AnimationToolbar.scss":
/*!****************************************************!*\
  !*** ./extensions/Fusion360/AnimationToolbar.scss ***!
  \****************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_AnimationToolbar_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./AnimationToolbar.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./extensions/Fusion360/AnimationToolbar.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_AnimationToolbar_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_AnimationToolbar_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_AnimationToolbar_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_AnimationToolbar_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


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

/***/ "./res/locales/cs/nobundle-animation.loc.json":
/*!****************************************************!*\
  !*** ./res/locales/cs/nobundle-animation.loc.json ***!
  \****************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"cs","@@context":"Prohlížeč animací","Play":"Přehrát","Pause":"Pozastavit","Next keyframe":"Další klíčový snímek","Previous keyframe":"Předchozí klíčový snímek","Click-drag to scrub":"Kliknutím a přetažením procházejte","Close animation timeline":"Zavřít časovou osu animace","Animate camera":"Animovat kameru","When checked, animation pauses whenever the user interacts with camera":"Při zaškrtnutí se animace pozastaví, kdykoli bude uživatel manipulovat s kamerou.","Loop":"Smyčka","Rewind and play as soon as the animation completes":"Převinout zpět a přehrávat ihned po dokončení animace","Speed modifier":"Ovladač rychlosti"}');

/***/ }),

/***/ "./res/locales/da/nobundle-animation.loc.json":
/*!****************************************************!*\
  !*** ./res/locales/da/nobundle-animation.loc.json ***!
  \****************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"da","@@context":"Animationsfremviser","Play":"Afspil","Pause":"Pause","Next keyframe":"Næste keyframe","Previous keyframe":"Forrige keyframe","Click-drag to scrub":"Klik og træk for hurtig visning","Close animation timeline":"Luk tidslinje for animation","Animate camera":"Animer kamera","When checked, animation pauses whenever the user interacts with camera":"Hvis markeret pauser animationen, når som helst brugeren interagerer med kamera.","Loop":"Loop","Rewind and play as soon as the animation completes":"Spol tilbage, og afspil så snart animationen er færdig","Speed modifier":"Hastighedsmodifikator"}');

/***/ }),

/***/ "./res/locales/de/nobundle-animation.loc.json":
/*!****************************************************!*\
  !*** ./res/locales/de/nobundle-animation.loc.json ***!
  \****************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"de","@@context":"Viewer-Animation","Play":"Wiedergabe","Pause":"Pause","Next keyframe":"Nächstes Keyframe","Previous keyframe":"Vorheriges Keyframe","Click-drag to scrub":"Für einen schnellen Vorlauf klicken und ziehen","Close animation timeline":"Animationsablaufprogramm schließen","Animate camera":"Kamera animieren","When checked, animation pauses whenever the user interacts with camera":"Wenn dieses Kontrollkästchen aktiviert ist, wird die Animation bei jeder Interaktion mit dem Benutzer angehalten.","Loop":"Schleife","Rewind and play as soon as the animation completes":"Zurückspulen und wiedergeben, sobald die Animation endet","Speed modifier":"Modifikator \\"Geschwindigkeit\\""}');

/***/ }),

/***/ "./res/locales/en-GB/nobundle-animation.loc.json":
/*!*******************************************************!*\
  !*** ./res/locales/en-GB/nobundle-animation.loc.json ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"en","@@context":"Viewer Animation","Play":"Play","Pause":"Pause","Next keyframe":"Next Keyframe","Previous keyframe":"Previous Keyframe","Click-drag to scrub":"Click-drag to Scrub","Close animation timeline":"Close Animation Timeline","Animate camera":"Animate Camera","When checked, animation pauses whenever the user interacts with camera":"When checked, animation pauses whenever the user interacts with the camera.","Loop":"Loop","Rewind and play as soon as the animation completes":"Rewind and play as soon as the animation completes.","Speed modifier":"Speed modifier"}');

/***/ }),

/***/ "./res/locales/en/nobundle-animation.loc.json":
/*!****************************************************!*\
  !*** ./res/locales/en/nobundle-animation.loc.json ***!
  \****************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"en","@@context":"Viewer Animation","Play":"Play","Pause":"Pause","Next keyframe":"Next keyframe","Previous keyframe":"Previous keyframe","Click-drag to scrub":"Click-drag to scrub","Close animation timeline":"Close animation timeline","Animate camera":"Animate camera","When checked, animation pauses whenever the user interacts with camera":"When checked, animation pauses whenever the user interacts with camera.","Loop":"Loop","Rewind and play as soon as the animation completes":"Rewind and play as soon as the animation completes","Speed modifier":"Speed modifier"}');

/***/ }),

/***/ "./res/locales/es/nobundle-animation.loc.json":
/*!****************************************************!*\
  !*** ./res/locales/es/nobundle-animation.loc.json ***!
  \****************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"es","@@context":"Animación del visor","Play":"Reproducir","Pause":"Pausar","Next keyframe":"Siguiente fotograma clave","Previous keyframe":"Fotograma clave anterior","Click-drag to scrub":"Haga clic y arrastre para anular.","Close animation timeline":"Cerrar duración de la animación","Animate camera":"Animar cámara","When checked, animation pauses whenever the user interacts with camera":"Si se ha activado esta opción, la animación se detiene temporalmente cuando el usuario interacciona con la cámara.","Loop":"Bucle","Rewind and play as soon as the animation completes":"Rebobina y reproduce en cuanto se completa la animación.","Speed modifier":"Modificador de velocidad"}');

/***/ }),

/***/ "./res/locales/fr-CA/nobundle-animation.loc.json":
/*!*******************************************************!*\
  !*** ./res/locales/fr-CA/nobundle-animation.loc.json ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"fr-CA","@@context":"Animation du visualiseur","Play":"Lire","Pause":"Suspendre","Next keyframe":"Image clé suivante","Previous keyframe":"Image clé précédente","Click-drag to scrub":"Cliquez et faites glisser le curseur pour faire défiler la page","Close animation timeline":"Fermer le plan de montage chronologique de l\'animation","Animate camera":"Animer la caméra","When checked, animation pauses whenever the user interacts with camera":"Lorsque cette option est sélectionnée, l\'animation se met en pause chaque fois que l\'utilisateur interagit avec la caméra.","Loop":"Boucle","Rewind and play as soon as the animation completes":"Rembobiner et lire dès que l\'animation est terminée","Speed modifier":"Modificateur de vitesse"}');

/***/ }),

/***/ "./res/locales/fr/nobundle-animation.loc.json":
/*!****************************************************!*\
  !*** ./res/locales/fr/nobundle-animation.loc.json ***!
  \****************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"fr","@@context":"Animation du visualiseur","Play":"Lire","Pause":"Suspendre","Next keyframe":"Image clé suivante","Previous keyframe":"Image clé précédente","Click-drag to scrub":"Cliquez et faites glisser le curseur pour faire défiler la page","Close animation timeline":"Fermer le plan de montage chronologique de l\'animation","Animate camera":"Animer la caméra","When checked, animation pauses whenever the user interacts with camera":"Lorsque cette option est sélectionnée, l\'animation se met en pause chaque fois que l\'utilisateur interagit avec la caméra.","Loop":"Boucle","Rewind and play as soon as the animation completes":"Rembobiner et lire dès que l\'animation est terminée","Speed modifier":"Modificateur de vitesse"}');

/***/ }),

/***/ "./res/locales/it/nobundle-animation.loc.json":
/*!****************************************************!*\
  !*** ./res/locales/it/nobundle-animation.loc.json ***!
  \****************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"it","@@context":"Animazione visualizzatore","Play":"Riproduci","Pause":"Pausa","Next keyframe":"Fotogramma chiave successivo","Previous keyframe":"Fotogramma chiave precedente","Click-drag to scrub":"Fare clic e trascinare per scorrere","Close animation timeline":"Chiudi sequenza temporale animazione","Animate camera":"Anima inquadratura","When checked, animation pauses whenever the user interacts with camera":"Quando questa opzione è selezionata, l\'animazione viene messa in pausa ogni volta che l\'utente interagisce con l\'inquadratura.","Loop":"Riproduzione continua","Rewind and play as soon as the animation completes":"Riavvolgi e riproduci non appena l\'animazione è stata completata","Speed modifier":"Modificatore di velocità"}');

/***/ }),

/***/ "./res/locales/ja/nobundle-animation.loc.json":
/*!****************************************************!*\
  !*** ./res/locales/ja/nobundle-animation.loc.json ***!
  \****************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"ja","@@context":"ビューア アニメーション","Play":"再生","Pause":"一時停止","Next keyframe":"次のキーフレーム","Previous keyframe":"前のキーフレーム","Click-drag to scrub":"クリックしてドラッグでスクラブ","Close animation timeline":"アニメーション タイムラインを閉じる","Animate camera":"カメラをアニメート","When checked, animation pauses whenever the user interacts with camera":"オンにすると、ユーザがカメラを操作するたびにアニメーションが一時停止します。","Loop":"ループ","Rewind and play as soon as the animation completes":"アニメーションが完了したらすぐに巻き戻して再生します","Speed modifier":"速度モディファイヤ"}');

/***/ }),

/***/ "./res/locales/ko/nobundle-animation.loc.json":
/*!****************************************************!*\
  !*** ./res/locales/ko/nobundle-animation.loc.json ***!
  \****************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"ko","@@context":"뷰어 애니메이션","Play":"재생","Pause":"일시 중지","Next keyframe":"다음 키프레임","Previous keyframe":"이전 키프레임","Click-drag to scrub":"클릭한 상태로 끌어 스크럽","Close animation timeline":"애니메이션 타임라인 닫기","Animate camera":"카메라 애니메이트","When checked, animation pauses whenever the user interacts with camera":"이 옵션을 선택하면 사용자가 카메라를 사용할 때마다 애니메이션이 일시 중지됩니다.","Loop":"루프","Rewind and play as soon as the animation completes":"애니메이션이 끝나면 뒤로 돌아가 재생","Speed modifier":"속도 수정자"}');

/***/ }),

/***/ "./res/locales/nl/nobundle-animation.loc.json":
/*!****************************************************!*\
  !*** ./res/locales/nl/nobundle-animation.loc.json ***!
  \****************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"nl","@@context":"Vieweranimatie","Play":"Afspelen","Pause":"Pauzeren","Next keyframe":"Volgend keyframe","Previous keyframe":"Vorig keyframe","Click-drag to scrub":"Klik en sleep om te scrubben","Close animation timeline":"Animatietijdlijn sluiten","Animate camera":"Camera van animatie voorzien","When checked, animation pauses whenever the user interacts with camera":"Als dit is aangevinkt, wordt de animatie gepauzeerd zodra de gebruiker de camera gebruikt.","Loop":"Herhalen","Rewind and play as soon as the animation completes":"Terugspoelen en afspelen zodra de animatie is voltooid","Speed modifier":"Snelheid aanpassen"}');

/***/ }),

/***/ "./res/locales/no/nobundle-animation.loc.json":
/*!****************************************************!*\
  !*** ./res/locales/no/nobundle-animation.loc.json ***!
  \****************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"no","@@context":"Viewer-animasjon","Play":"Spill av","Pause":"Pause","Next keyframe":"Neste nøkkelbilde","Previous keyframe":"Forrige nøkkelbilde","Click-drag to scrub":"Dra og slipp for å søke","Close animation timeline":"Lukk animasjonstidslinje","Animate camera":"Animer kamera","When checked, animation pauses whenever the user interacts with camera":"Når det er krysset av, settes animasjonen på pause når brukeren samhandler med kameraet.","Loop":"Loop","Rewind and play as soon as the animation completes":"Spol og spill av så snart animasjonen er fullført","Speed modifier":"Hastighetsmodifisering"}');

/***/ }),

/***/ "./res/locales/pl/nobundle-animation.loc.json":
/*!****************************************************!*\
  !*** ./res/locales/pl/nobundle-animation.loc.json ***!
  \****************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"pl","@@context":"Animacja w przeglądarce","Play":"Odtwórz","Pause":"Pauza","Next keyframe":"Następna ramka kluczowa","Previous keyframe":"Poprzednia ramka kluczowa","Click-drag to scrub":"Kliknij i przeciągnij, aby przewinąć","Close animation timeline":"Zamknij oś czasu animacji","Animate camera":"Animacja kamery","When checked, animation pauses whenever the user interacts with camera":"Jeśli ta opcja jest zaznaczona, animacja zatrzymuje się, gdy użytkownik przejmie obsługę kamery.","Loop":"Pętla","Rewind and play as soon as the animation completes":"Cofnij i odtwórz zaraz po zakończeniu animacji","Speed modifier":"Modyfikator prędkości"}');

/***/ }),

/***/ "./res/locales/pt-BR/nobundle-animation.loc.json":
/*!*******************************************************!*\
  !*** ./res/locales/pt-BR/nobundle-animation.loc.json ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"pt","@@context":"Animação do visualizador","Play":"Reproduzir","Pause":"Pausar","Next keyframe":"Próximo quadro-chave","Previous keyframe":"Quadro-chave anterior","Click-drag to scrub":"Clicar e arrastar para ignorar","Close animation timeline":"Fechar linha de tempo da animação","Animate camera":"Animar câmera","When checked, animation pauses whenever the user interacts with camera":"Quando marcada, a animação pausa sempre que o usuário interage com a câmera.","Loop":"Loop","Rewind and play as soon as the animation completes":"Rebobinar e reproduzir assim que a animação ficar concluída","Speed modifier":"Modificador de velocidade"}');

/***/ }),

/***/ "./res/locales/ru/nobundle-animation.loc.json":
/*!****************************************************!*\
  !*** ./res/locales/ru/nobundle-animation.loc.json ***!
  \****************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"ru","@@context":"Просмотр анимации","Play":"Воспроизведение","Pause":"Пауза","Next keyframe":"Следующий ключевой кадр","Previous keyframe":"Предыдущий ключевой кадр","Click-drag to scrub":"Чтобы отменить, нажмите и перетащите","Close animation timeline":"Закрыть временную шкалу анимации","Animate camera":"Анимация камеры","When checked, animation pauses whenever the user interacts with camera":"Если флажок установлен, анимация приостанавливается при взаимодействии пользователя с камерой.","Loop":"Цикл","Rewind and play as soon as the animation completes":"Перемотка назад и воспроизведение сразу после завершения анимации","Speed modifier":"Модификатор скорости"}');

/***/ }),

/***/ "./res/locales/sv/nobundle-animation.loc.json":
/*!****************************************************!*\
  !*** ./res/locales/sv/nobundle-animation.loc.json ***!
  \****************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"sv","@@context":"Animering av visningsprogrammet","Play":"Spela upp","Pause":"Pausa","Next keyframe":"Nästa keyframe","Previous keyframe":"Föregående keyframe","Click-drag to scrub":"Klicka-och-dra för att skrubba","Close animation timeline":"Stäng animeringstidslinjen","Animate camera":"Animera kameran","When checked, animation pauses whenever the user interacts with camera":"När detta är valt, pausas animationer när användaren interagerar med kameran.","Loop":"Upprepa","Rewind and play as soon as the animation completes":"Spola tillbaka och spela upp direkt efter att animationen är klar","Speed modifier":"Hastighetsmodifierare"}');

/***/ }),

/***/ "./res/locales/tr/nobundle-animation.loc.json":
/*!****************************************************!*\
  !*** ./res/locales/tr/nobundle-animation.loc.json ***!
  \****************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"tr","@@context":"Görüntüleyici Animasyonu","Play":"Oynat","Pause":"Duraklat","Next keyframe":"Sonraki ana kare","Previous keyframe":"Önceki ana kare","Click-drag to scrub":"Temizlemek için tıkla ve sürükle","Close animation timeline":"Canlandırma zaman çizgisini kapat","Animate camera":"Kamerayı canlandır","When checked, animation pauses whenever the user interacts with camera":"İşaretlendiğinde, kullanıcı kamera ile etkileşimde bulunduğunda canlandırma duraklar.","Loop":"Döngü","Rewind and play as soon as the animation completes":"Canlandırma tamamlanır tamamlanmaz geri al ve oynat","Speed modifier":"Hız değiştirici"}');

/***/ }),

/***/ "./res/locales/zh-HANS/nobundle-animation.loc.json":
/*!*********************************************************!*\
  !*** ./res/locales/zh-HANS/nobundle-animation.loc.json ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"zh-Hans","@@context":"查看器动画演示","Play":"播放","Pause":"暂停","Next keyframe":"下一关键帧","Previous keyframe":"上一关键帧","Click-drag to scrub":"单击并拖动以擦除","Close animation timeline":"关闭动画时间轴","Animate camera":"照相机动画演示","When checked, animation pauses whenever the user interacts with camera":"如果选中，动画将在用户与照相机交互时暂停。","Loop":"循环","Rewind and play as soon as the animation completes":"只要动画完成播放，就会倒回并播放","Speed modifier":"速度修改器"}');

/***/ }),

/***/ "./res/locales/zh-HANT/nobundle-animation.loc.json":
/*!*********************************************************!*\
  !*** ./res/locales/zh-HANT/nobundle-animation.loc.json ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"zh-Hant","@@context":"檢視器動畫","Play":"播放","Pause":"暫停","Next keyframe":"下一個關鍵畫面","Previous keyframe":"上一個關鍵畫面","Click-drag to scrub":"按一下並拖曳以進行編修","Close animation timeline":"關閉動畫時間軸線","Animate camera":"以動畫顯示相機","When checked, animation pauses whenever the user interacts with camera":"如果勾選此選項，每當使用者與相機互動時，動畫就會暫停。","Loop":"循環播放","Rewind and play as soon as the animation completes":"動畫一完成就倒轉並播放","Speed modifier":"速度修改器"}');

/***/ }),

/***/ "./res/locales/zh-HK/nobundle-animation.loc.json":
/*!*******************************************************!*\
  !*** ./res/locales/zh-HK/nobundle-animation.loc.json ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"zh-hk","@@context":"檢視器動畫","Play":"播放","Pause":"暫停","Next keyframe":"下一個主要畫格","Previous keyframe":"上一個主要畫格","Click-drag to scrub":"按住並拖曳以編修","Close animation timeline":"關閉動畫時間軸線","Animate camera":"以動畫顯示相機","When checked, animation pauses whenever the user interacts with camera":"如果勾選此選項，每當使用者與相機互動時，動畫就會暫停。","Loop":"循環播放","Rewind and play as soon as the animation completes":"動畫完結即倒帶並播放","Speed modifier":"速度修改器"}');

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
/*!****************************************************!*\
  !*** ./extensions/Fusion360/AnimationExtension.js ***!
  \****************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ANIMATION_PLAY_EVENT": () => (/* binding */ ANIMATION_PLAY_EVENT),
/* harmony export */   "ANIMATION_PAUSE_EVENT": () => (/* binding */ ANIMATION_PAUSE_EVENT),
/* harmony export */   "ANIMATION_SEEK_EVENT": () => (/* binding */ ANIMATION_SEEK_EVENT),
/* harmony export */   "ANIMATION_PREVIOUS_FRAME_EVENT": () => (/* binding */ ANIMATION_PREVIOUS_FRAME_EVENT),
/* harmony export */   "ANIMATION_NEXT_FRAME_EVENT": () => (/* binding */ ANIMATION_NEXT_FRAME_EVENT),
/* harmony export */   "ANIMATION_TRACK_UPDATE_EVENT": () => (/* binding */ ANIMATION_TRACK_UPDATE_EVENT),
/* harmony export */   "ANIMATION_TOOLBAR_CLOSE_EVENT": () => (/* binding */ ANIMATION_TOOLBAR_CLOSE_EVENT),
/* harmony export */   "AnimationExtension": () => (/* binding */ AnimationExtension)
/* harmony export */ });
/* harmony import */ var _AnimationToolbar_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AnimationToolbar.scss */ "./extensions/Fusion360/AnimationToolbar.scss");
/* harmony import */ var _AnimationPanel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AnimationPanel */ "./extensions/Fusion360/AnimationPanel.js");
/* harmony import */ var _AnimationLocales__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AnimationLocales */ "./extensions/Fusion360/AnimationLocales.js");
var av = Autodesk.Viewing;
var avp = Autodesk.Viewing.Private;
var avu = Autodesk.Viewing.UI;

var ToolBar = avu.ToolBar;
var ControlGroup = avu.ControlGroup;
var Button = avu.Button;
var Control = avu.Control;
var TOOLBAR = av.TOOLBAR;
var isTouchDevice = avp.isTouchDevice;
var isIE11 = avp.isIE11;

var ANIMATION_PLAY_EVENT = 'animationPlayEvent';
var ANIMATION_PAUSE_EVENT = 'animationPauseEvent';
var ANIMATION_SEEK_EVENT = 'animationSeekEvent';
var ANIMATION_PREVIOUS_FRAME_EVENT = 'animationPreviousFrameEvent';
var ANIMATION_NEXT_FRAME_EVENT = 'animationNextFrameEvent';
var ANIMATION_TRACK_UPDATE_EVENT = 'animationTrackUpdateEvent';
var ANIMATION_TOOLBAR_CLOSE_EVENT = 'animationToolbarCloseEvent';





var SETTINGS_BUTTON_LABEL = 'Animation';

//TODO: These exports into the global namespace seem to only be used by unit tests
av.ANIMATION_PLAY_EVENT = ANIMATION_PLAY_EVENT;
av.ANIMATION_PAUSE_EVENT = ANIMATION_PAUSE_EVENT;
av.ANIMATION_SEEK_EVENT = ANIMATION_SEEK_EVENT;
av.ANIMATION_PREVIOUS_FRAME_EVENT = ANIMATION_PREVIOUS_FRAME_EVENT;
av.ANIMATION_NEXT_FRAME_EVENT = ANIMATION_NEXT_FRAME_EVENT;
av.ANIMATION_TRACK_UPDATE_EVENT = ANIMATION_TRACK_UPDATE_EVENT;
av.ANIMATION_TOOLBAR_CLOSE_EVENT = ANIMATION_TOOLBAR_CLOSE_EVENT;

/**
                                                                   * AnimationExtension adds a toolbar with buttons (play/pause/forward/backward/goto start/end)
                                                                   * and timeline scrubber to control animation playback.
                                                                   * The extension provides api methods that will be reflected by the animation toolbar.
                                                                   *
                                                                   * The extension id is: `Autodesk.Fusion360.Animation`
                                                                   *
                                                                   * @param {Viewer3D} viewer - Viewer instance
                                                                   * @param {object} options - Configurations for the extension
                                                                   * @example 
                                                                   * viewer.loadExtension('Autodesk.Fusion360.Animation')
                                                                   * @memberof Autodesk.Viewing.Extensions
                                                                   * @alias Autodesk.Viewing.Extensions.AnimationExtension
                                                                   * @see {@link Autodesk.Viewing.Extension} for common inherited methods.
                                                                   * @class
                                                                   */
function AnimationExtension(viewer, options) {
  av.Extension.call(this, viewer, options);
  this.viewer = viewer;
  this.animTools = null;
  this.animToolsId = "animationTools";
  this.playButton = null;
  this.playButtonIsPaused = true;
  this.prevAnimationTime = -1;
  this.name = 'fusionanimation';
  this._configButtonId = null;
  this._panel = null;

  this._onGeomAndObjTreeReady = this._onGeomAndObjTreeReady.bind(this);
  this.openPanel = this.openPanel.bind(this);
  this._onPlayCallback = this._onPlayCallback.bind(this);
  this._onCameraChange = this._onCameraChange.bind(this);
  this._onExplode = this._onExplode.bind(this);
  this._onResize = this._onResize.bind(this);
  this._onEscape = this._onEscape.bind(this);

  this._toolbarReady = false;
  this._animationReady = false;
}

AnimationExtension.prototype = Object.create(av.Extension.prototype);
AnimationExtension.prototype.constructor = AnimationExtension;

/**
                                                                * Converts seconds into Hours:Minutes:Seconds String
                                                                *
                                                                * @param {number} time in seconds
                                                                * @returns {string}
                                                                * @private
                                                                */
function convertSecsToHMS(time) {
  var sign = "";
  if (time < 0) {sign = "-";time = -time;}
  var hrs = ~~(time / 3600);
  var mins = ~~(time % 3600 / 60);
  var secs = time % 60;
  var ret = sign;
  if (hrs > 0)
  ret += hrs + ":" + (mins < 10 ? "0" : "");
  ret += mins + ":" + (secs < 10 ? "0" : "");
  ret += secs.toFixed(2);
  return ret;
}

/**
   * Adds a toolbar button and hooks animation listeners.
   * 
   * @alias Autodesk.Viewing.Extensions.AnimationExtension#load
   */
AnimationExtension.prototype.load = function () {

  this.extendLocalization(_AnimationLocales__WEBPACK_IMPORTED_MODULE_2__.locales);

  this._initAnim = false;
  if (this._canAnimationInitialize()) {
    this._initAnimations({ model: this.viewer.model });
  } else {
    this.viewer.addEventListener(av.GEOMETRY_LOADED_EVENT, this._onGeomAndObjTreeReady, { once: true });
    this.viewer.addEventListener(av.OBJECT_TREE_CREATED_EVENT, this._onGeomAndObjTreeReady, { once: true });
  }

  return true;
};

/**
    * @private
    */
AnimationExtension.prototype._canAnimationInitialize = function () {
  return this.viewer.model && this.viewer.model.isLoadDone() && this.viewer.model.isObjectTreeCreated();
};

/**
    * @private
    */
AnimationExtension.prototype._onGeomAndObjTreeReady = function () {
  if (!this._initAnim && this._canAnimationInitialize()) {
    this._initAnimations({ model: this.viewer.model });
    this._initAnim = true;
  }
};

/**
    * @param event
    * @private
    */
AnimationExtension.prototype._initAnimations = function (event) {

  // Animations are available as soon as the model instance is created.
  var model = event.model;
  var animations = model.getData().animations;
  if (!animations) {
    return;
  }

  // init animations after geometry loaded
  var impl = this.viewer.impl;
  impl.keyFrameAnimator = new avp.KeyFrameAnimator(impl, animations.duration);
  for (var a in animations.animations) {
    impl.keyFrameAnimator.add(animations.animations[a]);
  }
  impl.keyFrameAnimator.goto(0);

  this.viewer.addEventListener(av.CAMERA_CHANGE_EVENT, this._onCameraChange);
  this.viewer.addEventListener(av.EXPLODE_CHANGE_EVENT, this._onExplode);
  this.viewer.addEventListener(av.ESCAPE_EVENT, this._onEscape);

  this._onAnimationReady();
  this.viewer.dispatchEvent({ type: av.ANIMATION_READY_EVENT });
};

/**
    * Removes toobar button and unhooks animation listeners.
    * 
    * @alias Autodesk.Viewing.Extensions.AnimationExtension#unload
    */
AnimationExtension.prototype.unload = function () {

  var viewer = this.viewer;
  viewer.removeEventListener(av.GEOMETRY_LOADED_EVENT, this._onGeomAndObjTreeReady);
  viewer.removeEventListener(av.OBJECT_TREE_CREATED_EVENT, this._onGeomAndObjTreeReady);
  viewer.removeEventListener(av.CAMERA_CHANGE_EVENT, this._onCameraChange);
  viewer.removeEventListener(av.EXPLODE_CHANGE_EVENT, this._onExplode);
  viewer.removeEventListener(av.VIEWER_RESIZE_EVENT, this._onResize);
  viewer.removeEventListener(av.ESCAPE_EVENT, this._onEscape);

  // stop animations
  this.rewind();
  viewer.impl.invalidate(true, true, true); // Required to reset animations when Extension unloads and viewer remains.

  if (this.animTools) {
    this.animTools.removeControl(this.animTools.timeText.getId());
    this.animTools.removeControl(this.animTools.timeline.getId());
    this.animTools.removeControl(this.animTools.timeLeftText.getId());
    this.animTools.removeControl(this.animTools.forwardButton.getId());
    this.animTools.removeControl(this.animTools.backwardButton.getId());
    this.animTools.removeControl(this.animTools.closeButton.getId());
  }

  if (this.toolbar) {
    this.toolbar.removeControl(this.animTools);
    this.toolbar.container.parentNode.removeChild(this.toolbar.container);
    this.toolbar = null;
  }

  if (this.playButton) {
    var viewerToolbar = viewer.getToolbar();
    if (viewerToolbar) {
      viewerToolbar.getControl(TOOLBAR.MODELTOOLSID).removeControl(this.playButton.getId());
    }
  }

  if (this._configButtonId !== null) {
    var settingsPanel = this.viewer.getSettingsPanel();
    settingsPanel && settingsPanel.removeConfigButton(this._configButtonId);
    this._configButtonId = null;
  }

  if (this._panel) {
    this._panel.uninitialize();
    this._panel = null;
  }

  this._toolbarReady = false;
  this._animationReady = false;

  return true;
};

/**
    * Plays the animation. Invoke pause() to stop the animation.
    * 
    * @alias Autodesk.Viewing.Extensions.AnimationExtension#play
    */
AnimationExtension.prototype.play = function () {

  if (this.isPlaying()) {
    return;
  }

  this.resetExplode(0, true);

  var viewer = this.viewer;
  var animator = viewer.impl.keyFrameAnimator;
  if (!animator) return;

  // restore previous animation if set
  if (this.prevAnimationTime > 0) {
    animator.goto(this.prevAnimationTime);
    this.prevAnimationTime = -1;
  }

  animator.play(0, this._onPlayCallback);

  this.updatePlayButton(animator.isPaused);

  if (this.animTools) {
    this.animTools.setVisible(true);
    if (!this.animTools.isPositionAdjusted) {
      this.adjustToolbarPosition();
      this.animTools.isPositionAdjusted = true;
    }
  }
};

/**
    * Pauses an active animation. Can resume by invoking play()
    * 
    * @alias Autodesk.Viewing.Extensions.AnimationExtension#pause
    */
AnimationExtension.prototype.pause = function () {

  if (this.isPaused()) {
    return;
  }

  var animator = this.viewer.impl.keyFrameAnimator;
  if (!animator) return;
  animator.pause();

  // UI stuff
  this.updatePlayButton(animator.isPaused);
};

/**
    * Whether the animation is currently playing.
    * Always returns the opposite of isPaused()
    *
    * @returns {boolean}
    * 
    * @alias Autodesk.Viewing.Extensions.AnimationExtension#isPlaying
    */
AnimationExtension.prototype.isPlaying = function () {

  var animator = this.viewer.impl.keyFrameAnimator;
  if (!animator) return false;
  return animator.isPlaying && !animator.isPaused;
};

/**
    * Wether the animation is currently paused.
    * Always returns the opposite of isPlaying()
    *
    * @returns {boolean}
    * 
    * @alias Autodesk.Viewing.Extensions.AnimationExtension#isPaused
    */
AnimationExtension.prototype.isPaused = function () {

  var animator = this.viewer.impl.keyFrameAnimator;
  if (!animator) return false;
  return animator.isPaused;
};

/**
    * Rewinds and pauses the animation.
    * 
    * @alias Autodesk.Viewing.Extensions.AnimationExtension#rewind
    */
AnimationExtension.prototype.rewind = function () {
  this.setTimelineValue(0);
};

/**
    * Sets the animation at the very beginning (0), at the end(1) or anywhere in between.
    * For example, use value 0.5 to set the animation half way through it's completion.
    * Will pause a playing animation.
    *
    * @param {number} scale - value between 0 and 1
    * 
    * @alias Autodesk.Viewing.Extensions.AnimationExtension#setTimelineValue
    */
AnimationExtension.prototype.setTimelineValue = function (scale) {
  var animator = this.viewer.impl.keyFrameAnimator;
  if (!animator) return;
  scale = Math.min(Math.max(0, scale), 1);
  var time = scale * animator.duration;
  animator.goto(time);
  this.updateUI();
};

/**
    * Sets animation onto the previous keyframe.
    * Will pause the animation if playing.
    * 
    * @alias Autodesk.Viewing.Extensions.AnimationExtension#prevKeyframe
    */
AnimationExtension.prototype.prevKeyframe = function () {
  var animator = this.viewer.impl.keyFrameAnimator;
  if (!animator) return;
  animator.prev();
  this.updateUI();
};

/**
    * Sets animation onto the next keyframe.
    * Will pause the animation if playing.
    * 
    * @alias Autodesk.Viewing.Extensions.AnimationExtension#nextKeyframe
    */
AnimationExtension.prototype.nextKeyframe = function () {
  var animator = this.viewer.impl.keyFrameAnimator;
  if (!animator) return;
  animator.next();
  this.updateUI();
};

/**
    * Returns how many seconds does the animation take to complete.
    *
    * @returns {number}
    * 
    * @alias Autodesk.Viewing.Extensions.AnimationExtension#getDuration
    */
AnimationExtension.prototype.getDuration = function () {
  var animator = this.viewer.impl.keyFrameAnimator;
  if (!animator) return 0;
  return animator.duration;
};

/**
    * Returns duration as a formatted String h:mm:ss (hours:minutes:seconds)
    *
    * @returns {string}
    * 
    * @alias Autodesk.Viewing.Extensions.AnimationExtension#getDurationLabel
    */
AnimationExtension.prototype.getDurationLabel = function () {
  return convertSecsToHMS(this.getDuration());
};

/**
    * Returns the elapsed time (in seconds) of the animation.
    *
    * @returns {number}
    * 
    * @alias Autodesk.Viewing.Extensions.AnimationExtension#getCurrentTime
    */
AnimationExtension.prototype.getCurrentTime = function () {
  var animator = this.viewer.impl.keyFrameAnimator;
  if (!animator) return 0;
  return animator.currentTime;
};

/**
    * Returns the current animation time as a formatted String h:mm:ss (hours:minutes:seconds)
    *
    * @returns {string}
    * 
    * @alias Autodesk.Viewing.Extensions.AnimationExtension#getCurrentTimeLabel
    */
AnimationExtension.prototype.getCurrentTimeLabel = function () {
  return convertSecsToHMS(this.getCurrentTime());
};

/**
    * Whether a playing animation updates the camera position.
    * 
    * @param {boolean} followCam - true to allow animation to update camera position (default behavior).
    * 
    * @returns {boolean} true if the operation was successful.
    *
    * @alias Autodesk.Viewing.Extensions.AnimationExtension#setFollowCamera
    */
AnimationExtension.prototype.setFollowCamera = function (followCam) {
  var animator = this.viewer.impl.keyFrameAnimator;
  if (!animator)
  return false;

  animator.setFollowCamera(followCam || false);
  return true;
};

/**
    * @returns {boolean} Whether animations will update the camera's position (true) or not (false)
    *
    * @alias Autodesk.Viewing.Extensions.AnimationExtension#isFollowingCamera
    */
AnimationExtension.prototype.isFollowingCamera = function () {
  var animator = this.viewer.impl.keyFrameAnimator;
  if (!animator)
  return true; // default behavior is following the camera

  return animator.isFollowingCamera();
};

/**
    * Changes the speed at which the animation is played. Use value 1 to run the 
    * animation at default speed, use value 2 to run it at double the speed, 
    * use value 0.5 to run it at half the speed.
    * 
    * @param {number} value - A multiplier for the animation's elapsed time.
    *
    * @alias Autodesk.Viewing.Extensions.AnimationExtension#setSpeedModifier
    */
AnimationExtension.prototype.setSpeedModifier = function (value) {
  var animator = this.viewer.impl.keyFrameAnimator;
  if (!animator)
  return false;

  animator.setSpeedModifier(value);
  return true;
};

/**
    * @returns {number} The playback speed multiplier.
    *
    * @alias Autodesk.Viewing.Extensions.AnimationExtension#getSpeedModifier
    */
AnimationExtension.prototype.getSpeedModifier = function () {
  var animator = this.viewer.impl.keyFrameAnimator;
  if (!animator)
  return 1;

  return animator.getSpeedModifier();
};

/**
    * Sets whether the animation rewinds and plays as soon as the animation
    * finishes playing.
    * 
    * @param {boolean} loop - true to have the animation loop continuously.
    *
    * @alias Autodesk.Viewing.Extensions.AnimationExtension#setLooping
    */
AnimationExtension.prototype.setLooping = function (loop) {
  var animator = this.viewer.impl.keyFrameAnimator;
  if (!animator)
  return false;

  animator.setLooping(loop);
  return true;
};

/**
    * @returns {boolean} Whether the animation will loop continuously.
    *
    * @alias Autodesk.Viewing.Extensions.AnimationExtension#isLooping
    */
AnimationExtension.prototype.isLooping = function () {
  var animator = this.viewer.impl.keyFrameAnimator;
  if (!animator)
  return 1;

  return animator.isLooping();
};


/**
    * @private
    */
AnimationExtension.prototype._onAnimationReady = function () {

  // Check for animator class
  if (!this.viewer.impl.keyFrameAnimator) {
    return;
  }

  this._animationReady = true;
  this._initUI();
};

/**
    *
    * @private
    */
AnimationExtension.prototype.updateUI = function () {

  var animator = this.viewer.impl.keyFrameAnimator;
  if (!this.animTools || !animator) {
    return;
  }
  this.animTools.input.value = animator.duration > 0 ? animator.currentTime / animator.duration * 100 : 0;
  this.animTools.lapse.value = convertSecsToHMS(animator.currentTime);
  this.animTools.lapseLeft.value = convertSecsToHMS(animator.duration);
  this.updatePlayButton(animator.isPaused);
  this.updateToolbarBackground();
};

/**
    * @param value
    * @private
    */
AnimationExtension.prototype._onPlayCallback = function (value) {

  // TODO: We should be able to replace this whole method body with a call to update().
  // The only problem for now is taht we would also need to change KeyFrameAnimator because
  // the onPlayCallback() is being invoked BEFORE the animation is paused.
  if (!this.animTools) return;

  var animator = this.viewer.impl.keyFrameAnimator;
  this.viewer.dispatchEvent({ type: ANIMATION_TRACK_UPDATE_EVENT, data: { time: animator.currentTime, duration: animator.duration } });
  this.animTools.input.value = value;
  this.animTools.lapse.value = convertSecsToHMS(animator.currentTime);
  this.animTools.lapseLeft.value = convertSecsToHMS(animator.duration);

  if (value >= 100 && !animator.isLooping()) {
    this.updatePlayButton(true);
  }
  this.updateToolbarBackground();
};

/**
    *
    * @param isPaused
    * @private
    */
AnimationExtension.prototype.updatePlayButton = function (isPaused) {
  if (!this.playButton) {
    return;
  }

  if (isPaused === this.playButtonIsPaused) {
    return;
  }

  this.playButtonIsPaused = isPaused;
  var animator = this.viewer.impl.keyFrameAnimator;

  if (isPaused) {
    this.playButton.setIcon('toolbar-animation-play-icon');
    this.playButton.setToolTip('Play');
    this.viewer.dispatchEvent({ type: ANIMATION_PAUSE_EVENT, data: { time: animator.currentTime, duration: animator.duration } });

  } else {
    this.playButton.setIcon('toolbar-animation-pause-icon');
    this.playButton.setToolTip('Pause');
    this.viewer.dispatchEvent({ type: ANIMATION_PLAY_EVENT, data: { time: animator.currentTime, duration: animator.duration } });
  }
};

/**
    * Helper function that resets model explosion.
    *
    * @param value
    * @param setSlider
    * @private
    */
AnimationExtension.prototype.resetExplode = function (value, setSlider) {
  var viewer = this.viewer;
  if (!viewer.model.is2d() && viewer.getExplodeScale() !== 0) {
    if (setSlider && viewer.explodeSlider) {// explodeSlider is only in GuiViewer3D instances
      viewer.explodeSlider.value = value;
    }
    viewer.explode(value);
  }
};

/**
    * @private
    */
AnimationExtension.prototype.adjustToolbarPosition = function () {
  // set timeline width
  var viewer = this.viewer;
  if (!viewer.toolbar) return;
  var fullwidth = viewer.toolbar.getDimensions().width;
  var viewportWidth = viewer.container.getBoundingClientRect().width;
  if (fullwidth > viewportWidth)
  fullwidth = viewer.modelTools.getDimensions().width;
  var inputWidth = fullwidth - (2 *
  this.animTools.backwardButton.getDimensions().width + 3 *
  this.animTools.timeText.getDimensions().width + this.animTools.closeButton.getDimensions().width + 20);
  this.animTools.input.style.width = inputWidth + 'px';
};

/**
    * @private
    */
AnimationExtension.prototype.hideAnimateToolbar = function () {
  if (this.animTools) {
    this.animTools.setVisible(false);
  }
};

/**
    * @private
    */
AnimationExtension.prototype.updateToolbarBackground = function () {
  if (!this.animTools) return;
  var input = this.animTools.input;
  var percentage = input.value;
  var col1 = "#ffffff",col2 = "#393939";
  input.style.background = "-webkit-linear-gradient(left," + col1 + " " + percentage + "%, " + col2 + " " + percentage + "%)";
  input.style.background = "-moz-linear-gradient(left," + col1 + " " + percentage + "%, " + col2 + " " + percentage + "%)";
  input.style.background = "-ms-linear-gradient(left," + col1 + " " + percentage + "%, " + col2 + " " + percentage + "%)";
  input.style.background = "-o-linear-gradient(left," + col1 + " " + percentage + "%, " + col2 + " " + percentage + "%)";
  input.style.background = "linear-gradient(to right," + col1 + " " + percentage + "%, " + col2 + " " + percentage + "%)";
};

/**
    * @private
    */
AnimationExtension.prototype._onCameraChange = function () {

  if (this.viewer.impl.keyFrameAnimator && !this.viewer.impl.keyFrameAnimator.isFollowingCamera())
  return;

  if (this.viewer.toolController.cameraUpdated) {
    var animator = this.viewer.impl.keyFrameAnimator;
    if (!animator) return;
    if (animator.isPlaying && !animator.isPaused) {
      animator.pause();
      this.updatePlayButton(animator.isPaused);
    }
  }
};

/**
    * @private
    */
AnimationExtension.prototype._onResize = function () {
  if (!this.toolbar) return;
  if (this.viewer.container.clientWidth < (isTouchDevice() ? 560 : 600)) {
    this.toolbar.setCollapsed(true);
  } else {
    this.toolbar.setCollapsed(false);
    this.adjustToolbarPosition();
  }
};

/**
    * @private
    */
AnimationExtension.prototype._onEscape = function () {

  if (this.isPlaying()) {
    this.pause();
  } else {
    this.hideAnimateToolbar();
  }
};

/**
    * @private
    */
AnimationExtension.prototype._onExplode = function () {
  // reset animation
  var animator = this.viewer.impl.keyFrameAnimator;
  if (animator) {
    if (animator.currentTime !== 0) {
      this.prevAnimationTime = animator.currentTime;
      animator.goto(0);
    }
    this.updatePlayButton(true);
  }
  this.hideAnimateToolbar();
};

/**
    * Invoked by the viewer when the toolbar UI is available.
    *
    * @param {Autodesk.Viewing.UI.ToolBar} toolbar - toolbar instance.
    *
    * @alias Autodesk.Viewing.Extensions.AnimationExtension#onToolbarCreated
    */
AnimationExtension.prototype.onToolbarCreated = function () {

  this._toolbarReady = true;
  this._initUI();
};

/**
    * @private
    */
AnimationExtension.prototype._initUI = function () {

  if (!this._toolbarReady || !this._animationReady) {
    return;
  }

  var viewer = this.viewer;
  var that = this;
  var _document = this.getDocument();

  this.toolbar = new ToolBar('animation-toolbar');
  this.toolbar.setGlobalManager(this.globalManager);
  this.toolbar.addClass('toolbar-animation-subtoolbar');
  viewer.container.appendChild(this.toolbar.container);

  this.animTools = new ControlGroup(this.animToolsId);
  this.animTools.setGlobalManager(this.globalManager);
  this.animTools.setVisible(false);
  this.toolbar.addControl(this.animTools);

  // play button at first of modelTools
  this.playButton = new Button('toolbar-animationPlay');
  this.playButton.setGlobalManager(this.globalManager);
  this.playButton.setIcon('toolbar-animation-play-icon');
  this.playButton.setToolTip('Play');
  this.playButton.onClick = function () {
    if (that.isPaused()) {
      that.activate();
    } else {
      that.deactivate();
    }
  };
  viewer.modelTools.addControl(this.playButton);

  // override reset button's onClick method
  if (viewer.modelTools.resetModelButton) {
    viewer.modelTools.resetModelButton.onClick = function () {
      viewer.showAll();
      var animator = viewer.impl.keyFrameAnimator;
      if (animator) {
        animator.goto(0);
        input.value = 0;
        lapse.value = convertSecsToHMS(0);
        lapseLeft.value = convertSecsToHMS(animator.duration);
        that.updatePlayButton(true);
      }
      that.resetExplode(0, true);
      that.updateToolbarBackground();
    };
  }

  // backward button
  this.animTools.backwardButton = new Button('toolbar-animationBackward');
  this.animTools.backwardButton.setGlobalManager(this.globalManager);
  this.animTools.backwardButton.setToolTip('Previous keyframe');
  this.animTools.backwardButton.onClick = function () {
    var animator = viewer.impl.keyFrameAnimator;
    if (animator !== undefined && animator) {
      animator.prev();
      viewer.dispatchEvent({ type: ANIMATION_PREVIOUS_FRAME_EVENT, data: { time: animator.currentTime, duration: animator.duration } });
      that.updateUI();
    }
  };
  this.animTools.backwardButton.addClass('toolbar-animation-button');
  this.animTools.backwardButton.setIcon('toolbar-animation-backward-icon');
  this.animTools.addControl(this.animTools.backwardButton);

  // forward button
  this.animTools.forwardButton = new Button('toolbar-animationForward');
  this.animTools.forwardButton.setGlobalManager(this.globalManager);
  this.animTools.forwardButton.setToolTip('Next keyframe');
  this.animTools.forwardButton.onClick = function () {
    var animator = viewer.impl.keyFrameAnimator;
    if (animator !== undefined && animator) {
      animator.next();
      viewer.dispatchEvent({ type: ANIMATION_NEXT_FRAME_EVENT, data: { time: animator.currentTime, duration: animator.duration } });
      that.updateUI();
    }
  };
  this.animTools.forwardButton.addClass('toolbar-animation-button');
  this.animTools.forwardButton.setIcon('toolbar-animation-forward-icon');
  this.animTools.addControl(this.animTools.forwardButton);

  // current time lapse
  this.animTools.timeText = new Control('toolbar-animation-time-lapse');
  this.animTools.timeText.setGlobalManager(this.globalManager);
  var lapse = this.animTools.lapse = _document.createElement("input");
  lapse.type = "text";
  lapse.value = "0";
  lapse.className = "animation-time-lapse";
  lapse.disabled = true;
  this.animTools.timeText.container.appendChild(lapse);
  this.animTools.timeText.addClass('toolbar-animation-button');
  this.animTools.addControl(this.animTools.timeText);

  // timeline
  this.animTools.timeline = new Control('toolbar-animation-timeline');
  this.animTools.timeline.setGlobalManager(this.globalManager);
  var input = this.animTools.input = _document.createElement("input");
  input.type = "range";
  input.value = "0";
  input.className = "animation-timeline";
  if (isIE11) {
    // In IE11, the input type=range has a weird default layout...
    input.style['padding-top'] = '0';
    input.style['padding-bottom'] = '0';
    input.style['margin-top'] = '10px';
  }
  this.animTools.timeline.container.appendChild(input);
  // oninput doesn't work on IE11, use onchange instead
  input.addEventListener(isIE11 ? "change" : "input", function () {
    var animator = viewer.impl.keyFrameAnimator;
    if (animator !== undefined && animator) {
      var time = input.value * animator.duration / 100;
      lapse.value = convertSecsToHMS(time);
      lapseLeft.value = convertSecsToHMS(animator.duration);
      animator.goto(time);
      viewer.dispatchEvent({ type: ANIMATION_SEEK_EVENT, data: { time: time, duration: animator.duration } });
      that.updatePlayButton(animator.isPaused);
      that.updateToolbarBackground();
    }
  });
  // tooltip for slider
  var tooltipSiderLabel = "Click-drag to scrub";
  var inputTooltip = _document.createElement("div");
  inputTooltip.className = "adsk-control-tooltip";
  inputTooltip.textContent = av.i18n.translate(tooltipSiderLabel);
  inputTooltip.setAttribute('data-i18n', tooltipSiderLabel);
  this.animTools.timeline.container.appendChild(inputTooltip);
  input.addEventListener("mouseover", function (event) {
    if (event.target === input)
    inputTooltip.style.visibility = "visible";
  });
  input.addEventListener("mouseout", function (event) {
    if (event.target === input)
    inputTooltip.style.visibility = "hidden";
  });

  this.animTools.timeline.addClass('toolbar-animation-button');
  this.animTools.timeline.addClass('toolbar-animation-timeline');
  this.animTools.addControl(this.animTools.timeline);

  // remaining time lapse
  this.animTools.timeLeftText = new Control('toolbar-animationRemainingTime');
  this.animTools.timeLeftText.setGlobalManager(this.globalManager);
  var lapseLeft = this.animTools.lapseLeft = _document.createElement("input");
  lapseLeft.type = "text";
  lapseLeft.value = "0";
  lapseLeft.className = "animation-time-lapse";
  lapseLeft.disabled = true;
  this.animTools.timeLeftText.container.appendChild(lapseLeft);
  this.animTools.timeLeftText.addClass('toolbar-animation-button');
  this.animTools.addControl(this.animTools.timeLeftText);

  // close button
  this.animTools.closeButton = new Button('toolbar-animation-Close');
  this.animTools.closeButton.setGlobalManager(this.globalManager);
  this.animTools.closeButton.addClass('docking-panel-close');
  this.animTools.closeButton.addClass('toolbar-animation-button');
  this.animTools.closeButton.addClass('toolbar-animation-close-button');
  this.animTools.closeButton.onClick = function () {
    that.hideAnimateToolbar();
    viewer.dispatchEvent({ type: ANIMATION_TOOLBAR_CLOSE_EVENT });
  };

  this.animTools.addControl(this.animTools.closeButton);


  // settings panel
  var settingsPanel = this.viewer.getSettingsPanel();
  if (settingsPanel) {
    this._configButtonId = settingsPanel.addConfigButton(SETTINGS_BUTTON_LABEL, this.openPanel);
  }

  viewer.addEventListener(av.VIEWER_RESIZE_EVENT, this._onResize);
};


/**
    * Opens a panel with options to configure the animation extension.
    * 
    * @alias Autodesk.Viewing.Extensions.AnimationExtension#openPanel
    */
AnimationExtension.prototype.openPanel = function () {
  if (!this._panel) {
    this._panel = new _AnimationPanel__WEBPACK_IMPORTED_MODULE_1__.AnimationPanel(this.viewer, this, SETTINGS_BUTTON_LABEL);
  }
  this._panel.setVisible(true);
};

/**
    * Plays the animation.
    * 
    * @alias Autodesk.Viewing.Extensions.AnimationExtension#activate
    */
AnimationExtension.prototype.activate = function () {
  this.play();
  return true;
};

/**
    * Pauses the animation.
    * 
    * @alias Autodesk.Viewing.Extensions.AnimationExtension#deactivate
    */
AnimationExtension.prototype.deactivate = function () {
  this.pause();
  return true;
};

/**
    * @returns {boolean} true when the animation is playing.
    * 
    * @alias Autodesk.Viewing.Extensions.AnimationExtension#isActive
    */
AnimationExtension.prototype.isActive = function () {
  return this.isPlaying();
};



Autodesk.Viewing.theExtensionManager.registerExtension('Autodesk.Fusion360.Animation', AnimationExtension);
})();

Autodesk.Extensions.Fusion360 = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=Fusion360.js.map