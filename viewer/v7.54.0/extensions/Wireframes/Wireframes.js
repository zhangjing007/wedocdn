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
/*!*********************************************!*\
  !*** ./extensions/Wireframes/Wireframes.js ***!
  \*********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WireframesExtension)
/* harmony export */ });
function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}

var av = Autodesk.Viewing;

/**
                            * Provides the ability of rendering the model in wireframe mode.
                            * The method implemented is not very performant, so it's best to 
                            * avoid using it with large models.
                            * 
                            * The extension id is: `Autodesk.Viewing.Wireframes`
                            * 
                            * @example
                            *   viewer.loadExtension('Autodesk.Viewing.Wireframes')
                            * 
                            * @memberof Autodesk.Viewing.Extensions
                            * @alias Autodesk.Viewing.Extensions.WireframesExtension
                            * @see {@link Autodesk.Viewing.Extension} for common inherited methods.
                            * @class
                            */var
WireframesExtension = /*#__PURE__*/function (_av$Extension) {_inherits(WireframesExtension, _av$Extension);var _super = _createSuper(WireframesExtension);

  function WireframesExtension(viewer, options) {var _this;_classCallCheck(this, WireframesExtension);
    _this = _super.call(this, viewer, options);

    _this.groups = [];
    _this.geometries = [];
    _this.materials = [];
    _this.lines = [];

    _this.lightPreset = 4; //"Photo Booth";
    _this.viewerLightPreset = 4;

    _this.showingSolidMaterials = true;
    _this.showingLines = true;

    _this.linesMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(0x00000000),
      opacity: 0.03,
      transparent: true,
      depthTest: true,
      depthWrite: false });


    _this.solidMaterial = new THREE.MeshPhongMaterial({
      color: 0xFFCFCFCF,
      specular: 0x00000000,
      emissive: 0xFFCFCFCF,
      ambient: 0,
      opacity: 1.0,
      transparent: false,
      polygonOffset: true,
      polygonOffsetFactor: 1.0,
      polygonOffsetUnits: 5 });

    _this.solidMaterial.packedNormals = true;
    _this.name = 'wireframes';
    _this.onProgressUpdate = _this.onProgressUpdate.bind(_assertThisInitialized(_this));return _this;
  }_createClass(WireframesExtension, [{ key: "onProgressUpdate", value: function onProgressUpdate(

    event) {
      if (event.state === av.ProgressState.LOADING) {

        // Add wireframes for newly loaded fragments.
        this.createAndAddWireframes();
      }
    } }, { key: "togglePolygonOffset", value: function togglePolygonOffset()

    {
      // Functionality available in Viewer 2.15 and up, to make wireframe lines
      // look better.
      // However, wirelines may still work (though not as good) when the function is not present.
      var matManager = this.viewer.impl.getMaterials();
      if (matManager && matManager.togglePolygonOffset) {
        matManager.togglePolygonOffset(true, 1.0, 5.0);
      }
    }

    // Create and add wireframe geometry.
  }, { key: "createAndAddWireframes", value: function createAndAddWireframes() {

      var viewer = this.viewer;
      var models = viewer.impl.modelQueue().getModels();
      var modelsCount = models.length;

      for (var i = 0; i < modelsCount; ++i) {

        if (!models[i].getData().instanceTree) {
          continue;
        }

        // Create group with all lines obtained for the model.
        var group = createWireframes(models[i], this.geometries, this.lines, this.materials, this.linesMaterial);
        group.model = models[i];
        this.groups.push(group);

        // Set solid material to new fragments only when tool is activated.
        if (this.activeStatus) {
          addWireframes(this.viewer, this.groups);
          this.setSolidMaterial(this.solidMaterial);
        }

      }

      this.togglePolygonOffset();
      viewer.impl.invalidate(true, true, true);
    } }, { key: "load", value: function load()

    {
      this.createAndAddWireframes();

      // Keep adding wireframes if model is still loading.
      this.viewer.addEventListener(av.PROGRESS_UPDATE_EVENT, this.onProgressUpdate);

      // Enable line offset.
      this.togglePolygonOffset();

      return true;
    } }, { key: "unload", value: function unload()

    {

      this.activeStatus = false;

      revertSolidMaterials(this.viewer, this.materials);
      revertWireframes(this.viewer, this.groups);

      this.viewer.removeEventListener(av.PROGRESS_UPDATE_EVENT, this.onProgressUpdate);

      this.geometries = [];
      this.materials = [];
      this.lines = [];
      this.groups = [];

      return true;
    }

    /**
       * Enters wireframe mode.
       * 
       * @memberof Autodesk.Viewing.Extensions.WireframesExtension
       * @alias Autodesk.Viewing.Extensions.WireframesExtension#activate
       */ }, { key: "activate", value: function activate()
    {

      this.activeStatus = true;

      this.viewerLightPreset = this.viewer.prefs.get('lightPreset');
      this.viewer.setLightPreset(this.lightPreset);

      this.setSolidMaterial(this.solidMaterial);
      this.setLinesMaterial(this.linesMaterial);

      addWireframes(this.viewer, this.groups);

      this.showSolidMaterial(this.showingSolidMaterials);
      this.showLines(this.showingLines);

      return true;
    }

    /**
       * Exits wireframe mode.
       * 
       * @memberof Autodesk.Viewing.Extensions.WireframesExtension
       * @alias Autodesk.Viewing.Extensions.WireframesExtension#deactivate
       */ }, { key: "deactivate", value: function deactivate()
    {

      this.activeStatus = false;
      this.viewer.setLightPreset(this.viewerLightPreset);
      revertWireframes(this.viewer, this.groups);
      revertSolidMaterials(this.viewer, this.materials);
      return true;
    }

    /**
       * Whether to replace the standard materials with a solid one, or not.
       * 
       * @param {boolean} show
       * 
       * @memberof Autodesk.Viewing.Extensions.WireframesExtension
       * @alias Autodesk.Viewing.Extensions.WireframesExtension#showSolidMaterial
       */ }, { key: "showSolidMaterial", value: function showSolidMaterial(
    show) {

      this.showingSolidMaterials = show;

      if (!this.activeStatus) {
        return;
      }

      if (this.showingSolidMaterials) {
        this.setSolidMaterial(this.solidMaterial);
      } else {
        revertSolidMaterials(this.viewer, this.materials);
      }
    }

    /**
       * Whether to render line edges or not.
       * 
       * @param {boolean} show
       * 
       * @memberof Autodesk.Viewing.Extensions.WireframesExtension
       * @alias Autodesk.Viewing.Extensions.WireframesExtension#showLines
       */ }, { key: "showLines", value: function showLines(
    show) {

      this.showingLines = show;

      if (!this.activeStatus) {
        return;
      }

      var lines = this.lines;
      var linesCount = lines.length;

      for (var i = 0; i < linesCount; ++i) {

        var line = lines[i];
        line.visible = show;
      }

      this.viewer.impl.invalidate(true, true, true);
    }

    /**
       * Replaces the solid material.
       * 
       * @param {THREE.Material} material
       * 
       * @see {@link Autodesk.Viewing.Extensions.WireframesExtension#showSolidMaterial}
       * @memberof Autodesk.Viewing.Extensions.WireframesExtension
       * @alias Autodesk.Viewing.Extensions.WireframesExtension#setSolidMaterial
       */ }, { key: "setSolidMaterial", value: function setSolidMaterial(
    material) {

      this.solidMaterial = material;
      // TODO: We don't dispose of the material we may be replacing. It isn't
      // clear whether we should do that, or whether it is the reponsibility of
      // the application to dispose of materials.
      var matman = this.viewer.impl.matman();
      var name = matman._getMaterialHash(null, "Autodesk.Viewing.Wireframes.solid");
      matman.addMaterial(name, material, true);

      // Replace all fragments materials if extension active and showing solid materials.
      if (!this.activeStatus || !this.showingSolidMaterials) {
        return;
      }

      var materials = this.materials;
      var materialsCount = materials.length;

      for (var i = 0; i < materialsCount; ++i) {
        var materialEntry = materials[i];
        materialEntry.fragments.setMaterial(materialEntry.fragment, this.solidMaterial);
      }

      this.viewer.impl.invalidate(true, true, true);
    }

    /**
       * Replaces the line material.
       * 
       * @param {THREE.Material} material
       * 
       * @see {@link Autodesk.Viewing.Extensions.WireframesExtension#showLines}
       * @memberof Autodesk.Viewing.Extensions.WireframesExtension
       * @alias Autodesk.Viewing.Extensions.WireframesExtension#setLinesMaterial
       */ }, { key: "setLinesMaterial", value: function setLinesMaterial(
    material) {

      this.linesMaterial = material;
      // TODO: We don't dispose of the material we may be replacing. It isn't
      // clear whether we should do that, or whether it is the reponsibility of
      // the application to dispose of materials.
      var matman = this.viewer.impl.matman();
      var name = matman._getMaterialHash(null, "Autodesk.Viewing.Wireframes.lines");
      matman.addMaterialNonHDR(name, material);

      // Replace all lines materials if extension is active and showing lines.
      if (!this.activeStatus || !this.showingLines) {
        return;
      }

      var lines = this.lines;
      var linesCount = lines.length;

      for (var i = 0; i < linesCount; ++i) {

        var line = lines[i];
        line.material = this.linesMaterial;
      }

      this.viewer.impl.invalidate(true, true, true);
    }

    /**
       * Specifies the light preset to use when wireframe mode is activated.
       * 
       * @param {string} name - the name of the light preset
       * 
       * @memberof Autodesk.Viewing.Extensions.WireframesExtension
       * @alias Autodesk.Viewing.Extensions.WireframesExtension#setLightPreset
       */ }, { key: "setLightPreset", value: function setLightPreset(
    name) {

      this.lightPreset = name;
      if (this.activeStatus) {
        this.viewer.setLightPreset(name);
      }
    } }]);return WireframesExtension;}(av.Extension);




/**
                                                       * @param model
                                                       * @param geometries
                                                       * @param lines
                                                       * @param materials
                                                       * @param linesMaterial
                                                       * @private
                                                       */
function createWireframes(model, geometries, lines, materials, linesMaterial) {

  // Get Meshes in the model.
  var tree = model.getData().instanceTree;
  var fragments = model.getFragmentList();
  var newGeometries = [];

  tree.enumNodeChildren(model.getRootId(), function (dbId) {

    if (tree.isNodeHidden(dbId) || tree.isNodeOff(dbId)) {
      return;
    }

    //All fragments that belong to the same node make part of the
    //same object so we have to accumulate all their intersections into one list
    tree.enumNodeFragments(dbId, function (fragmentId) {

      var mesh = fragments.getVizmesh(fragmentId);

      if (!mesh.geometry) {
        return;
      }

      if (mesh.geometry.is2d || mesh.geometry.isLines) {
        return;
      }

      if (!mesh.material.cutplanes) {
        return;
      }

      // Save materials to restore later.
      materials.push({ fragment: fragmentId, fragments: fragments, material: fragments.getMaterial(fragmentId) });

      // Add geometry if not already present.
      var geometry = fragments.getGeometry(fragmentId);
      if (!find(geometry, fragmentId, geometries)) {

        var world = new THREE.Matrix4();
        fragments.getWorldMatrix(fragmentId, world);
        newGeometries.push({ geometry: geometry, world: world, fragment: fragmentId });
      }
    }.bind(this), false);
  }, true);

  // Create wire lines.
  var group = new THREE.Group();
  var newGeometriesCount = newGeometries.length;
  var position = new THREE.Vector3(),quaternion = new THREE.Quaternion(),scale = new THREE.Vector3();

  for (var i = 0; i < newGeometriesCount; ++i) {

    var geometry = new THREE.Geometry();
    var geometryVertices = geometry.vertices;

    var srcWorld = newGeometries[i].world;
    var srcGeometry = newGeometries[i].geometry;

    var srcVertices = srcGeometry.vb;
    var srcIndices = srcGeometry.ib;
    var srcStride = srcGeometry.vbstride;

    for (var j = 0; j < srcIndices.length;) {

      var indexA = srcIndices[j++] * srcStride;
      var indexB = srcIndices[j++] * srcStride;
      var indexC = srcIndices[j++] * srcStride;

      var vertexA = new THREE.Vector3(srcVertices[indexA++], srcVertices[indexA++], srcVertices[indexA]);
      var vertexB = new THREE.Vector3(srcVertices[indexB++], srcVertices[indexB++], srcVertices[indexB]);
      var vertexC = new THREE.Vector3(srcVertices[indexC++], srcVertices[indexC++], srcVertices[indexC]);

      geometryVertices.push(vertexA);
      geometryVertices.push(vertexB);

      geometryVertices.push(vertexB);
      geometryVertices.push(vertexC);

      geometryVertices.push(vertexC);
      geometryVertices.push(vertexA);
    }

    var line = new THREE.Line(geometry, linesMaterial, THREE.LinePieces);

    srcWorld.decompose(position, quaternion, scale);
    line.position.copy(position);
    line.quaternion.copy(quaternion);
    line.scale.copy(scale);
    lines.push(line);

    group.add(line);
    geometries.push(newGeometries[i]);
  }

  return group;
}

/**
   * @param {Viewer3D} viewer - Viewer instance
   * @param groups
   * @private
   */
function addWireframes(viewer, groups) {

  var groupsCount = groups.length;
  for (var i = 0; i < groupsCount; ++i) {

    viewer.impl.sceneAfter.add(groups[i]);
  }
  viewer.impl.invalidate(true, true, true);
}

/**
   * @param {Viewer3D} viewer - Viewer instance
   * @param materials
   * @private
   */
function revertSolidMaterials(viewer, materials) {

  var materialsLength = materials.length;
  for (var i = 0; i < materialsLength; ++i) {

    var material = materials[i];
    material.fragments.setMaterial(material.fragment, material.material);
  }
  viewer.impl.invalidate(true, true, true);
}

/**
   * @param {Viewer3D} viewer - Viewer instance
   * @param groups
   * @private
   */
function revertWireframes(viewer, groups) {

  var groupsCount = groups.length;
  for (var i = 0; i < groupsCount; ++i) {

    viewer.impl.sceneAfter.remove(groups[i]);
  }
  viewer.impl.invalidate(true, true, true);
}

/**
   * @param geometry
   * @param fragment
   * @param geometries
   * @private
   */
function find(geometry, fragment, geometries) {

  var geometryCount = geometries.length;
  for (var i = 0; i < geometryCount; ++i) {

    if (geometries[i].geometry === geometry && geometries[i].fragment === fragment) {
      return geometries[i];
    }
  }

  return null;
}


Autodesk.Viewing.theExtensionManager.registerExtension('Autodesk.Viewing.Wireframes', WireframesExtension);
})();

Autodesk.Extensions.Wireframes = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=Wireframes.js.map