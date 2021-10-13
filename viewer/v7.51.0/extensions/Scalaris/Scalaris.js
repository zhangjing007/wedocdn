/*!
 * LMV v7.51.0
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
 * The Autodesk Forge viewer can only be used to view files generated by
 * Autodesk Forge services. The Autodesk Forge Viewer JavaScript must be
 * delivered from an Autodesk hosted URL.
 */
Autodesk.Extensions.Scalaris =
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./extensions/Scalaris/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./extensions/Scalaris/ScalarisLoader.js":
/*!***********************************************!*\
  !*** ./extensions/Scalaris/ScalarisLoader.js ***!
  \***********************************************/
/*! exports provided: ScalarisLoader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ScalarisLoader", function() { return ScalarisLoader; });
/* harmony import */ var worker_loader_inline_ScalarisWorker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! worker-loader?inline!./ScalarisWorker */ "./node_modules/worker-loader/dist/cjs.js?inline!./extensions/Scalaris/ScalarisWorker.js");
/* harmony import */ var worker_loader_inline_ScalarisWorker__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(worker_loader_inline_ScalarisWorker__WEBPACK_IMPORTED_MODULE_0__);
/*
* ScalarisLoader
*
* Loads scalaris files. It is trigger by loading a file with .scalaris extension or by specifying the default file type
* in the options to loadModel() method.
*
* For detailed information on Scalaris Data Model (“neutral format for Simulation & Forge”), refer to the following links:
* - https://wiki.autodesk.com/display/NFDC/Scalaris+for+Autodesk+Generative+Design
* - https://wiki.autodesk.com/pages/viewpage.action?spaceKey=MPGART&title=Project+Scalaris
* - https://pages.git.autodesk.com/dmg-nfdc/ScalarisDataModel/documentation.html
* - https://git.autodesk.com/MPGART/Scalaris
*
* Authors: Parviz Rushenas (Parviz.Rushenas@autodesk.com) & Ania Lipka (Ania.Lipka@autodesk.com)
*/




var av = Autodesk.Viewing;
var avp = Autodesk.Viewing.Private;

var logger = avp.logger;
var FileLoaderManager = av.FileLoaderManager;
var InstanceTreeStorage = avp.InstanceTreeStorage;
var InstanceTreeAccess = avp.InstanceTreeAccess;
var InstanceTree = avp.InstanceTree;
var errorCodeString = av.errorCodeString;
var ErrorCodes = av.ErrorCodes;
var ProgressState = av.ProgressState;
var pathToURL = avp.pathToURL;
var initLoadContext = av.initLoadContext;
var getResourceUrl = avp.getResourceUrl;
var Model = av.Model;

var WORKER_LOAD_SCALARIS = "LOAD_SCALARIS";
var SCALARIS_PROTO_LOCATION = "res/protobuf/scalaris.proto";
var MODEL_UNITS = "meter";
var ROOT_NODE_NAME = "RootNode";
var GEOMETRY_NODE_NAME = "Geometry";

var scalarisLoader = function scalarisLoader(parent) {
  this.viewer3DImpl = parent;
  this.loading = false;
};

scalarisLoader.prototype.dtor = function () {
  this.viewer3DImpl = null;
  this.model = null;
  this.svf = null;
  this.logger = null;
  this.loading = false;
};

scalarisLoader.prototype.isValid = function () {
  return this.viewer3DImpl != null;
};

scalarisLoader.prototype.loadFile = function (path, options, onDone, onWorkerStart) {
  if (!this.viewer3DImpl) {
    logger.log("Scalaris loader was already destructed. So no longer usable.");
    return false;
  }

  if (this.loading) {
    logger.log("Loading of Scalaris already in progress. Ignoring new request.");
    return false;
  }

  this.loading = true;

  this.currentLoadPath = path;
  var basePath = "";
  var lastSlash = this.currentLoadPath.lastIndexOf("/");
  if (lastSlash != -1)
  basePath = this.currentLoadPath.substr(0, lastSlash + 1);
  this.basePath = basePath;


  this.options = options;
  this.options.debug = {};
  this.options.preserveView = true; // to preserve the view set by setViewCube

  this.loadScalarisCB(path, this.options, onDone, onWorkerStart);
  return true;
};

scalarisLoader.prototype.createWorkerWithIntercept = function () {
  var worker = new worker_loader_inline_ScalarisWorker__WEBPACK_IMPORTED_MODULE_0___default.a();
  // let worker = new Worker('http://localhost:8000/build/lmvworker.js')
  worker.doOperation = worker.postMessage;

  worker.checkEvent = function (e) {
    if (e.data && e.data.assetRequest) {
      return true;
    }
    return false;
  };

  var interceptListeners = [];
  function popCallback(listener) {
    if (!interceptListeners) return null;
    for (var i = 0; i < interceptListeners.length; ++i) {
      if (interceptListeners[i].arg === listener) {
        var ret = interceptListeners[i].callback;
        interceptListeners.splice(i, 1);
        if (interceptListeners.length === 0)
        interceptListeners = null;
        return ret;
      }
    }
    return null;
  }

  worker.addEventListenerWithIntercept = function (listener) {

    var callbackFn = function callbackFn(ew) {
      if (worker.checkEvent(ew))
      return;

      listener(ew);
    };

    if (!interceptListeners) interceptListeners = [];
    interceptListeners.push({ arg: listener, callback: callbackFn });
    worker.addEventListener('message', callbackFn, false);
    return callbackFn;
  };

  worker.removeEventListenerWithIntercept = function (listener) {
    var callbackFn = popCallback(listener);
    if (callbackFn) {
      worker.removeEventListener('message', callbackFn, false);
    }
  };

  worker.clearAllEventListenerWithIntercept = function () {
    if (!interceptListeners) return;
    var copy = interceptListeners.concat();
    for (var i = 0; i < copy.length; ++i) {
      worker.removeEventListenerWithIntercept(copy[i].arg);
    }
  };

  return worker;
};

scalarisLoader.prototype.loadScalarisCB = function (path, options, onDone, onWorkerStart) {
  var first = true;
  var scope = this;
  var w = this.svfWorker = this.createWorkerWithIntercept();
  var onScalarisLoad = function onScalarisLoad(ew) {
    var cleaner = function cleaner() {
      if (w) {
        w.clearAllEventListenerWithIntercept();
        w.terminate();
        scope.svfWorker = null;
        w = null;
      }
    };

    if (first && onWorkerStart) {
      first = false;
      onWorkerStart();
    }

    if (ew.data && ew.data.geometry) {
      // Decompression is done.
      var svf = scope.svf = ew.data.geometry;
      scope.onModelRootLoadDone(svf);

      if (onDone) {
        onDone(null, scope.model);
      }

      scope.viewer3DImpl.api.dispatchEvent({ type: av.MODEL_ROOT_LOADED_EVENT, svf: svf, model: scope.model });
      scope.svf.loadDone = false;

    } else if (ew.data && ew.data.progress) {
      var impl = scope.viewer3DImpl;
      if (impl) {
        scope.viewer3DImpl.signalProgress(100 * ew.data.progress, ProgressState.LOADING);
      }

      // Delay onGeomLoadDone so that UI has time to build.
      if (ew.data.progress == 1) {
        setTimeout(function () {
          scope.onGeomLoadDone();
          scope.loading = false;
          cleaner();
        }, 0);
      }
    } else if (ew.data && ew.data.error) {
      scope.loading = false;
      console.error(ew.data);
      cleaner();
      if (onDone) {
        onDone(ew.data.error, null);
      }
    } else if (ew.data && ew.data.debug) {
      logger.debug(ew.data.message);
    } else {
      logger.error("Scalaris load failed.", errorCodeString(ErrorCodes.NETWORK_FAILURE));
      // Load failed.
      scope.loading = false;
      cleaner();
    }
  };

  w.addEventListenerWithIntercept(onScalarisLoad);

  var loadContext = {
    url: pathToURL(path),
    basePath: this.currentLoadPath,
    scalarisProtoPath: getResourceUrl(SCALARIS_PROTO_LOCATION) };


  loadContext.operation = WORKER_LOAD_SCALARIS;
  w.doOperation(initLoadContext(loadContext));

  return true;
};

scalarisLoader.prototype.onModelRootLoadDone = function (svf) {

  svf.basePath = this.basePath;
  svf.disableStreaming = true;
  svf.geomPolyCount = 0;
  svf.gpuNumMeshes = 0;
  svf.gpuMeshMemory = 0;

  svf.fragments = {
    length: svf.meshCount,
    numLoaded: 0,
    boxes: null,
    transforms: null,
    materials: null,

    fragId2dbId: null,
    entityIndexes: null,
    mesh2frag: null };


  svf.animations = null;
  svf.nodeToDbId = {};
  svf.loadOptions = this.options;

  svf.bbox = new THREE.Box3(svf.min, svf.max);

  // Create the API Model object and its render proxy
  var model = this.model = new Model(svf);
  if (svf.urn) {
    model.setUUID(svf.urn);
  }
  model.initialize();
  model.loader = this;
  model.isScalaris = true;

  this.viewer3DImpl.signalProgress(5, ProgressState.ROOT_LOADED);
  this.viewer3DImpl.invalidate(false, false);
};

scalarisLoader.prototype.onGeomLoadDone = function () {
  this.svf.loadDone = true;

  var fragLength = this.svf.fragments.length;
  this.svf.numGeoms = fragLength;

  this.svf.fragments.numLoaded = fragLength;
  this.svf.fragments.boxes = new Float32Array(fragLength * 6);
  this.svf.fragments.transforms = new Float32Array(fragLength * 12);
  this.svf.fragments.materials = new Int32Array(fragLength);
  this.svf.fragments.fragId2dbId = new Int32Array(fragLength);
  this.svf.fragments.mesh2frag = new Int32Array(fragLength);

  var ensureChunk = function ensureChunk(geometry) {
    if (geometry.offsets.length === 0) {
      var chunkSize = 21845;
      var numTris = geometry.attributes.index.array.length / 3;
      var offsets = numTris / chunkSize;
      for (var i = 0; i < offsets; i++) {
        var offset = {
          start: i * chunkSize * 3,
          count: Math.min(numTris - i * chunkSize, chunkSize) * 3 };

        geometry.addDrawCall(offset.start, offset.count);
      }
    }
  };

  var ensureNormals = function ensureNormals(geometry) {
    if (geometry.attributes.normal.array.length == 0) {
      geometry.attributes.normal.array = new Float32Array(geometry.attributes.position.array.length);
      geometry.computeVertexNormals();
    }
  };

  var commitGeometry = function commitGeometry(geometryData) {
    var geometry = new THREE.BufferGeometry();
    geometry.byteSize = 0;
    geometry.addAttribute('index', new THREE.BufferAttribute(new Uint32Array(geometryData.indices), 1));
    geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(geometryData.vertices), 3));
    geometry.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(geometryData.normals), 3));

    if (geometryData.hasOwnProperty('uvs') && geometryData.uvs.byteLength > 0) {
      geometry.byteSize += geometryData.uvs.byteLength;
      geometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(geometryData.uvs), 2));
    }

    geometry.hasColors = false;
    if (geometryData.hasOwnProperty('colors') && geometryData.colors.byteLength > 0) {
      geometry.byteSize += geometryData.colors.byteLength;
      geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(geometryData.colors), 3));
      geometry.hasColors = true;
      geometry.colorsNeedUpdate = true;
    }

    if (geometry.attributes.index.array.length > 0 && geometry.attributes.position.array.length > 0) {
      if (geometryData.hasOwnProperty('offsets') && geometryData.offsets.byteLength > 0) {
        geometry.byteSize += geometryData.offsets.byteLength;
        var length = geometryData.offsets.length;
        for (var i = 0; i < length; i++) {
          var offset = geometryData.offsets[i];
          geometry.addDrawCall(offset.start, offset.count);
        }
      }

      if (geometryData.min) {
        geometry.boundingBox = new THREE.Box3(new THREE.Vector3(geometryData.min.x, geometryData.min.y, geometryData.min.z),
        new THREE.Vector3(geometryData.max.x, geometryData.max.y, geometryData.max.z));
      } else {
        geometry.computeBoundingBox();
      }
      geometryData.bbox.min = geometryData.min = geometry.boundingBox.min;
      geometryData.bbox.max = geometryData.max = geometry.boundingBox.max;

      ensureChunk(geometry);
      ensureNormals(geometry);

      geometry.byteSize += geometryData.indices.byteLength + geometryData.vertices.byteLength + geometryData.normals.byteLength;
      geometry.polyCount = geometry.attributes.index.array.length / 3;

      return geometry;
    }

    return null;
  };

  var svf = this.svf;

  // Get the THREE.BufferGeometry.
  var geometry = commitGeometry(svf);

  svf.geomPolyCount += geometry.polyCount;

  var meshId = 0;
  var fragId = 0;
  var matId = null; // no material info for now.

  this.createInstanceTree(fragId);

  var dbId = 2; // The id of the geometry node in the Instance tree (for this fragment).

  this.model.getGeometryList().addGeometry(geometry, 1 /*numOfInstances*/, meshId);

  var matrix = new THREE.Matrix4();
  var mesh = this.viewer3DImpl.setupMesh(this.model, geometry, matId, matrix);
  mesh.material = this.viewer3DImpl.getMaterials().defaultMaterial;

  svf.fragments.materials[fragId] = matId;
  svf.fragments.fragId2dbId[fragId] = dbId;
  svf.fragments.mesh2frag[meshId] = fragId;

  var bbox = svf.fragments.boxes;
  bbox[0] = svf.min.x;
  bbox[1] = svf.min.y;
  bbox[2] = svf.min.z;
  bbox[3] = svf.max.x;
  bbox[4] = svf.max.y;
  bbox[5] = svf.max.z;

  var trans = svf.fragments.transforms;
  for (var i = 0; i < 12; i++) {
    trans[i] = 0;}
  trans[0] = trans[4] = trans[8] = 1;

  this.model.activateFragment(fragId, mesh, !!svf.placementTransform);

  this.currentLoadPath = null;

  this.viewer3DImpl.api.setModelUnits(MODEL_UNITS);

  if (geometry.hasColors && svf.colors.byteLength) {
    // Turn off the display of simulation data.
    var defMaterial = this.viewer3DImpl.getMaterials().defaultMaterial;
    defMaterial.vertexColors = THREE.NoColors;
    defMaterial.needsUpdate = true;
    this.viewer3DImpl.invalidate(true, true, false); // trigger re-render
  }

  if (!this.options.skipFitToView) {
    this.viewer3DImpl.api.fitToView(null, null, true);
  }

  this.viewer3DImpl.onLoadComplete(this.model);
};

scalarisLoader.prototype.createInstanceTree = function (fragId) {
  var storage = new InstanceTreeStorage(2, 1);

  var rootDbId = 1; // dbId are 1-based.
  var geomDbId = 2;
  var rootChildrenDbIds = [geomDbId];
  var geomChildrenDbIds = [];

  storage.setNode(rootDbId, 0, ROOT_NODE_NAME, 0, rootChildrenDbIds, []);
  storage.setNode(geomDbId, rootDbId, GEOMETRY_NODE_NAME, 0, geomChildrenDbIds, [fragId]);

  var nodeAccess = new InstanceTreeAccess(storage, 0);
  nodeAccess.computeBoxes(this.svf.fragments.boxes);

  this.svf.instanceTree = new InstanceTree(nodeAccess, 1, 1);
};

scalarisLoader.prototype.is3d = function () {
  return true;
};

var ScalarisLoader = scalarisLoader;

avp.ScalarisLoader = ScalarisLoader;

/***/ }),

/***/ "./extensions/Scalaris/index.js":
/*!**************************************!*\
  !*** ./extensions/Scalaris/index.js ***!
  \**************************************/
/*! exports provided: ScalarisLoader, ScalarisExtension */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ScalarisExtension", function() { return ScalarisExtension; });
/* harmony import */ var _ScalarisLoader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ScalarisLoader */ "./extensions/Scalaris/ScalarisLoader.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ScalarisLoader", function() { return _ScalarisLoader__WEBPACK_IMPORTED_MODULE_0__["ScalarisLoader"]; });

function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}



var av = Autodesk.Viewing;
var aveh = AutodeskNamespace('Autodesk.Viewing.Extensions.Scalaris');


/**
                                                                       * Registers a FileLoader to enhance `viewer.loadModel()` to allow loading of Scalaris files.
                                                                       *
                                                                       * The extension id is: `Autodesk.Scalaris`
                                                                       *
                                                                       * @example
                                                                       * // Create Viewer instance and load a Scalaris file
                                                                       * Autodesk.Viewing.Initializer(options, function() {
                                                                       *     var viewer = new Autodesk.Viewing.Viewer3D(div,config3d);
                                                                       *     viewer.start();
                                                                       *     viewer.loadExtension('Autodesk.Scalaris').then(function() {
                                                                       *         viewer.loadModel('path/to/file.scalaris');
                                                                       *     });
                                                                       * });
                                                                       *
                                                                       *
                                                                       * @memberof Autodesk.Viewing.Extensions
                                                                       * @alias Autodesk.Viewing.Extensions.ScalarisExtension
                                                                       * @see {@link Autodesk.Viewing.Extension} for common inherited methods.
                                                                       * @class
                                                                       */var
ScalarisExtension = /*#__PURE__*/function (_av$Extension) {_inherits(ScalarisExtension, _av$Extension);var _super = _createSuper(ScalarisExtension);

  function ScalarisExtension(viewer, options) {_classCallCheck(this, ScalarisExtension);return _super.call(this,
    viewer, options);
  }_createClass(ScalarisExtension, [{ key: "load", value: function load()

    {
      av.FileLoaderManager.registerFileLoader("scalaris", ["scalaris"], _ScalarisLoader__WEBPACK_IMPORTED_MODULE_0__["ScalarisLoader"]);
      return true;
    } }, { key: "unload", value: function unload()

    {
      av.FileLoaderManager.unregisterFileLoader("scalaris");
      return true;
    } }, { key: "activate", value: function activate()

    {return true;} }, { key: "deactivate", value: function deactivate()
    {return false;} }]);return ScalarisExtension;}(av.Extension);


aveh.ScalarisExtension = ScalarisExtension;
aveh.ScalarisLoader = _ScalarisLoader__WEBPACK_IMPORTED_MODULE_0__["ScalarisLoader"];

av.theExtensionManager.registerExtension('Autodesk.Scalaris', ScalarisExtension);



/***/ }),

/***/ "./node_modules/worker-loader/dist/cjs.js?inline!./extensions/Scalaris/ScalarisWorker.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/worker-loader/dist/cjs.js?inline!./extensions/Scalaris/ScalarisWorker.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function() {
};

/***/ }),

/***/ "./node_modules/worker-loader/dist/workers/InlineWorker.js":
/*!*****************************************************************!*\
  !*** ./node_modules/worker-loader/dist/workers/InlineWorker.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// http://stackoverflow.com/questions/10343913/how-to-create-a-web-worker-from-a-string

var URL = window.URL || window.webkitURL;

module.exports = function (content, url) {
  try {
    try {
      var blob;

      try {
        // BlobBuilder = Deprecated, but widely implemented
        var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;

        blob = new BlobBuilder();

        blob.append(content);

        blob = blob.getBlob();
      } catch (e) {
        // The proposed API
        blob = new Blob([content]);
      }

      return new Worker(URL.createObjectURL(blob));
    } catch (e) {
      return new Worker('data:application/javascript,' + encodeURIComponent(content));
    }
  } catch (e) {
    if (!url) {
      throw Error('Inline worker is not supported');
    }

    return new Worker(url);
  }
};

/***/ })

/******/ });
//# sourceMappingURL=Scalaris.js.map