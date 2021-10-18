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

/***/ "./extensions/OMV/ConfettiController.js":
/*!**********************************************!*\
  !*** ./extensions/OMV/ConfettiController.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ConfettiController": () => (/* binding */ ConfettiController)
/* harmony export */ });


var surfaceInspectionProperty = 'Surface Inspection Point';
var measuredPointLabel = 'projected';

/**
                                       * Controller for the confetti
                                       * 
                                       * @memberof Autodesk.Viewing.Extensions.OMV
                                       * @alias Autodesk.Viewing.Extensions.OMV.ConfettiController
                                       * @constructor
                                      */
var ConfettiController = function ConfettiController(viewer) {

  var _controller = this;
  this.viewer = viewer;
  this.diameter = null;

  /**
                         * Resize the confetti to the given diameter.
                         * @param {number} newDiameter The diameter to resize the confetti to.
                        */
  this.resizeConfetti = function (newDiameter) {
    if (newDiameter === this.diameter) {
      return;
    }
    var viewer = this.viewer;
    var instanceTree = viewer.model.getData().instanceTree;
    this.diameter = newDiameter;

    this.findMeasuredPoints(function (dbIdArray) {
      for (var i = 0; i < dbIdArray.length; i++) {
        instanceTree.enumNodeFragments(dbIdArray[i], function (fragId) {
          setFragmentDiameter(fragId, newDiameter);
          // If we just resized the last confetti, update the view
          if (i === dbIdArray.length - 1) {
            // Update the scene
            viewer.impl.sceneUpdated(true);
          }
        }, false);
      }
    });
  };

  /**
      * Get the current diameter from the geometry of the confetti
      * @param {function} gotDiameter The callback with the diameter as the argument.
      * 
     */
  this.getDiameterFromGeom = function (gotDiameter) {
    var viewer = this.viewer;
    var instanceTree = viewer.model.getData().instanceTree;

    this.findMeasuredPoints(function (dbIdArray) {
      instanceTree.enumNodeFragments(dbIdArray[0], function (fragId) {
        var diameter = getDiameterFromFrag(fragId);
        gotDiameter(diameter);
      }, false);
    });
  };

  /**
      * Find the measured points.
      * @param {function} onGetMeasuredPoints The callback with the measured points as an array argument.
     */
  this.findMeasuredPoints = function (onGetMeasuredPoints) {
    var viewer = this.viewer;
    this.findInspectionPoints(function (dbIdArray) {
      var options = { propFilter: [surfaceInspectionProperty], ignoreHidden: false };
      viewer.model.getBulkProperties(dbIdArray, options, function (results) {
        var measuredPoints = results.filter(function (result) {
          var propValue = getPropertyValue(result.properties, surfaceInspectionProperty);
          return propValue === measuredPointLabel;
        });
        onGetMeasuredPoints(measuredPoints);
      });
    });
  };

  /**
      * Find inspection points
      * @param {function} onGetInspectionPoints The callback with the IDs of the inspection points.
     */
  this.findInspectionPoints = function (onGetInspectionPoints) {
    this.viewer.model.findProperty(surfaceInspectionProperty).then(function (dbIdArray) {
      onGetInspectionPoints(dbIdArray);
    });
  };

  /**
      * Get the diameter from the given fragment
      * @param fragId The fragment ID of the confetti to get the diameter of.
      * @returns {number} The diameter of the confetti
      * @private
     */
  function getDiameterFromFrag(fragId) {
    var viewer = _controller.viewer;

    // Get the diameter of the geometry
    var geometry = viewer.model.getFragmentList().getGeometry(fragId);
    var vb = geometry.vb;
    var center = getConfettiCenter(fragId);
    var on_circle = new THREE.Vector3(vb[3], vb[4], vb[5]);
    var diameter = 2 * center.distanceTo(on_circle);
    return parseFloat(diameter.toFixed(1));
  }

  /**
     * Get the center of the confetti
     * @param fragId The fragment ID of the confetti to get the center of.
     * @returns {THREE.Vector3} The center point of the confetti
     * @private
    */
  function getConfettiCenter(fragId) {
    var geometry = _controller.viewer.model.getFragmentList().getGeometry(fragId);
    var vb = geometry.vb;
    return new THREE.Vector3(vb[0], vb[1], vb[2]);
  }

  /**
     * Set the diameter of the given fragment confetti. 
     * This applies a transformation to scale the geometry, so we can achieve
     * the diameter we want.
     * @param fragId The fragment ID of the confetti to resize to the new diameter.
     * @param diameter THe diameter to resize the confetti to.
     * @private
    */
  function setFragmentDiameter(fragId, diameter) {
    var viewer = _controller.viewer;
    var fragProxy = viewer.impl.getFragmentProxy(
    viewer.model,
    fragId);

    fragProxy.getAnimTransform();

    // Get the diameter of the geometry
    var geom_diameter = getDiameterFromFrag(fragId);
    // Calculate the scale we need to have in order to simulate the new diameter
    var scale = diameter / geom_diameter;

    // get inverse of world matrix
    var worldInv = new THREE.Matrix4();
    fragProxy.getOriginalWorldMatrix(worldInv);
    worldInv.invert();
    var confetti_center = getConfettiCenter(fragId);

    // Set the scale we need in order to achieve the diameter we want
    fragProxy.scale = new THREE.Vector3(scale, scale, scale);

    // Move the position of the fragment, so it will stay in the same place after the scaling
    fragProxy.position.x = worldInv.elements[12] * (scale - 1) - confetti_center.x * (scale - 1);
    fragProxy.position.y = worldInv.elements[13] * (scale - 1) - confetti_center.y * (scale - 1);
    fragProxy.position.z = worldInv.elements[14] * (scale - 1) - confetti_center.z * (scale - 1);

    fragProxy.updateAnimTransform();
  }

  /**
     * Get the value of the property that matches the given name
     * @param properties The array of properties to search in.
     * * @param propertyName The name of the property we want to find the value of.
     * @returns The value of the requested property. If it doesn't exist, return null.
     * @private
    */
  function getPropertyValue(properties, propertyName) {
    for (var i = 0; i < properties.length; ++i) {
      var property = properties[i];
      if (property.displayName === propertyName) {
        return property.displayValue;
      }
    }
    return null;
  }
};

/***/ }),

/***/ "./extensions/OMV/OMVLocales.js":
/*!**************************************!*\
  !*** ./extensions/OMV/OMVLocales.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "locales": () => (/* binding */ locales)
/* harmony export */ });
/* harmony import */ var _res_locales_en_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../res/locales/en/nobundle-omv.loc.json */ "./res/locales/en/nobundle-omv.loc.json");
/* harmony import */ var _res_locales_en_GB_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../res/locales/en-GB/nobundle-omv.loc.json */ "./res/locales/en-GB/nobundle-omv.loc.json");
/* harmony import */ var _res_locales_cs_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../res/locales/cs/nobundle-omv.loc.json */ "./res/locales/cs/nobundle-omv.loc.json");
/* harmony import */ var _res_locales_de_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../res/locales/de/nobundle-omv.loc.json */ "./res/locales/de/nobundle-omv.loc.json");
/* harmony import */ var _res_locales_es_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../res/locales/es/nobundle-omv.loc.json */ "./res/locales/es/nobundle-omv.loc.json");
/* harmony import */ var _res_locales_fr_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../res/locales/fr/nobundle-omv.loc.json */ "./res/locales/fr/nobundle-omv.loc.json");
/* harmony import */ var _res_locales_fr_CA_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../res/locales/fr-CA/nobundle-omv.loc.json */ "./res/locales/fr-CA/nobundle-omv.loc.json");
/* harmony import */ var _res_locales_it_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../res/locales/it/nobundle-omv.loc.json */ "./res/locales/it/nobundle-omv.loc.json");
/* harmony import */ var _res_locales_ja_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../res/locales/ja/nobundle-omv.loc.json */ "./res/locales/ja/nobundle-omv.loc.json");
/* harmony import */ var _res_locales_ko_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../res/locales/ko/nobundle-omv.loc.json */ "./res/locales/ko/nobundle-omv.loc.json");
/* harmony import */ var _res_locales_pl_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../res/locales/pl/nobundle-omv.loc.json */ "./res/locales/pl/nobundle-omv.loc.json");
/* harmony import */ var _res_locales_pt_BR_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../res/locales/pt-BR/nobundle-omv.loc.json */ "./res/locales/pt-BR/nobundle-omv.loc.json");
/* harmony import */ var _res_locales_ru_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../res/locales/ru/nobundle-omv.loc.json */ "./res/locales/ru/nobundle-omv.loc.json");
/* harmony import */ var _res_locales_tr_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../res/locales/tr/nobundle-omv.loc.json */ "./res/locales/tr/nobundle-omv.loc.json");
/* harmony import */ var _res_locales_zh_HANS_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../res/locales/zh-HANS/nobundle-omv.loc.json */ "./res/locales/zh-HANS/nobundle-omv.loc.json");
/* harmony import */ var _res_locales_zh_HANT_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../res/locales/zh-HANT/nobundle-omv.loc.json */ "./res/locales/zh-HANT/nobundle-omv.loc.json");
/* harmony import */ var _res_locales_zh_HK_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../res/locales/zh-HK/nobundle-omv.loc.json */ "./res/locales/zh-HK/nobundle-omv.loc.json");
/* harmony import */ var _res_locales_nl_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../res/locales/nl/nobundle-omv.loc.json */ "./res/locales/nl/nobundle-omv.loc.json");
/* harmony import */ var _res_locales_sv_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../res/locales/sv/nobundle-omv.loc.json */ "./res/locales/sv/nobundle-omv.loc.json");
/* harmony import */ var _res_locales_da_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../res/locales/da/nobundle-omv.loc.json */ "./res/locales/da/nobundle-omv.loc.json");
/* harmony import */ var _res_locales_no_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../res/locales/no/nobundle-omv.loc.json */ "./res/locales/no/nobundle-omv.loc.json");
/**
 * Include each locale json file and return it in an object
 * that can be consumed by i18n
 */























var locales = {
  en: _res_locales_en_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_0__,
  "en-GB": _res_locales_en_GB_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_1__,
  cs: _res_locales_cs_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_2__,
  de: _res_locales_de_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_3__,
  es: _res_locales_es_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_4__,
  fr: _res_locales_fr_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_5__,
  "fr-CA": _res_locales_fr_CA_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_6__,
  it: _res_locales_it_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_7__,
  ja: _res_locales_ja_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_8__,
  ko: _res_locales_ko_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_9__,
  pl: _res_locales_pl_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_10__,
  "pt-BR": _res_locales_pt_BR_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_11__,
  ru: _res_locales_ru_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_12__,
  tr: _res_locales_tr_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_13__,
  "zh-HANS": _res_locales_zh_HANS_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_14__,
  "zh-HANT": _res_locales_zh_HANT_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_15__,
  "zh-HK": _res_locales_zh_HK_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_16__,
  nl: _res_locales_nl_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_17__,
  sv: _res_locales_sv_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_18__,
  da: _res_locales_da_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_19__,
  no: _res_locales_no_nobundle_omv_loc_json__WEBPACK_IMPORTED_MODULE_20__ };

/***/ }),

/***/ "./extensions/OMV/OMVPanel.js":
/*!************************************!*\
  !*** ./extensions/OMV/OMVPanel.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "OMVPanel": () => (/* binding */ OMVPanel)
/* harmony export */ });

function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}


var TAB_ID = 'configTab';
var TAB_LABEL = 'Probing';
var INSPECTION_POINTS_LABEL = 'Inspection Points';
var SLIDER_LABEL = 'Confetti diameter';

var SLIDER_MIN_VALUE = 0.5;
var SLIDER_MAX_VALUE = 40;
var SLIDER_INIT_VALUE = 1;
var SLIDER_STEP_VALUE = 0.1;

/**
                              * Panel with UI to configure the On-Machine Verification (OMV) extension.
                              * 
                              * @memberof Autodesk.Viewing.Extensions.OMV
                              * @alias Autodesk.Viewing.Extensions.OMV.OMVPanel
                              * @extends {Autodesk.Viewing.UI.SettingsPanel}
                              * @constructor
                             */
var OMVPanel = function OMVPanel(viewer, confettiController, title) {

  var PANEL_ID = 'adsk_omv_panel_' + viewer.id;
  var opts = { heightAdjustment: 90 };
  Autodesk.Viewing.UI.SettingsPanel.call(this, viewer.container, PANEL_ID, title, opts);
  this.setGlobalManager(viewer.globalManager);
  this.container.classList.add('viewer-settings-panel');

  this.viewer = viewer;
  this.confettiController = confettiController;
  this._onSetConfettiDiameter = this._onSetConfettiDiameter.bind(this);

  // Add a default tab called Configuration
  this.addTab(TAB_ID, TAB_LABEL, { className: 'config' });
  this.selectTab(TAB_ID);

  // Add the Inspection Points settings
  this.inspectionSettingsLabel = this.addLabel(TAB_ID, INSPECTION_POINTS_LABEL);
  // Add a slider for confetti diameter
  this.sliderId = this.addSlider(TAB_ID, SLIDER_LABEL,
  SLIDER_MIN_VALUE, SLIDER_MAX_VALUE, SLIDER_INIT_VALUE,
  this._onSetConfettiDiameter);

  this.confettiSizeSlider = this.getControl(this.sliderId);
  this.confettiSizeSlider.sliderElement.step = this.confettiSizeSlider.stepperElement.step = SLIDER_STEP_VALUE;

  this.createFooter();
};


OMVPanel.prototype = Object.create(Autodesk.Viewing.UI.SettingsPanel.prototype);
OMVPanel.prototype.constructor = OMVPanel;

/**
                                            * Syncronize UI controls with confetti controller data.
                                            */
OMVPanel.prototype.syncUI = function () {
  this.confettiSizeSlider.setValue(this.confettiController.diameter);
};

/**
    * When the diameter has been changed
    * @param event The event that caused the confetti size to change. Either an object or a number.
    * @private
    */
OMVPanel.prototype._onSetConfettiDiameter = function (event) {
  var new_diameter = null;
  // We can have two types of input
  // 1. An event from the slider control
  // 2. The actual value that the preference was changed to
  var typeOfEvent = _typeof(event);
  if (typeOfEvent === 'object' && event.detail && event.detail.value) {
    new_diameter = parseFloat(event.detail.value);
  } else if (typeOfEvent === 'number') {
    new_diameter = event;
  }
  if (!new_diameter) {
    return;
  }

  this.confettiController.resizeConfetti(new_diameter);
  // No need to syncUI() when event comes from UI...
};

/***/ }),

/***/ "./res/locales/cs/nobundle-omv.loc.json":
/*!**********************************************!*\
  !*** ./res/locales/cs/nobundle-omv.loc.json ***!
  \**********************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"cs","@@context":"Rozšíření ověření na stroji","On-Machine Verification":"Ověření na stroji","Probing":"Sondování","Inspection Points":"Kontrolní body","Confetti diameter":"Průměr konfety"}');

/***/ }),

/***/ "./res/locales/da/nobundle-omv.loc.json":
/*!**********************************************!*\
  !*** ./res/locales/da/nobundle-omv.loc.json ***!
  \**********************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"da","@@context":"Udvidelse af verificering på maskine","On-Machine Verification":"Verificering på maskine","Probing":"Tester","Inspection Points":"Inspektionpunkter","Confetti diameter":"Confetti-diameter"}');

/***/ }),

/***/ "./res/locales/de/nobundle-omv.loc.json":
/*!**********************************************!*\
  !*** ./res/locales/de/nobundle-omv.loc.json ***!
  \**********************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"de","@@context":"Prüfungen an der Maschine selbst Extension","On-Machine Verification":"Prüfungen an der Maschine","Probing":"Antasten","Inspection Points":"Inspektionspunkte","Confetti diameter":"Durchmesser Konfetti"}');

/***/ }),

/***/ "./res/locales/en-GB/nobundle-omv.loc.json":
/*!*************************************************!*\
  !*** ./res/locales/en-GB/nobundle-omv.loc.json ***!
  \*************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"en","@@context":"On-Machine Verification extension","On-Machine Verification":"On-Machine Verification","Probing":"Probing","Inspection Points":"Inspection Points","Confetti diameter":"Confetti diameter"}');

/***/ }),

/***/ "./res/locales/en/nobundle-omv.loc.json":
/*!**********************************************!*\
  !*** ./res/locales/en/nobundle-omv.loc.json ***!
  \**********************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"en","@@context":"On-Machine Verification extension","On-Machine Verification":"On-Machine Verification","Probing":"Probing","Inspection Points":"Inspection Points","Confetti diameter":"Confetti diameter"}');

/***/ }),

/***/ "./res/locales/es/nobundle-omv.loc.json":
/*!**********************************************!*\
  !*** ./res/locales/es/nobundle-omv.loc.json ***!
  \**********************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"es","@@context":"Ampliación de la verificación en la máquina","On-Machine Verification":"Verificación en la máquina","Probing":"Sondeo","Inspection Points":"Puntos de inspección","Confetti diameter":"Diámetro de confeti"}');

/***/ }),

/***/ "./res/locales/fr-CA/nobundle-omv.loc.json":
/*!*************************************************!*\
  !*** ./res/locales/fr-CA/nobundle-omv.loc.json ***!
  \*************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"fr-CA","@@context":"Extension de vérification sur la machine","On-Machine Verification":"Vérification sur la machine","Probing":"Palpage","Inspection Points":"Points d\'inspection","Confetti diameter":"Diamètre des confettis"}');

/***/ }),

/***/ "./res/locales/fr/nobundle-omv.loc.json":
/*!**********************************************!*\
  !*** ./res/locales/fr/nobundle-omv.loc.json ***!
  \**********************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"fr","@@context":"Extension de vérification sur la machine","On-Machine Verification":"Vérification sur la machine","Probing":"Palpage","Inspection Points":"Points d\'inspection","Confetti diameter":"Diamètre des confettis"}');

/***/ }),

/***/ "./res/locales/it/nobundle-omv.loc.json":
/*!**********************************************!*\
  !*** ./res/locales/it/nobundle-omv.loc.json ***!
  \**********************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"it","@@context":"Estensione verifica sulla macchina","On-Machine Verification":"Verifica sulla macchina","Probing":"Sonda","Inspection Points":"Punti di ispezione","Confetti diameter":"Diametro ravvicinati"}');

/***/ }),

/***/ "./res/locales/ja/nobundle-omv.loc.json":
/*!**********************************************!*\
  !*** ./res/locales/ja/nobundle-omv.loc.json ***!
  \**********************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"ja","@@context":"機上検証エクステンション","On-Machine Verification":"機上検証","Probing":"検出中","Inspection Points":"検査点","Confetti diameter":"紙吹雪の直径"}');

/***/ }),

/***/ "./res/locales/ko/nobundle-omv.loc.json":
/*!**********************************************!*\
  !*** ./res/locales/ko/nobundle-omv.loc.json ***!
  \**********************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"ko","@@context":"켜기-기계 검증 확장","On-Machine Verification":"켜기-기계 검증","Probing":"프로브","Inspection Points":"검사 점","Confetti diameter":"색종이 지름"}');

/***/ }),

/***/ "./res/locales/nl/nobundle-omv.loc.json":
/*!**********************************************!*\
  !*** ./res/locales/nl/nobundle-omv.loc.json ***!
  \**********************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"nl","@@context":"Extensie voor verificatie op machine","On-Machine Verification":"Verificatie op machine","Probing":"Zoeken","Inspection Points":"Inspectiepunten","Confetti diameter":"Confettidiameter"}');

/***/ }),

/***/ "./res/locales/no/nobundle-omv.loc.json":
/*!**********************************************!*\
  !*** ./res/locales/no/nobundle-omv.loc.json ***!
  \**********************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"no","@@context":"Utvidelse av maskinbasert bekreftelse","On-Machine Verification":"Maskinbasert bekreftelse","Probing":"Undersøkelse","Inspection Points":"Inspeksjonspunkter","Confetti diameter":"Konfettidiameter"}');

/***/ }),

/***/ "./res/locales/pl/nobundle-omv.loc.json":
/*!**********************************************!*\
  !*** ./res/locales/pl/nobundle-omv.loc.json ***!
  \**********************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"pl","@@context":"Rozszerzenie On-Machine Verification","On-Machine Verification":"On-Machine Verification","Probing":"Sondowanie","Inspection Points":"Punkty kontrolne","Confetti diameter":"Średnica confetti"}');

/***/ }),

/***/ "./res/locales/pt-BR/nobundle-omv.loc.json":
/*!*************************************************!*\
  !*** ./res/locales/pt-BR/nobundle-omv.loc.json ***!
  \*************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"pt","@@context":"Extensão Verificação na máquina","On-Machine Verification":"Verificação na máquina","Probing":"Sondagem","Inspection Points":"Pontos de inspeção","Confetti diameter":"Diâmetro do confete"}');

/***/ }),

/***/ "./res/locales/ru/nobundle-omv.loc.json":
/*!**********************************************!*\
  !*** ./res/locales/ru/nobundle-omv.loc.json ***!
  \**********************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"ru","@@context":"Расширение «Контроль на станке»","On-Machine Verification":"Контроль на станке","Probing":"Измерение щупом","Inspection Points":"Контрольные точки","Confetti diameter":"Диаметр конфетти"}');

/***/ }),

/***/ "./res/locales/sv/nobundle-omv.loc.json":
/*!**********************************************!*\
  !*** ./res/locales/sv/nobundle-omv.loc.json ***!
  \**********************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"sv","@@context":"On-Machine Verification-tillägg","On-Machine Verification":"On-Machine Verification","Probing":"Sondering","Inspection Points":"Inspektionspunkter","Confetti diameter":"Konfettidiameter"}');

/***/ }),

/***/ "./res/locales/tr/nobundle-omv.loc.json":
/*!**********************************************!*\
  !*** ./res/locales/tr/nobundle-omv.loc.json ***!
  \**********************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"tr","@@context":"Makine Üzerinde Doğrulama uzantısı","On-Machine Verification":"Makine Üzerinde Doğrulama","Probing":"Problama","Inspection Points":"Denetim Noktaları","Confetti diameter":"Konfeti çapı"}');

/***/ }),

/***/ "./res/locales/zh-HANS/nobundle-omv.loc.json":
/*!***************************************************!*\
  !*** ./res/locales/zh-HANS/nobundle-omv.loc.json ***!
  \***************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"zh-Hans","@@context":"计算机验证扩展","On-Machine Verification":"计算机验证","Probing":"正在探测","Inspection Points":"检验点","Confetti diameter":"彩色纸屑直径"}');

/***/ }),

/***/ "./res/locales/zh-HANT/nobundle-omv.loc.json":
/*!***************************************************!*\
  !*** ./res/locales/zh-HANT/nobundle-omv.loc.json ***!
  \***************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"zh-Hant","@@context":"在機驗證延伸","On-Machine Verification":"在機驗證","Probing":"正在探測","Inspection Points":"檢測點","Confetti diameter":"五色點直徑"}');

/***/ }),

/***/ "./res/locales/zh-HK/nobundle-omv.loc.json":
/*!*************************************************!*\
  !*** ./res/locales/zh-HK/nobundle-omv.loc.json ***!
  \*************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"zh-hk","@@context":"在機驗證擴充功能","On-Machine Verification":"在機驗證","Probing":"探測","Inspection Points":"檢查點","Confetti diameter":"彩色點直徑"}');

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
/******/ 			// no module.id needed
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
/*!*******************************!*\
  !*** ./extensions/OMV/OMV.js ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "OMV": () => (/* binding */ OMV)
/* harmony export */ });
/* harmony import */ var _ConfettiController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ConfettiController */ "./extensions/OMV/ConfettiController.js");
/* harmony import */ var _OMVPanel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./OMVPanel */ "./extensions/OMV/OMVPanel.js");
/* harmony import */ var _OMVLocales__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./OMVLocales */ "./extensions/OMV/OMVLocales.js");




var SETTINGS_BUTTON_LABEL = 'On-Machine Verification';
var av = Autodesk.Viewing;

'use strict';

/**
               * Provides UI controls for OMV settings
               * 
               * The extension id is: `Autodesk.OMV`
               * 
               * @example
               *   viewer.loadExtension('Autodesk.OMV')
               * 
               * @memberof Autodesk.Viewing.Extensions.OMV
               * @alias Autodesk.Viewing.Extensions.OMV.OMV
               * @see {@link Autodesk.Viewing.Extension} for common inherited methods.
               * @constructor
              */
function OMV(viewer, options) {

  Autodesk.Viewing.Extension.call(this, viewer, options);
  this._configButtonId = null;
  this._default_geom_diameter = undefined;
  this._panel = null;
  this.confettiController = null;
  this.hasUI = Autodesk.Viewing.GuiViewer3D && viewer instanceof Autodesk.Viewing.GuiViewer3D;
  this.openPanel = this.openPanel.bind(this);
  this._initialiseConfetti = this._initialiseConfetti.bind(this);
  this._initButtonConfig = this._initButtonConfig.bind(this);
}

OMV.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
OMV.prototype.constructor = OMV;

/**
                                  * Load the OMV extension.
                                  * It will fail to load when running a headless viewer.
                                  */
OMV.prototype.load = function () {
  // Don't do anything if there is no UI
  if (!this.hasUI) {
    return false;
  }

  this.extendLocalization(_OMVLocales__WEBPACK_IMPORTED_MODULE_2__.locales);

  if (this.viewer.model && this.viewer.model.isLoadDone()) {
    this._initialiseConfetti();
  } else {
    // Add an one time listener for the geometry loaded event
    this.viewer.addEventListener(
    Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
    this._initialiseConfetti,
    { once: true });

  }

  return true;
};

/**
    * Unload the OMV extension.
   */
OMV.prototype.unload = function () {

  // Remove the listener in case we unload the extension before the geometry has been loaded
  this.viewer.removeEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, this._initialiseConfetti);

  if (this._configButtonId !== null) {
    this.viewer.viewerSettingsPanel.removeConfigButton(this._configButtonId);
    this._configButtonId = null;
  }

  if (this._panel) {
    this._panel.uninitialize();
    this._panel = null;
  }

  this.confettiController = null;
  return true;
};

/**
    * @private
    */
OMV.prototype._initialiseConfetti = function () {var _this = this;

  this.confettiController = new _ConfettiController__WEBPACK_IMPORTED_MODULE_0__.ConfettiController(this.viewer);

  // Get the initial diameter from the geometry of the confetti
  this.confettiController.getDiameterFromGeom(function (geom_diameter) {

    // Abort if the extension got unloaded before it fully initialized the UI.
    if (!_this.viewer)
    return;

    _this._default_geom_diameter = geom_diameter;
    _this.setConfettiDiameter(geom_diameter);
    _this._initButtonConfig();
  });


};

/**
    * Change the confetti diameter.
    * @param {number} [diameter] - Confetti diameter. Use `undefined` to set model's default value.
    * @returns {boolean} true is the confetti value has changed.
    */
OMV.prototype.setConfettiDiameter = function (diameter) {

  // When no diameter is passed, use the default one from the model.
  if (diameter === undefined) {
    diameter = this._default_geom_diameter;
  }

  if (diameter === undefined) {
    // Model has no default confeti diamter specified, abort.
    return false;
  }

  this.confettiController.resizeConfetti(diameter);
  this._panel && this._panel.syncUI();
  return true;
};


/**
    * Opens the OMV configuration panel.
    */
OMV.prototype.openPanel = function () {
  if (!this._panel) {
    this._panel = new _OMVPanel__WEBPACK_IMPORTED_MODULE_1__.OMVPanel(this.viewer, this.confettiController, SETTINGS_BUTTON_LABEL);
  }
  this._panel.setVisible(true);
};

/**
    * Adds a button to the Settings Panel.
    * @private
    */
OMV.prototype._initButtonConfig = function () {

  var settingsPanel = this.viewer.getSettingsPanel();
  if (!settingsPanel) {
    this.addEventListener(av.SETTINGS_PANEL_CREATED_EVENT, this._initButtonConfig, { once: true });
    return;
  }

  this._configButtonId = settingsPanel.addConfigButton(SETTINGS_BUTTON_LABEL, this.openPanel);
};

Autodesk.Viewing.theExtensionManager.registerExtension('Autodesk.OMV', OMV);
})();

Autodesk.Extensions.OMV = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=OMV.js.map