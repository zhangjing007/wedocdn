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

/***/ "./extensions/VisualClusters/AnimController.js":
/*!*****************************************************!*\
  !*** ./extensions/VisualClusters/AnimController.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AnimController)
/* harmony export */ });
/* harmony import */ var _AnimState_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AnimState.js */ "./extensions/VisualClusters/AnimState.js");
function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;} //
// Controls animations between different animation states.
//




// An AnimController contains multiple scene animation states and can smoothly interpolate between those. Each state defines the positions for several objects.
//
// Example: Transition from "original shape positions" to "shapes are grouped by categories".
var AnimController = /*#__PURE__*/function () {

  function AnimController(viewer) {_classCallCheck(this, AnimController);

    // Describes animation state at the current time.
    this.currentState = new _AnimState_js__WEBPACK_IMPORTED_MODULE_0__.SceneAnimState();

    // Different states that we can interpolate between - indexed by stateName.
    this.states = {}; // string => SceneAnimState

    // Animation state at the point when the last animation had started
    this.startState = new _AnimState_js__WEBPACK_IMPORTED_MODULE_0__.SceneAnimState();

    // {Viewer3D}
    this.viewer = viewer;

    // Used to interrupt running in-progress animations
    this.animControl = null;
  }

  // Start animation to a target state.
  //
  // @param {string} [stateName] - A previously registered stateName or null. Null returns to original shape positions.
  //
  // @returns {AnimControl} Control in-progress animation..
  //                          control.stop(): to interrupt it.
  //                          control.isRunning(): to check whether it is in progress.
  _createClass(AnimController, [{ key: "animateTo", value: function animateTo() {var _this = this;var stateName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;var animTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2.0;

      // Make sure that we don't run any previous animation concurrently
      this.stopAnim();

      var endState = this.states[stateName];

      var onTimer = function onTimer(t) {

        // Ensure that motion speed is changed smoothly
        t = Autodesk.Viewing.Private.smootherStep(t);

        _this.currentState.lerp(_this.startState, endState, t);
        _this.currentState.apply(_this.viewer);
      };

      // Freeze current SceneAnimState and keep it as start for interpolation
      this.startState.copyFrom(this.currentState);

      return Autodesk.Viewing.Private.fadeValue(0, 1, animTime, onTimer, function () {return _this.onAnimEnded();});
    }

    // Immediately stop current animation at its current state. No-op if no animation is running
  }, { key: "stopAnim", value: function stopAnim() {
      if (this.animControl && this.animControl.isRunning) {
        this.animControl.stop();
        this.animControl = null;
      }
    }

    // Register new SceneState that we can animate to
  }, { key: "registerState", value: function registerState(stateName, sceneState) {
      this.states[stateName] = sceneState;

      // Make sure that currentState addresses all objects that are modified by the new SceneAnimState.
      this.currentState.createObjectAnimStates(sceneState);
    }

    // Immediately apply a given animation state
  }, { key: "setState", value: function setState(stateName) {
      var state = this.states[stateName];
      if (state) {
        this.currentState.copyFrom(state);
      } else {
        // Recover shape transforms
        this.currentState.resetTransforms();
      }
      this.currentState.apply(this.viewer);
    } }, { key: "onAnimEnded", value: function onAnimEnded()

    {
      //this should trigger ANIM_ENDED event
      this.viewer.dispatchEvent({ type: Autodesk.Viewing.ANIM_ENDED });
    }

    // Ensures that no animation is active and all anim transform is being cleared for all fragments that we modified before.
  }, { key: "reset", value: function reset() {
      this.stopAnim();
      this.currentState.resetTransforms();
      this.currentState.apply(this.viewer);

      // Drop all states to free some memory
      this.currentState = new _AnimState_js__WEBPACK_IMPORTED_MODULE_0__.SceneAnimState();
      this.states = {};
      this.startState = new _AnimState_js__WEBPACK_IMPORTED_MODULE_0__.SceneAnimState();
    } }]);return AnimController;}();
;

/***/ }),

/***/ "./extensions/VisualClusters/AnimState.js":
/*!************************************************!*\
  !*** ./extensions/VisualClusters/AnimState.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ObjectAnimState": () => (/* binding */ ObjectAnimState),
/* harmony export */   "ModelAnimState": () => (/* binding */ ModelAnimState),
/* harmony export */   "SceneAnimState": () => (/* binding */ SceneAnimState)
/* harmony export */ });
function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;} // Contains classes to control the animation state of animation for objects of one or more models.

var tmpMatrix = new THREE.Matrix4();
var tmpVec1 = new THREE.Vector3();

// Get translation offset that is needed to make the given
// point center of the rotation.
//  @param {Quaternion} rotation
//  @param {Vector3}    center
//  @param {Vecotr3}    [optionalTarget]
//  @returns {THREE.Vector3}
var getRotationOffset = function getRotationOffset(rotation, center, optionalTarget) {

  var result = optionalTarget || new THREE.Vector3();

  // get rotation as matrix
  var rotMatrix = tmpMatrix.makeRotationFromQuaternion(rotation);

  // Compute where center would be moved when just applying rotation alone
  var p = center.clone().applyMatrix4(rotMatrix);

  // Return correction offset to bring center back at its original position
  return result.copy(center).sub(p);
};

// Describes an animation transform to be applied to single object. 
// Note that placement is relative to original position, i.e., identity means shape appears at original position.
var ObjectAnimState = /*#__PURE__*/function () {

  function ObjectAnimState(dbId) {_classCallCheck(this, ObjectAnimState);

    // id of the object being animated
    this.dbId = dbId;

    // translation
    this.move = new THREE.Vector3(0, 0, 0);

    // scale
    this.scale = new THREE.Vector3(1, 1, 1);

    // rotation (as Quaternion)
    //
    // Note: Note that fragment animTransforms always rotate around the world origin, 
    //       because the original matrix is applied first.
    this.rot = new THREE.Quaternion();

    // By default, fragment rotations in LMV rotate around the world-origin.
    this.rotCenter = new THREE.Vector3(0, 0, 0);
  }_createClass(ObjectAnimState, [{ key: "apply", value: function apply(

    model) {var _this = this;

      var fragList = model.getFragmentList();
      var it = model.getInstanceTree();

      // Apply additional correction offset when rotating around a center != origin.
      // Note that rotations set by updateAnimTransform always rotate around world origin.
      var move = getRotationOffset(this.rot, this.rotCenter, tmpVec1).add(this.move);

      // Update fragment animation transforms
      it.enumNodeFragments(this.dbId, function (fragId) {
        fragList.updateAnimTransform(fragId, _this.scale, _this.rot, move);
      });
    }

    // Set this placement by interpolating between a start and end placement
    //  @param {ItemPlacement} start, end - If null, we assume identity transform.
    //  @param {number}        t          - interpolation param in [0,1]
  }, { key: "lerp", value: function lerp(start, end, t) {

      // use identiy transform if start or end is missing
      start = start || ObjectAnimState.Identity;
      end = end || ObjectAnimState.Identity;

      // Interpolate move/scale/rotation
      this.move.lerpVectors(start.move, end.move, t);
      this.scale.lerpVectors(start.scale, end.scale, t);
      this.rotCenter.lerpVectors(start.rotCenter, end.rotCenter, t);
      THREE.Quaternion.slerp(start.rot, end.rot, this.rot, t);
    } }, { key: "copyFrom", value: function copyFrom(

    src) {
      this.dbId = src.dbId;
      this.move.copy(src.move);
      this.scale.copy(src.scale);
      this.rot.copy(src.rot);
      this.rotCenter.copy(src.rotCenter);
    } }, { key: "resetTransform", value: function resetTransform()

    {
      this.move.set(0, 0, 0);
      this.scale.set(1, 1, 1);
      this.rot.set(0, 0, 0, 1); // = identity Quaternion
      this.rotCenter.set(0, 0, 0);
    }

    // Set rotation center. 
    // @param {Vector3} center
    // @param {bool}    ajdustMove - If true, the move vector is changed so that the effect of the AnimState keeps the same.
  }, { key: "setRotationCenter", value: function setRotationCenter(newCenter, adjustMove) {

      // Adjust translation offset to keep position
      if (adjustMove) {

        // Compute the shift that the shape position would do without move adjustment.
        // This could be optimized by avoiding double-computation of the rotation matrix.
        var oldOffset = getRotationOffset(this.rot, this.rotCenter);
        var newOffset = getRotationOffset(this.rot, newCenter);

        // Modify translation to eliminate the position shift
        this.move.add(oldOffset).sub(newOffset);
      }

      // Change rotationCenter
      this.rotCenter.copy(newCenter);
    } }]);return ObjectAnimState;}();


// Represents the original state of an object when no anim transform is applied.
ObjectAnimState.Identity = new ObjectAnimState(-1);

// Describes animation transforms for a set of objects within the same RenderModel
var ModelAnimState = /*#__PURE__*/function () {

  function ModelAnimState(model) {_classCallCheck(this, ModelAnimState);

    this.model = model;

    // Indexed by dbId.
    this.animStates = []; // ObjectAnimState[]
  }_createClass(ModelAnimState, [{ key: "apply", value: function apply()

    {
      for (var dbId in this.animStates) {
        this.animStates[dbId].apply(this.model);
      }

      // Make sure that hierarchical bboxes are updated
      this.model.visibleBoundsDirty = true;
    }

    // Finds or creates an animState for the given dbId.
    //  @param {number}          dbId
    //  @param {ObjectAnimState} animState
  }, { key: "setAnimState", value: function setAnimState(dbId, animState) {
      this.animStates[dbId] = animState;
    } }, { key: "getAnimState", value: function getAnimState(

    dbId) {var createIfMissing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var animState = this.animStates[dbId];

      // Create new one if needed
      if (!animState && createIfMissing) {
        animState = new ObjectAnimState(dbId);
        this.setAnimState(dbId, animState);
      }

      return animState;
    }

    // Adds new ObjectAnimStates for all dbIds in srcState.
    //
    // This is important if you use this to interpolate between other ModelStates and want to make sure that this ModelState
    // affects all dbIds that are affected either by startState or endState.
    //
    // @param {ModelAnimState} srcState
  }, { key: "createObjctAnimStates", value: function createObjctAnimStates(srcState) {
      for (var key in srcState.animStates) {

        // Note that key is the dbId as string. 
        // => Use the integer variant from srcState instead.
        var dbId = srcState.animStates[key].dbId;

        // Make sure that we have an ObjectAnimState for this dbId
        this.getAnimState(dbId, true);
      }
    }

    // Prepares this ModelState to interpolate between two others:
    // For this, we make sure that this ModelState affects all dbIds that are modified by either start or end.
  }, { key: "prepareLerp", value: function prepareLerp(start, end) {
      this.createObjectAnimStates(start);
      this.createObjectAnimStates(end);
    }

    // Updates all ObjectAnimStates by interpolating between a start and end anim state.
    //
    // Note: This only affects the existing ObjectAnimStates within this ModelAnimState.
    //       It does NOT create new AnimStates. See prepareLerp()
    // 
    //  @param {ModelAnimState} start, end - may be null (= original state)
    //  @param {number}         t          - interpolation param in [0,1]
  }, { key: "lerp", value: function lerp(start, end, t) {
      for (var dbId in this.animStates) {
        var objStart = start && start.animStates[dbId];
        var objEnd = end && end.animStates[dbId];
        this.animStates[dbId].lerp(objStart, objEnd, t);
      }
    } }, { key: "copyFrom", value: function copyFrom(

    src) {

      this.model = src.model;

      // Make sure that we set the same ObjectAnimStates as src.
      // Avoid re-allocations if possible.
      for (var dbId in src.animStates) {
        // get or create state
        var srcObj = src.animStates[dbId];
        var dstObj = this.getAnimState(dbId, true);
        dstObj.copyFrom(srcObj);
      }

      // Clean all object animStates that src doesn't have
      for (var _dbId in this.animStates) {
        if (!src.animStates[_dbId]) {
          delete this.animStates[_dbId];
        }
      }
    }

    // Reset anim transforms for all fragments that were modified by this state
  }, { key: "resetTransforms", value: function resetTransforms() {
      for (var dbId in this.animStates) {
        this.animStates[dbId].resetTransform();
      }
    } }]);return ModelAnimState;}();


// Describes animations for several objects within a scene composed from multiple models.
var SceneAnimState = /*#__PURE__*/function () {

  function SceneAnimState(models) {var _this2 = this;_classCallCheck(this, SceneAnimState);

    // ModelAnimState[] - indexed by modelId
    this.animStates = [];

    // Create a model placement for each model, indexed by modelId
    models && models.forEach(function (m) {return _this2.animStates[m.id] = new ModelAnimState(m);});
  }_createClass(SceneAnimState, [{ key: "apply", value: function apply(

    viewer) {
      // Apply all model anim states
      for (var modelId in this.animStates) {
        this.animStates[modelId].apply();
      }

      // Force re-render
      viewer.impl.invalidate(true, true, true);
    }

    // Set animation state for a single object
    // Note that modelId must be the id of one of the models used for construction
  }, { key: "setAnimState", value: function setAnimState(modelId, dbId, animState) {
      this.animStates[modelId].setAnimState(dbId, animState);
    }

    // Adds new ObjectAnimStates for all dbIds in srcState.
    // see ModelAnimState.createObjectAnimStates for details.
    //
    // @param {ModelAnimState} srcState
  }, { key: "createObjectAnimStates", value: function createObjectAnimStates(srcState) {
      for (var modelId in srcState.animStates) {
        // get src ModelAnimState
        var src = srcState.animStates[modelId];

        // Get or create target ModelState for this model
        var dst = this.animStates[modelId];
        if (!dst) {
          dst = new ModelAnimState(src.model);
          this.animStates[modelId] = dst;
        }

        // Make sure that this ModelState operates on the same dbIds as src
        dst.createObjctAnimStates(src);
      }
    }

    // Prepares this SceneAnimState to interpolate between two others:
    // For this, we make sure that this SceneAnimState affects all dbIds that are modified by either start or end.
    //  @param {SceneAnimState} start, end
  }, { key: "prepareLerp", value: function prepareLerp(start, end) {
      this.createObjctAnimStates(start);
      this.createObjctAnimStates(end);
    }

    // Set this placement by interpolating between a start and end placement
    // Note:
    //  - All placements must refer to the same list of models
    //  - For each model, all placements must enlist the same dbIds
    // 
    //  @param {ScenePlacement} start, end
    //  @param {number}         t          - interpolation param in [0,1]
  }, { key: "lerp", value: function lerp(start, end, t) {
      for (var modelId in this.animStates) {
        var modelStart = start && start.animStates[modelId];
        var modelEnd = end && end.animStates[modelId];
        this.animStates[modelId].lerp(modelStart, modelEnd, t);
      }
    }

    // Makes this SceneState equal to the src state.
  }, { key: "copyFrom", value: function copyFrom(srcState) {

      for (var modelId in srcState.animStates) {
        var src = srcState.animStates[modelId];
        var dst = this.animStates[modelId];

        // In case we don't have a ModelState for this model, create one
        if (!dst) {
          dst = new ModelAnimState(src.model);
          this.animStates[modelId] = dst;
        }

        dst.copyFrom(src);
      }

      // Erase any modelState that src doesn't have
      for (var _modelId in this.animStates) {
        if (!srcState.animStates[_modelId]) {
          delete this.animStates[_modelId];
        }
      }
    }

    // Reset anim transforms for all fragments that were modified by this state
  }, { key: "resetTransforms", value: function resetTransforms() {
      for (var modelId in this.animStates) {
        this.animStates[modelId].resetTransforms();
      }
    } }]);return SceneAnimState;}();

/***/ }),

/***/ "./extensions/VisualClusters/Cluster.js":
/*!**********************************************!*\
  !*** ./extensions/VisualClusters/Cluster.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "buildClustersFromAttribute": () => (/* binding */ buildClustersFromAttribute),
/* harmony export */   "Cluster": () => (/* binding */ Cluster),
/* harmony export */   "createShapeId": () => (/* binding */ createShapeId),
/* harmony export */   "hasVisibleFragments": () => (/* binding */ hasVisibleFragments)
/* harmony export */ });
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}
// A ShapeID references a single object within a multi-models scene. 
var createShapeId = function createShapeId(modelId, dbId) {
  return {
    modelId: modelId,
    dbId: dbId };

};

// A Cluster is a group of objects that is supposed to be positions close to each other.
var Cluster =

function Cluster(name) {_classCallCheck(this, Cluster);

  // string
  this.name = name;

  // ShapeID[]
  this.shapeIds = [];
};


// Checks if all fragments of a given dbId are hidden. If so, we exclude it from layout algorithm, because it would just produce empty space.
var hasVisibleFragments = function hasVisibleFragments(model, dbId) {

  var it = model.getInstanceTree();
  var fragList = model.getFragmentList();
  var visFlags = model.myData.fragments.visibilityFlags;

  // Update fragment animation transforms
  var allHidden = true;
  it.enumNodeFragments(dbId, function (fragId) {

    // For OTG models, the visFlags tell us which fragments have been skipped by OtgLoader. This applies for Revit Room geometry.
    // For Svf, these flags may not exist, because they are deleted after loading. However, SvfLoader then sets the corresponding fragments to invisible.
    var skipped = visFlags && visFlags[fragId] === Autodesk.Viewing.Private.MeshFlags.MESH_NOTLOADED;
    var hidden = !fragList.isFragVisible(fragId);

    if (!skipped && !hidden) {
      // We found a visible fragment
      allHidden = false;

      // No need to continue traversal
      return true;
    }
  });
  return !allHidden;
};

// Remove duplicates from array
//  @param {[]} a
//  @returns {[]} Deduplicated copy.
var uniq = function uniq(a) {
  return Array.from(new Set(a));
};

// Creates a set of clusters based on the values of a certain propertyDB attribute.
// Note that you have to wait for an async propDB call to finish.
//
// By default, we only categorize leaf objects. This requires that all leaf objects contain the attribute to search for.
// The searchParents option enables to allow parent nodes as well:
//      i.e. we search all levels of the model tree and consider inner nodes as a single object if they contain
//           the search attribute.
//
//  @param {Model[]}   models
//  @param {string}    attribName
//  @param {boolean}   searchParents
//  @returns {Promise} When done, it resolves to a {Cluster[]}, where each element is...
//                       - named by an attribute value 
//                       - containing all ShapeIds that match that value
var buildClustersFromAttribute = /*#__PURE__*/function () {var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(models) {var attribName,searchAncestors,clustersByName,promises,_loop,i,clusters,_args = arguments;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:attribName = _args.length > 1 && _args[1] !== undefined ? _args[1] : 'Category';searchAncestors = _args.length > 2 && _args[2] !== undefined ? _args[2] : false;

            // Collects result
            clustersByName = {};

            // For each model, we run an async propDB worker query
            promises = [];_loop = function _loop(

            i) {

              var model = models[i];
              var tree = model.getData().instanceTree;
              var dbIds = void 0;

              if (searchAncestors) {
                // Use all the dbIds in the model
                var ids = Object.keys(tree.nodeAccess.dbIdToIndex);
                dbIds = ids.map(function (item) {return parseInt(item, 10);});
              } else {
                // get all dbIds with visual representation
                dbIds = model.myData.fragments.fragId2dbId;

                // Exclude all dbIds that only contain hidden fragments (like room geometries)
                dbIds = dbIds.filter(function (dbId) {return hasVisibleFragments(model, dbId);});

                // Remove duplicates. Note that this is necessary, because dbIds with multiple fragments will
                // occur several times in fragId2dbId.
                dbIds = uniq(dbIds);
              }

              var options = {
                ignoreHidden: false,
                propFilter: [attribName] };


              promises.push(new Promise(function (resolve, reject) {

                // Process dbIds. result is an array of item,
                // each containing the props for a single dbId
                var onDone = function onDone(result) {var _loop2 = function _loop2(
                  _i) {

                    // item contains props of a single db object
                    var item = result[_i];

                    // get category of this db item  
                    var category = item.properties[0].displayValue;

                    // get or create cluster for this category
                    var cluster = clustersByName[category];
                    if (!cluster) {
                      cluster = new Cluster(category);
                      clustersByName[category] = cluster;
                    }

                    if (searchAncestors) {
                      // Append IDs of visible children
                      tree.enumNodeChildren(item.dbId, function (child) {
                        if (hasVisibleFragments(model, child)) {
                          cluster.shapeIds.push(createShapeId(model.id, child));
                        }
                      }, true);
                    } else {
                      // Append current dbId to this cluster
                      cluster.shapeIds.push(createShapeId(model.id, item.dbId));
                    }};for (var _i = 0; _i < result.length; _i++) {_loop2(_i);
                  }
                  resolve();
                };

                model.getBulkProperties2(dbIds, options, onDone);
              }));};for (i = 0; i < models.length; i++) {_loop(i);
            }_context.next = 8;return (

              Promise.all(promises));case 8:

            // Flatten to an array
            clusters = Object.values(clustersByName);return _context.abrupt("return",

            clusters);case 10:case "end":return _context.stop();}}}, _callee);}));return function buildClustersFromAttribute(_x) {return _ref.apply(this, arguments);};}();




/***/ }),

/***/ "./extensions/VisualClusters/ClusterGizmo.js":
/*!***************************************************!*\
  !*** ./extensions/VisualClusters/ClusterGizmo.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ClusterGizmo": () => (/* binding */ ClusterGizmo),
/* harmony export */   "ClusterGizmoController": () => (/* binding */ ClusterGizmoController)
/* harmony export */ });
function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}
// Disable packed normals for now, because it sometimes causes wrong values in the normal-depth-buffer (not clear why).
// The number of cluster boxes is small anyway, so using unpacked is okay here.
var UsePackedNormals = false;

var avp = Autodesk.Viewing.Private;

// Creates a quad with xy in [-0.5, 0.5] and z=0. Normal is +z
var createUnitQuadGeom = function createUnitQuadGeom() {

  var l = -0.5;
  var h = +0.5;

  // vertex positions (3-floats per vertex)
  var positions = Float32Array.from([
  l, l, 0,
  l, h, 0,
  h, l, 0,
  h, h, 0]);


  // index buffer for triangles
  var indices = Uint16Array.from([0, 3, 1, 0, 2, 3]);

  // index buffer for edges
  var iblines = Uint16Array.from([0, 1, 1, 3, 3, 2, 2, 0]);

  // create interleaved vertex buffer
  var vertexCount = 4;
  var vbstride = UsePackedNormals ? 4 : 6; // float32 values per vertex
  var vb = new Float32Array(vertexCount * vbstride);

  // write positions to interleaved buffer
  for (var i = 0; i < vertexCount; i++) {
    var srcOffset = 3 * i;
    var dstOffset = vbstride * i;
    vb[dstOffset] = positions[srcOffset];
    vb[dstOffset + 1] = positions[srcOffset + 1];
    vb[dstOffset + 2] = positions[srcOffset + 2];
  }

  if (UsePackedNormals) {
    // encode (0,0,1) as packed Uint16 normal
    var toUint16 = 0xFFFF; // for upscaling from [0,1]-floats to Uint16-scale
    var nx = 0.5 * toUint16;
    var ny = 1.0 * toUint16;

    // The first 3 floats per vertex are used by positions. 
    // Counting in Uint16 values, this makes 6.
    var normalOffset = 6;

    // write normals to interleaved buffer
    var vbUint16 = new Uint16Array(vb.buffer);
    var vbUint16Stride = vbstride * 2; // 2 Uint16 per float32
    for (var _i = 0; _i < vertexCount; _i++) {
      var _dstOffset = vbUint16Stride * _i + normalOffset;
      vbUint16[_dstOffset] = nx;
      vbUint16[_dstOffset + 1] = ny;
    }
  } else {
    var _normalOffset = 3;

    // write normals to interleaved buffer
    for (var _i2 = 0; _i2 < vertexCount; _i2++) {
      var _dstOffset2 = vbstride * _i2 + _normalOffset;
      vb[_dstOffset2] = 0;
      vb[_dstOffset2 + 1] = 0;
      vb[_dstOffset2 + 2] = 1;
    }
  }

  // create result geometry
  var geom = new THREE.BufferGeometry();
  geom.vbstride = vbstride;
  geom.vb = vb;
  geom.ib = indices;
  geom.iblines = iblines;

  // position attribute
  var attrPos = new THREE.BufferAttribute(undefined, 3);
  attrPos.itemOffset = 0;
  geom.attributes.position = attrPos;

  // normal attribute
  var attrNormal = new THREE.BufferAttribute(undefined, 3);
  attrNormal.itemOffset = 3;
  attrNormal.bytesPerItem = UsePackedNormals ? 2 : 6;
  attrNormal.normalized = true;
  geom.attributes.normal = attrNormal;

  // index attribute
  var attrIndex = new THREE.BufferAttribute(undefined, 1);
  attrIndex.bytesPerItem = 2;
  geom.index = attrIndex;

  // add attribute for edge rendering
  var attrIndexLines = new THREE.BufferAttribute(undefined, 1);
  attrIndexLines.bytesPerItem = 2;
  geom.setAttribute('indexlines', attrIndexLines);

  // attribute keys
  geom.attributesKeys = Object.keys(geom.attributes);

  return geom;
};

// Creates a quad mesh that corresponds to the z-Min face of the given bbox
//  @param {Box3}            bbox
//  @param {BufferGeometry}  unitQuadGeom
//  @param {Material}        matman       - must be registered at materialManager and use packedNormals
var createGizmoMesh = function createGizmoMesh(bbox, material) {

  // In theory, we could share a static one here. However, this would introduce subtle detail problems
  // when using multiple viewer instances, because WebGLRenderer attaches gl-context-specific resources.
  // The number of gizmo boxes is not big anyway, so what.
  var geom = createUnitQuadGeom();

  // create mesh
  var boxMesh = new THREE.Mesh(geom, material);

  // move mesh origin to center of bbox z-min face
  bbox.getCenter(boxMesh.position);
  bbox.size(boxMesh.scale);
  boxMesh.position.z = bbox.min.z;

  // Attach mesh bbox
  boxMesh.boundingBox = bbox.clone();
  boxMesh.boundingBox.max.z = bbox.min.z; // The mesh only spans the z-min surface of bbox

  return boxMesh;
};

// @param {MaterialManager} matman - needed to register the material
var createGizmoMaterial = function createGizmoMaterial(matman) {

  // create material
  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff, // white
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide,

    // Disable z-buffer: It doesn't work with fading and the quads are below all the shapes anyway.
    depthTest: false,
    depthWrite: false });


  // Note: This is must be set separately, because it's a custom-lmv property and not supported by the material ctor
  material.packedNormals = UsePackedNormals;

  // Register at MaterialManager
  material.name = 'ClusterGizmoMaterial_' + material.id;
  matman.addHDRMaterial(material.name, material);

  return material;
};

var disposeGizmoMesh = function disposeGizmoMesh(mesh, matman) {
  mesh.geometry.dispose();
  mesh.material.dispose();
  matman.removeMaterial(mesh.material.name);
};

// A ClusterGizmo is a quad below an object cluster that helps to distinguish different clusters.
var ClusterGizmo = /*#__PURE__*/function () {

  // @param {Box3}   clusterBox - bbox of the cluster
  // @param {string} [meshName] - Attached to the mesh to simplify debugging
  function ClusterGizmo(viewer, clusterBox, meshName) {var _this = this;_classCallCheck(this, ClusterGizmo);

    this.viewer = viewer;

    // create mesh
    var material = createGizmoMaterial(viewer.impl.matman());
    this.mesh = createGizmoMesh(clusterBox, material);

    this.mesh.name = meshName;

    // add it to viewer scene
    this.viewer.impl.scene.add(this.mesh);

    // For smooth fadeIn/Out
    var setOpacity = function setOpacity(t) {
      // Fade-in quad
      _this.mesh.material.opacity = t;

      // Fade-in outline: Edges should have 0.5 opacity when fully faded in
      _this.mesh.material.edgeOpacity = 0.5 * t;

      _this.viewer.impl.invalidate(true, true);
    };
    this.opacityParam = new avp.AnimatedParam(0.0, setOpacity, 1.0);

    // Initial fade-in
    this.opacityParam.fadeTo(1);
  }_createClass(ClusterGizmo, [{ key: "dtor", value: function dtor()

    {
      // remove from viewer scene
      this.viewer.impl.scene.remove(this.mesh);
      this.viewer.impl.invalidate(true, true);

      // dispose gpu resources
      disposeGizmoMesh(this.mesh, this.viewer.impl.matman());

      this.mesh = null;
      this.viewer = null;
    }

    // Fade out and dispose mesh when done
  }, { key: "dispose", value: function dispose() {var _this2 = this;
      this.opacityParam.fadeTo(0.0, function () {return _this2.dtor();});
    } }]);return ClusterGizmo;}();


// ClusterGizmoController takes care that ClusterGizmos and corresponding labels are created/disposed according to the currently shown layout.
var ClusterGizmoController = /*#__PURE__*/function () {

  function ClusterGizmoController(viewer) {_classCallCheck(this, ClusterGizmoController);

    this.viewer = viewer;

    this.gizmos = []; // ClusterGizmo[]
    this.labels = []; // Label3D[]

    // We delay fade-in, so that gizmos/labels appear shortly before the cluster animation ends
    this.fadeInDelay = 1.8; // in seconds
    this.timerId = null;
  }_createClass(ClusterGizmoController, [{ key: "createGizmos", value: function createGizmos(

    sceneLayout) {var _this3 = this;

      // For each cluster...
      var layouts = sceneLayout.clusterLayouts;var _loop = function _loop(
      i) {
        var layout = layouts[i];

        // create quad gizmo
        var bbox = layout.getBBox();
        var gizmo = new ClusterGizmo(_this3.viewer, bbox, layout.cluster.name);
        _this3.gizmos.push(gizmo);

        // get label position (center of the bbox zMin-face)
        var labelPos = bbox.getCenter(new THREE.Vector3());
        labelPos.z = bbox.min.z;

        // create label
        var text = _this3.getLabelText(layout);
        var label = new Autodesk.Edit3D.Label3D(_this3.viewer, labelPos, text);
        _this3.labels.push(label);

        // Hide label if ClusterGizmo size on screen is below MinPixels threshold.
        //
        // Note: We could use the screen-size of the label text. However, this looks confusing
        //       if some cluster labels are shown and others are not (due to longer text that you don't see).
        //       So, it looks more consistent to use a fixed minPixelSize for all clusters.
        //       For super-long cluster names, we will introduce abbreviations instead.
        var MinPixels = 75;
        label.setWorldBox(gizmo.mesh.boundingBox, MinPixels);

        // When clicking a label, fly to the cluster
        var flyToCluster = function flyToCluster(e) {
          var camera = _this3.viewer.impl.camera;

          // get cluster-platform center and box size
          var gizmoBox = gizmo.mesh.boundingBox;
          var p = gizmoBox.getCenter(new THREE.Vector3());
          var size = gizmoBox.getSize(new THREE.Vector3());

          // Setup view diagonally to look at p
          var dstView = camera.clone();
          dstView.target.copy(p);

          // get current distance from target point
          var curDistance = camera.position.distanceTo(p);

          // Place the camera on the line between target and start camera position.
          // Choose distance close enough to the cluster to clearly focus it.
          var dist = Math.max(size.x, size.y, size.z);
          dist = Math.min(dist, curDistance); // if already close, never move away from target
          var dir = camera.position.clone().sub(p).normalize();
          dstView.position.set(
          p.x + dir.x * dist,
          p.y + dir.y * dist,
          p.z + dir.z * dist);


          // trigger animation
          avp.flyToView(_this3.viewer, dstView, 1.5);

          // Mark click as consumed, so that it doesn't trigger selection of objects behind the label.
          e.stopPropagation();
        };
        label.container.style.pointerEvents = 'auto';
        label.container.addEventListener('click', flyToCluster);};for (var i = 0; i < layouts.length; i++) {_loop(i);
      }
    } }, { key: "getLabelText", value: function getLabelText(

    layout) {
      var text = layout.cluster.name;

      // Remove "Revit " prefix
      // For now, we hard-wire this, but this function will be customizable by clients later.
      var prefix = 'Revit ';
      if (text.startsWith(prefix)) {
        text = text.substring(prefix.length);
      }

      return text;
    } }, { key: "disposeGizmos", value: function disposeGizmos()

    {
      this.gizmos.forEach(function (g) {return g.dispose();});
      this.labels.forEach(function (l) {return l.dispose();});
      this.gizmos.length = 0;
      this.labels.length = 0;
    }

    // If a delayed fade-in of gizmos is pending for prior layout, cancel it
  }, { key: "cancelTimer", value: function cancelTimer() {
      if (this.timerId) {
        window.clearTimeout(this.timerId);
        this.timerId = null;
      }
    } }, { key: "onLayoutChanged", value: function onLayoutChanged(

    sceneLayout) {var _this4 = this;

      // Make sure that there is no concurrent delayed fade-in of a prior layout
      this.cancelTimer();

      // Fade-out and dispose any outdated gizmos
      this.disposeGizmos();

      // Fade-in new gizmos after some delay
      if (sceneLayout) {
        this.timerId = window.setTimeout(
        function () {return _this4.createGizmos(sceneLayout);},
        this.fadeInDelay * 1000);

      }
    }

    // Dispose all resources immediately
  }, { key: "reset", value: function reset() {
      this.gizmos.forEach(function (g) {return g.dtor();});
      this.labels.forEach(function (l) {return l.dtor();});
      this.gizmos.length = 0;
      this.labels.length = 0;
    } }]);return ClusterGizmoController;}();

/***/ }),

/***/ "./extensions/VisualClusters/ClusterLayout.js":
/*!****************************************************!*\
  !*** ./extensions/VisualClusters/ClusterLayout.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ShapeBoxes": () => (/* reexport safe */ _ShapeBoxes_js__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   "ClusterRowLayout": () => (/* binding */ ClusterRowLayout),
/* harmony export */   "ClusterSetLayout": () => (/* binding */ ClusterSetLayout)
/* harmony export */ });
/* harmony import */ var _AnimState_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AnimState.js */ "./extensions/VisualClusters/AnimState.js");
/* harmony import */ var _ShapeBoxes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ShapeBoxes.js */ "./extensions/VisualClusters/ShapeBoxes.js");
function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}



var tmpBox = new THREE.Box3();

// Rotate an item by 90 degrees to make sure that width >= height. 
// This is done in a way that the box minPoint keeps the same.
// 
// Note: Rotations using animTransform rotate around the world origin
//
// @param {THREE.Box3}      box - Original worldBox of a shape (without any animTransform applied)
// @param {ObjectAnimState} dst - animState on which we set the rotation
var applyAlignmentTransform = function applyAlignmentTransform(box, dst) {

  // rotate by 90 degrees
  var angle = 90;
  var axis = new THREE.Vector3(0, 0, 1);
  dst.rot.setFromAxisAngle(axis, THREE.Math.degToRad(angle));

  // Rotations work around the world origin.
  // Now, we modify the move vector to make sure that the bbox keeps the same

  // get rotation as matrix
  var rotTf = new THREE.Matrix4().makeRotationFromQuaternion(dst.rot);

  // get box after rotation
  var box2 = tmpBox.copy(box).applyMatrix4(rotTf);

  // modify move vector to obtain the same box minPoint as before rotation
  // Note that box2.min is not simply the same as we would get when rotating the point box.min. 
  dst.move.sub(box2.min).add(box.min);
};

// A ClusterRowLayout defines how to line up a group of objects along one or more rows.
var ClusterRowLayout = /*#__PURE__*/function () {

  function ClusterRowLayout(cluster) {_classCallCheck(this, ClusterRowLayout);

    // MinPoint of the whole cluster.
    this.position = new THREE.Vector3(0, 0, 0);

    // {Cluster} - The cluster defining the object that this layout refers to
    this.cluster = cluster;

    // For each dbId cluster.shapeIds[i], positions[i] defines the corresponding position.
    // Each object is anchored at the bbox minPoint.
    this.positions = []; // Vector3[]

    // If rotated[i] is true, the shape with id clusterShapeIds[i] will be rotated by 90 degree around z, 
    // so that x/y are swapped - while preserving the bbox minPoint.
    this.rotated = []; // bool[]

    // Spatial extent of this cluster.
    this.size = new THREE.Vector3(0, 0, 0);
  }_createClass(ClusterRowLayout, [{ key: "getBBox", value: function getBBox(

    optionalTarget) {
      var target = optionalTarget || new THREE.Box3();
      target.min.copy(this.position);
      target.max.copy(this.position).add(this.size);
      return target;
    }

    // Modifies the given scene anim state so that all objects in the cluster are properly placed and rotated.
    //
    //  @param {SceneAnimState} sceneAnimState - SceneAnimState to be modified.
    //  @param {Vector3}        offset         - Additional translation offset applied to all objects
    //  @param {ShapeBoxes}     shapeBoxes     - access to shape bboxes
    //  @param {RotationAlignment} [rotationAlignment] - Optional: Defines rotations that are applied per shape.
  }, { key: "apply", value: function apply(sceneAnimState, offset, shapeBoxes, rotationAlignment) {

      // reused tmp-vector
      var targetPos = new THREE.Vector3();

      // Reused below
      var tmpBox = new THREE.Box3();
      var tmpVec = new THREE.Vector3();

      for (var i = 0; i < this.cluster.shapeIds.length; i++) {

        // get shapeId
        var shapeId = this.cluster.shapeIds[i];

        // init itemPlacement for this shape
        var animState = new _AnimState_js__WEBPACK_IMPORTED_MODULE_0__.ObjectAnimState(shapeId.dbId);

        // get final position of this shape: 
        targetPos.copy(this.positions[i]) // position of the shape within the cluster
        .add(this.position) // position of this cluster within the cluster set
        .add(offset); // cluster set position

        // get original shape minPoint
        var originalBox = shapeBoxes.getShapeBox(shapeId, tmpBox);
        var originalPos = originalBox.min;

        // Set move-vector so that originalPos is moved to targePos
        animState.move.subVectors(targetPos, originalPos);

        if (rotationAlignment) {
          // Apply rotation
          rotationAlignment.getShapeRotation(shapeId, animState.rot);

          // Set original shape box center as rotation anchor
          var shapeBox = shapeBoxes.getUnrotatedShapeBox(shapeId, tmpBox);
          var center = shapeBox.getCenter(tmpVec);
          animState.setRotationCenter(center, true);
        }

        // If needed, apply rotation while keeping bbox.min the same.
        // Note: When using RotationAlignments, the auto-flip is not needed anymore.
        //       So, this code path will be removed as soon as the new variant is sufficiently tested.
        var needsRotate = this.rotated[i];
        if (needsRotate) {

          // get shape bbox
          originalBox = shapeBoxes.getShapeBox(shapeId, originalBox);

          // apply rotation
          applyAlignmentTransform(originalBox, animState);
        }

        // Add object anim state to scene anim state
        sceneAnimState.setAnimState(shapeId.modelId, shapeId.dbId, animState);
      }
    } }]);return ClusterRowLayout;}();


// Defines the placement for a set of object clusters
var ClusterSetLayout = /*#__PURE__*/function () {

  // @param {ClusterLayout}     layouts
  // @param {RotationAlignment} [rotationAlignment] - only needed if shapes are rotated for alignment.
  function ClusterSetLayout(layouts, rotationAlignment) {_classCallCheck(this, ClusterSetLayout);

    // ClusterSet position. ClusterSets are anchored at the minPoint
    this.position = new THREE.Vector3(0, 0, 0);

    // {ClusterLayout[]}
    this.clusterLayouts = layouts || [];

    // {RotationAlignment}
    this.rotationAlignment = rotationAlignment;
  }

  // Modifies the given scene anim state so that all objects in all cluster are properly placed and rotated.
  //
  //  @param {SceneAnimState} sceneAnimState - SceneAnimState to be modified.
  //  @param {ShapeBoxes}     shapeBoxes     - access to shape bboxes
  _createClass(ClusterSetLayout, [{ key: "apply", value: function apply(sceneAnimState, shapeBoxes) {var _this = this;
      this.clusterLayouts.forEach(function (l) {return l.apply(sceneAnimState, _this.position, shapeBoxes, _this.rotationAlignment);});
    }

    // Creates a SceneAnimState that brings all shapes to their target positions
  }, { key: "createSceneState", value: function createSceneState(models) {
      var shapeBoxes = new _ShapeBoxes_js__WEBPACK_IMPORTED_MODULE_1__["default"](models, this.rotationAlignment);
      var state = new _AnimState_js__WEBPACK_IMPORTED_MODULE_0__.SceneAnimState(models);
      this.apply(state, shapeBoxes);
      return state;
    } }]);return ClusterSetLayout;}();




/***/ }),

/***/ "./extensions/VisualClusters/RotationAlignment.js":
/*!********************************************************!*\
  !*** ./extensions/VisualClusters/RotationAlignment.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getBoxCorner": () => (/* binding */ getBoxCorner),
/* harmony export */   "getAngleToXAxis": () => (/* binding */ getAngleToXAxis),
/* harmony export */   "collectFragBoxAxes": () => (/* binding */ collectFragBoxAxes),
/* harmony export */   "findAlignmentRotation": () => (/* binding */ findAlignmentRotation),
/* harmony export */   "computeObjectAlignment": () => (/* binding */ computeObjectAlignment),
/* harmony export */   "getRotatedFragmentBox": () => (/* binding */ getRotatedFragmentBox),
/* harmony export */   "computeTransformedObjectBox": () => (/* binding */ computeTransformedObjectBox),
/* harmony export */   "RotationAlignment": () => (/* binding */ RotationAlignment)
/* harmony export */ });
function _createForOfIteratorHelper(o, allowArrayLike) {var it;if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {if (it) o = it;var i = 0;var F = function F() {};return { s: F, n: function n() {if (i >= o.length) return { done: true };return { done: false, value: o[i++] };}, e: function e(_e) {throw _e;}, f: F };}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}var normalCompletion = true,didErr = false,err;return { s: function s() {it = o[Symbol.iterator]();}, n: function n() {var step = it.next();normalCompletion = step.done;return step;}, e: function e(_e2) {didErr = true;err = _e2;}, f: function f() {try {if (!normalCompletion && it.return != null) it.return();} finally {if (didErr) throw err;}} };}function _unsupportedIterableToArray(o, minLen) {if (!o) return;if (typeof o === "string") return _arrayLikeToArray(o, minLen);var n = Object.prototype.toString.call(o).slice(8, -1);if (n === "Object" && o.constructor) n = o.constructor.name;if (n === "Map" || n === "Set") return Array.from(o);if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);}function _arrayLikeToArray(arr, len) {if (len == null || len > arr.length) len = arr.length;for (var i = 0, arr2 = new Array(len); i < len; i++) {arr2[i] = arr[i];}return arr2;}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;} // The purpose of this file is to compute the necessary transforms to rotate
// all objects in a way that...
//
//  1. Identical objects are oriented in the same way
//  2. Objects are horizontally aligned with the main axes x/y to reduce bbox extents.
//  3. Up-Vector is preserved
//
// It also provides methods to consider these rotations during computation of
// cluster layout and animation.

// @param {Box3}   box
// @param {number} i - in [0, 7]
var getBoxCorner = function getBoxCorner(box, i) {
  return new THREE.Vector3(
  i & 1 ? box.min.x : box.max.x,
  i & 2 ? box.min.y : box.max.y,
  i & 4 ? box.min.z : box.max.z);

};

// Each element is a corner index. Each pair of two forms a main axis direction.
var BoxAxisIndices = Uint32Array.from([
0, 1, 0, 2, 0, 4]);


// Helper class to enumerate the main axis directions of one or more rotated bboxes.
var BoxAxes = /*#__PURE__*/function () {

  function BoxAxes() {_classCallCheck(this, BoxAxes);
    // Transforming vertices turned out to be the major cost factor. So we use indexing to reduce it.
    this.vertices = [];

    this.tmpPoint = new THREE.Vector3();
  }

  // @param {Box3}    box
  // @param {Matrix4} matrix - orientation of the box
  _createClass(BoxAxes, [{ key: "addBox", value: function addBox(box, matrix) {

      // It's important to skip empty boxes. Otherwise, we would produce infinite 
      // extents after transforming min/max
      if (box.isEmpty()) {
        return;
      }

      // add 8 box corners
      for (var i = 0; i < 8; i++) {
        var p = getBoxCorner(box, i).applyMatrix4(matrix);
        this.vertices.push(p);
      }
    }

    // Sets outAxis.indexA and outAxis.indexB to vertex numbers of the given edge
    //
    // @param {number} axisIndex
    // @param {Object} outAxis.indexA and outAxis.indexB will be set.
  }, { key: "getAxis", value: function getAxis(axisIndex, outAxis) {
      // Get offset where the vertices of the box start
      var boxIndex = Math.floor(axisIndex / 3); // 3 axes per box
      var vertexOffset = 8 * boxIndex; // 8 vertices per box

      // Get index into BoxAxisIndices
      var localIndex = 2 * axisIndex % BoxAxisIndices.length; // 2 values per axis

      outAxis.indexA = vertexOffset + BoxAxisIndices[localIndex];
      outAxis.indexB = vertexOffset + BoxAxisIndices[localIndex + 1];
    } }, { key: "getAxisCount", value: function getAxisCount()

    {
      var boxCount = this.vertices.length / 8;
      var AxesPerBox = 3;
      return boxCount * AxesPerBox;
    }

    // Returns bounding rectangle of all boxes if we transform all points by the given matrix
    //  @param {Box2}    outRect
    //  @param {Matrix4} matrix
  }, { key: "getBoundingRect", value: function getBoundingRect(outRect, matrix) {var _iterator = _createForOfIteratorHelper(
      this.vertices),_step;try {for (_iterator.s(); !(_step = _iterator.n()).done;) {var v = _step.value;
          // add transformed vertex to bbox
          var p = this.tmpPoint.copy(v).applyMatrix4(matrix);
          outRect.expandByPoint(p);
        }} catch (err) {_iterator.e(err);} finally {_iterator.f();}
    } }]);return BoxAxes;}();
;

// Find rotation around z-axis that brings the given (horizontal) direction to the x-axis
//
//  @param {Vector2}  dir - Does not need to be normalized
//  @returns {number} ccw angle in radians. Rotate by this angle to bring dir to xAxis.
var getAngleToXAxis = function getAngleToXAxis(dir) {
  return -Math.atan2(dir.y, dir.x);
};

// Collects main axes of all fragment geometry boxes and projects them to world-space.
//  @returns {BoxAxes} 
var collectFragBoxAxes = function collectFragBoxAxes(model, dbId) {

  var boxAxes = new BoxAxes();

  var geomList = model.getGeometryList();
  var fragList = model.getFragmentList();

  // Reused tmp-values
  var geomBox = new THREE.Box3();
  var worldMatrix = new THREE.Matrix4();

  // For each fragment...
  var it = model.getInstanceTree();
  it.enumNodeFragments(dbId, function (fragId) {

    // Set geomBox to geometry bbox in object-space (for otg, it will simply be the unit box)
    var geomId = fragList.getGeometryId(fragId);
    geomList.getModelBox(geomId, geomBox);

    // get fragment world matrix
    fragList.getOriginalWorldMatrix(fragId, worldMatrix);

    // collect bbox with transform
    boxAxes.addBox(geomBox, worldMatrix);
  });
  return boxAxes;
};

// Given vertices and axis directions of bboxes, this function finds a rotation around z so that...
//  - area of the boundsXY is minimized
//  - We always have xExtent <= yExtent for boundsXY
// where boundsXY is the bounding box of the xy-projection of all boxes.
//
// Note: We assume here that the optimal solution will align one of the edges with the x-axis.
//
//  @param {BoxAxes} boxAxes
//  @returns {Quaternion}
var findAlignmentRotation = function findAlignmentRotation(boxAxes) {

  // Reused in the loop below
  var edgeDir = new THREE.Vector2();
  var quaternion = new THREE.Quaternion();
  var rotMatrix = new THREE.Matrix4();
  var zAxis = new THREE.Vector3(0, 0, 1);
  var rect = new THREE.Box2();

  var minArea = Infinity;
  var bestAngle = null;
  var minExtent = new THREE.Vector2();

  // An axis direction, given by two indices into boxAxes.vertices
  var axis = {
    indexA: 0,
    indexB: 0 };

  var a = null;
  var b = null;

  // For each edge...
  var axisCount = boxAxes.getAxisCount();
  for (var i = 0; i < axisCount; i++) {

    // get edge
    boxAxes.getAxis(i, axis);
    a = boxAxes.vertices[axis.indexA];
    b = boxAxes.vertices[axis.indexB];

    // get edge direction
    edgeDir.set(b.x - a.x, b.y - a.y);

    // compute rotation matrix that brings that angle to x-axis (ccw radians)
    var angleToXAxis = getAngleToXAxis(edgeDir);
    quaternion.setFromAxisAngle(zAxis, angleToXAxis);
    rotMatrix.makeRotationFromQuaternion(quaternion);

    // compute xy-bounding rectangle that we get when using this angle
    boxAxes.getBoundingRect(rect, rotMatrix);

    // compute area
    var dx = rect.max.x - rect.min.x;
    var dy = rect.max.y - rect.min.y;
    var area = dx * dy;

    // If this area is better than our candidates so far, use it
    if (area < minArea) {
      // keep rotation that minimized area so far
      minExtent.set(dx, dy);
      minArea = area;
      bestAngle = angleToXAxis;
    }
  }

  // If needed, rotate by another 90 degree to ensure xExtent < yExtent.
  // Note that this doesn't change the area
  if (minExtent.x > minExtent.y) {
    bestAngle += THREE.Math.degToRad(90.0);
  }

  // Compute final quaternion
  quaternion.setFromAxisAngle(zAxis, bestAngle);
  return quaternion;
};

// Computes a rotation transform for a given dbId that aligns the object horizontally, so that:
//  - xy extent of the bbox is minimized
//  - xExtent <= yExtent
// @returns {Quaternion}
var computeObjectAlignment = function computeObjectAlignment(model, dbId) {

  // project the main axes of all fragment geometry boxes to world-space
  var axes = collectFragBoxAxes(model, dbId); // {Vector3[]} with two vectors per edge

  // find rotation that minimizes the x/y-bbox of all transformed boxes
  return findAlignmentRotation(axes);
};

var tmpMatrix = new THREE.Matrix4();
var tmpMatrix2 = new THREE.Matrix4();

// Returns the bbox that we obtain when applying the given rotationMatrix
// to the given fragment as animation transform, i.e., applied after world matrix.
var getRotatedFragmentBox = function getRotatedFragmentBox(model, fragId, rotMatrix, optionalTarget) {

  var result = optionalTarget || new THREE.Box3();

  var fragList = model.getFragmentList();
  var geomList = model.getGeometryList();

  // Get fragment worldMatrix. Note that we don't want it to be affected by current animation state.
  var worldMatrix = tmpMatrix;
  fragList.getOriginalWorldMatrix(fragId, worldMatrix);

  // Apply worldMatrix then rotMatrix
  var fullMatrix = tmpMatrix2.copy(rotMatrix).multiply(worldMatrix);

  // Get geometry bbox in object-space (for otg, it will simply be the unit box)
  var geomId = fragList.getGeometryId(fragId);
  geomList.getModelBox(geomId, result);

  // Applying a matrix turns an empty box into an infinite one. So, we must skip it for empty boxes
  if (!result.isEmpty()) {
    // Apply combined matrix to geometry box.
    // Note that we cannot simply rotate the fragment's worldBox here, because
    // this would sometimes result in an unnecessary large bbox.
    result.applyMatrix4(fullMatrix);
  }

  return result;
};

// Given a list of fragment ids and an addtional transform to be applied to each of those,
// this function computes the resulting bbox when applying fragment worldMatrix + given transform to each
// fragment geometry.
//
//  @param {Model}   model
//  @param {dbId}    dbId
//  @param {Matrix4} matrix
var computeTransformedObjectBox = function computeTransformedObjectBox(model, dbId, matrix) {

  var summedBox = new THREE.Box3();
  var tmpBox = new THREE.Box3();

  // For each fragment...
  var it = model.getInstanceTree();
  it.enumNodeFragments(dbId, function (fragId) {
    // add aligned box of this fragment
    var fragBox = getRotatedFragmentBox(model, fragId, matrix, tmpBox);
    summedBox.union(fragBox);
  });

  return summedBox;
};

// Computes for each object an alignment rotation with the goal that...
//  - x/y extent is minimized
//  - z-axis is preserved
//  - xExtent <= yExtent
var RotationAlignment = /*#__PURE__*/function () {

  // @param {Model[]}
  function RotationAlignment(models) {var _this = this;_classCallCheck(this, RotationAlignment);

    // Index modely by modelId
    this.modelsById = [];
    models.forEach(function (m) {return _this.modelsById[m.id] = m;});

    // Caches of rotations and bboxes for rotated shapes
    this.rotations = []; // {Quaternion[][]}
    this.boxes = []; // {Box3[][]} - boxes of rotated fragments

    // Reused tmp matrix
    this.rotMatrix = new THREE.Matrix4();
  }_createClass(RotationAlignment, [{ key: "_addToCache",

    // Store alignment rotation and bbox for a shape in cache
    value: function _addToCache(modelId, dbId, rotation, bbox) {

      // Get or create arrays for cached rotations and boxes for this model
      var modelRotations = this.rotations[modelId];
      var modelBoxes = this.boxes[modelId];
      if (!this.rotations[modelId]) {
        // first rotation for this model => create new array
        modelRotations = [];
        modelBoxes = [];
        this.rotations[modelId] = modelRotations;
        this.boxes[modelId] = modelBoxes;
      }

      // store rotation and bbox in cache
      modelRotations[dbId] = rotation;
      modelBoxes[dbId] = bbox;
    }

    // Make sure that rotation and rotated box are in cache
  }, { key: "_computeAlignmentAndBox", value: function _computeAlignmentAndBox(modelId, dbId) {

      // Skip if already cached
      if (this._isInCache(modelId, dbId)) {
        return;
      }

      // compute Quaternion to align the shape
      var model = this.modelsById[modelId];
      var rotation = computeObjectAlignment(model, dbId);

      // compute bbox that we get after rotation
      this.rotMatrix.makeRotationFromQuaternion(rotation);
      var box = computeTransformedObjectBox(model, dbId, this.rotMatrix);

      // Store both for next time
      this._addToCache(modelId, dbId, rotation, box);

      return box;
    }

    // Check if alignment transform and bbox are already computed
  }, { key: "_isInCache", value: function _isInCache(modelId, dbId) {
      var modelBoxes = this.boxes[modelId];
      return Boolean(modelBoxes && modelBoxes[dbId]);
    }

    // Get resulting bbox that a shape has - assuming that the alignment rotation was already applied.
    //
    // Note: We cannot simply transform the fragment world-box here, because this results in a larger
    //       bbox than transforming the geometry boxes directly to the rotated world position.
  }, { key: "getAlignedBox", value: function getAlignedBox(shapeId, optionalTarget) {var

      modelId = shapeId.modelId,dbId = shapeId.dbId;

      var result = optionalTarget || new THREE.Box3();

      // Make sure that box is in cache
      this._computeAlignmentAndBox(modelId, dbId);

      // Return box from cache
      var box = this.boxes[modelId][dbId];
      return result.copy(box);
    }

    // Returns the alignment rotation for a shape.
    // @param {ShapeId}      shapeId
    // @param {Quaternion}   [optionalTarget]
    // @returns {Quaternion}
  }, { key: "getShapeRotation", value: function getShapeRotation(shapeId, optionalTarget) {var

      modelId = shapeId.modelId,dbId = shapeId.dbId;

      var result = optionalTarget || new THREE.Quaternion();

      // Make sure that rotation is in cache
      this._computeAlignmentAndBox(modelId, dbId);

      // Return rotation from cache
      var rotation = this.rotations[modelId][dbId];
      return result.copy(rotation);
    } }]);return RotationAlignment;}();
;

/***/ }),

/***/ "./extensions/VisualClusters/RowLayoutBuilder.js":
/*!*******************************************************!*\
  !*** ./extensions/VisualClusters/RowLayoutBuilder.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createClusterSetLayout": () => (/* binding */ createClusterSetLayout)
/* harmony export */ });
/* harmony import */ var _ClusterLayout_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ClusterLayout.js */ "./extensions/VisualClusters/ClusterLayout.js");
//
// An algorithm to computes the placement (ClusterSetLayout) for a set of object clusters.
//




// Computes the x/y extent that we obtain when lining up all shapes in a single row. 
//
//  @param {bool} autoRotate - If true, we assume that each object is rotated in a way that sizeX <= sizeY.
var getRowExtent = function getRowExtent(cluster, shapeBoxes, spacing, autoRotate) {

  // Reused tmp vector
  var boxDiag = new THREE.Vector3();

  // Accumulated row width
  var rowSize = new THREE.Vector2();

  for (var i = 0; i < cluster.shapeIds.length; i++) {

    // get shape box diagonal
    var shapeId = cluster.shapeIds[i];
    boxDiag = shapeBoxes.getShapeSize(shapeId, boxDiag);

    // get width/height along row
    var shapeSizeX = autoRotate ? Math.min(boxDiag.x, boxDiag.y) : boxDiag.x;
    var shapeSizeY = autoRotate ? Math.max(boxDiag.x, boxDiag.y) : boxDiag.y;

    // sum up shape with along the row
    rowSize.x += shapeSizeX;

    // Track y-extent of row (determined by largest shape along y)
    rowSize.y = Math.max(rowSize.y, shapeSizeY);
    rowSize.z = Math.max(rowSize.z, boxDiag.z);
  }

  // consider spacing
  rowSize.x += (cluster.shapeIds.length - 1) * spacing;

  return rowSize;
};

// Given a list of bboxes, this function creates a ClusterLayout that stacks all items vertically.
//  @param {Cluster}    cluster
//  @param {ShapeBoxes} shapeBoxes
//  @param {number}     spacing
var createStack = function createStack(cluster, shapeBoxes, spacing) {

  var shapeIds = cluster.shapeIds;

  var layout = new _ClusterLayout_js__WEBPACK_IMPORTED_MODULE_0__.ClusterRowLayout(cluster);

  // Track position where to add next shape
  var zOffset = 0.0;

  // Reused tmp vector
  var boxSize = new THREE.Vector3();

  // Why backwards?: Shapes are ordered by increasing size. For stacking, it looks better to start with the largest.
  for (var i = shapeIds.length - 1; i >= 0; i--) {
    var shapeId = shapeIds[i];

    // Place shape i
    layout.positions[i] = new THREE.Vector3(0, 0, zOffset);

    // Size along the row is alway min(sizeX, sizeY)
    boxSize = shapeBoxes.getShapeSize(shapeId, boxSize);

    // Track layout size
    layout.size.x = Math.max(layout.size.x, boxSize.x);
    layout.size.y = Math.max(layout.size.y, boxSize.y);
    layout.size.z = zOffset + boxSize.y;

    // Step up to next stack level
    zOffset += boxSize.z + spacing;
  }
  return layout;
};

// Given a list of bboxes, this function creates a ClusterLayout that lines them up in one or more rows.
//  @param {Cluster}    cluster
//  @param {ShapeBoxes} shapeBoxes
//  @param {number}     rowWidth
//  @param {number}     spacing
//  @param {number}     autoRotate - If true, each shape is aligned so that sizeX <= sizeY
var createRows = function createRows(cluster, shapeBoxes, rowWidth, spacing, autoRotate) {

  var shapeIds = cluster.shapeIds;

  var layout = new _ClusterLayout_js__WEBPACK_IMPORTED_MODULE_0__.ClusterRowLayout(cluster);

  // Track position where to add next shape
  var nextPos = new THREE.Vector3(0, 0, 0);

  // Reused tmp vector
  var boxSize = new THREE.Vector3();

  // Track y-extent of current row
  var rowSizeY = 0;

  for (var i = 0; i < shapeIds.length; i++) {
    var shapeId = shapeIds[i];

    // Place shape i
    layout.positions[i] = nextPos.clone();

    // Size along the row is alway min(sizeX, sizeY)
    boxSize = shapeBoxes.getShapeSize(shapeId, boxSize);

    // If wanted, we orient all shapes so that sizeX < sizeY.
    layout.rotated[i] = autoRotate && boxSize.x > boxSize.y;

    // get shapeSize in x/y - after rotating in a way that sizeX <= sizeY
    var shapeSizeX = autoRotate ? Math.min(boxSize.x, boxSize.y) : boxSize.x;
    var shapeSizeY = autoRotate ? Math.max(boxSize.x, boxSize.y) : boxSize.y;

    // Track y-extent of current row
    rowSizeY = Math.max(rowSizeY, shapeSizeY);

    // Track overall extent of the whole layout
    layout.size.x = Math.max(layout.size.x, nextPos.x + shapeSizeX);
    layout.size.y = Math.max(layout.size.y, nextPos.y + shapeSizeY); // 
    layout.size.z = Math.max(layout.size.z, boxSize.z); // max over all shape heights

    // Shift position along x to next new slot
    nextPos.x += shapeSizeX + spacing;

    // If width of current row reached the target row width...
    if (nextPos.x >= rowWidth) {
      // Start a new row
      nextPos.x = 0;
      nextPos.y += rowSizeY + spacing;
      rowSizeY = 0;
    }
  }

  return layout;
};

// Given a list of shapeIds, this function computes how these can be positioned in order to form a compact block.
//
//   @param {Cluster}    cluster    - Note: cluster.shapeIds within the claster will be sorted within this function.
//   @param {ShapeBoxes} shapeBoxes - to get shape sizes per shapeId
//   @param {bool}       autoRotate - Ensure sizeX <= sizeY for each shape by auto-rotating by 90 degree if necessary.
//   @returns {ClusterRowLayout}
var createClusterRowLayout = function createClusterRowLayout(cluster, shapeBoxes, spacing, autoRotate) {var enableStacking = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

  // Sort shapes by increasing yExtent.
  //
  // When using autoRotate, we must consider that shapes will be xy-flipped, so that we
  // must sort by max{xExtent, yExtent} instead.
  //
  // Note: The autoRotate option will eventually be removed, because the rotationAlignment can already ensure xExtent <= yExtent,
  //       so that the layout algorithm can just assume it and always sort by y-extent only.
  var shapeIds = cluster.shapeIds;
  var byY = function byY(a, b) {return bySizeY(a, b, shapeBoxes);};
  var byMaxXY = function byMaxXY(a, b) {return byMaxXYSize(a, b, shapeBoxes);};
  var pred = autoRotate ? byMaxXY : byY;

  // Sort shapeIds
  shapeIds.sort(pred);

  // Compute x/y-extent that we would get when lining up all objects in a single row
  var singleRowSize = getRowExtent(cluster, shapeBoxes, spacing, autoRotate);

  // For simplicity and performance, the code below is just a heuristic: We neglect the fact 
  // that y-extents of rows may be varying. So, depending on the variance of y-extents
  // we may not get an actual squre. However, at least we usually avoid to odd aspect ratios.
  // 
  // We would like to choose the number of rows in a way that the cluster gets approximately squared.
  // Given n rows, we would approximately obtain a cluster for which...
  //  - sizeX = singleRowSizeX / numRows
  //  - sizeY = singleRowSizeY * numRows
  //
  // To get it approximately square, we choose so that 
  //    sizeX = sizeY
  //
  var numRows = Math.sqrt(singleRowSize.x / singleRowSize.y);
  var rowWidth = singleRowSize.x / numRows;

  var rows = createRows(cluster, shapeBoxes, rowWidth, spacing, autoRotate);

  // For large flat shapes (like floors/ceilings), it may be better to just stack them on top of each other.
  // So, we try stacking them as well.
  if (enableStacking) {
    var stack = createStack(cluster, shapeBoxes, spacing);

    // If the stack height is smaller than the horizonal extent, we use the stack.
    var useStack = stack.size.z < Math.max(rows.size.x, rows.size.y);
    if (useStack) {
      return stack;
    }
  }

  return rows;
};

// Sort predicate to order objects by increasing y-extent
// Input:
//   @param {ShapeId}    a          - shapeID a
//   @param {ShapeId}    b          - shapeID b
//   @param {ShapeBoxes} shapeBoxes - shape sizes per shapeId
//
// Output: -1, if the max extent of object a is greater than of object b
//          1, otherwise
var bySizeY = function bySizeY(a, b, shapeBoxes) {

  // Get bbox extents
  var diagA = shapeBoxes.getShapeSize(a);
  var diagB = shapeBoxes.getShapeSize(b);

  // If y-extent is different, use it
  if (diagA.y != diagB.y) {
    return diagA.y - diagB.y;
  }

  // Among shapes with equal y-extent, sort by increasing x-extent
  if (diagA.x != diagB.x) {
    return diagA.x - diagB.x;
  }

  return 0;
};


// Sort predicate to order objects by increasing maxXYExtent (=max(xExtent, yExtent)). 
// Input:
//   @param {ShapeId}    a          - shapeID a
//   @param {ShapeId}    b          - shapeID b
//   @param {ShapeBoxes} shapeBoxes - shape sizes per shapeId
//
// Output: -1, if the max extent of object a is greater than of object b
//          1, otherwise
var byMaxXYSize = function byMaxXYSize(a, b, shapeBoxes) {

  // Get bbox extents
  var diagA = shapeBoxes.getShapeSize(a);
  var diagB = shapeBoxes.getShapeSize(b);

  // Sort based on the max axis extent.
  var sizeA = Math.max(diagA.x, diagA.y);
  var sizeB = Math.max(diagB.x, diagB.y);
  if (sizeA < sizeB) {
    return -1;
  } else
  if (sizeA > sizeB) {
    return 1;
  }

  // If max-entents are equal, sort by minExtent
  var minExtA = Math.min(diagA.x, diagA.y);
  var minExtB = Math.min(diagB.x, diagB.y);
  if (minExtA > minExtB) {
    return -1;
  } else if (minExtA < minExtB) {
    return 1;
  }

  // If min/max extents are both equal, just sort by id for consistency
  return b - a;
};

// Given a set of individual ClusterRowLayouts, this function sets their positions, so that clusters are lined up in a grid or stack as well.
//
//  @param {ClusterRowLayout[]} layouts
//  @param {number}             clusterSpacing - Minimum distance between two clusters
//  @param {Box3}               sceneBox       - bbox of the full scene (without anim transforms)
var setClusterPositions = function setClusterPositions(layouts, clusterSpacing, sceneBox) {

  // For placing the clusters, we use the same code that we used for arranging the shapes within
  // the cluster. 
  //
  // Only difference is that the shapes to be placed are actually clusters instead of shapes.

  var parentCluster = {
    // In this case, shapeIds are just indices into the layouts array
    shapeIds: new Int32Array(layouts.length) };


  // Enlist all cluster indices 0, 1, ..., layouts.length-1.
  for (var i = 0; i < layouts.length; i++) {
    parentCluster.shapeIds[i] = i;
  }

  // ShapeBoxes access when using clusters as shapes.
  var clusterBoxes = {
    // Return cluster size
    getShapeSize: function getShapeSize(shapeId, target) {
      target = target || new THREE.Vector3();
      var layout = layouts[shapeId];
      target.copy(layout.size);
      return target;
    } };


  // We only align single shapes, but don't rotate clusters. Note that the aspect ratio 
  var autoRotate = false;

  // Run layout to place the clusters
  var enableStacking = false; // We only use stacking inside clusters. But the clusters themselves are always layouted horizontally.
  var parentLayout = createClusterRowLayout(parentCluster, clusterBoxes, clusterSpacing, autoRotate, enableStacking);

  // Parent cluster should be horizonally centered at the scene midpoint
  var origin = sceneBox.getCenter(new THREE.Vector3());

  origin.x -= 0.5 * parentLayout.size.x;

  // Start the flea-market behind the actual building
  origin.y = sceneBox.min.y + 1.1 * (sceneBox.max.y - sceneBox.min.y);

  // Copy positions from parent clusterLayout to the individual cluster positions
  for (var _i = 0; _i < parentCluster.shapeIds.length; _i++) {
    // get position for next cluster
    var clusterPos = parentLayout.positions[_i];

    // Find the corresponding cluster
    var clusterIndex = parentCluster.shapeIds[_i];
    var layout = layouts[clusterIndex]; // Note that shapeIds is reordered during layout process. So we cannot assume shapeIds[i]==i anymore

    // set cluster position
    layout.position.copy(clusterPos).add(origin);
  }
};

var getDefaultOptions = function getDefaultOptions() {
  return {
    // minimum distance between two shapes within a group
    spacing: 1.0,

    // minimum distance between different groups
    clusterSpacing: 10.0,

    // If true, we stack clusters vertically - otherwise, we line up along x/y
    stackClusters: true };

};

// Computes a ClusterSetLayout from a set of object clusters.
//
// @param {Cluster[]}         layouts    - Each shape group is given by an array of shapeIds
// @param {ShapeBoxes}        shapeBoxes - Provides bboxes per shape
// @param {RotationAlignment} [rotationAlignment] - Defines rotations per shape (optional)
// @param {Object}            options    - configuration params (see getDefaultOptions)
// @returns {ClusterSetLayout}
var createClusterSetLayout = function createClusterSetLayout(clusters, shapeBoxes, rotationAlignment) {var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : getDefaultOptions();

  // When using pre-rotated shapes, the algorithm doesn't need to flipXY for items anymore.
  var enableXYFlip = !rotationAlignment;

  // Create layout for each cluster
  var layouts = clusters.map(function (c) {return createClusterRowLayout(c, shapeBoxes, options.spacing, enableXYFlip);});

  // Based on layouts and known cluster sizes, determine the placement of each cluster
  //setClusterPositions(layouts, shapeBoxes, options.stackClusters, options.clusterSpacing);
  setClusterPositions(layouts, options.clusterSpacing, shapeBoxes.sceneBox);

  return new _ClusterLayout_js__WEBPACK_IMPORTED_MODULE_0__.ClusterSetLayout(layouts, rotationAlignment);
};



/***/ }),

/***/ "./extensions/VisualClusters/ShapeBoxes.js":
/*!*************************************************!*\
  !*** ./extensions/VisualClusters/ShapeBoxes.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ShapeBoxes)
/* harmony export */ });
function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}
var getSummedModelBox = function getSummedModelBox(models) {
  var bbox = new THREE.Box3();
  for (var i = 0; i < models.length; i++) {
    var modelBox = models[i].getBoundingBox();
    bbox.union(modelBox);
  }
  return bbox;
};

// Helper class to faciliate access to shape bboxes across multiple models
var ShapeBoxes = /*#__PURE__*/function () {

  // @param {bool} [rotationAlignment] - If specified, we don't return the original fragment boxes. Instead, we return the boxes obtained
  //                                     assuming that an alignment rotation has been applied to each shape. (see RotationAlignment.js for details)
  function ShapeBoxes(models, rotationAlignment) {var _this = this;_classCallCheck(this, ShapeBoxes);

    // Index modely by modelId
    this.modelsById = [];
    models.forEach(function (m) {return _this.modelsById[m.id] = m;});

    // reused for bbox access
    this.tmpFloat6 = new Float32Array(6);
    this.tmpBox = new THREE.Box3();

    // Compute summed scene box. Note that sceneBox is always the original scene bbox - not considering alignment rotations per object.
    this.sceneBox = getSummedModelBox(models);

    // {RotationAlignment}
    this.rotationAlignment = rotationAlignment;
  }

  // Return shapeBox that we obtain when not applying any rotationAlignment.
  // @param {ShapeId} shapeId
  // @param {Box3}    [optionalTarget]
  _createClass(ShapeBoxes, [{ key: "getUnrotatedShapeBox", value: function getUnrotatedShapeBox(shapeId, optionalTarget) {
      var box = optionalTarget || new THREE.Box3();var

      modelId = shapeId.modelId,dbId = shapeId.dbId;

      // get instanceTree
      var model = this.modelsById[modelId];
      var it = model.getInstanceTree();

      // get box as 6 floats in tmpArray
      it.getNodeBox(dbId, this.tmpFloat6);

      // convert to Box3
      var values = this.tmpFloat6;
      box.min.set(values[0], values[1], values[2]);
      box.max.set(values[3], values[4], values[5]);

      return box;
    }

    // @param {ShapeId} shapeId
    // @param {Box3}    [optionalTarget]
  }, { key: "getShapeBox", value: function getShapeBox(shapeId, optionalTarget) {

      // If shapes are rotated, we must return the bboxes of the rotated shapes instead
      // of the original fragment boxes.
      // It would be nice if AlignmentRotation could simply provide only the rotations and ShapeBoxes
      // apply them to the fragment boxes. Unfortunately, this would not work, because it would unnecessarily 
      // increase the bbox sizes. So, RotationAlignment has to provide own bboxes that are computed by transforming the geometry boxes directly.
      if (this.rotationAlignment) {
        return this.rotationAlignment.getAlignedBox(shapeId, optionalTarget);
      }

      // No rotation applied - just use original boxes.
      return this.getUnrotatedShapeBox(shapeId, optionalTarget);
    }

    // get shape box diagonal from a given ShapeId
  }, { key: "getShapeSize", value: function getShapeSize(shapeId, optionalTarget) {
      var target = optionalTarget || new THREE.Vector3();

      var box = this.getShapeBox(shapeId, this.tmpBox);

      // For empty boxes, the diagonal contains -infinity - which isn't helpful for layouting.
      // So, we return zero extent for this case.
      if (box.isEmpty()) {
        target.set(0, 0, 0);
      } else {
        box.size(target);
      }
      return target;
    } }]);return ShapeBoxes;}();

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
/*!*****************************************************!*\
  !*** ./extensions/VisualClusters/VisualClusters.js ***!
  \*****************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ VisualClustersExtension)
/* harmony export */ });
/* harmony import */ var _Cluster_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Cluster.js */ "./extensions/VisualClusters/Cluster.js");
/* harmony import */ var _RowLayoutBuilder_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./RowLayoutBuilder.js */ "./extensions/VisualClusters/RowLayoutBuilder.js");
/* harmony import */ var _AnimController_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AnimController.js */ "./extensions/VisualClusters/AnimController.js");
/* harmony import */ var _ShapeBoxes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ShapeBoxes.js */ "./extensions/VisualClusters/ShapeBoxes.js");
/* harmony import */ var _AnimState_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./AnimState.js */ "./extensions/VisualClusters/AnimState.js");
/* harmony import */ var _ClusterGizmo_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ClusterGizmo.js */ "./extensions/VisualClusters/ClusterGizmo.js");
/* harmony import */ var _RotationAlignment_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./RotationAlignment.js */ "./extensions/VisualClusters/RotationAlignment.js");

function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}









var av = Autodesk.Viewing;
var avu = av.UI;

var namespace = AutodeskNamespace('Autodesk.Viewing.Extensions.VisualClusters');

// Name of the animation state that organizes all objects in clusters based on Category attribute.
var ClusteredStateName = 'ByCategory';

var createClusterIcon = function createClusterIcon() {
  return [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 143 135">',
  '<g fill="currentColor">',
  '<polygon points="29.275 51 9.725 51 0 68.05 9.725 85 29.275 85 39 68.05"/>',
  '<polygon points="133.275 51 113.725 51 104 68.05 113.725 85 133.275 85 143 68.05"/>',
  '<polygon points="89.05 0 55.05 0 38 29.55 55.05 59 89.05 59 106 29.55"/>',
  '<polygon points="89.05 76 55.05 76 38 105.45 55.05 135 89.05 135 106 105.45"/>',
  '</g>',
  '</svg>'].
  join('');
};

// Create a clustering layout that forms clusters of objects based on Category attribute.
var createDefaultLayout = /*#__PURE__*/function () {var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(models, alignShapeRotation, attribName, searchAncestors) {var modelSupported, clusters, filter, rotationAlignment, shapeBoxes;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:

            // Make sure that we only work on supported models
            modelSupported = function modelSupported(model) {return model.is3d() && Boolean(model.getInstanceTree());};
            models = models.filter(modelSupported);

            // build clusters
            _context.next = 4;return (0,_Cluster_js__WEBPACK_IMPORTED_MODULE_0__.buildClustersFromAttribute)(models, attribName, searchAncestors);case 4:clusters = _context.sent;

            // Exclude topography & rooms
            filter = function filter(c) {return c.name != 'Revit Topography' && c.name != 'Revit Rooms' && c.name != 'Revit <Sketch>';};
            clusters = clusters.filter(filter);

            // Use RotationLayout to orient all shapes in a way that the projected x/y-extent is small
            rotationAlignment = alignShapeRotation ? new _RotationAlignment_js__WEBPACK_IMPORTED_MODULE_6__.RotationAlignment(models) : null;

            // Create helper for bbox access
            shapeBoxes = new _ShapeBoxes_js__WEBPACK_IMPORTED_MODULE_3__["default"](models, rotationAlignment);

            // Compute layouts
            return _context.abrupt("return", (0,_RowLayoutBuilder_js__WEBPACK_IMPORTED_MODULE_1__.createClusterSetLayout)(clusters, shapeBoxes, rotationAlignment));case 10:case "end":return _context.stop();}}}, _callee);}));return function createDefaultLayout(_x, _x2, _x3, _x4) {return _ref.apply(this, arguments);};}();


/**
                                                                                                                                                                                                                                                                             * Purpose of VisualClusters extension is to group objects into clusters.
                                                                                                                                                                                                                                                                             * 
                                                                                                                                                                                                                                                                             * This means:
                                                                                                                                                                                                                                                                             *  1. Categories: Form categories by assigning each shape in a model (or multiple) to a unique category, e.g. based on values of a database property.
                                                                                                                                                                                                                                                                             *  2. Layout:     Compute a "layout" that places all shapes in a way that shapes of the same group are located closeby.
                                                                                                                                                                                                                                                                             *  3. Animation:  Animate between original shape positions and new positions according to cluster layout.
                                                                                                                                                                                                                                                                             * 
                                                                                                                                                                                                                                                                             * Example: By default, the clustering extension forms clusters based on the "Category" Given a building model and 2 groups - windows and doors - the result is that all windows and doors are moved away from their
                                                                                                                                                                                                                                                                             *          original positions, so that you have one cluster of windows and one cluster of doors located outside the original building.
                                                                                                                                                                                                                                                                             * 
                                                                                                                                                                                                                                                                             * The extension id is: `Autodesk.VisualClusters`
                                                                                                                                                                                                                                                                             * 
                                                                                                                                                                                                                                                                             * @example
                                                                                                                                                                                                                                                                             *   viewer.loadExtension('Autodesk.VisualClusters')
                                                                                                                                                                                                                                                                             * 
                                                                                                                                                                                                                                                                             *   If you have a 3D model with propertyDb loaded, you should now see a button in the toolbar to trigger clustering based on Category attribute.
                                                                                                                                                                                                                                                                             *  
                                                                                                                                                                                                                                                                             * @memberof Autodesk.Viewing.Extensions
                                                                                                                                                                                                                                                                             * @alias Autodesk.Viewing.Extensions.VisualClusters
                                                                                                                                                                                                                                                                             * @see {@link Autodesk.Viewing.Extension} for common inherited methods.
                                                                                                                                                                                                                                                                             * @constructor
                                                                                                                                                                                                                                                                            */var
VisualClustersExtension = /*#__PURE__*/function (_av$Extension) {_inherits(VisualClustersExtension, _av$Extension);var _super = _createSuper(VisualClustersExtension);
  function VisualClustersExtension(viewer, options) {var _this;_classCallCheck(this, VisualClustersExtension);
    _this = _super.call(this, viewer, options);

    // If true, the toggle button for the layout is pressed and all objects
    // are arranged in clusters (or being computed or animating towards that state)
    _this.layoutActive = false;

    // Used to detect if an async layout computation is meanwhile outdated.
    _this.layoutTimeStamp = 0;

    // Controls transitions between clustered and original state
    _this.animController = new _AnimController_js__WEBPACK_IMPORTED_MODULE_2__["default"](_this.viewer);

    // Controls gizmos and labels for clusters
    _this.gizmoController = new _ClusterGizmo_js__WEBPACK_IMPORTED_MODULE_5__.ClusterGizmoController(_this.viewer);

    // Bind event listener callbacks
    _this.onModelAddedCb = _this.onModelAdded.bind(_assertThisInitialized(_this));
    _this.onModelRemovedCb = _this.onModelRemoved.bind(_assertThisInitialized(_this));
    _this.dbLoadedCb = _this.onDbLoaded.bind(_assertThisInitialized(_this));
    _this.onTransitionEndedCb = _this.onTransitionEnded.bind(_assertThisInitialized(_this));return _this;
  }_createClass(VisualClustersExtension, [{ key: "load", value: function () {var _load = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_context2.next = 2;return (



                  this.viewer.loadExtension('Autodesk.Edit3D'));case 2:

                this.viewer.addEventListener(av.MODEL_ADDED_EVENT, this.onModelAddedCb);
                this.viewer.addEventListener(av.MODEL_REMOVED_EVENT, this.onModelRemovedCb);
                this.viewer.addEventListener(av.OBJECT_TREE_CREATED_EVENT, this.dbLoadedCb);
                this.viewer.addEventListener(av.ANIM_ENDED, this.onTransitionEndedCb);return _context2.abrupt("return",
                true);case 7:case "end":return _context2.stop();}}}, _callee2, this);}));function load() {return _load.apply(this, arguments);}return load;}() }, { key: "unload", value: function unload()


    {
      this.viewer.removeEventListener(av.MODEL_ADDED_EVENT, this.onModelAddedCb);
      this.viewer.removeEventListener(av.MODEL_REMOVED_EVENT, this.onModelRemovedCb);
      this.viewer.removeEventListener(av.OBJECT_TREE_CREATED_EVENT, this.onDbLoaded);
      this.viewer.removeEventListener(av.ANIM_ENDED, this.onTransitionEndedCb);

      // Revert all anim transform changes.
      this.animController.reset();

      this._destroyUI();
      return true;
    }

    // Reset to initial state.
  }, { key: "reset", value: function reset() {
      this.animController.reset();
      this.gizmoController.reset();
      this.layoutActive = false;
      this.updateButton();
    } }, { key: "onModelAdded", value: function onModelAdded()

    {
      this.updateButton();
    } }, { key: "onModelRemoved", value: function onModelRemoved()

    {
      this.updateButton();

      // Auto-reset: When reset all animation transforms and extension state.
      // This avoids leaking any state information when switching between views.
      //
      // Note: When temporarily switching all models off in a multi-model scenario, auto-reset might
      //       not be wanted. If we need to support that case, we need a concept to tell the extension
      //       explicitly whether a view-switch occurred or leave the reset to the client.
      var lastModelRemoved = !this.viewer.getVisibleModels().length;
      if (lastModelRemoved) {
        this.reset();
      }
    } }, { key: "onDbLoaded", value: function onDbLoaded()

    {
      this.updateButton();
    } }, { key: "onToolbarCreated", value: function onToolbarCreated()

    {var _this2 = this;
      this.clusterButton = new avu.Button("toolbar-clusterTool");
      this.clusterButton.icon.innerHTML = createClusterIcon();

      // add button to toolbar section 'Model Tools'
      var toolbar = this.viewer.getToolbar && this.viewer.getToolbar();
      if (toolbar) {
        var modelTools = toolbar.getControl(av.TOOLBAR.MODELTOOLSID);

        // Add our button to the toolbar
        if (modelTools) {
          modelTools.addControl(this.clusterButton);
        }
      }

      this.clusterButton.onClick = function () {
        _this2.setLayoutActive(!_this2.layoutActive);
      };

      this.updateButton();
    } }, { key: "onTransitionStarted", value: function onTransitionStarted()

    {
      // check if animation state is available and whether there are clusters
      // (models with clusters have an animStates array with length bigger than 0)
      if (ClusteredStateName in this.animController.states &&
      this.animController.states[ClusteredStateName].animStates.filter(Boolean)[0].animStates.length > 0) {
        this.viewer.fireEvent({ type: av.TRANSITION_STARTED, sceneAnimState: this.animController.states[ClusteredStateName] });
      } else {
        this.viewer.fireEvent({ type: av.TRANSITION_STARTED, sceneAnimState: null });
      }
    } }, { key: "onTransitionEnded", value: function onTransitionEnded()

    {
      if (ClusteredStateName in this.animController.states &&
      this.animController.states[ClusteredStateName].animStates.filter(Boolean)[0].animStates.length > 0) {
        this.viewer.fireEvent({ type: av.TRANSITION_ENDED, sceneAnimState: this.animController.states[ClusteredStateName] });
      } else {
        this.viewer.fireEvent({ type: av.TRANSITION_ENDED, sceneAnimState: null });
      }
    } }, { key: "_destroyUI", value: function _destroyUI()

    {
      // Remove button from toolbar
      if (this.clusterButton) {
        var toolbar = this.viewer.getToolbar && this.viewer.getToolbar();
        var modelTools = toolbar && toolbar.getControl(av.TOOLBAR.MODELTOOLSID);
        if (modelTools) {
          modelTools.removeControl(this.clusterButton);
        }
        this.clusterButton = null;
      }
    } }, { key: "setLayoutActive", value: function setLayoutActive(

    active) {
      if (this.layoutActive === active) {
        return;
      }

      // Indicate that layout is activated
      this.layoutActive = active;

      this.updateButton();

      // Layout disabled: Animate back to original state
      if (!active) {
        this.onTransitionStarted();
        this.animController.animateTo(null);
        this.gizmoController.onLayoutChanged(null);
        return;
      }

      this.applyLayout();
    } }, { key: "applyLayout", value: function () {var _applyLayout = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {var models, layoutTimeStamp, sceneLayout;return regeneratorRuntime.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:



                // get currently visible/loaded models
                models = this.viewer.getVisibleModels();

                // If a layout computation is active, mark it as outdated.
                this.layoutTimeStamp++;

                // Remember timestamp so that we can check later if result is still wanted
                layoutTimeStamp = this.layoutTimeStamp;_context3.next = 5;return (
                  createDefaultLayout(models, true, this.options.attribName, this.options.searchAncestors));case 5:sceneLayout = _context3.sent;if (!(


                !this.layoutActive || layoutTimeStamp !== this.layoutTimeStamp)) {_context3.next = 8;break;}return _context3.abrupt("return");case 8:



                this.sceneLayout = sceneLayout;

                // Create animation state that represents this layout
                this.sceneAnimState = sceneLayout.createSceneState(models);

                // Make animation state available 
                this.animController.registerState(ClusteredStateName, this.sceneAnimState);

                this.onTransitionStarted();

                // Animate to clustered layout
                this.animController.animateTo(ClusteredStateName);
                this.gizmoController.onLayoutChanged(this.sceneLayout);case 14:case "end":return _context3.stop();}}}, _callee3, this);}));function applyLayout() {return _applyLayout.apply(this, arguments);}return applyLayout;}() }, { key: "updateButton", value: function updateButton()


    {
      if (!this.clusterButton) {
        return;
      }

      var models = this.viewer.getVisibleModels();

      // Only show button if we have >=1 3D model. Note that we cannot rely on this.viewer.impl.is2d, because it
      // is set after addModel event is fired.
      var showButton = models.some(function (model) {return model.is3d();});
      this.clusterButton.setVisible(showButton);
      if (!showButton) {
        return;
      }

      // Disable button if some propDb is still loading or if we don't have any propDb at all.
      var propDbLoading = function propDbLoading(model) {return model.getPropertyDb() && !model.getPropertyDb().isLoadDone();};
      var propDbMissing = function propDbMissing(model) {return !propDbLoading(model) && !model.getInstanceTree();};
      var waitForDb = models.some(propDbLoading);
      var noPropDb = models.some(propDbMissing);
      var disable = waitForDb || noPropDb;

      // Choose button tooltip. If we disable, explain why.
      var tooltip = 'Form Clusters by Category';
      if (disable) {
        tooltip = waitForDb ? 'Waiting for database to load' : 'Visual Clustering can only be used if a database is available';
      }
      this.clusterButton.setToolTip(tooltip);

      // Set button state
      if (disable) {
        this.clusterButton.setState(avu.Button.State.DISABLED);
      } else {
        this.clusterButton.setState(this.layoutActive ? avu.Button.State.ACTIVE : avu.Button.State.INACTIVE);
      }
    } }]);return VisualClustersExtension;}(av.Extension);


av.theExtensionManager.registerExtension('Autodesk.VisualClusters', VisualClustersExtension);

namespace.buildClustersFromAttribute = _Cluster_js__WEBPACK_IMPORTED_MODULE_0__.buildClustersFromAttribute;
namespace.Cluster = _Cluster_js__WEBPACK_IMPORTED_MODULE_0__.Cluster;
namespace.createShapeId = _Cluster_js__WEBPACK_IMPORTED_MODULE_0__.createShapeId;
namespace.createClusterSetLayout = _RowLayoutBuilder_js__WEBPACK_IMPORTED_MODULE_1__.createClusterSetLayout;
namespace.ShapeBoxes = _ShapeBoxes_js__WEBPACK_IMPORTED_MODULE_3__["default"];
namespace.AnimConstroller = _AnimController_js__WEBPACK_IMPORTED_MODULE_2__["default"];
namespace.hasVisibleFragments = _Cluster_js__WEBPACK_IMPORTED_MODULE_0__.hasVisibleFragments;
namespace.ObjectAnimState = _AnimState_js__WEBPACK_IMPORTED_MODULE_4__.ObjectAnimState;
namespace.ModelAnimState = _AnimState_js__WEBPACK_IMPORTED_MODULE_4__.ModelAnimState;
namespace.SceneAnimState = _AnimState_js__WEBPACK_IMPORTED_MODULE_4__.SceneAnimState;
namespace.getBoxCorner = _RotationAlignment_js__WEBPACK_IMPORTED_MODULE_6__.getBoxCorner;
namespace.findAlignmentRotation = _RotationAlignment_js__WEBPACK_IMPORTED_MODULE_6__.findAlignmentRotation;
namespace.computeObjectAlignment = _RotationAlignment_js__WEBPACK_IMPORTED_MODULE_6__.computeObjectAlignment;
namespace.RotationAlignment = _RotationAlignment_js__WEBPACK_IMPORTED_MODULE_6__.RotationAlignment;
})();

Autodesk.Extensions.VisualClusters = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=VisualClusters.js.map