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

/***/ "./extensions/SplitScreen/SplitScreenGroundShadow.js":
/*!***********************************************************!*\
  !*** ./extensions/SplitScreen/SplitScreenGroundShadow.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SplitScreenGroundShadow": () => (/* binding */ SplitScreenGroundShadow)
/* harmony export */ });


var RightShadowMaterial = "SplitScreen_RightGroundShadowMaterial";

// Proxy to manage 2 separate GroundShadows for split screen
function SplitScreenGroundShadow() {

  this.attach = function (viewer) {

    this.renderer = viewer.impl.glrenderer();

    // Reuse existing ground shadow for left screen and create a separate GroundShadow for the right one.
    this.leftShadow = viewer.impl.setUserGroundShadow(this);
    this.rightShadow = new Autodesk.Viewing.Private.GroundShadow(this.renderer);

    // Make sure that override materials get current cutplanes from MaterialManager
    var materials = viewer.impl.getMaterials();
    materials.addMaterialNonHDR(RightShadowMaterial, this.rightShadow.getDepthMaterial());

    // Sync right ground-shadow settings with the original one
    this.rightShadow.enabled = this.leftShadow.enabled;
    this.rightShadow.setColor(this.leftShadow.getColor());
    this.rightShadow.setAlpha(this.leftShadow.getAlpha());

    // force ground shadow update (including transform reset)
    viewer.impl.sceneUpdated();
  };

  this.detach = function (viewer) {

    // clean up secondary ground shadow material
    var materials = viewer.impl.getMaterials();
    materials.removeNonHDRMaterial(RightShadowMaterial);

    // recover original ground shadow
    viewer.impl.setUserGroundShadow(this.leftShadow);
    viewer.impl.sceneUpdated();
  };

  // Create function that forwards a function call to left/right GroundShadow. Return values are taken
  // from the right one. (We can use any, because we keep them in sync)
  this.createForward = function (funcName) {
    this[funcName] = function () {
      this.leftShadow[funcName].apply(this.leftShadow, arguments);
      return this.rightShadow[funcName].apply(this.rightShadow, arguments);
    }.bind(this);
  };

  var forwards = [
  "setTransform",
  "setDirty",
  "prepareGroundShadow",
  "getStatus",
  "clear",
  "setColor",
  "setAlpha"];

  for (var i in forwards) {
    this.createForward(forwards[i]);
  }

  Object.defineProperty(this, 'enabled', {
    get: function get() {
      return this.leftShadow.enabled;
    },
    set: function set(enabled) {
      this.leftShadow.enabled = enabled;
      this.rightShadow.enabled = enabled;
    } });


  Object.defineProperty(this, 'rendered', {
    get: function get() {
      return this.leftShadow.rendered;
    },
    set: function set(rendered) {
      this.leftShadow.rendered = rendered;
      this.rightShadow.rendered = rendered;
    } });


  this.renderShadow = function (camera, target) {

    // Note that the camera is already set to half canvas width
    var halfW = camera.clientWidth;
    var height = camera.clientHeight;

    this.renderer.setViewport(0, 0, halfW, height);
    this.leftShadow.renderShadow(camera, target);

    this.renderer.setViewport(halfW, 0, halfW, height);
    this.rightShadow.renderShadow(camera, target);
  };
}

/***/ }),

/***/ "./extensions/SplitScreen/SplitScreenRenderContext.js":
/*!************************************************************!*\
  !*** ./extensions/SplitScreen/SplitScreenRenderContext.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SplitScreenRenderContext": () => (/* binding */ SplitScreenRenderContext)
/* harmony export */ });


function SplitScreenRenderContext(context, viewer) {

  var permissiveFilter = function permissiveFilter() {return true;};
  var _this = this;
  var _black = new THREE.Color().setRGB(0, 0, 0);

  this.context = context;
  this.settings = this.context.settings;

  // By default, 2 viewports, no filters (all models on both viewports)
  this._viewports = [permissiveFilter, permissiveFilter];

  // Backwards compatibility
  Object.defineProperty(this, 'modelFilterLeft', {
    enumerable: true,
    get: function get() {
      return this._viewports[0];
    },
    set: function set(val) {
      this._viewports[0] = val || permissiveFilter; // null/undefined used to mean "show all"
    } });

  Object.defineProperty(this, 'modelFilterRight', {
    enumerable: true,
    get: function get() {
      return this._viewports[1];
    },
    set: function set(val) {
      this._viewports[1] = val || permissiveFilter; // null/undefined used to mean "show all"
    } });


  this.width = viewer.impl.canvas.clientWidth;
  this.height = viewer.impl.canvas.clientHeight;

  this.renderer = viewer.impl.glrenderer();

  // All standard function calls that we don't override are forwarded to this.context
  function applyForwards(targetContext) {

    function createForwardFunction(funcName) {
      return function () {
        // Forward to target context.
        return targetContext[funcName].apply(targetContext, arguments);
      };
    }

    // For any function that we don't explicitly override in prototype, just forward the calls
    // to both child contexts.
    for (var key in targetContext) {

      // Only care for functions
      var func = targetContext[key];
      if (typeof func !== 'function') {
        continue;
      }

      _this[key] = createForwardFunction(key);
    }
  }
  applyForwards(this.context);

  this.renderScenePart = function (scene) {

    this.renderer.enableViewportOnOffscreenTargets(true);

    var vpWidth = this.width / 2;
    var vpHeight = _this._viewports.length > 2 ? this.height / 2 : this.height;
    var vpVertStart = _this._viewports.length > 2 ? vpHeight : 0;

    var shouldRenderForViewport = _this._viewports.map(function (vpFilter) {
      return vpFilter(scene.modelId);
    });

    // Left
    if (shouldRenderForViewport[0]) {
      this.renderer.setViewport(0, vpVertStart, vpWidth, vpHeight);
      this.context.renderScenePart.apply(this.context, arguments);
    }

    // Right
    if (shouldRenderForViewport[1]) {
      this.renderer.setViewport(vpWidth, vpVertStart, vpWidth, vpHeight);
      this.context.renderScenePart.apply(this.context, arguments);
    }

    // Bottom left
    if (shouldRenderForViewport[2]) {
      this.renderer.setViewport(0, 0, vpWidth, vpHeight);
      this.context.renderScenePart.apply(this.context, arguments);
    }

    // Bottom right
    if (shouldRenderForViewport[3]) {
      this.renderer.setViewport(vpWidth, 0, vpWidth, vpHeight);
      this.context.renderScenePart.apply(this.context, arguments);
    }

    this.renderer.setViewport(0, 0, this.width, this.height);
    this.renderer.enableViewportOnOffscreenTargets(false);
  };

  // Set all meshes visible that are excluded by the given model filter.
  // Returns an array of all meshes that were hidden - is used to recover previous visiblity later.
  this.isolateSelectionMeshes = function (overlays, filter) {

    var overlay = overlays["selection"];
    var scene = overlay && overlay.scene;
    if (!scene) {
      return [];
    }

    var meshesHidden = [];
    for (var i = 0; i < scene.children.length; i++) {
      var mesh = scene.children[i];
      if (!(mesh instanceof THREE.Mesh) || !mesh.visible) {
        continue;
      }

      // hide mesh if its model is excluded
      if (filter && mesh.model && !filter(mesh.model.id)) {
        mesh.visible = false;
        meshesHidden.push(mesh);
      }
    }
    return meshesHidden;
  };

  this.setMeshesVisible = function (meshes) {
    for (var i = 0; i < meshes.length; i++) {
      meshes[i].visible = true;
    }
  };

  this.renderOverlays = function (overlays, lights) {
    var vpWidth = this.width / 2;
    var vpHeight = _this._viewports.length > 2 ? this.height / 2 : this.height;
    var vpVertStart = _this._viewports.length > 2 ? vpHeight : 0;

    var overlayTarget = this.context.getNamedTarget('overlay');
    var needsClear = false;
    for (var key in overlays) {
      var p = overlays[key];
      var s = p.scene;
      if (s.children.length) {
        needsClear = true;
        break;
      }
    }
    if (needsClear) {
      this.renderer.setClearColor(_black, 0.0);
      this.renderer.clearTarget(overlayTarget, true, false, false);
    }

    this.renderer.enableViewportOnOffscreenTargets(true);

    var meshesExcluded;

    // Left
    meshesExcluded = this.isolateSelectionMeshes(overlays, _this._viewports[0]);
    this.renderer.setViewport(0, vpVertStart, vpWidth, vpHeight);
    this.context.renderOverlays(overlays, lights, true);
    this.setMeshesVisible(meshesExcluded);

    // Right
    meshesExcluded = this.isolateSelectionMeshes(overlays, _this._viewports[1]);
    this.renderer.setViewport(vpWidth, vpVertStart, vpWidth, vpHeight);
    this.context.renderOverlays(overlays, lights, true);
    this.setMeshesVisible(meshesExcluded);

    // Bottom left
    if (_this._viewports.length >= 3) {
      meshesExcluded = this.isolateSelectionMeshes(overlays, _this._viewports[2]);
      this.renderer.setViewport(0, 0, vpWidth, vpHeight);
      this.context.renderOverlays(overlays, lights, true);
      this.setMeshesVisible(meshesExcluded);
    }

    // Bottom right
    if (_this._viewports.length >= 4) {
      meshesExcluded = this.isolateSelectionMeshes(overlays, _this._viewports[3]);
      this.renderer.setViewport(vpWidth, 0, vpWidth, vpHeight);
      this.context.renderOverlays(overlays, lights, true);
      this.setMeshesVisible(meshesExcluded);
    }

    this.renderer.setViewport(0, 0, this.width, this.height);
    this.renderer.enableViewportOnOffscreenTargets(false);
  };

  this.setSize = function (w, h, force) {
    this.width = w;
    this.height = h;
    this.context.setSize(w, h, force);
  };

  /**
      * Sets the viewports and their filters. There can be at most 4 viewports/filters and at least 2.
      *
      * @param {Array.<Function?>} viewports - The array of viewport filters. Each entry in the array is a predicate
      * function on a model ID indicating whether or not that model ID should be rendered in the viewport. Falsy values
      * in the array are replaced with a function that always returns true.
      */
  this.setViewports = function (viewports) {
    // Maximum 4 viewports, null means permissive filter
    viewports = viewports.slice(0, 4) // create a shallow copy of at most 4 of the items
    .map(function (filter) {
      return filter || permissiveFilter; // Replace any null values with a permissive filter
    });

    // Minimum of 2 viewports
    if (viewports.length < 2) {
      var fillStart = viewports.length;
      viewports.length = 2;
      viewports.fill(permissiveFilter, fillStart);
    }

    this._viewports = viewports;

    // Trigger a resize to recalculate aspect ratio and cause a redraw
    viewer.resize();
  };

  /**
      * Adds a viewport. If there are already 4 viewports then nothing happens.
      *
      * @param {Function?} [viewport] - A filter for the viewport. If no filter is provided then all models are displayed
      */
  this.addViewport = function (viewport) {
    viewport = viewport || permissiveFilter;

    if (this._viewports.length < 4) {
      this._viewports.push(viewport);
      // Trigger a resize to recalculate aspect ratio and cause a redraw
      viewer.resize();
    }
  };

  /**
      * Removes a viewport at the specified index. If the index is out of bounds or there are 2 or fewer viewports
      * then nothing happens.
      *
      * @param {Function?} [viewport] - A filter for the viewport. If no filter is provided then all models are displayed
      */
  this.removeViewport = function (index) {
    if (this._viewports.length <= 2 || index >= this._viewports.length || index < 0) {
      return;
    }

    this._viewports.splice(index, 1);
    // Trigger a resize to recalculate aspect ratio and cause a redraw
    viewer.resize();
  };

  /**
      * Returns a shallow copy of the array of viewports
      *
      * @return {Array.<Function>} - The array of viewports
      */
  this.getViewports = function () {
    // Shallow copy so we don't have to worry about other parts of the code modifying it and messing with our
    // assumptions
    return this._viewports.slice(0);
  };

  /**
      * Returns the number of viewports.
      *
      * @return {number} - The number of viewports (between 2 and 4 inclusive)
      */
  this.getNumberOfViewports = function () {
    return this._viewports.length;
  };
}

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
/*!***********************************************!*\
  !*** ./extensions/SplitScreen/SplitScreen.js ***!
  \***********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SplitScreenExtension": () => (/* binding */ SplitScreenExtension)
/* harmony export */ });
/* harmony import */ var _SplitScreenGroundShadow__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SplitScreenGroundShadow */ "./extensions/SplitScreen/SplitScreenGroundShadow.js");
/* harmony import */ var _SplitScreenRenderContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SplitScreenRenderContext */ "./extensions/SplitScreen/SplitScreenRenderContext.js");



'use strict';

var namespace = AutodeskNamespace('Autodesk.Extensions.SplitScreen');
var myExtensionName = 'Autodesk.SplitScreen';
var navToolsExtension = 'Autodesk.DefaultTools.NavTools';

/**
                                                           * Filter function that returns true for models to be rendered on the specified subcanvas.
                                                           * 
                                                           * @callback Autodesk.Viewing.Extensions.SplitScreenExtension~modelFilterFunction
                                                           * @param {number} modelId - The id of the model.
                                                           * @returns {boolean}
                                                           */


/**
                                                               * This extension subdivides the LMV canvas into between 2 and 4 (inclusive) separate subcanvases.
                                                               *
                                                               * The extension id is: `Autodesk.SplitScreen`
                                                               *
                                                               * For each sub-canvas, you can specify a separate model filter function to control in which
                                                               * canvases each model shall appear. The canvases are numbered as follows:
                                                               * 0  1
                                                               * 2  3
                                                               *
                                                               * By default (no modelFilter), all models are rendered to each subcanvas.
                                                               * Overlays are rendered into both canvases (unless selection highlighting proxies - which are associated with models)
                                                               *
                                                               * Limitations: Most core features of LMV keep working (2D/3D render, mouse-over, selection, directional zoom etc.).
                                                               * However, there are currently some known limitations/tradeoffs:
                                                               * - All canvases must use the same camera. Overcoming this requires to introduce a separate scene graph evaluation too.
                                                               * - Subcanvas configuration is currently limited to subcanvases with the same aspect ratio. Extending that will
                                                               * (among others) require support for separate cameras.
                                                               * - ZoomToolExtension, SectionTool, and Measure tool are disabled SplitScreen (we hide the UI)
                                                               * - GroundShadow is supported, but doesn't apply model filter yet when refreshing the shadow
                                                               * - GroundReflection in SplitScreen is not supported yet.
                                                               * - We currently use only a single background for both. This is hardly noticeable for discreet backgrounds like the AEC default or fixed colors,
                                                               * but may disturb when using more detailed environments.
                                                               *
                                                               * @example 
                                                               * var options = {
                                                               * viewports: [
                                                               * function(id) { return id === 1; },
                                                               * function(id) { return id !== 1; }
                                                               * ]
                                                               * };
                                                               * viewer.loadExtension('Autodesk.SplitScreen', options);
                                                               * @param {Viewer3D} viewer - Viewer instance
                                                               * @param {object} [options]
                                                               * @param {Array.<Autodesk.Viewing.Extensions.SplitScreenExtension~modelFilterFunction?>} [options.viewports] - Filter
                                                               * functions that returns true for models to be rendered for the viewport at that index. Falsy values render everything.
                                                               * @memberof Autodesk.Viewing.Extensions
                                                               * @alias Autodesk.Viewing.Extensions.SplitScreenExtension
                                                               * @see {@link Autodesk.Viewing.Extension} for common inherited methods.
                                                               * @class
                                                               */
function SplitScreenExtension(viewer, options) {
  Autodesk.Viewing.Extension.call(this, viewer, options);
  this.options = options || {};
}

SplitScreenExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
SplitScreenExtension.prototype.constructor = SplitScreenExtension;

var proto = SplitScreenExtension.prototype;


proto.load = function () {
  var scope = this;
  this.enabled = true;

  // Note that we just wrap the RenderContext, but do not reinitialize it. This avoids a couple of issues like...
  //  1. Wasting some resources by reallocating targets and effects
  //  2. EdgeMaterial and DepthMaterial would be recreated, so that we would need to register them again at MaterialManager to keep cutplanes working.
  //  3. We would lose some settings (e.g. edge rendering flag, sao settings etc.)
  var renderer = this.viewer.impl.renderer();
  this.context = new _SplitScreenRenderContext__WEBPACK_IMPORTED_MODULE_1__.SplitScreenRenderContext(renderer, this.viewer);
  this.viewer.impl.setUserRenderContext(this.context, true);

  // Replace ground shadow by proxy object that manages an additional GroundShadows for right screen
  this.groundShadow = new _SplitScreenGroundShadow__WEBPACK_IMPORTED_MODULE_0__.SplitScreenGroundShadow();
  this.groundShadow.attach(this.viewer);

  // Filter viewports
  this.patchRayCast();

  // Viewport coordinate conversions
  this.patchCoordinateConversions();

  // Fix world up (roll) tool
  if (this.viewer.getExtension(navToolsExtension)) {
    this.patchWorldUp();
  } else {
    var onExtensionLoaded = function onExtensionLoaded(event) {
      if (event.extensionId === navToolsExtension) {
        scope.patchWorldUp();
        scope.viewer.removeEventListener(Autodesk.Viewing.EXTENSION_LOADED_EVENT, onExtensionLoaded);
      }
    };
    this.viewer.addEventListener(Autodesk.Viewing.EXTENSION_LOADED_EVENT, onExtensionLoaded);
  }

  // Remember which tools we have hidden in order to bring them back later
  // NOTE: This assumes that the tool display state or existence is not changed while SplitScreen is used. Ideally, we should
  //       avoid this by making them work together.
  this.collectControlsToHide();

  // On resize or nav-mode changes, GuiViewer.updateButtonToolbar overwrites the display style for some tools, so that we have
  // to hide them again.
  this.onToolbarButtonsUpdated = function () {
    scope.hideIncompatibleControls(true);
  };
  this.viewer.addEventListener(Autodesk.Viewing.NAVIGATION_MODE_CHANGED_EVENT, this.onToolbarButtonsUpdated);

  // Adjust camera aspect ratio for half screen width (now and on resize)
  this.handleResize = function () {
    var w = scope.viewer.canvas.clientWidth;
    var h = scope.viewer.canvas.clientHeight;

    var camera = scope.viewer.impl.camera;
    camera.clientWidth = w;
    camera.clientHeight = h;
    camera.aspect = w / h;

    if (scope.enabled) {
      camera.clientWidth /= 2.0;
      if (scope.context.getNumberOfViewports() > 2) {
        camera.clientHeight /= 2.0;
      } else {
        camera.aspect /= 2.0;
      }
    }

    // Make sure that incompabible
    scope.onToolbarButtonsUpdated();
  };
  this.viewer.addEventListener(Autodesk.Viewing.VIEWER_RESIZE_EVENT, this.handleResize);
  this.handleResize();

  if (this.options.viewports) {
    this.context.setViewports(this.options.viewports);
  } else if (this.options.modelFilterLeft || this.options.modelFilterRight) {
    this.context.modelFilterLeft = this.options.modelFilterLeft;
    this.context.modelFilterRight = this.options.modelFilterRight;
  }

  return true;
};

// Maps a value in the range [Left, Right] with midpoint M so that [L, M] => [L, R] and [M, R] => [L, R]
/**
 * @param {number} a - Value to map
 * @param {number} left - Left of the range
 * @param {number} right - Right of the range
 * @private
 */
function squish(a, left, right) {
  if (Math.abs(a - left) > Math.abs(a - right)) {// closer to right than left
    // Move to the left
    a -= (right - left) / 2;
  }

  a = 2 * a - left;

  return a;
}

/**
   * Maps the given x/y coordinates onto a viewport. x is assumed to be in [left, right]. y is assumed to
   * be in [top, bottom]. Viewports are numbered left to right, top to bottom starting at 0. E.g if there are
   * 2 viewports, 0 is the left one, 1 is the right one. If there are 4, 0 is top left, 1 is top right, 2 is bottom
   * left, 3 is bottom right.
   *
   * Example: top=-1, bottom=1, right=1, left=-1 with 4 viewports
   *     -1
   * -1 --|-- 1
   *      1
   * (-0.5, -0.5) => (0, 0) vpId=0
   * (-0.25, 1) => (0.5, 1) vpId=2
   * (1, 1) => (1, 1) vpId=3
   *
   *
   * @param {number} x - The x coordinate to map. Should be in the range [left, right]
   * @param {number} y - The y coordinate to map. Should be in the range [bottom, top]
   * @param {number} left - The left boundary of the coordinate system
   * @param {number} right - The right boundary of the coordinate system
   * @param {number} top - The top boundary of the coordinate system
   * @param {number} bottom - The bottom boundary of the coordinate system
   *
   * @returns {{x: number, y: number, viewportId: number}} - An object with the new x/y coordinates and the viewport number
   */
proto.mapCoords = function (x, y, left, right, top, bottom) {
  var viewportId = 0;
  var numberOfViewports = this.context.getNumberOfViewports();

  // Need to map the x coordinate
  if (numberOfViewports >= 2) {
    viewportId = Math.abs(x - left) < Math.abs(x - right) ? 0 : 1;
    x = squish(x, left, right);
  }

  // Need to map the y coordinate
  if (numberOfViewports >= 3) {
    viewportId += Math.abs(y - top) < Math.abs(y - bottom) ? 0 : 2;
    y = squish(y, bottom, top);
  }

  return { x: x, y: y, viewportId: viewportId };
};

// Set 'display: none' for all incompatible tools or recover initial display value.
proto.hideIncompatibleControls = function (hide) {
  for (var i = 0; i < this.controlsToHide.length; i++) {
    var obj = this.controlsToHide[i];
    var val = hide ? 'none' : obj.originalValue;
    obj.control.setDisplay(val);
  }
};

proto.collectControl = function (control) {
  if (control) {
    this.controlsToHide.push({
      control: control,
      originalValue: control.container.style.display });

  }
};

// Collect controls that we have to hide because they are not yet compatible with split screen
proto.collectControlsToHide = function () {

  this.controlsToHide = [];

  // measure
  var modelTools = this.viewer.modelTools;
  this.collectControl(modelTools.measurementToolbarButton);

  // section
  this.collectControl(modelTools.getControl('toolbar-sectionTool'));

  // zoom
  this.collectControl(this.viewer.navTools.getControl('toolbar-zoomTools'));
};

// Wrap raycast, so that it distinguishes between viewports
proto.patchRayCast = function () {
  this.castRayViewport = this.viewer.impl.castRayViewport.bind(this.viewer.impl);

  var hideAllFilter = function hideAllFilter() {return false;}; // Hide everything

  var scope = this;
  this.viewer.impl.castRayViewport = function (vpVecIn, ignoreTransparent, dbIds, modelIds, intersections) {
    // get visible models
    var mq = scope.viewer.impl.modelQueue();
    var models = mq.getModels();

    // Create list of modelIds to be ray-intersected
    var modelIdsFiltered = models.map(function (model) {return model.id;});

    // Filter based on viewport
    // vpVecIn has been augmented with the viewport ID by this point so we can tell which viewport the mouse
    // event originally came from.
    // viewportFilter isn't guaranteed to be defined. If there are only 3 viewports, mouse events can still be
    // mapped to where the 4th viewport would be if it existed. In this case we want to hit nothing
    var viewports = scope.context.getViewports();
    var viewportFilter = viewports[vpVecIn.viewportId || 0];
    modelIdsFiltered = modelIdsFiltered.filter(viewportFilter || hideAllFilter);

    return scope.castRayViewport(vpVecIn, ignoreTransparent, dbIds, modelIdsFiltered, intersections);
  };
};

// Recover original raycast function
proto.unpatchRayCast = function () {
  this.viewer.impl.castRayViewport = this.castRayViewport;
};

// Fix coordinate conversions to respect the split viewports
proto.patchCoordinateConversions = function () {
  var scope = this;

  this.clientToViewport = this.viewer.impl.clientToViewport.bind(this.viewer.impl);
  this.screenToViewport = this.viewer.navigation.screenToViewport.bind(this.viewer.navigation);
  this.viewportToScreen = this.viewer.navigation.viewportToScreen.bind(this.viewer.navigation);
  this.rolloverObjectViewport = this.viewer.impl.rolloverObjectViewport.bind(this.viewer.impl);

  // Returns vec with x and y in [-1, 1]
  this.viewer.impl.clientToViewport = function (clientX, clientY) {
    var vpVec = scope.clientToViewport(clientX, clientY);

    var result = scope.mapCoords(vpVec.x, vpVec.y, -1, 1, 1, -1);

    vpVec.x = result.x;
    vpVec.y = result.y;

    // Augment with an id for the viewport that was targeted so we can recover it later
    vpVec.viewportId = result.viewportId;

    return vpVec;
  };

  // Redirect to the correct viewport at tag the vector with the viewportId
  this.viewer.navigation.screenToViewport = function (x, y) {
    var result = scope.mapCoords(x, y, 0, 1, 0, 1);

    var vpVec = scope.screenToViewport(result.x, result.y);
    vpVec.viewportId = result.viewportId;

    return vpVec;
  };

  // We can't recover the correct viewport so just assume it's from the left viewport
  this.viewer.navigation.viewportToScreen = function (x, y) {
    var vpVec = scope.viewportToScreen(x, y);

    // Just convert to the top left viewport since we can't tell which one it's from
    vpVec.x /= 2.0;

    if (scope.context.getNumberOfViewports() > 2) {
      vpVec.y /= 2.0;
    }

    return vpVec;
  };

  // Rolling over objects actually doesn't need a conversion so we have to undo the conversion that was applied
  this.viewer.impl.rolloverObjectViewport = function (vpVecIn) {
    var vpVecOut = new THREE.Vector3();

    // Convert it back
    vpVecOut.copy(vpVecIn);

    vpVecOut.x += 1.0;
    vpVecOut.x /= 2.0;
    vpVecOut.x -= vpVecIn.viewportId % 2 === 0 ? 1.0 : 0.0;

    if (scope.context.getNumberOfViewports() > 2) {
      vpVecOut.y += 1.0;
      vpVecOut.y /= 2.0;
      vpVecOut.y -= vpVecIn.viewportId > 1 ? 1.0 : 0.0;
    }

    return scope.rolloverObjectViewport(vpVecOut);
  };
};

proto.unpatchCoordinateConversions = function () {
  this.viewer.impl.clientToViewport = this.clientToViewport;
  this.viewer.navigation.screenToViewport = this.screenToViewport;
  this.viewer.navigation.viewportToScreen = this.viewportToScreen;
  this.viewer.impl.rolloverObjectViewport = this.rolloverObjectViewport;
};

// Fix world up by patching its input handlers
proto.patchWorldUp = function () {
  this.worldUpTool = this.viewer.toolController.getTool('worldup');
  if (!this.worldUpTool) {
    console.warn('Failed to patch the world up tool');
    return;
  }
  this.worldUpHandleMouseMove = this.worldUpTool.handleMouseMove.bind(this.worldUpTool);
  this.worldUpHandleButtonDown = this.worldUpTool.handleButtonDown.bind(this.worldUpTool);
  this.worldUpHandleButtonUp = this.worldUpTool.handleButtonUp.bind(this.worldUpTool);

  var scope = this;

  // The viewport our interaction started in
  var startingViewportId = null;

  // Transforms the coordinates to the appropriate viewport. Records which viewport the mouse goes down in so we can
  // reference it when tracking movement and release.
  this.worldUpTool.handleButtonDown = function (event) {
    var originalX = event.normalizedX;
    var originalY = event.normalizedY;

    var result = scope.mapCoords(originalX, originalY, -1, 1, 1, -1);

    event.normalizedX = result.x;
    event.normalizedY = result.y;
    startingViewportId = result.viewportId;

    result = scope.worldUpHandleButtonDown(event);

    // Reverse the transformation so it doesn't affect other tools further down in the stack
    event.normalizedX = originalX;
    event.normalizedY = originalY;

    return result;
  };

  // Returns a mouse handler function that transforms the input coordinates to the starting viewports coordinates.
  // This prevents the weird snapping when dragging from one viewport to another when using the roll tool
  /**
   * @param f
   * @private
   */
  function transform(f) {
    return function (event) {
      var originalX = event.normalizedX;
      var originalY = event.normalizedY;

      // Map the coordinates as usual
      var result = scope.mapCoords(originalX, originalY, -1, 1, 1, -1);

      // Shift result so it's in the starting viewport's coordinates
      // X
      // Only need to do something if we've dragged from left to right or right to left.
      if (startingViewportId % 2 !== result.viewportId % 2) {
        // Range becomes [-3, 1] or [-1, 3] depending on which viewport is our reference
        result.x += 2 * (result.viewportId % 2 - startingViewportId % 2);
      }

      // Y
      // Only need to do something if we've dragged from top to bottom or bottom to top.
      if (startingViewportId > 1 !== result.viewportId > 1) {
        // Range becomes [-3, 1] or [-1, 3] depending on which viewport is our reference
        result.y += result.viewportId > 1 ? -2 : 2;
      }

      event.normalizedX = result.x;
      event.normalizedY = result.y;

      result = f(event);

      // Reverse the transformation so it doesn't affect other tools further down in the stack
      event.normalizedX = originalX;
      event.normalizedY = originalY;

      return result;
    };
  }
  this.worldUpTool.handleMouseMove = transform(this.worldUpHandleMouseMove);
  this.worldUpTool.handleButtonUp = transform(this.worldUpHandleButtonUp);
};

proto.unpatchWorldUp = function () {
  // The patch wasn't necessarily applied so only unpatch if these are defined
  if (this.worldUpHandleMouseMove) {
    this.worldUpTool.handleMouseMove = this.worldUpHandleMouseMove;
    this.worldUpHandleMouseMove = null;
  }

  if (this.worldUpHandleButtonDown) {
    this.worldUpTool.handleButtonDown = this.worldUpHandleButtonDown;
    this.worldUpHandleButtonDown = null;
  }

  if (this.worldUpHandleButtonUp) {
    this.worldUpTool.handleButtonUp = this.worldUpHandleButtonUp;
    this.worldUpHandleButtonUp = null;
  }
};


// called on first activation of split screen mode
proto.unload = function () {

  // recover original RenderContext
  this.viewer.impl.setUserRenderContext(this.context.context, true);

  // recover original GroundShadow
  this.groundShadow.detach(this.viewer);

  // revert remapping of raycasts and getWorldpoint
  this.unpatchRayCast();
  this.unpatchCoordinateConversions();
  this.unpatchWorldUp();

  // reset camera to full horizontal fov
  this.enabled = false;
  this.handleResize();
  this.viewer.removeEventListener(Autodesk.Viewing.VIEWER_RESIZE_EVENT, this.handleResize);

  // recover visibility of incompatible controls
  this.hideIncompatibleControls(false);
  this.viewer.removeEventListener(Autodesk.Viewing.NAVIGATION_MODE_CHANGED_EVENT, this.onToolbarButtonsUpdated);
};

// Register the extension with the extension manager.
Autodesk.Viewing.theExtensionManager.registerExtension(myExtensionName, SplitScreenExtension);
namespace.SplitScreenExtension = SplitScreenExtension;
})();

Autodesk.Extensions.SplitScreen = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=SplitScreen.js.map