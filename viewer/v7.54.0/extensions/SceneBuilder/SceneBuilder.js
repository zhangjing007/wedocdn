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

/***/ "./node_modules/bintrees/index.js":
/*!****************************************!*\
  !*** ./node_modules/bintrees/index.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
    RBTree: __webpack_require__(/*! ./lib/rbtree */ "./node_modules/bintrees/lib/rbtree.js"),
    BinTree: __webpack_require__(/*! ./lib/bintree */ "./node_modules/bintrees/lib/bintree.js")
};


/***/ }),

/***/ "./node_modules/bintrees/lib/bintree.js":
/*!**********************************************!*\
  !*** ./node_modules/bintrees/lib/bintree.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var TreeBase = __webpack_require__(/*! ./treebase */ "./node_modules/bintrees/lib/treebase.js");

function Node(data) {
    this.data = data;
    this.left = null;
    this.right = null;
}

Node.prototype.get_child = function(dir) {
    return dir ? this.right : this.left;
};

Node.prototype.set_child = function(dir, val) {
    if(dir) {
        this.right = val;
    }
    else {
        this.left = val;
    }
};

function BinTree(comparator) {
    this._root = null;
    this._comparator = comparator;
    this.size = 0;
}

BinTree.prototype = new TreeBase();

// returns true if inserted, false if duplicate
BinTree.prototype.insert = function(data) {
    if(this._root === null) {
        // empty tree
        this._root = new Node(data);
        this.size++;
        return true;
    }

    var dir = 0;

    // setup
    var p = null; // parent
    var node = this._root;

    // search down
    while(true) {
        if(node === null) {
            // insert new node at the bottom
            node = new Node(data);
            p.set_child(dir, node);
            ret = true;
            this.size++;
            return true;
        }

        // stop if found
        if(this._comparator(node.data, data) === 0) {
            return false;
        }

        dir = this._comparator(node.data, data) < 0;

        // update helpers
        p = node;
        node = node.get_child(dir);
    }
};

// returns true if removed, false if not found
BinTree.prototype.remove = function(data) {
    if(this._root === null) {
        return false;
    }

    var head = new Node(undefined); // fake tree root
    var node = head;
    node.right = this._root;
    var p = null; // parent
    var found = null; // found item
    var dir = 1;

    while(node.get_child(dir) !== null) {
        p = node;
        node = node.get_child(dir);
        var cmp = this._comparator(data, node.data);
        dir = cmp > 0;

        if(cmp === 0) {
            found = node;
        }
    }

    if(found !== null) {
        found.data = node.data;
        p.set_child(p.right === node, node.get_child(node.left === null));

        this._root = head.right;
        this.size--;
        return true;
    }
    else {
        return false;
    }
};

module.exports = BinTree;



/***/ }),

/***/ "./node_modules/bintrees/lib/rbtree.js":
/*!*********************************************!*\
  !*** ./node_modules/bintrees/lib/rbtree.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var TreeBase = __webpack_require__(/*! ./treebase */ "./node_modules/bintrees/lib/treebase.js");

function Node(data) {
    this.data = data;
    this.left = null;
    this.right = null;
    this.red = true;
}

Node.prototype.get_child = function(dir) {
    return dir ? this.right : this.left;
};

Node.prototype.set_child = function(dir, val) {
    if(dir) {
        this.right = val;
    }
    else {
        this.left = val;
    }
};

function RBTree(comparator) {
    this._root = null;
    this._comparator = comparator;
    this.size = 0;
}

RBTree.prototype = new TreeBase();

// returns true if inserted, false if duplicate
RBTree.prototype.insert = function(data) {
    var ret = false;

    if(this._root === null) {
        // empty tree
        this._root = new Node(data);
        ret = true;
        this.size++;
    }
    else {
        var head = new Node(undefined); // fake tree root

        var dir = 0;
        var last = 0;

        // setup
        var gp = null; // grandparent
        var ggp = head; // grand-grand-parent
        var p = null; // parent
        var node = this._root;
        ggp.right = this._root;

        // search down
        while(true) {
            if(node === null) {
                // insert new node at the bottom
                node = new Node(data);
                p.set_child(dir, node);
                ret = true;
                this.size++;
            }
            else if(is_red(node.left) && is_red(node.right)) {
                // color flip
                node.red = true;
                node.left.red = false;
                node.right.red = false;
            }

            // fix red violation
            if(is_red(node) && is_red(p)) {
                var dir2 = ggp.right === gp;

                if(node === p.get_child(last)) {
                    ggp.set_child(dir2, single_rotate(gp, !last));
                }
                else {
                    ggp.set_child(dir2, double_rotate(gp, !last));
                }
            }

            var cmp = this._comparator(node.data, data);

            // stop if found
            if(cmp === 0) {
                break;
            }

            last = dir;
            dir = cmp < 0;

            // update helpers
            if(gp !== null) {
                ggp = gp;
            }
            gp = p;
            p = node;
            node = node.get_child(dir);
        }

        // update root
        this._root = head.right;
    }

    // make root black
    this._root.red = false;

    return ret;
};

// returns true if removed, false if not found
RBTree.prototype.remove = function(data) {
    if(this._root === null) {
        return false;
    }

    var head = new Node(undefined); // fake tree root
    var node = head;
    node.right = this._root;
    var p = null; // parent
    var gp = null; // grand parent
    var found = null; // found item
    var dir = 1;

    while(node.get_child(dir) !== null) {
        var last = dir;

        // update helpers
        gp = p;
        p = node;
        node = node.get_child(dir);

        var cmp = this._comparator(data, node.data);

        dir = cmp > 0;

        // save found node
        if(cmp === 0) {
            found = node;
        }

        // push the red node down
        if(!is_red(node) && !is_red(node.get_child(dir))) {
            if(is_red(node.get_child(!dir))) {
                var sr = single_rotate(node, dir);
                p.set_child(last, sr);
                p = sr;
            }
            else if(!is_red(node.get_child(!dir))) {
                var sibling = p.get_child(!last);
                if(sibling !== null) {
                    if(!is_red(sibling.get_child(!last)) && !is_red(sibling.get_child(last))) {
                        // color flip
                        p.red = false;
                        sibling.red = true;
                        node.red = true;
                    }
                    else {
                        var dir2 = gp.right === p;

                        if(is_red(sibling.get_child(last))) {
                            gp.set_child(dir2, double_rotate(p, last));
                        }
                        else if(is_red(sibling.get_child(!last))) {
                            gp.set_child(dir2, single_rotate(p, last));
                        }

                        // ensure correct coloring
                        var gpc = gp.get_child(dir2);
                        gpc.red = true;
                        node.red = true;
                        gpc.left.red = false;
                        gpc.right.red = false;
                    }
                }
            }
        }
    }

    // replace and remove if found
    if(found !== null) {
        found.data = node.data;
        p.set_child(p.right === node, node.get_child(node.left === null));
        this.size--;
    }

    // update root and make it black
    this._root = head.right;
    if(this._root !== null) {
        this._root.red = false;
    }

    return found !== null;
};

function is_red(node) {
    return node !== null && node.red;
}

function single_rotate(root, dir) {
    var save = root.get_child(!dir);

    root.set_child(!dir, save.get_child(dir));
    save.set_child(dir, root);

    root.red = true;
    save.red = false;

    return save;
}

function double_rotate(root, dir) {
    root.set_child(!dir, single_rotate(root.get_child(!dir), !dir));
    return single_rotate(root, dir);
}

module.exports = RBTree;


/***/ }),

/***/ "./node_modules/bintrees/lib/treebase.js":
/*!***********************************************!*\
  !*** ./node_modules/bintrees/lib/treebase.js ***!
  \***********************************************/
/***/ ((module) => {


function TreeBase() {}

// removes all nodes from the tree
TreeBase.prototype.clear = function() {
    this._root = null;
    this.size = 0;
};

// returns node data if found, null otherwise
TreeBase.prototype.find = function(data) {
    var res = this._root;

    while(res !== null) {
        var c = this._comparator(data, res.data);
        if(c === 0) {
            return res.data;
        }
        else {
            res = res.get_child(c > 0);
        }
    }

    return null;
};

// returns iterator to node if found, null otherwise
TreeBase.prototype.findIter = function(data) {
    var res = this._root;
    var iter = this.iterator();

    while(res !== null) {
        var c = this._comparator(data, res.data);
        if(c === 0) {
            iter._cursor = res;
            return iter;
        }
        else {
            iter._ancestors.push(res);
            res = res.get_child(c > 0);
        }
    }

    return null;
};

// Returns an iterator to the tree node at or immediately after the item
TreeBase.prototype.lowerBound = function(item) {
    var cur = this._root;
    var iter = this.iterator();
    var cmp = this._comparator;

    while(cur !== null) {
        var c = cmp(item, cur.data);
        if(c === 0) {
            iter._cursor = cur;
            return iter;
        }
        iter._ancestors.push(cur);
        cur = cur.get_child(c > 0);
    }

    for(var i=iter._ancestors.length - 1; i >= 0; --i) {
        cur = iter._ancestors[i];
        if(cmp(item, cur.data) < 0) {
            iter._cursor = cur;
            iter._ancestors.length = i;
            return iter;
        }
    }

    iter._ancestors.length = 0;
    return iter;
};

// Returns an iterator to the tree node immediately after the item
TreeBase.prototype.upperBound = function(item) {
    var iter = this.lowerBound(item);
    var cmp = this._comparator;

    while(iter.data() !== null && cmp(iter.data(), item) === 0) {
        iter.next();
    }

    return iter;
};

// returns null if tree is empty
TreeBase.prototype.min = function() {
    var res = this._root;
    if(res === null) {
        return null;
    }

    while(res.left !== null) {
        res = res.left;
    }

    return res.data;
};

// returns null if tree is empty
TreeBase.prototype.max = function() {
    var res = this._root;
    if(res === null) {
        return null;
    }

    while(res.right !== null) {
        res = res.right;
    }

    return res.data;
};

// returns a null iterator
// call next() or prev() to point to an element
TreeBase.prototype.iterator = function() {
    return new Iterator(this);
};

// calls cb on each node's data, in order
TreeBase.prototype.each = function(cb) {
    var it=this.iterator(), data;
    while((data = it.next()) !== null) {
        if(cb(data) === false) {
            return;
        }
    }
};

// calls cb on each node's data, in reverse order
TreeBase.prototype.reach = function(cb) {
    var it=this.iterator(), data;
    while((data = it.prev()) !== null) {
        if(cb(data) === false) {
            return;
        }
    }
};


function Iterator(tree) {
    this._tree = tree;
    this._ancestors = [];
    this._cursor = null;
}

Iterator.prototype.data = function() {
    return this._cursor !== null ? this._cursor.data : null;
};

// if null-iterator, returns first node
// otherwise, returns next node
Iterator.prototype.next = function() {
    if(this._cursor === null) {
        var root = this._tree._root;
        if(root !== null) {
            this._minNode(root);
        }
    }
    else {
        if(this._cursor.right === null) {
            // no greater node in subtree, go up to parent
            // if coming from a right child, continue up the stack
            var save;
            do {
                save = this._cursor;
                if(this._ancestors.length) {
                    this._cursor = this._ancestors.pop();
                }
                else {
                    this._cursor = null;
                    break;
                }
            } while(this._cursor.right === save);
        }
        else {
            // get the next node from the subtree
            this._ancestors.push(this._cursor);
            this._minNode(this._cursor.right);
        }
    }
    return this._cursor !== null ? this._cursor.data : null;
};

// if null-iterator, returns last node
// otherwise, returns previous node
Iterator.prototype.prev = function() {
    if(this._cursor === null) {
        var root = this._tree._root;
        if(root !== null) {
            this._maxNode(root);
        }
    }
    else {
        if(this._cursor.left === null) {
            var save;
            do {
                save = this._cursor;
                if(this._ancestors.length) {
                    this._cursor = this._ancestors.pop();
                }
                else {
                    this._cursor = null;
                    break;
                }
            } while(this._cursor.left === save);
        }
        else {
            this._ancestors.push(this._cursor);
            this._maxNode(this._cursor.left);
        }
    }
    return this._cursor !== null ? this._cursor.data : null;
};

Iterator.prototype._minNode = function(start) {
    while(start.left !== null) {
        this._ancestors.push(start);
        start = start.left;
    }
    this._cursor = start;
};

Iterator.prototype._maxNode = function(start) {
    while(start.right !== null) {
        this._ancestors.push(start);
        start = start.right;
    }
    this._cursor = start;
};

module.exports = TreeBase;



/***/ }),

/***/ "./extensions/SceneBuilder/locales.js":
/*!********************************************!*\
  !*** ./extensions/SceneBuilder/locales.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "locales": () => (/* binding */ locales)
/* harmony export */ });
/* harmony import */ var _res_locales_en_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../res/locales/en/nobundle-scene-builder.loc.json */ "./res/locales/en/nobundle-scene-builder.loc.json");
/* harmony import */ var _res_locales_en_GB_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../res/locales/en-GB/nobundle-scene-builder.loc.json */ "./res/locales/en-GB/nobundle-scene-builder.loc.json");
/* harmony import */ var _res_locales_cs_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../res/locales/cs/nobundle-scene-builder.loc.json */ "./res/locales/cs/nobundle-scene-builder.loc.json");
/* harmony import */ var _res_locales_de_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../res/locales/de/nobundle-scene-builder.loc.json */ "./res/locales/de/nobundle-scene-builder.loc.json");
/* harmony import */ var _res_locales_es_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../res/locales/es/nobundle-scene-builder.loc.json */ "./res/locales/es/nobundle-scene-builder.loc.json");
/* harmony import */ var _res_locales_fr_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../res/locales/fr/nobundle-scene-builder.loc.json */ "./res/locales/fr/nobundle-scene-builder.loc.json");
/* harmony import */ var _res_locales_fr_CA_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../res/locales/fr-CA/nobundle-scene-builder.loc.json */ "./res/locales/fr-CA/nobundle-scene-builder.loc.json");
/* harmony import */ var _res_locales_it_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../res/locales/it/nobundle-scene-builder.loc.json */ "./res/locales/it/nobundle-scene-builder.loc.json");
/* harmony import */ var _res_locales_ja_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../res/locales/ja/nobundle-scene-builder.loc.json */ "./res/locales/ja/nobundle-scene-builder.loc.json");
/* harmony import */ var _res_locales_ko_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../res/locales/ko/nobundle-scene-builder.loc.json */ "./res/locales/ko/nobundle-scene-builder.loc.json");
/* harmony import */ var _res_locales_pl_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../res/locales/pl/nobundle-scene-builder.loc.json */ "./res/locales/pl/nobundle-scene-builder.loc.json");
/* harmony import */ var _res_locales_pt_BR_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../res/locales/pt-BR/nobundle-scene-builder.loc.json */ "./res/locales/pt-BR/nobundle-scene-builder.loc.json");
/* harmony import */ var _res_locales_ru_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../res/locales/ru/nobundle-scene-builder.loc.json */ "./res/locales/ru/nobundle-scene-builder.loc.json");
/* harmony import */ var _res_locales_tr_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../res/locales/tr/nobundle-scene-builder.loc.json */ "./res/locales/tr/nobundle-scene-builder.loc.json");
/* harmony import */ var _res_locales_zh_HANS_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../res/locales/zh-HANS/nobundle-scene-builder.loc.json */ "./res/locales/zh-HANS/nobundle-scene-builder.loc.json");
/* harmony import */ var _res_locales_zh_HANT_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../res/locales/zh-HANT/nobundle-scene-builder.loc.json */ "./res/locales/zh-HANT/nobundle-scene-builder.loc.json");
/* harmony import */ var _res_locales_zh_HK_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../res/locales/zh-HK/nobundle-scene-builder.loc.json */ "./res/locales/zh-HK/nobundle-scene-builder.loc.json");
/* harmony import */ var _res_locales_nl_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../res/locales/nl/nobundle-scene-builder.loc.json */ "./res/locales/nl/nobundle-scene-builder.loc.json");
/* harmony import */ var _res_locales_sv_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../res/locales/sv/nobundle-scene-builder.loc.json */ "./res/locales/sv/nobundle-scene-builder.loc.json");
/* harmony import */ var _res_locales_da_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../res/locales/da/nobundle-scene-builder.loc.json */ "./res/locales/da/nobundle-scene-builder.loc.json");
/* harmony import */ var _res_locales_no_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../res/locales/no/nobundle-scene-builder.loc.json */ "./res/locales/no/nobundle-scene-builder.loc.json");
/**
 * Include each locale json file and return it in an object
 * that can be consumed by i18n
 */























var locales = {
  en: _res_locales_en_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_0__,
  "en-GB": _res_locales_en_GB_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_1__,
  cs: _res_locales_cs_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_2__,
  de: _res_locales_de_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_3__,
  es: _res_locales_es_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_4__,
  fr: _res_locales_fr_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_5__,
  "fr-CA": _res_locales_fr_CA_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_6__,
  it: _res_locales_it_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_7__,
  ja: _res_locales_ja_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_8__,
  ko: _res_locales_ko_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_9__,
  pl: _res_locales_pl_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_10__,
  "pt-BR": _res_locales_pt_BR_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_11__,
  ru: _res_locales_ru_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_12__,
  tr: _res_locales_tr_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_13__,
  "zh-HANS": _res_locales_zh_HANS_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_14__,
  "zh-HANT": _res_locales_zh_HANT_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_15__,
  "zh-HK": _res_locales_zh_HK_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_16__,
  nl: _res_locales_nl_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_17__,
  sv: _res_locales_sv_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_18__,
  da: _res_locales_da_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_19__,
  no: _res_locales_no_nobundle_scene_builder_loc_json__WEBPACK_IMPORTED_MODULE_20__ };

/***/ }),

/***/ "./extensions/SceneBuilder/modelBuilder.js":
/*!*************************************************!*\
  !*** ./extensions/SceneBuilder/modelBuilder.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ModelBuilder": () => (/* binding */ ModelBuilder)
/* harmony export */ });
/* harmony import */ var _reusableIds__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./reusableIds */ "./extensions/SceneBuilder/reusableIds.js");
function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

var av = Autodesk.Viewing;
var avp = av.Private;
var tmpMatrix = new THREE.Matrix4();
var tmpBox = new THREE.Box3();
var tmpMin = new THREE.Vector3();
var tmpMax = new THREE.Vector3();
var missingGeometry = { svfid: 0, boundingBox: new THREE.Box3() };
var meshInfo = {
  geometry: null,
  material: undefined,
  matrix: tmpMatrix,
  isLine: false,
  isWideLine: false,
  isPoint: false };

var isLines = avp.MeshFlags.MESH_ISLINE;
var isWideLines = avp.MeshFlags.MESH_ISWIDELINE;
var isPoints = avp.MeshFlags.MESH_ISPOINT;
var clearFlags = ~(isLines | isWideLines | isPoints);
var defaultMtlName = "__defaultMaterial__";
var REMOVED_EVENT = { type: "removed" };

var ROOT_NODE_ID = -1e9; // Large negative number for root node id
var START_FRAG_ID = -100; // Place where fragments without dbids are put

// See InstanceTreeAccess in src/wgs/scene/InstanceTreeStorage.js
var SceneBuilderNodeAccess = /*#__PURE__*/function () {
  function SceneBuilderNodeAccess() {_classCallCheck(this, SceneBuilderNodeAccess);
    this.rootId = ROOT_NODE_ID;
    this.nodeIndices = new _reusableIds__WEBPACK_IMPORTED_MODULE_0__.ReusableIds(1);
    this.dbIdToIndex = _defineProperty({}, ROOT_NODE_ID, 0);
    this._nodeCount = 1;
    this._maxIndex = 0;
    this._nodeFlags = [0];
    this._indexToFragId = [];
    this._rootName = av.i18n.translate("Root");
  }_createClass(SceneBuilderNodeAccess, [{ key: "getIndex", value: function getIndex(

    id) {
      return this.dbIdToIndex[id];
    } }, { key: "getNumNodes", value: function getNumNodes()

    {
      // Use _maxIndex + 1 instead of _nodeCount. The ModelBrowserPanel get indices from the
      // instance tree and assumes that they are < getNumNodes(). This guarantees that
      // is true. _maxIndex + 1 will be >= _nodeCount and <= the fragment count.
      return this._maxIndex + 1;
    } }, { key: "getParentId", value: function getParentId(

    nodeId) {
      return nodeId === this.rootId ? undefined : this.rootId;
    } }, { key: "getNodeFlags", value: function getNodeFlags(

    dbId) {
      var index = this.dbIdToIndex[dbId];
      return index >= 0 ? this._nodeFlags[index] : undefined;
    } }, { key: "setNodeFlags", value: function setNodeFlags(

    dbId, flags) {
      var index = this.dbIdToIndex[dbId];
      if (index !== undefined)
      this._nodeFlags[index] = flags;
    } }, { key: "name", value: function name(

    nodeId, includeCount) {
      return nodeId === this.rootId ?
      includeCount && this._nodeCount > 1 ? "".concat(this._rootName, "(").concat(this._nodeCount - 1, ")") : this._rootName :
      av.i18n.translate("Object %(nodeId)", {
        nodeId: nodeId });

    } }, { key: "getNodeBox", value: function getNodeBox(

    dbId, dst) {
      dst.setEmpty();
    } }, { key: "getNumChildren", value: function getNumChildren(

    nodeId) {
      return nodeId == this.rootId ? this._nodeCount - 1 : 0;
    } }, { key: "getNumFragments", value: function getNumFragments(

    nodeId) {
      if (nodeId === this.rootId)
      return 0;
      var index = this.dbIdToIndex[nodeId];
      if (index === undefined)
      return 0;
      var frags = this._indexToFragId[index];
      return Array.isArray(frags) ? frags.length : 1;
    } }, { key: "enumNodeFragments", value: function enumNodeFragments(

    node, callback) {
      if (node === this.rootId)
      return;
      var index = this.dbIdToIndex[node];
      if (index === undefined)
      return;
      var frags = this._indexToFragId[index];
      if (Array.isArray(frags)) {
        for (var i = 0; i < frags.length; ++i) {
          callback(frags[i], node, index);}
      } else
      callback(frags, node, index);
    } }, { key: "enumNodeChildren", value: function enumNodeChildren(

    dbId, callback) {
      if (dbId !== this.rootId)
      return;
      var dbids = Object.keys(this.dbIdToIndex);
      for (var i = 0; i < dbids.length; ++i) {
        var child = parseInt(dbids[i]);
        if (child !== this.rootId) {
          callback(child, dbId, 0);
        }
      }
    } }, { key: "addFragment", value: function addFragment(

    nodeId, fragId) {
      var index = this.dbIdToIndex[nodeId];
      if (index === undefined) {
        index = this.nodeIndices.reserveId();
        this.dbIdToIndex[nodeId] = index;
        this._nodeFlags[index] = 0;
        ++this._nodeCount;
        if (index > this._maxIndex)
        this._maxIndex = index;
      }
      var frags = this._indexToFragId[index];
      if (frags === undefined)
      this._indexToFragId[index] = fragId;else
      if (Array.isArray(frags))
      frags.push(fragId);else

      this._indexToFragId[index] = [frags, fragId];
    } }, { key: "removeFragment", value: function removeFragment(

    nodeId, fragId) {
      var index = this.dbIdToIndex[nodeId];
      if (index !== undefined) {
        var frags = this._indexToFragId[index];
        if (Array.isArray(frags)) {
          var i = frags.indexOf(fragId);
          if (i >= 0 && frags.length === 2)
          this._indexToFragId[index] = frags[1 - i];else

          frags.splice(i, 1);
        } else {
          this.nodeIndices.releaseId();
          delete this.dbIdToIndex[nodeId];
          delete this._indexToFragId[index];
          --this._nodeCount;
        }
      }
    } }]);return SceneBuilderNodeAccess;}();var


EmptyModelLoader = /*#__PURE__*/function () {
  function EmptyModelLoader(viewer) {_classCallCheck(this, EmptyModelLoader);
    this.viewer3DImpl = viewer;
  }_createClass(EmptyModelLoader, [{ key: "loadFile", value: function loadFile(

    url, options, onDone, onWorkerStart) {
      onWorkerStart && onWorkerStart();
      //Make the initial blank model
      var initialSize = options.conserveMemory ? 1 : 0;
      var svf = {
        bbox: new THREE.Box3().set(options.globalOffset, options.globalOffset),
        fragments: {
          length: initialSize,
          fragId2dbId: [0],
          transforms: initialSize ? new Float32Array(initialSize * 12) : null,
          boxes: initialSize ? new Float32Array(initialSize * 6) : null },

        is2d: false,
        loadOptions: options || {},
        isSceneBuilder: true,
        loadDone: true, // True as model is empty
        instanceTree: new avp.InstanceTree(new SceneBuilderNodeAccess(), 0, 1),
        metadata: {} };

      var model = new av.Model(svf);

      var name;
      if (options && options.modelNameOverride) {
        name = options.modelNameOverride;
        // Undefine this in the options so the model browser panel will use
        // the same name we copy to the instance tree. The instance tree will
        // append the object count to the model name, but not if the name
        // is take directly from the options.
        options.modelNameOverride = undefined;
      } else {
        name = av.i18n.translate('Scene Builder %(modelId)', {
          modelId: model.getModelId() });

      }

      svf.instanceTree.nodeAccess._rootName = name;
      svf.urn = btoa(name);
      this.svf = svf;

      model.initialize();
      model.loader = this;
      this.model = model;
      model.getFragmentList().isFixedSize = false;
      onDone(null, model);
      this.viewer3DImpl.api.dispatchEvent({ type: av.MODEL_ROOT_LOADED_EVENT, svf: svf, model: model });
      this.viewer3DImpl.onLoadComplete(model);
    } }, { key: "dtor", value: function dtor()

    {
    } }, { key: "is3d", value: function is3d()

    {
      return true;
    } }]);return EmptyModelLoader;}();


/**
                                        * @param transform
                                        * @param dstMatrix
                                        * @private
                                        */
function convertMatrix(transform, dstMatrix) {
  if (!transform) {
    dstMatrix.identity();
  } else if (transform instanceof THREE.Matrix4) {
    dstMatrix.copy(transform);
  } else {
    var dst = dstMatrix.elements;
    dst[0] = transform[0];
    dst[1] = transform[1];
    dst[2] = transform[2];
    dst[3] = 0;
    dst[4] = transform[3];
    dst[5] = transform[4];
    dst[6] = transform[5];
    dst[7] = 0;
    dst[8] = transform[6];
    dst[9] = transform[7];
    dst[10] = transform[8];
    dst[11] = 0;
    dst[12] = transform[9];
    dst[13] = transform[10];
    dst[14] = transform[11];
    dst[15] = 1;
  }

  return dstMatrix;
}

/**
   * Get the fragment id for a fragment
   *
   * @param {number|THREE.Mesh} fragment The mesh or the fragment id for a fragment.
   * @returns {number} The id of the fragment
   * @private
   */
function getFragmentId(fragment) {
  return fragment instanceof THREE.Mesh ? fragment.fragId : fragment;
}

/**
   * @param modelBuilder
   * @param fragment
   * @param geometry
   * @param material
   * @param transform
   * @param bbox
   * @private
   */
function _changeFragmentGeometry(modelBuilder, fragment, geometry, material, transform, bbox) {
  // get the fragment id
  var fragId = getFragmentId(fragment);

  var model = modelBuilder.model;
  var fragList = modelBuilder.fragList;

  // Get the geometry
  missingGeometry.geometry = (geometry === undefined ? modelBuilder.fragList.getGeometryId(fragId) :
  geometry instanceof THREE.BufferGeometry ? geometry.svfid : geometry) || 0;
  geometry = geometry === undefined ? modelBuilder.fragList.getGeometry(fragId) : modelBuilder._getGeometry(geometry);

  // Get the material
  var mtl = material === undefined ? modelBuilder.fragList.getMaterial(fragId) : modelBuilder._getMaterial(material);

  var mesh = !modelBuilder.conserveMemory && model.getFragmentList().getVizmesh(fragId);
  if (mesh) {
    mesh.dispatchEvent(REMOVED_EVENT);
  } else
  mesh = meshInfo;

  // Get the material
  mesh.material = mtl;
  // Clear the vizflags, that may be left over.
  if (fragId < fragList.vizflags.length)
  fragList.vizflags[fragId] &= ~clearFlags;
  // We need to mark whether the fragment is a line, wideline, or points
  // If we don't have geometry, assume false, which will get fixed when
  // the geometry is available.
  mesh.geometry = geometry;
  if (geometry) {
    mesh.isLine = geometry.isLines;
    mesh.isWideLine = geometry.isWideLines;
    mesh.isPoint = geometry.isPoints;
  } else {
    mesh.geometry = missingGeometry;
    mesh.isLine = false;
    mesh.isWideLine = false;
    mesh.isPoint = false;
  }
  // Get the transform
  mesh.matrix = convertMatrix(transform, mesh === meshInfo ? tmpMatrix : mesh.matrix);
  // Get the bounding box, if it is provided by the caller. Use meshInfo because
  // bbox doesn't work when conserveMemory is false.
  meshInfo.bbox = bbox && (bbox instanceof THREE.Box3 ? bbox :
  tmpBox.set(tmpMin.fromArray(bbox, 0), tmpMax.fromArray(bbox, 3)));
  fragList.fragments.fragId2dbId[fragId] = START_FRAG_ID - fragId;
  modelBuilder.instanceTree.nodeAccess.addFragment(START_FRAG_ID - fragId, fragId);
  model.setFragment(fragId, mesh, mesh !== meshInfo);
  if (fragList.useThreeMesh && !geometry)
  fragList.getVizmesh(fragId).geometry = null;

  modelBuilder.sceneUpdated(true);
  return true;
}

/**
   * @param geometry
   * @param dst
   * @private
   */
function calculateBBox(geometry, dst) {
  dst.makeEmpty();
  avp.VertexEnumerator.enumMeshVertices(geometry, function (pos) {
    dst.expandByPoint(pos);
  });
  return dst;
}

/**
   * @param matman
   * @param hash
   * @param material
   * @private
   */
function _addMaterial(matman, hash, material) {
  if (material instanceof THREE.MeshPhongMaterial ||
  material instanceof THREE.ShaderMaterial && material.isPrismMaterial) {
    matman.addMaterial(hash, material, true);
  } else
  matman.addMaterialNonHDR(hash, material);
}

/**
   * @param newDbId
   * @param fragId
   * @param fragId2dbId
   * @param instanceTree
   * @private
   */
function changeDbId(newDbId, fragId, fragId2dbId, instanceTree) {
  var oldDbId = fragId2dbId[fragId] | 0;
  newDbId = newDbId || START_FRAG_ID - fragId;
  fragId2dbId[fragId] = newDbId;
  if (newDbId === oldDbId)
  return;

  instanceTree.nodeAccess.removeFragment(oldDbId, fragId);
  instanceTree.nodeAccess.addFragment(newDbId, fragId);
}

/**
   * Class that implements the API for building models dynamically.
   * An instance of this class can be obtained after the Promise returned by {@link Autodesk.Viewing.Extensions.SceneBuilder#addNewModel}
   * is resolved.
   * 
   * @memberof Autodesk.Viewing.Extensions
   * @alias Autodesk.Viewing.Extensions.ModelBuilder
   * 
   * @property {Autodesk.Viewing.Model} model The model instance being manipulated.
   */var
ModelBuilder = /*#__PURE__*/function () {

  /**
                                          * The constructor is invoked automatically by {@link Autodesk.Viewing.Extensions.SceneBuilder}.
                                          * 
                                          * @class
                                          * @param {Autodesk.Viewing.Model} model The model this build works on
                                          * @param {object} [options] Options for the ModelBuilder
                                          * @param {boolean} [options.conserveMemory=false] Set to true to turn on memory conservation mode.
                                          *  In this mode [addMesh()]{@link Autodesk.Viewing.Extensions.ModelBuilder#addMesh} is not available because 
                                          *  a single mesh is shared among all of the fragments in the model.
                                          */
  function ModelBuilder(model, options) {_classCallCheck(this, ModelBuilder);
    this.model = model;
    this.geomList = model.getGeometryList();
    this.fragList = model.getFragmentList();
    // Initialize the ids we use for geometry and fragments.
    this.geomIds = new _reusableIds__WEBPACK_IMPORTED_MODULE_0__.ReusableIds(1);
    this.fragmentIds = new _reusableIds__WEBPACK_IMPORTED_MODULE_0__.ReusableIds(Math.max(model.getData().fragments.length, 1));
    this.conserveMemory = !!(options && options.conserveMemory);
    this.instanceTree = model.getData().instanceTree;
    this.instanceTree.setFragmentList(this.fragList);
    this.createWireframe = !!(options && options.createWireframe);
  }

  /**
     * @returns {boolean} true when the model being manipulated is using the memory-optimized code path.
     * @alias Autodesk.Viewing.Extensions.ModelBuilder#isConservingMemory
     */_createClass(ModelBuilder, [{ key: "isConservingMemory", value: function isConservingMemory()
    {
      return this.conserveMemory;
    }

    /**
       * Add geometry to the model.
       * 
       * @param {THREE.BufferGeometry} geometry The geometry to add. This can be null or
       *  undefined to allocate a geometry id without geometry.
       * @param {number} [numFragments] The number of fragments you expect this geometry
       *  to be used in. Default is 1. This is used to prioritize placing geometry on the
       *  GPU. Geometry used by more fragments gets a higher priority.
       * @returns {number} The id of the added geometry, or 0 if there was an error.
       * 
       * @alias Autodesk.Viewing.Extensions.ModelBuilder#addGeometry
       */ }, { key: "addGeometry", value: function addGeometry(
    geometry, numFragments) {
      // Must have geometry and it must not be in a model
      if (geometry && geometry.svfid !== undefined)
      return 0;

      // Get the new geometry id
      var geomId = this.geomIds.reserveId();
      if (geomId === undefined)
      return 0; // 4 billion fragments? not likely

      if (geometry) {
        if (this.createWireframe) {
          avp.createWireframe(geometry);

          if (!geometry.attributes.indexlines) {
            // add attribute for edge rendering
            var attrIndexLines = new THREE.BufferAttribute(undefined, 1);
            attrIndexLines.bytesPerItem = geometry.iblines instanceof Uint32Array ? 4 : 2;
            geometry.setAttribute('indexlines', attrIndexLines);
            geometry.iblinesbuffer = undefined;
          }

          // Add index for the renderer to draw the lines
          if (!geometry.index) {
            var indices = new Uint16Array(geometry.attributes.position.length / 3);
            for (var i = 0; i < indices.length; ++i) {
              indices[i] = i;
            }
            var iba = new THREE.BufferAttribute(indices, 1);
            iba.bytesPerItem = 2;
            geometry.setAttribute('index', iba);
          }
        }
        // Sort of ugly - the geometry list will set geometry.boundingBox to null,
        // but if we aren't conserving memory we need to keep the bounding box.
        var bbox = geometry.boundingBox = geometry.boundingBox ||
        calculateBBox(geometry, this.conserveMemory ? tmpBox : new THREE.Box3());
        this.geomList.addGeometry(this.packNormals(geometry), numFragments, geomId);
        if (!this.conserveMemory)
        geometry.boundingBox = bbox;
      }

      return geomId;
    }

    /**
       * Update fragments to use a new geometry id.
       *
       * @param {object.<number,boolean>} oldGeomIds Existing geometry ids
       * @param {number} newGeomId New geometry id
       * @private
       */ }, { key: "_updateGeometry", value: function _updateGeometry(
    oldGeomIds, newGeomId) {
      var fragList = this.fragList;
      var update = false;
      if (this.conserveMemory) {
        var geomids = fragList.geomids;
        for (var i = 0; i < geomids.length; ++i) {
          if (oldGeomIds[geomids[i]]) {
            this.changeFragmentGeometry(i, newGeomId);
            update = true;
          }
        }
      } else {
        var meshes = fragList.vizmeshes;
        for (var _i = 0; _i < meshes.length; ++_i) {
          var mesh = meshes[_i];
          if (mesh && mesh.geometry && oldGeomIds[mesh.geometry.svfid]) {
            this.changeFragmentGeometry(_i, newGeomId);
            update = true;
          }
        }
      }

      if (update)
      this.sceneUpdated(true);
    }

    /**
       * Validate geometry from caller
       *
       * @param {number|THREE.BufferGeometry|Array<number|THREE.BufferGeometry>} geometry The geometry or ids of the geometry
       *  to validate.
       * @returns {object.<string, boolean>} A map from id to true for the validated geometry. Null is returned if any
       *  of the geometry is invalid.
       * @private
       */ }, { key: "_validateGeometry", value: function _validateGeometry(
    geometry) {
      if (!Array.isArray(geometry))
      geometry = [geometry];

      var search = {};
      var geomList = this.geomList;
      for (var i = 0; i < geometry.length; ++i) {
        // Make sure geometry is valid
        var id = geometry[i];
        if (id instanceof THREE.BufferGeometry) {
          // The geometry is a BufferGeometry make sure it is right
          if (geomList.getGeometry(id.svfid) != id)
          return null;
          id = id.svfid;
        }
        if (!this.geomIds.isIdReserved(id))
        return null;
        search[id] = true;
      }

      return search;
    }

    /**
       * Change geometry in a model.
       *
       * @param {number|THREE.BufferGeometry} existingGeom The geometry or the id of the geometry to change
       * @param {THREE.BufferGeometry} geometry Geometry that replaces the existing geometry
       * @param {number} [numFragments] The number of fragments using this geometry.
       *  If not given, then we will count the number in the model. This is used to
       *  prioritize placing geometry on the GPU. Geometry used by more fragments
       *  gets a higher priority.
       * @returns {boolean} True if the existing geometry is valid and the geometry was changed.
       * @alias Autodesk.Viewing.Extensions.ModelBuilder#changeGeometry
       */ }, { key: "changeGeometry", value: function changeGeometry(
    existingGeom, geometry, numFragments) {
      var result = this._validateGeometry(existingGeom);
      if (!result)
      return false;
      var geomId = parseInt(Object.keys(result)[0]);
      var geomList = this.geomList;
      // Make sure existing geomId and the new geometry are valid
      if (!geometry || geometry && geometry.svfid !== undefined)
      return false;

      // remove the geometry
      var oldGeom = geomList.getGeometry(geomId);
      geomList.removeGeometry(geomId);

      // Count the number of fragment using geomId
      if (numFragments === undefined) {
        numFragments = 0;
        var fragList = this.fragList;
        if (fragList.useThreeMesh) {
          // Using THREE.Mesh directly, need to look there for the geometry
          if (oldGeom) {
            var meshes = fragList.vizmeshes;
            for (var i = 0; i < meshes.length; ++i) {
              if (meshes[i] && meshes[i].geometry === oldGeom)
              ++numFragments;
            }
          }
        } else {
          // Using geomIds, so look and fragment to geomId map
          var frag2geom = fragList.geomids;
          for (var _i2 = 0; _i2 < frag2geom.length; ++_i2) {
            if (frag2geom[_i2] === geomId)
            ++numFragments;
          }
        }
        numFragments = numFragments || 1;
      }


      // Sort of ugly - the geometry list will set geometry.boundingBox to null,
      // but if we aren't conserving memory we need to keep the bounding box.
      var bbox = geometry.boundingBox = geometry.boundingBox ||
      calculateBBox(geometry, this.conserveMemory ? tmpBox : new THREE.Box3());
      geomList.addGeometry(this.packNormals(geometry), numFragments, geomId);
      if (!this.conserveMemory)
      geometry.boundingBox = bbox;

      this._updateGeometry(result, geomId);
      // clear old geomId
      if (oldGeom)
      oldGeom.svfid = undefined;
      return true;
    }

    /**
       * Find fragments using a specific geometry.
       *
       * @param {number|THREE.BufferGeometry|Array<number|THREE.BufferGeometry>} geometry The geometry
       *  or id(s) of the geometry to use in the search
       * @returns {number[]} An array with the fragment ids for all fragments that were using
       *  the geometry. Null is returned if any geometry is invalid.
       * @alias Autodesk.Viewing.Extensions.ModelBuilder#findGeometryFragments
       */ }, { key: "findGeometryFragments", value: function findGeometryFragments(
    geometry) {
      var search = this._validateGeometry(geometry);

      var frags = [];
      var fragList = this.fragList;
      if (fragList.useThreeMesh) {
        // Using THREE.Mesh for the fragments, look there for the objects
        var meshes = fragList.vizmeshes;
        for (var i = 0; i < meshes.length; ++i) {
          var id = meshes[i] && meshes[i].geometry && meshes[i].geometry.svfid;
          if (search[id])
          frags.push(i);
        }
      } else {
        // Using geom ids for the fragments, look and the fragment to geom id map
        var geomids = fragList.geomids;
        for (var _i3 = 0; _i3 < geomids.length; ++_i3) {
          if (search[geomids[_i3]])
          frags.push(_i3);
        }
      }

      return frags;
    }

    /**
       * Remove geometry from the model.
       * The caller should dispose the geometry if needed.
       *
       * @param {number|THREE.BufferGeometry|Array<number|THREE.BufferGeometry>} geometry The geometry or id(s) of the geometry to remomve
       * @returns {boolean} True if all of the ids are valid and the geometry is removed.
       * @alias Autodesk.Viewing.Extensions.ModelBuilder#removeGeometry
       */ }, { key: "removeGeometry", value: function removeGeometry(
    geometry) {

      var delMap = this._validateGeometry(geometry);
      if (!delMap)
      return false;
      var geomList = this.geomList;

      this._updateGeometry(delMap, 0);

      var delIds = Object.keys(delMap);
      for (var i = 0; i < delIds.length; ++i) {
        var geomId = parseInt(delIds[i]);
        var _geometry = geomList.getGeometry(geomId);
        if (_geometry)
        _geometry.svfid = undefined;
        geomList.removeGeometry(geomId);
        this.geomIds.releaseId(geomId);
      }

      return true;
    }

    /**
       * Add a material that can be used by a mesh in the model.
       *
       * @param {string} name The name used for the material. This name must not be
       *  used for an existing material in the model.
       * @param {THREE.Material} material The material to add. This material must not
       *  be used in the model.
       * @returns {boolean} True if the material was added.
       * @alias Autodesk.Viewing.Extensions.ModelBuilder#addMaterial
       */ }, { key: "addMaterial", value: function addMaterial(
    name, material) {
      if (!material || material.materialManagerName)
      return false;
      name = name || "!!mtl-" + material.id;
      var matman = this.model.loader.viewer3DImpl.matman();
      var hash = matman._getMaterialHash(this.model, name);
      // Name must not be used and material must be valid.
      if (name === defaultMtlName || matman._materials[hash] || matman._materialsNonHDR[hash])
      return false;
      if (!material.packedNormals) {
        material.packedNormals = true;
        material.needsUpdate = true;
      }

      _addMaterial(matman, hash, material);

      material.materialManagerName = name;

      return true;
    }

    /**
       * Validate materials from caller
       *
       * @param {number|THREE.Material|Array<number|THREE.Material>} materials The materials or namess of the materials
       *  to validate.
       * @returns {string[]} An array of the hashes of the validated materials. Null is returned if any
       *  of the materials are invalid.
       * @private
       */ }, { key: "_validateMaterials", value: function _validateMaterials(
    materials) {
      if (!Array.isArray(materials))
      materials = [materials];

      var matman = this.model.loader.viewer3DImpl.matman();
      var mtls = [];
      for (var i = 0; i < materials.length; ++i) {
        var name = materials[i];
        var oldMat = void 0;
        var hash = void 0;
        if (name instanceof THREE.Material) {
          oldMat = name;
          name = name.materialManagerName;
          hash = matman._getMaterialHash(this.model, name);
          // Name must be the right material
          if (oldMat !== (matman._materials[hash] || matman._materialsNonHDR[hash]))
          return null;
        } else {
          hash = matman._getMaterialHash(this.model, name);
          // Name must be used
          var _oldMat = matman._materials[hash] || matman._materialsNonHDR[hash];
          if (!_oldMat)
          return null;
        }

        mtls.push(hash);
      }

      return mtls;
    }

    /**
       * Replaces an existing material with another one.
       *
       * @param {string|THREE.Material} existingMaterial The material or name of the material to change. The material
       *  must be in the model.
       * @param {THREE.Material} material The material to replace the existing material. This material
       *  must not be used in the model.
       * @returns {boolean} True if the material is valid and the material was changed.
       * @alias Autodesk.Viewing.Extensions.ModelBuilder#changeMaterial
       */ }, { key: "changeMaterial", value: function changeMaterial(
    existingMaterial, material) {
      if (!material || material.materialManagerName)
      return false;
      var mtls = this._validateMaterials(existingMaterial);
      if (!mtls)
      return false;

      var matman = this.model.loader.viewer3DImpl.matman();
      var hash = mtls[0];
      var oldMat = matman._materials[hash] || matman._materialsNonHDR[hash];
      var name = oldMat.materialManagerName;
      if (!material.packedNormals) {
        material.packedNormals = true;
        material.needsUpdate = true;
      }

      _addMaterial(matman, hash, material);
      oldMat.materialManagerName = undefined;
      material.materialManagerName = name;

      var fragList = this.fragList;
      if (fragList.useThreeMesh) {
        // Using meshes, need to replace the material in each mesh
        var meshes = fragList.vizmeshes;
        for (var i = 0; i < meshes.length; ++i) {
          if (meshes[i] && meshes[i].material === oldMat)
          meshes[i].material = material;
        }
      } else {
        // This is easier, because we just need to update the material
        // at the right id
        var matId = fragList.materialmap[oldMat.id];
        if (matId !== undefined) {
          fragList.materialmap[material.id] = matId;
          fragList.materialIdMap[matId] = material;
        }
      }

      return true;
    }

    /**
       * Find a material
       *
       * @param {string} name The name of the material
       */ }, { key: "findMaterial", value: function findMaterial(
    name) {
      var matman = this.model.loader.viewer3DImpl.matman();
      var hash = matman._getMaterialHash(this.model, name);
      return matman._materials[hash] || matman._materialsNonHDR[hash];
    }

    /**
       * Return the fragments that are using materials.
       *
       * @param {string|THREE.Material|Array<string|THREE.Material>} materials The materials or names of the materials to use in the search.
       * @returns {number[]} An array with the fragment ids for all
       *  fragments that were using the materials. Null is returned
       *  if any material name is invalid or all of the materials were not removed.
       * @alias Autodesk.Viewing.Extensions.ModelBuilder#findMaterialFragments
       */ }, { key: "findMaterialFragments", value: function findMaterialFragments(
    materials) {
      var hashes = this._validateMaterials(materials);
      if (!hashes)
      return null;

      var matman = this.model.loader.viewer3DImpl.matman();
      var fragList = this.fragList;
      var useThreeMesh = fragList.useThreeMesh;
      var findFrags = false;
      var matIds = {};
      for (var i = 0; i < hashes.length; ++i) {
        var oldMat = matman._materials[hashes[i]] || matman._materialsNonHDR[hashes[i]];
        var matId = useThreeMesh ? oldMat.id : fragList.materialmap[oldMat.id];
        if (matId !== undefined) {
          matIds[matId] = true;
          findFrags = true;
        }
      }

      var frags = [];
      if (findFrags) {
        if (useThreeMesh) {
          // Nees to seach the meshes for the material
          var meshes = fragList.vizmeshes;
          var fragCount = meshes.length;
          for (var _i4 = 0; _i4 < fragCount; ++_i4) {
            var id = meshes[_i4] && meshes[_i4].material && meshes[_i4].material.id;
            if (matIds[id])
            frags.push(_i4);
          }
        } else {
          // Need to search to the frag id to material id map
          var frag2MatId = fragList.materialids;
          var _fragCount = frag2MatId.length;
          for (var _i5 = 0; _i5 < _fragCount; ++_i5) {
            if (matIds[frag2MatId[_i5]])
            frags.push(_i5);
          }
        }
      }

      return frags;
    }

    /**
       * Remove a material from the model.
       * The caller should dispose the material if needed.
       *
       * @param {string|THREE.Material|Array<string|THREE.Material>} materials The materials or names of the materials to remove. All of the
       *  names must be used for materials in the model.
       * @returns {boolean} True if all of the names are valid and all of the materials are removed.
       * @alias Autodesk.Viewing.Extensions.ModelBuilder#removeMaterial
       */ }, { key: "removeMaterial", value: function removeMaterial(
    materials) {
      var hashes = this._validateMaterials(materials);
      if (!hashes)
      return false;

      var matman = this.model.loader.viewer3DImpl.matman();
      var fragList = this.fragList;
      var useThreeMesh = fragList.useThreeMesh;
      var idMap = {};
      var findFrags = false;

      for (var i = 0; i < hashes.length; ++i) {
        var oldMat = matman._materials[hashes[i]] || matman._materialsNonHDR[hashes[i]];
        delete matman._materials[hashes[i]];
        delete matman._materialsNonHDR[hashes[i]];

        if (useThreeMesh) {
          idMap[oldMat.id] = true;
          findFrags = true;
        } else {
          var matId = fragList.materialmap[oldMat.id];
          if (matId !== undefined) {
            delete fragList.materialmap[oldMat.id];
            delete fragList.materialIdMap[matId];
            idMap[matId] = true;
            findFrags = true;
          }
        }
      }

      // Map all fragments using this material to the default.
      if (findFrags) {
        if (useThreeMesh) {
          // Using THREE.Mesh for the fragments, search the mesh list
          var meshes = fragList.vizmeshes;
          for (var _i6 = 0; _i6 < meshes.length; ++_i6) {
            var id = meshes[_i6] && meshes[_i6].material && meshes[_i6].material.id;
            if (idMap[id]) {
              fragList.setMaterial(_i6, this._getDefaultMaterial());
            }
          }
        } else {
          // Use the frag to material id map to find materials to change
          var fragToMtlId = fragList.materialids;
          for (var _i7 = 0; _i7 < fragToMtlId.length; ++_i7) {
            if (idMap[fragToMtlId[_i7]]) {
              fragList.setMaterial(_i7, this._getDefaultMaterial());
            }
          }
        }
      }

      return true;
    }

    /**
       * Add a fragment to the model using a mesh.
       * Meshes can only be added to the model when {@link Autodesk.Viewing.Extensions.ModelBuilder#isConservingMemory} is false. 
       * Note the following restrictions:
       * - A mesh cannot be used multiple times.
       * - The geometry for a mesh cannot be used in different models.
       * - The material for a mesh cannot be used in different models.
       *
       * @param {THREE.Mesh} mesh The mesh to be added.
       * @param {boolean} [mesh.isLine=false] Optional bool to mark line geometry
       * @param {boolean} [mesh.isWideLine=false] Optional bool to mark wide line geometry
       * @param {boolean} [mesh.isPoint=false] Optional bool to mark point geometry
       * @param {number} [mesh.fragId] The fragment id for the mesh. This must not be defined
       *  when addMesh() is called and the Viewer sets this property to the new fragment id.
       * @param {number} [mesh.modeId] The id of the model. This must not be defined when
       *  addMesh() is called and the Viewer will set this to the id of the model for this ModelBuilder.
       * @param {number} [mesh.dbId] An optional object id for the mesh. Meshes with the same object id
       *  are selected as a unit. Internal tables are maintained to link fragments and dbIds. If a mesh is
       *  in the scene you shouldn't change this value direcly. Call
       *  {@link Autodesk.Viewing.Extensions.ModelBuilder#changeFragmentsDbId} to change it to insure
       *  the tables are updated.
       * @returns {boolean} True if the mesh was added.
       * @alias Autodesk.Viewing.Extensions.ModelBuilder#addMesh
       */ }, { key: "addMesh", value: function addMesh(
    mesh) {
      if (!mesh || this.conserveMemory || mesh.modelId !== undefined || mesh.fragId !== undefined)
      return false;
      if (!mesh.geometry || !mesh.material)
      return false;

      // Add the geometry, if it wasn't already added
      var svfid = mesh.geometry.svfid;
      if (svfid) {
        if (this.geomList.getGeometry(svfid) !== mesh.geometry)
        return false;
      } else if (!this.addGeometry(mesh.geometry))
      return false;

      // Add the material, if it wasn't already added
      var mtlName = mesh.material.materialManagerName;
      if (mtlName) {
        if (this.findMaterial(mtlName) !== mesh.material)
        return false;
      } else if (!this.addMaterial(undefined, mesh.material)) {
        svfid && this.removeGeometry(svfid);
        return false;
      }

      var fragId = this.fragmentIds.reserveId();
      mesh.dbId = mesh.dbId || START_FRAG_ID - fragId;
      this.model.setFragment(fragId, mesh, true);
      var fragments = this.fragList.fragments;
      fragments.fragId2dbId[fragId] = mesh.dbId;
      this.instanceTree.nodeAccess.addFragment(mesh.dbId, fragId);
      this.sceneUpdated(true);
      return true;
    }

    /**
       * Remove a mesh from the model.
       * Meshes can only be removed from the model when {@link Autodesk.Viewing.Extensions.ModelBuilder#isConservingMemory} is false.
       *
       * @param {THREE.Mesh|THREE.Mesh[]} meshes The meshes to be removed.
       * @returns {boolean} True if the mesh was removed.
       * @alias Autodesk.Viewing.Extensions.ModelBuilder#removeMesh
       */ }, { key: "removeMesh", value: function removeMesh(
    meshes) {
      if (this.conserveMemory)
      return false;

      return this.removeFragment(meshes);
    }

    /**
       * Use this method to inform the Viewer when you directly update a mesh you added
       * to the model. If you change a mesh directly without calling this method,
       * it may not display properly. You don't need to call this if you use the
       * ModelBuilder API to update a mesh.
       *
       * @param {THREE.Mesh|THREE.Mesh[]} meshes The meshes that were changed.
       * @param {boolean} [skipGeom=false] Set to true if the geometry in the meshes wasn't updated
       * @param {boolean} [skipTransform=false] Set to true if the tranforms in the meshes weren't update
       * @returns {boolean} True if the viewer was updated
       * @alias Autodesk.Viewing.Extensions.ModelBuilder#updateMesh
       */ }, { key: "updateMesh", value: function updateMesh(
    meshes, skipGeom, skipTransform) {
      // Did anything important change
      if (skipGeom && skipTransform)
      return true; // No, return success

      if (!Array.isArray(meshes))
      meshes = [meshes];

      var i = 0;
      var mesh;
      // Skip falsey meshes
      while (!(mesh = meshes[i])) {
        // No meshes in the input, return success;
        if (++i >= meshes.length)
        return true;
      }

      do {
        if (mesh) {
          if (!skipGeom) {
            this.packNormals(mesh.geometry);
            mesh.dispatchEvent(REMOVED_EVENT);
          }
          if (!skipTransform) {
            mesh.matrixWorld.copy(mesh.matrix);
          }
        }
        mesh = meshes[++i];
      } while (i < meshes.length);

      this.sceneUpdated(!(skipGeom && skipTransform));
      return true;
    }

    /**
       * Signal viewer that scene was modified.
       *
       * @param {boolean} [objectsMoved=false] True if transforms or geometry was changed
       * @param {boolean} [skipRepaint=false] True to skip repainting because of this change
       * @alias Autodesk.Viewing.Extensions.ModelBuilder#sceneUpdated
       */ }, { key: "sceneUpdated", value: function sceneUpdated(
    objectsMoved, skipRepaint) {
      this.model.loader.viewer3DImpl.sceneUpdated(objectsMoved, skipRepaint);
    }

    /**
       * Validate the parameters for a fragment
       *
       * @param {number|THREE.Mesh} fragment The mesh or fragment id whose geometry is to be set.
       * @param {number|THREE.BufferGeometry} geometry - The geometry or the id of the geometry for the fragment.
       *  Use a falsey value if the geometry for the fragment isn't ready. If the geometry hasn't been added
       *  to the model, this method will add it. Geometry must not be used in a different model.
       * @param {string|THREE.material} material The material or the name of the material for the fragment.
       *  A material name must be used by a material in the model, but a material will be added to the model
       *  if it hasn't been.
       * @returns {boolean} True if all parameters are valid
       * @private
       */ }, { key: "_validateFragment", value: function _validateFragment(
    fragment, geometry, material) {
      if (fragment instanceof THREE.Mesh) {
        if (!this.fragList.useThreeMesh || this.fragList.getVizmesh(fragment.fragId) !== fragment)
        return false;
      } else if (!this.fragmentIds.isIdReserved(fragment))
      return false;

      if (geometry) {
        if (geometry instanceof THREE.BufferGeometry) {
          if (geometry.svfid && this.geomList.getGeometry(geometry.svfid) !== geometry)
          return false;
        } else if (!this.geomIds.isIdReserved(geometry))
        return false;
      }

      if (material) {
        if (material instanceof THREE.Material) {
          if (material.materialManagerName &&
          this.findMaterial(material.materialManagerName) !== material) {
            return false;
          }
        } else if (!this.findMaterial(material))
        return false;
      }

      return true;
    }

    /**
       * Get the geometry id for some geometry
       *
       * @param {number|THREE.BufferGeometry} geometry The geometry or the geometry id. If this is geometry
       *  it will be added to the model if it hasn't been.
       * @returns {number|null} The id of the geometry, or null if the geometry is in a different model
       * @private
       */ }, { key: "_getGeometry", value: function _getGeometry(
    geometry) {
      return geometry instanceof THREE.BufferGeometry ? (
      geometry.svfid || this.addGeometry(geometry), geometry) :
      this.geomList.getGeometry(geometry);
    }

    /**
       * Get the material name for a material
       *
       * @param {number|THREE.Material} material The material or the material name. If this is a material
       *  it will be added to the model if it hasn't been.
       * @returns {string|null} The name of the material, or null if the material is in a different model
       * @private
       */ }, { key: "_getMaterial", value: function _getMaterial(
    material) {
      if (material instanceof THREE.Material) {
        if (material.materialManagerName) {
          return material;
        }
        this.addMaterial(undefined, material);
        return material;
      }

      return this.findMaterial(material);
    }

    /**
       * Add a fragment to a model.
       * A fragment is the combination of a geometry, a material, and a transform.
       * 
       * @param {number|THREE.BufferGeometry} geometry - The geometry or the id of the geometry for the fragment.
       *  Use a falsey value if the geometry for the fragment isn't ready. If the geometry hasn't been added
       *  to the model, this method will add it. Geometry must not be used in a different model.
       * @param {string|THREE.material} material The material or the name of the material instance for the fragment.
       *  A material name must be used by a material in the model, but a material will be added to the model
       *  if it hasn't already.
       * @param {THREE.Matrix|number[]} [transform] The transform for the fragment. Default
       *  is the identity transform. If an array is used it is a 4x3 matrix in column major order.
       * @param {THREE.Box3|number[]} [bbox] Bounding box for the fragment. Default is
       *  calculated from the geometry bounding box and the transform. 
       *  When {@link Autodesk.Viewing.Extensions.ModelBuilder#isConservingMemory} is true
       *  then this argument is ignored and the default is used. If an array is used
       *  it contains the minimum x, y, z followed by the maximum x, y, z.
       * @returns {number} The fragment id added or 0 if there was an error.
       * 
       * @alias Autodesk.Viewing.Extensions.ModelBuilder#addFragment
       */ }, { key: "addFragment", value: function addFragment(
    geometry, material, transform, bbox) {
      var fragIds = this.fragmentIds;
      var fragId = fragIds.reserveId();
      if (fragId === undefined || !this._validateFragment(fragId, geometry, material))
      return 0;
      if (_changeFragmentGeometry(this, fragId, geometry, material, transform, bbox))
      return fragId;
      fragIds.releaseId(fragId);
      return 0;
    }

    /**
       * Change the geometry and transform for a fragment.
       * 
       * @param {number|THREE.Mesh} fragment The mesh or fragment id whose geometry is to be set.
       * @param {number|THREE.BufferGeometry} geometry - The geometry or the id of the geometry for the fragment.
       *  Use a falsey value if the geometry for the fragment isn't ready. If the geometry hasn't been added
       *  to the model, this method will add it. Geometry must not be used in a different model.
       * @param {THREE.Matrix|number[]} [transform] The transform for the fragment. If not
       *  present the transform isn't changed. If an array is used it is a 4x3 matrix in column major order.
       * @param {THREE.Box3|number[]} [bbox] Bounding box for the fragment. Default is
       *  calculated from the geometry bounding box and the transform. 
       *  When {@link Autodesk.Viewing.Extensions.ModelBuilder#isConservingMemory} is true
       *  then this argument is ignored and the default is used. If an array is used
       *  it contains the minimum x, y, z followed by the maximum x, y, z.
       * @returns {boolean} True if the geometry id is valid and the fragment is changed.
       * 
       * @alias Autodesk.Viewing.Extensions.ModelBuilder#changeFragmentGeometry
       */ }, { key: "changeFragmentGeometry", value: function changeFragmentGeometry(
    fragment, geometry, transform, bbox) {
      if (!this._validateFragment(fragment, geometry))
      return false;
      var fragId = getFragmentId(fragment);
      transform = transform || (this.fragList.getOriginalWorldMatrix(fragId, tmpMatrix), tmpMatrix);
      if (!_changeFragmentGeometry(this, fragment, geometry, undefined, transform, bbox))
      return false;
      return true;
    }

    /**
       * Get the default material
       *
       * @returns {THREE.Material} The default material
       * @private
       */ }, { key: "_getDefaultMaterial", value: function _getDefaultMaterial()
    {
      // If already have default material, then use it
      if (this._defaultMaterial)
      return this._defaultMaterial;

      // Clone the matman default.
      var matman = this.model.loader.viewer3DImpl.matman();
      var mtl = matman.defaultMaterial.clone();

      // Make sure packed normals is true.
      mtl.packedNormals = true;
      mtl.needsUpdate = true;

      // Add it to the material manager
      matman.addMaterial(matman._getMaterialHash(this.model, defaultMtlName), mtl);
      this._defaultMaterial = mtl;
      mtl.materialManagerName = defaultMtlName;
      return mtl;
    }

    /**
       * Change the material for a fragment.
       *
       * @param {number|THREE.Mesh} fragment The mesh or fragment id whose material is to be set.
       * @param {string|THREE.material} material The material or the name of the material for the fragment.
       *  A material name must be used by a material in the model, but a material will be added to the model
       *  if it hasn't been.
       * @returns {boolean} True if the material id is valid and the fragment is changed.
       * @alias Autodesk.Viewing.Extensions.ModelBuilder#changeFragmentMaterial
       */ }, { key: "changeFragmentMaterial", value: function changeFragmentMaterial(
    fragment, material) {
      if (!this._validateFragment(fragment, undefined, material))
      return false;

      // get the Material and set it for the fragment
      var mtl = this._getMaterial(material) || this._getDefaultMaterial();
      this.fragList.setMaterial(getFragmentId(fragment), mtl);
      this.sceneUpdated(false);
      return true;
    }

    /**
       * Change the transform for a fragment.
       *
       * @param {number|THREE.Mesh} fragment The mesh or fragment id whose material is to be set.
       * @param {THREE.Matrix|number[]} transform The transform for the fragment.
       *  If an array is used it is a 4x3 matrix in column major order.
       * @param {THREE.Box3|number[]} [bbox] [bbox] Bounding box for the fragment. Default is
       *  calculated from the geometry bounding box and the transform. 
       *  When {@link Autodesk.Viewing.Extensions.ModelBuilder#isConservingMemory} is true
       *  then this argument is ignored and the default is used. If an array is used
       *  it contains the minimum x, y, z followed by the maximum x, y, z.
       * @returns {boolean} True if the fragId is valid and the transform was changed.
       * @alias Autodesk.Viewing.Extensions.ModelBuilder#changeFragmentTransform
       */ }, { key: "changeFragmentTransform", value: function changeFragmentTransform(
    fragment, transform, bbox) {
      if (!transform || !this._validateFragment(fragment))
      return false;

      // Need to replace the geometry with the same id to change
      // the transform.
      var id = getFragmentId(fragment);
      if (!this.changeFragmentGeometry(id, this.fragList.getGeometryId(id),
      transform, bbox)) {
        return false;
      }
      this.sceneUpdated(true);
      return true;
    }

    /**
       * Change the dbId of one or more fragments
       *
       * @param {number|THREE.Mesh|Array<number|THREE.Mesh>} fragments The meshes or ids of the fragments to be changed
       * @param {number} dbId The new dbId of the fragments. A 0 dbId will prevent an object from being selected.
       *  All fragments with the same dbId are selected as a single object. Changing the dbids on fragments will
       *  not change the display of objects that are already selected.
       * @returns {boolean} True if all of the fragment ids were valid and all of the
       *  fragments were changed.
       * @alias Autodesk.Viewing.Extensions.ModelBuilder#changeFragmentsDbId
       */ }, { key: "changeFragmentsDbId", value: function changeFragmentsDbId(
    fragments, dbId) {
      if (!Array.isArray(fragments))
      fragments = [fragments];

      dbId = dbId | 0; // Force dbId to integer
      for (var i = 0; i < fragments.length; ++i) {
        // Make sure the fragId is valid;
        if (!this._validateFragment(fragments[i]))
        return false;
      }

      var frags = this.fragList.fragments;
      var instanceTree = this.instanceTree;
      var fragId2dbId = frags.fragId2dbId;
      if (this.conserveMemory) {
        for (var _i8 = 0; _i8 < fragments.length; ++_i8) {
          var id = getFragmentId(fragments[_i8]);
          changeDbId(dbId, id, fragId2dbId, instanceTree);
        }
      } else {
        var array = this.fragList.vizmeshes;
        for (var _i9 = 0; _i9 < fragments.length; ++_i9) {
          var _id = getFragmentId(fragments[_i9]);
          changeDbId(dbId, _id, fragId2dbId, instanceTree);
          array[_id].dbId = dbId;
        }
      }

      return true;
    }

    /**
       * Remove fragments from the model
       *
       * @param {number|THREE.Mesh|Array<number|THREE.Mesh>} fragments The meshes or ids of the fragments to be removed
       * @returns {boolean} True if all of the fragment ids were valid and all of the
       *  fragments were removed.
       * @alias Autodesk.Viewing.Extensions.ModelBuilder#removeFragment
       */ }, { key: "removeFragment", value: function removeFragment(
    fragments) {
      if (!Array.isArray(fragments))
      fragments = [fragments];

      for (var i = 0; i < fragments.length; ++i) {
        // Make sure the fragId is valid;
        if (!this._validateFragment(fragments[i]))
        return false;
      }

      var frags = this.fragList.fragments;
      var instanceTree = this.instanceTree;
      var array = this.conserveMemory ? this.fragList.geomids : this.fragList.vizmeshes;
      var clear = this.conserveMemory ? 0 : null;
      for (var _i10 = 0; _i10 < fragments.length; ++_i10) {
        var id = getFragmentId(fragments[_i10]);
        this.fragmentIds.releaseId(id);
        instanceTree.nodeAccess.removeFragment(frags.fragId2dbId[id], id);
        frags.fragId2dbId[id] = 0;
        if (!this.conserveMemory && array[id]) {
          array[id].dispatchEvent(REMOVED_EVENT);
          array[id].fragId = array[id].modelId = undefined;
        }
        array[id] = clear;
      }
      this.sceneUpdated(true);

      return true;
    }

    /**
       * Pack normals for geometry.
       * Utility method automatically used when {@link Autodesk.Viewing.Extensions.ModelBuilder#isConservingMemory} is true.
       * 
       * @param {THREE.BufferGeometry} geometry 
       * @returns {THREE.BufferGeometry} The geometry argument is returned
       * 
       * @alias Autodesk.Viewing.Extensions.ModelBuilder#packNormals
       */ }, { key: "packNormals", value: function packNormals(
    geometry) {
      var attributes = geometry.attributes;
      var normal = attributes.normal;
      // If no normals or normals are already packed, then skip this
      if (!normal || normal.itemSize !== 3)
      return geometry;

      /**
                        * @param src
                        * @param srcOff
                        * @param srcStride
                        * @param dst
                        * @param dstOff
                        * @param dstStride
                        * @private
                        */
      function cvt(src, srcOff, srcStride, dst, dstOff, dstStride) {
        var atan2 = Math.atan2;
        var INV_PI = 1 / Math.PI;
        for (; srcOff < src.length; srcOff += srcStride, dstOff += dstStride) {
          var pnx = (atan2(src[srcOff + 1], src[srcOff]) * INV_PI + 1.0) * 0.5;
          var pny = (src[srcOff + 2] + 1.0) * 0.5;

          dst[dstOff] = pnx * 65535 | 0;
          dst[dstOff + 1] = pny * 65535 | 0;
        }
      }

      if (normal.array) {
        // The normals are not interleaved
        var vcount = Math.floor(normal.length / normal.itemSize);
        var dst = new Uint16Array(vcount * 2);
        cvt(normal.array, 0, 3, dst, 0, 2);
        normal.itemSize = 2;
        normal.array = dst;
        normal.normalized = true;
        normal.needsUpdate = true;
        normal.bytesPerItem = 2;
      } else {
        // The normals are part of an interleaved buffer
        // First copy all of the data that isn't normal to the new buffer
        var vbstride = geometry.vbstride;
        var vb = geometry.vb;
        var _vcount = Math.floor(vb.length / vbstride);

        // ALlocate the new buffer. The normals shrink from 3 floats to
        // 2 UInt16s which is 1 float. So reduce the vbstride by 2
        var _dst = new Float32Array((vbstride - 2) * _vcount);
        var srcOff = normal.itemOffset;

        if (srcOff <= 0 || srcOff + 3 >= vbstride) {
          // Normals are at start or end of interleaved buffer
          var from = srcOff <= 0 ? 3 : 0;
          var to = srcOff <= 0 ? 1 : 0;
          var length = vbstride - 3;
          for (var i = 0; i < _vcount; ++i, from += 3, to += 1) {
            for (var j = 0; j < length; ++j) {
              _dst[to++] = vb[from++];
            }
          }
        } else {
          // Normals are in the middle of interleaved buffer
          // Normals are at start or end of interleaved buffer
          var _from = 0;
          var _to = 0;
          var length1 = srcOff;
          var length2 = vbstride - srcOff - 3;
          for (var _i11 = 0; _i11 < _vcount; ++_i11) {
            for (var _j = 0; _j < length1; ++_j) {
              _dst[_to++] = vb[_from++];
            }
            _from += 3;
            _to += 1;
            for (var _j2 = 0; _j2 < length2; ++_j2) {
              _dst[_to++] = vb[_from++];
            }
          }
        }

        // Pack the normals, Recast the interleaved buffer as 16 bit ints
        cvt(vb, srcOff, vbstride, new Uint16Array(_dst.buffer), srcOff * 2, (vbstride - 2) * 2);
        geometry.vbstride -= 2;
        geometry.vb = _dst;
        geometry.vbNeedsUpdate = true;
        // For interleaved case, the attributes are cached and shared, so we need
        // to find the attribute with the proper description.
        attributes.normal = avp.BufferGeometryUtils.findBufferAttribute('normal', {
          array: null,
          bytesPerItem: 2,
          itemSize: 2,
          normalize: true,
          isPattern: normal.isPattern,
          divisor: normal.divisor,
          offset: normal.itemOffset },
        geometry.numInstances);

        // Adjust all of the offsets for the packed buffers
        var keys = Object.keys(attributes);
        for (var _i12 = 0; _i12 < keys.length; ++_i12) {
          var attr = attributes[keys[_i12]];
          if (!attr.array && attr.itemOffset > srcOff) {
            // For interleaved case, the attributes are cached and shared, so we need
            // to find the attribute with the proper description.
            attributes[keys[_i12]] = avp.BufferGeometryUtils.findBufferAttribute(keys[_i12], {
              array: null,
              bytesPerItem: attr.bytesPerItem,
              itemSize: attr.itemSize,
              normalized: attr.normalized,
              isPattern: attr.isPattern,
              divisor: attr.divisor,
              offset: attr.itemOffset - 2 },
            geometry.numInstances);
          }
        }
      }

      return geometry;
    }

    /**
       * Add a new model to the viewer
       *
       * @param {Autodesk.Extensions.SceneBuilder.SceneBuilder} sceneBuilder The SceneBuilder asking for the model
       * @param {any} options Options for adding the model.
       * @param {boolean} [options.conserveMemory] Set to true to turn on memory conservation mode.
       *  In this mode [addMesh()]{@link Extensions.SceneBuilder.ModelBuilder#addMesh} is not available because a single mesh is shared among
       *  all of the fragments in the model.
       * @param {boolean} [options.createWireframe] Set to true to turn on edge generation for geometry.
       * @returns {Promise<Autodesk.Extensions.SceneBuilder.ModelBuilder>} A promise that resolves to the ModelBuilder for the new model.
       * @private
       */ }], [{ key: "addNewModel", value: function addNewModel(
    sceneBuilder, options) {
      return new Promise(function (resolve, reject) {
        //Set up overrides for Fluent
        var loadOptions = Object.assign({}, options);
        loadOptions.fileLoader = EmptyModelLoader;
        loadOptions.globalOffset = loadOptions.globalOffset || { x: 0, y: 0, z: 0 }; //Make camera operations more sane by not having to offset everything

        sceneBuilder.viewer.loadModel("Dummy", loadOptions, function (model) {
          resolve(new ModelBuilder(model, loadOptions));
        }, function (error) {
          reject(error);
        });
      });
    } }]);return ModelBuilder;}();




/***/ }),

/***/ "./extensions/SceneBuilder/reusableIds.js":
/*!************************************************!*\
  !*** ./extensions/SceneBuilder/reusableIds.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ReusableIds": () => (/* binding */ ReusableIds)
/* harmony export */ });
/* harmony import */ var bintrees__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bintrees */ "./node_modules/bintrees/index.js");
/* harmony import */ var bintrees__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bintrees__WEBPACK_IMPORTED_MODULE_0__);
function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

var tmpRange = [0, 1];

/**
                        * Table to manage ids that can be  reserved and released and keep the
                        * id values as compact as possible.
                        */
var ReusableIds = /*#__PURE__*/function () {
  /**
                                                    * Construct the id table
                                                    */
  function ReusableIds(lowId, highId, reserve) {_classCallCheck(this, ReusableIds);
    this._lowId = lowId === undefined ? 0 : lowId | 0;
    this._highId = highId === undefined ? 4 * 1024 * 1024 * 1024 - 1 : highId | 0;
    this._availableIds = new bintrees__WEBPACK_IMPORTED_MODULE_0__.RBTree(function (a, b) {return a[0] - b[0];});
    this._availableIds.insert([this._lowId + (reserve | 0), this._highId]);
  }

  /**
     * Get next id
     * @return {number|undefined} The next id or undefined if there aren't any more ids.
     */_createClass(ReusableIds, [{ key: "reserveId", value: function reserveId()
    {
      var range = this._availableIds.min();
      if (range === null)
      return undefined;
      var id = range[0];
      if (id >= range[1]) {
        // Remove the empty range.
        this._availableIds.remove(range);
      } else {
        // Updating the key of the RBTree without removing and inserting it
        // is probably not correct, but the ranges are all disjoint and so it should be OK
        ++range[0];
      }
      return id;
    }

    /**
       * Make an id available again
       * @param {number} id The id
       * @return {Boolean} True if the id can be released.
       */ }, { key: "releaseId", value: function releaseId(
    id) {
      if (id < this._lowId || id > this._highId)
      return false;

      tmpRange[0] = id; // Only the first
      var ranges = this._availableIds.lowerBound(tmpRange);
      var upper = ranges.data();
      if (upper !== null) {
        // Make sure the id isn't already in a range
        if (upper[0] <= id && upper[1] >= id) {
          return false;
        }

        ranges.prev();
        var lower = ranges.data();
        if (id + 1 === upper[0]) {
          if (lower === null || id - 1 > lower[1]) {
            // Extend the upper range to include id
            // Updating the key of the RBTree without removing and inserting it
            // is probably not correct, but the ranges are all disjoint and so it should be OK
            upper[0] = id;
          } else {
            // Combine upper and lower ranges
            this._availableIds.remove(upper);
            this._availableIds.remove(lower);
            upper[0] = lower[0];
            this._availableIds.insert(upper);
          }
        } else if (lower === null || id - 1 > lower[1]) {
          // Add a new single id range
          this._availableIds.insert([id, id]);
        } else {
          // Extend the lower range
          // Updating the key of the RBTree without removing and inserting it
          // is probably not correct, but the ranges are all disjoint and so it should be OK
          lower[1] = id;
        }
      }

      return true;
    } }, { key: "isIdReserved", value: function isIdReserved(

    id) {
      if (id < this._lowId || id > this._highId)
      return false;

      tmpRange[0] = id; // Only the first
      var upper = this._availableIds.upperBound(tmpRange).prev();
      return !upper || id < upper[0] || id > upper[1];
    } }]);return ReusableIds;}();

/***/ }),

/***/ "./res/locales/cs/nobundle-scene-builder.loc.json":
/*!********************************************************!*\
  !*** ./res/locales/cs/nobundle-scene-builder.loc.json ***!
  \********************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"cs","@@context":"Rozšíření SceneBuilder","Scene Builder %(modelId)":"Scene Builder %(modelId)","Root":"Kořen","Object %(nodeId)":"Object %(nodeId)"}');

/***/ }),

/***/ "./res/locales/da/nobundle-scene-builder.loc.json":
/*!********************************************************!*\
  !*** ./res/locales/da/nobundle-scene-builder.loc.json ***!
  \********************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"da","@@context":"SceneBuilder-udvidelse","Scene Builder %(modelId)":"Scene Builder %(modelId)","Root":"Rod","Object %(nodeId)":"Object %(nodeId)"}');

/***/ }),

/***/ "./res/locales/de/nobundle-scene-builder.loc.json":
/*!********************************************************!*\
  !*** ./res/locales/de/nobundle-scene-builder.loc.json ***!
  \********************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"de","@@context":"SceneBuilder-Erweiterung","Scene Builder %(modelId)":"Scene Builder %(modelId)","Root":"Stammverzeichnis","Object %(nodeId)":"Object %(nodeId)"}');

/***/ }),

/***/ "./res/locales/en-GB/nobundle-scene-builder.loc.json":
/*!***********************************************************!*\
  !*** ./res/locales/en-GB/nobundle-scene-builder.loc.json ***!
  \***********************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"en","@@context":"SceneBuilder Extension","Scene Builder %(modelId)":"Scene Builder %(modelId)","Root":"Root","Object %(nodeId)":"Object %(nodeId)"}');

/***/ }),

/***/ "./res/locales/en/nobundle-scene-builder.loc.json":
/*!********************************************************!*\
  !*** ./res/locales/en/nobundle-scene-builder.loc.json ***!
  \********************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"en","@@context":"SceneBuilder Extension","Scene Builder %(modelId)":"Scene Builder %(modelId)","Root":"Root","Object %(nodeId)":"Object %(nodeId)"}');

/***/ }),

/***/ "./res/locales/es/nobundle-scene-builder.loc.json":
/*!********************************************************!*\
  !*** ./res/locales/es/nobundle-scene-builder.loc.json ***!
  \********************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"es","@@context":"Extensión SceneBuilder","Scene Builder %(modelId)":"Scene Builder %(modelId)","Root":"Raíz","Object %(nodeId)":"Object %(nodeId)"}');

/***/ }),

/***/ "./res/locales/fr-CA/nobundle-scene-builder.loc.json":
/*!***********************************************************!*\
  !*** ./res/locales/fr-CA/nobundle-scene-builder.loc.json ***!
  \***********************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"fr-CA","@@context":"Extension SceneBuilder (générateur de scène)","Scene Builder %(modelId)":"Scene Builder %(modelId)","Root":"Racine","Object %(nodeId)":"Object %(nodeId)"}');

/***/ }),

/***/ "./res/locales/fr/nobundle-scene-builder.loc.json":
/*!********************************************************!*\
  !*** ./res/locales/fr/nobundle-scene-builder.loc.json ***!
  \********************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"fr","@@context":"Extension SceneBuilder","Scene Builder %(modelId)":"Scene Builder %(modelId)","Root":"Racine","Object %(nodeId)":"Object %(nodeId)"}');

/***/ }),

/***/ "./res/locales/it/nobundle-scene-builder.loc.json":
/*!********************************************************!*\
  !*** ./res/locales/it/nobundle-scene-builder.loc.json ***!
  \********************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"it","@@context":"Estensione SceneBuilder","Scene Builder %(modelId)":"Scene Builder %(modelId)","Root":"Radice","Object %(nodeId)":"Object %(nodeId)"}');

/***/ }),

/***/ "./res/locales/ja/nobundle-scene-builder.loc.json":
/*!********************************************************!*\
  !*** ./res/locales/ja/nobundle-scene-builder.loc.json ***!
  \********************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"ja","@@context":"SceneBuilder Extension","Scene Builder %(modelId)":"Scene Builder %(modelId)","Root":"ルート","Object %(nodeId)":"Object %(nodeId)"}');

/***/ }),

/***/ "./res/locales/ko/nobundle-scene-builder.loc.json":
/*!********************************************************!*\
  !*** ./res/locales/ko/nobundle-scene-builder.loc.json ***!
  \********************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"ko","@@context":"SceneBuilder 확장","Scene Builder %(modelId)":"Scene Builder %(modelId)","Root":"루트","Object %(nodeId)":"Object %(nodeId)"}');

/***/ }),

/***/ "./res/locales/nl/nobundle-scene-builder.loc.json":
/*!********************************************************!*\
  !*** ./res/locales/nl/nobundle-scene-builder.loc.json ***!
  \********************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"nl","@@context":"SceneBuilder Extension","Scene Builder %(modelId)":"Scene Builder %(modelId)","Root":"Root","Object %(nodeId)":"Object %(nodeId)"}');

/***/ }),

/***/ "./res/locales/no/nobundle-scene-builder.loc.json":
/*!********************************************************!*\
  !*** ./res/locales/no/nobundle-scene-builder.loc.json ***!
  \********************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"no","@@context":"SceneBuilder-utvidelse","Scene Builder %(modelId)":"Scene Builder %(modelId)","Root":"Rot","Object %(nodeId)":"Object %(nodeId)"}');

/***/ }),

/***/ "./res/locales/pl/nobundle-scene-builder.loc.json":
/*!********************************************************!*\
  !*** ./res/locales/pl/nobundle-scene-builder.loc.json ***!
  \********************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"pl","@@context":"Rozszerzenie SceneBuilder","Scene Builder %(modelId)":"Scene Builder %(modelId)","Root":"Katalog główny","Object %(nodeId)":"Object %(nodeId)"}');

/***/ }),

/***/ "./res/locales/pt-BR/nobundle-scene-builder.loc.json":
/*!***********************************************************!*\
  !*** ./res/locales/pt-BR/nobundle-scene-builder.loc.json ***!
  \***********************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"pt","@@context":"Extensão SceneBuilder","Scene Builder %(modelId)":"Scene Builder %(modelId)","Root":"Raiz","Object %(nodeId)":"Object %(nodeId)"}');

/***/ }),

/***/ "./res/locales/ru/nobundle-scene-builder.loc.json":
/*!********************************************************!*\
  !*** ./res/locales/ru/nobundle-scene-builder.loc.json ***!
  \********************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"ru","@@context":"Расширение SceneBuilder","Scene Builder %(modelId)":"Scene Builder %(modelId)","Root":"Корневая папка","Object %(nodeId)":"Object %(nodeId)"}');

/***/ }),

/***/ "./res/locales/sv/nobundle-scene-builder.loc.json":
/*!********************************************************!*\
  !*** ./res/locales/sv/nobundle-scene-builder.loc.json ***!
  \********************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"sv","@@context":"SceneBuilder-tillägg","Scene Builder %(modelId)":"Scene Builder %(modelId)","Root":"Rot","Object %(nodeId)":"Object %(nodeId)"}');

/***/ }),

/***/ "./res/locales/tr/nobundle-scene-builder.loc.json":
/*!********************************************************!*\
  !*** ./res/locales/tr/nobundle-scene-builder.loc.json ***!
  \********************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"tr","@@context":"SceneBuilder Uzantısı","Scene Builder %(modelId)":"Scene Builder %(modelId)","Root":"Kök","Object %(nodeId)":"Object %(nodeId)"}');

/***/ }),

/***/ "./res/locales/zh-HANS/nobundle-scene-builder.loc.json":
/*!*************************************************************!*\
  !*** ./res/locales/zh-HANS/nobundle-scene-builder.loc.json ***!
  \*************************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"zh-Hans","@@context":"场景生成器扩展","Scene Builder %(modelId)":"Scene Builder %(modelId)","Root":"根","Object %(nodeId)":"Object %(nodeId)"}');

/***/ }),

/***/ "./res/locales/zh-HANT/nobundle-scene-builder.loc.json":
/*!*************************************************************!*\
  !*** ./res/locales/zh-HANT/nobundle-scene-builder.loc.json ***!
  \*************************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"zh-Hant","@@context":"場景建置器延伸","Scene Builder %(modelId)":"Scene Builder %(modelId)","Root":"根","Object %(nodeId)":"Object %(nodeId)"}');

/***/ }),

/***/ "./res/locales/zh-HK/nobundle-scene-builder.loc.json":
/*!***********************************************************!*\
  !*** ./res/locales/zh-HK/nobundle-scene-builder.loc.json ***!
  \***********************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"zh-hk","@@context":"場景建置器擴充功能","Scene Builder %(modelId)":"Scene Builder %(modelId)","Root":"根","Object %(nodeId)":"Object %(nodeId)"}');

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
/*!*************************************************!*\
  !*** ./extensions/SceneBuilder/sceneBuilder.js ***!
  \*************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modelBuilder__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modelBuilder */ "./extensions/SceneBuilder/modelBuilder.js");
/* harmony import */ var _locales__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./locales */ "./extensions/SceneBuilder/locales.js");
function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}


var av = Autodesk.Viewing;
var SCENE_BUILD_EXTENSION_ID = "Autodesk.Viewing.SceneBuilder";

/**
                                                                 * Scene Builder extension provides an API for building scenes without
                                                                 * loading them from a URL.
                                                                 * 
                                                                 * The extension id is: `Autodesk.Viewing.SceneBuilder`
                                                                 * 
                                                                 * @example
                                                                 *  viewer.loadExtension('Autodesk.Viewing.SceneBuilder');
                                                                 * 
                                                                 * @memberof Autodesk.Viewing.Extensions
                                                                 * @alias Autodesk.Viewing.Extensions.SceneBuilder
                                                                 */var
SceneBuilder = /*#__PURE__*/function (_av$Extension) {_inherits(SceneBuilder, _av$Extension);var _super = _createSuper(SceneBuilder);

  /**
                                                                                                                                       * @class
                                                                                                                                       * @param {Autodesk.Viewing.Viewer3D} viewer The viewer instance loading the extension
                                                                                                                                       * @param {object} [options] Default options used when calling addNewModel
                                                                                                                                       * @param {boolean} [options.conserveMemory=false] Set to true to turn on memory conservation mode.
                                                                                                                                       *  In this mode [addMesh()]{@link Autodesk.Viewing.Extensions.SceneBuilder#addMesh} is not available because a single mesh is shared among
                                                                                                                                       *  all of the fragments in the model.
                                                                                                                                       */
  function SceneBuilder(viewer, options) {var _this;_classCallCheck(this, SceneBuilder);
    _this = _super.call(this, viewer, options);
    _this._loaded = false;
    _this.extendLocalization(_locales__WEBPACK_IMPORTED_MODULE_1__.locales);return _this;
  }

  /**
     * Extension interface method - loads the extension
     *
     * @alias Autodesk.Viewing.Extensions.SceneBuilder#load
     * @returns {boolean}
     */_createClass(SceneBuilder, [{ key: "load", value: function load()
    {
      this._loaded = true;
      return true;
    }

    /**
       * Extension interface method - unloads the extension
       * Method {@link Autodesk.Viewing.Extensions.SceneBuilder#addNewModel} will fail if the extension is unloaded.
       *
       * @alias Autodesk.Viewing.Extensions.SceneBuilder#unload
       */ }, { key: "unload", value: function unload()
    {
      this._loaded = false;
      return true;
    }

    /**
       * Add a new empty model into the scene. The model can be manipulated only by its associated
       * ModelBuilder instance.
       *
       * @param {object} [options] Options combined with the options used  when the
       *  extension is loaded with loadExtension(). The combined options are
       *  put in the loadOptions property in the object returned by model.getData().
       * @param {boolean} [options.conserveMemory=false] Set to true to turn on memory conservation mode.
       *  In this mode [addMesh()]{@link Autodesk.Viewing.Extensions.SceneBuilder#addMesh} is not available because a single mesh is shared among
       *  all of the fragments in the model.
       * @param {boolean} [options.createWireframe] Set to true to turn on edge generation for geometry. 
       * @returns {Promise.<Autodesk.Viewing.Extensions.ModelBuilder>} A Promise that resolves with a ModelBuilder instance for the new model.
       *
       * @alias Autodesk.Viewing.Extensions.SceneBuilder#addNewModel
       */ }, { key: "addNewModel", value: function addNewModel(
    options) {
      if (!this._loaded) {
        return Promise.reject(new Error("SceneBuilder extension not loaded"));
      }

      return _modelBuilder__WEBPACK_IMPORTED_MODULE_0__.ModelBuilder.addNewModel(this, Object.assign({}, this.options, options));
    } }]);return SceneBuilder;}(av.Extension);


av.theExtensionManager.registerExtension(SCENE_BUILD_EXTENSION_ID, SceneBuilder);
})();

Autodesk.Extensions.SceneBuilder = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=SceneBuilder.js.map