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
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
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
/*!*****************************************************!*\
  !*** ./extensions/PropertySearch/PropertySearch.js ***!
  \*****************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PropertySearch": () => (/* binding */ PropertySearch)
/* harmony export */ });


var av = Autodesk.Viewing;
var avu = Autodesk.Viewing.UI;

/**
                                * PropertySearch extension provides UI for end users to search through a design's Property Database.
                                * 
                                * The extension id is: `Autodesk.PropertySearch`
                                * 
                                * @example
                                *    viewer.loadExtension('Autodesk.PropertySearch');
                                * 
                                * @see {@link Autodesk.Viewing.Extension} for common inherited methods.
                                * @param {Autodesk.Viewing.Viewer3D} viewer - Viewer instance.
                                * @constructor
                                */

function PropertySearch(viewer, options) {
  av.Extension.call(this, viewer, options);
  this.viewer = viewer;
  this.name = "propertysearch";
}

PropertySearch.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
PropertySearch.prototype.constructor = PropertySearch;

/**
                                                        * Loads the extension.
                                                        * 
                                                        * @alias Autodesk.Viewing.Extensions.PropertySearch#load
                                                        */
PropertySearch.prototype.load = function () {
  return true;
};

/**
    * Unloads the extension.
    * 
    * @alias Autodesk.Viewing.Extensions.PropertySearch#unload
    */
PropertySearch.prototype.unload = function () {
  // Remove the UI
  if (this.propertySearchButton) {
    this.propertySearchButton.removeFromParent();
    this.propertySearchButton = null;
  }
  return true;
};

/**
    * Enables the property search tool.
    * 
    * @alias Autodesk.Viewing.Extensions.PropertySearch#activate
    */
PropertySearch.prototype.activate = function () {
  if (!this.activeStatus) {
    this.activeStatus = true;
  }
  return true;
};

/**
    * Deactivates the property search tool.
    * 
    * @alias Autodesk.Viewing.Extensions.PropertySearch#deactivate
    */
PropertySearch.prototype.deactivate = function () {
  if (this.activeStatus) {
    this.activeStatus = false;
  }
  return true;
};

/**
    * @returns {boolean} true when the tool is active
    *
    * @alias Autodesk.Viewing.Extensions.PropertySearch.PropertySearch#isActive
    */
PropertySearch.prototype.isActive = function () {
  return this.activeStatus;
};

/**
    * Invoked by the viewer when the toolbar UI is available. 
    * Adds a button to the toolbar.
    *
    * @alias Autodesk.Viewing.Extensions.PropertySearch#onToolbarCreated
    */

PropertySearch.prototype.onToolbarCreated = function (toolbar) {
  this.propertySearchButton = new avu.Button('toolbar-property-search-tool');
  this.propertySearchButton.setToolTip('Property Search');
  this.propertySearchButton.setIcon("propertysearch-icon");
  this.propertySearchButton.onClick = function (e) {
    // Property panel is not available
  };

  var modelTools = toolbar.getControl(Autodesk.Viewing.TOOLBAR.MODELTOOLSID);
  if (modelTools) {
    modelTools.addControl(this.propertySearchButton, { index: 0 });
  }
};

/**
    * Register the extension with the extension manager.
    */
Autodesk.Viewing.theExtensionManager.registerExtension('Autodesk.PropertySearch', PropertySearch);
})();

Autodesk.Extensions.PropertySearch = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=PropertySearch.js.map