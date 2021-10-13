/*!
 * LMV v7.17.1
 * 
 * Copyright 2020 Autodesk, Inc.
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
 * The Autodesk Forge viewer can only be used to view files generated by
 * Autodesk Forge services. The Autodesk Forge Viewer JavaScript must be
 * delivered from an Autodesk hosted URL.
 */
Autodesk.Extensions.PropertySearch =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./extensions/PropertySearch/PropertySearch.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./extensions/PropertySearch/PropertySearch.js":
/*!*****************************************************!*\
  !*** ./extensions/PropertySearch/PropertySearch.js ***!
  \*****************************************************/
/*! exports provided: PropertySearch */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PropertySearch", function() { return PropertySearch; });


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
};

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

/***/ })

/******/ });
//# sourceMappingURL=PropertySearch.js.map