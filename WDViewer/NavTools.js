!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var r=t();for(var n in r)("object"==typeof exports?exports:e)[n]=r[n]}}(self,(function(){return(()=>{"use strict";var e,t,r,n={87233:(e,t,r)=>{r.r(t);var n=r(54800);class o extends n.Z{constructor(e,t={}){super(e,t),this.viewer=e,this.speed=4,this.lister={NAVIGATION_MODE_CHANGED_EVENT:this.navLister.bind(this),VIEWER_RESIZE_EVENT:this.resize.bind(this)},this.ui=null}static get ExtensionId(){return"VE.NavTools"}load(){return this.viewer,!0}unload(){const e=this.viewer;return e.removeEventListener(Autodesk.Viewing.NAVIGATION_MODE_CHANGED_EVENT,this.lister.NAVIGATION_MODE_CHANGED_EVENT),e.addEventListener(Autodesk.Viewing.VIEWER_RESIZE_EVENT,this.lister.VIEWER_RESIZE_EVENT),this.off(),!0}onToolbarCreated(){this.viewer.addEventListener(Autodesk.Viewing.NAVIGATION_MODE_CHANGED_EVENT,this.lister.NAVIGATION_MODE_CHANGED_EVENT)}navLister(e){const t=this.viewer;"bimwalk"===e.id?t.container.getElementsByClassName("roam-relate-func-class").length?this.ui.style.display="block":this.createUi():this.destoryUi()}resize(){if(!this.ui)return;const e=this.viewer;this.ui.style.top=e.getToolbar().container.offsetTop-20+"px"}createUi(){const e=this.viewer,t=e.getExtension("Autodesk.BimWalk");this.on("onSpeed",this.onSpeed),this.emit("onSpeed");let r=document.createElement("div");r.setAttribute("class","roam-relate-func-class"),r.style.height="38px",r.style.lineHeight="38px",r.style.background="rgba(34, 34, 34, 0.6)",r.style.borderRadius="3px",r.style.display="block",r.style.position="absolute",r.style.top=e.getToolbar().container.offsetTop-20+"px",r.style.left="50%",r.style.transform="translate(-50%, -50%)",e.container.appendChild(r),this.ui=r,e.addEventListener(Autodesk.Viewing.VIEWER_RESIZE_EVENT,this.lister.VIEWER_RESIZE_EVENT);let n=document.createElement("div");n.setAttribute("class","roam-relate-func-speed"),n.style.height="38px",n.style.lineHeight="38px",n.style.float="left";let o=document.createElement("span");o.style.fontSize="14px",o.style.marginLeft="10px",o.innerHTML="速度：",n.appendChild(o);let i=document.createElement("span");i.style.fontSize="22px",i.style.cursor="pointer",i.innerHTML="&nbsp;-&nbsp;&nbsp;",i.addEventListener("click",(e=>{this.speed+=this.speed<=2?0:-1,t.set("topWalkSpeed",this.speed),this.emit("onSpeed"),d.innerHTML=this.speed+"x"}),!1),n.appendChild(i);let d=document.createElement("span");d.style.fontSize="14px",d.innerHTML=this.speed+"x",n.appendChild(d);let s=document.createElement("span");s.style.fontSize="22px",s.style.cursor="pointer",s.innerHTML="&nbsp;&nbsp;+&nbsp;",s.addEventListener("click",(e=>{this.speed+=this.speed>=6?0:1,t.set("topWalkSpeed",this.speed),this.emit("onSpeed"),d.innerHTML=this.speed+"x"}),!1),n.appendChild(s),r.appendChild(n);let l=document.createElement("div");l.style.border="0.5px solid",l.style.color="#1dc6f2",l.style.float="left",l.style.height="30px",l.style.margin="4px 5px",r.appendChild(l);let a=document.createElement("div");a.setAttribute("class","roam-relate-func-gravity"),a.style.height="38px",a.style.lineHeight="38px",a.style.float="left";let c=document.createElement("span");c.style.fontSize="14px",c.innerHTML="重力：",a.appendChild(c);let p=document.createElement("input");p.setAttribute("type","checkbox"),p.setAttribute("checked","checked"),p.style.position="relative",p.style.top="3px",p.style.cursor="pointer",a.appendChild(p),p.addEventListener("click",(e=>{t.tool.navigator.enableGravity(e.target.checked)}),!1),r.appendChild(a);let u=document.createElement("div");u.style.border="0.5px solid",u.style.color="#1dc6f2",u.style.float="left",u.style.height="30px",u.style.margin="4px 5px",r.appendChild(u);let f=document.createElement("div");f.setAttribute("class","roam-relate-func-navMap"),f.style.height="38px",f.style.lineHeight="38px",f.style.float="left";let h=document.createElement("span");h.style.fontSize="14px",h.innerHTML="导航地图：",f.appendChild(h);let m=document.createElement("input");if(m.setAttribute("type","checkbox"),m.setAttribute("checked","checked"),m.style.position="relative",m.style.top="3px",m.style.cursor="pointer",m.onclick=e=>{var t=document.querySelector(".minimap3D"),r=document.querySelector("#tooltip-info");if("checked"===e.target.getAttribute("checked"))return e.target.setAttribute("checked",""),t.style.display="none",void r.classList.remove("open");e.target.setAttribute("checked","checked"),t.style.display="block",r.classList.add("open")},f.appendChild(m),r.appendChild(f),NOP_VIEWER.getExtension("VE.PathRoaming")){let t=document.createElement("div");t.style.border="0.5px solid",t.style.color="#1dc6f2",t.style.float="left",t.style.height="30px",t.style.margin="4px 5px",r.appendChild(t);let n=document.createElement("div");n.setAttribute("class","roam-relate-func-pathRoam"),n.style.height="38px",n.style.lineHeight="38px",n.style.float="left";let o=document.createElement("span");o.style.fontSize="14px",o.style.marginRight="10px",o.innerHTML="路径漫游",o.style.cursor="pointer",o.style.color="#1dc6f2",o.addEventListener("click",(t=>{const r=e.loadedExtensions["VE.PathRoaming"];if(r)return r._NAV_EVENT1(),void r.on("update",(e=>{console.error("需要结合后端保存数据！",e)}));e.loadExtension("VE.PathRoaming",{}).then((e=>{e._NAV_EVENT1(),e.on("update",(e=>{console.error("需要结合后端保存数据！",e)}))}))})),n.appendChild(o),r.appendChild(n)}else m.style.marginRight="10px"}destoryUi(){if(!this.ui)return;const e=this.viewer;this.ui.style.display="none",e.addEventListener(Autodesk.Viewing.VIEWER_RESIZE_EVENT,this.lister.VIEWER_RESIZE_EVENT)}onSpeed(){const e=this.viewer;this.speed=e.loadedExtensions["Autodesk.BimWalk"].tool.get("topWalkSpeed")}}Autodesk.Viewing.theExtensionManager.registerExtension(o.ExtensionId,o)}},o={};function i(e){var t=o[e];if(void 0!==t){if(void 0!==t.error)throw t.error;return t.exports}var r=o[e]={id:e,loaded:!1,exports:{}};try{var d={id:e,module:r,factory:n[e],require:i};i.i.forEach((function(e){e(d)})),r=d.module,d.factory.call(r.exports,r,r.exports,d.require)}catch(e){throw r.error=e,e}return r.loaded=!0,r.exports}i.m=n,i.c=o,i.i=[],e=[],i.O=(t,r,n,o)=>{if(!r){var d=1/0;for(a=0;a<e.length;a++){for(var[r,n,o]=e[a],s=!0,l=0;l<r.length;l++)(!1&o||d>=o)&&Object.keys(i.O).every((e=>i.O[e](r[l])))?r.splice(l--,1):(s=!1,o<d&&(d=o));s&&(e.splice(a--,1),t=n())}return t}o=o||0;for(var a=e.length;a>0&&e[a-1][2]>o;a--)e[a]=e[a-1];e[a]=[r,n,o]},i.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return i.d(t,{a:t}),t},i.d=(e,t)=>{for(var r in t)i.o(t,r)&&!i.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},i.hu=e=>e+"."+i.h()+".hot-update.js",i.hmrF=()=>"NavTools."+i.h()+".hot-update.json",i.h=()=>"7152d5a9c66f2a2ebb99",i.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),t={},r="wd-viewer:",i.l=(e,n,o,d)=>{if(t[e])t[e].push(n);else{var s,l;if(void 0!==o)for(var a=document.getElementsByTagName("script"),c=0;c<a.length;c++){var p=a[c];if(p.getAttribute("src")==e||p.getAttribute("data-webpack")==r+o){s=p;break}}s||(l=!0,(s=document.createElement("script")).charset="utf-8",s.timeout=120,i.nc&&s.setAttribute("nonce",i.nc),s.setAttribute("data-webpack",r+o),s.src=e),t[e]=[n];var u=(r,n)=>{s.onerror=s.onload=null,clearTimeout(f);var o=t[e];if(delete t[e],s.parentNode&&s.parentNode.removeChild(s),o&&o.forEach((e=>e(n))),r)return r(n)},f=setTimeout(u.bind(null,void 0,{type:"timeout",target:s}),12e4);s.onerror=u.bind(null,s.onerror),s.onload=u.bind(null,s.onload),l&&document.head.appendChild(s)}},i.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),i.j=695,(()=>{var e,t,r,n,o={},d=i.c,s=[],l=[],a="idle";function c(e){a=e;for(var t=0;t<l.length;t++)l[t].call(null,e)}function p(e){if(0===t.length)return e();var r=t;return t=[],Promise.all(r).then((function(){return p(e)}))}function u(e){if("idle"!==a)throw new Error("check() is only allowed in idle status");return c("check"),i.hmrM().then((function(n){if(!n)return c(m()?"ready":"idle"),null;c("prepare");var o=[];return t=[],r=[],Promise.all(Object.keys(i.hmrC).reduce((function(e,t){return i.hmrC[t](n.c,n.r,n.m,e,r,o),e}),[])).then((function(){return p((function(){return e?h(e):(c("ready"),o)}))}))}))}function f(e){return"ready"!==a?Promise.resolve().then((function(){throw new Error("apply() is only allowed in ready status")})):h(e)}function h(e){e=e||{},m();var t=r.map((function(t){return t(e)}));r=void 0;var o,i=t.map((function(e){return e.error})).filter(Boolean);if(i.length>0)return c("abort"),Promise.resolve().then((function(){throw i[0]}));c("dispose"),t.forEach((function(e){e.dispose&&e.dispose()})),c("apply");var d=function(e){o||(o=e)},s=[];return t.forEach((function(e){if(e.apply){var t=e.apply(d);if(t)for(var r=0;r<t.length;r++)s.push(t[r])}})),o?(c("fail"),Promise.resolve().then((function(){throw o}))):n?h(e).then((function(e){return s.forEach((function(t){e.indexOf(t)<0&&e.push(t)})),e})):(c("idle"),Promise.resolve(s))}function m(){if(n)return r||(r=[]),Object.keys(i.hmrI).forEach((function(e){n.forEach((function(t){i.hmrI[e](t,r)}))})),n=void 0,!0}i.hmrD=o,i.i.push((function(h){var m,v,y,E,g=h.module,b=function(r,n){var o=d[n];if(!o)return r;var i=function(t){if(o.hot.active){if(d[t]){var i=d[t].parents;-1===i.indexOf(n)&&i.push(n)}else s=[n],e=t;-1===o.children.indexOf(t)&&o.children.push(t)}else console.warn("[HMR] unexpected require("+t+") from disposed module "+n),s=[];return r(t)},l=function(e){return{configurable:!0,enumerable:!0,get:function(){return r[e]},set:function(t){r[e]=t}}};for(var u in r)Object.prototype.hasOwnProperty.call(r,u)&&"e"!==u&&Object.defineProperty(i,u,l(u));return i.e=function(e){return function(e){switch(a){case"ready":return c("prepare"),t.push(e),p((function(){c("ready")})),e;case"prepare":return t.push(e),e;default:return e}}(r.e(e))},i}(h.require,h.id);g.hot=(m=h.id,v=g,E={_acceptedDependencies:{},_acceptedErrorHandlers:{},_declinedDependencies:{},_selfAccepted:!1,_selfDeclined:!1,_selfInvalidated:!1,_disposeHandlers:[],_main:y=e!==m,_requireSelf:function(){s=v.parents.slice(),e=y?void 0:m,i(m)},active:!0,accept:function(e,t,r){if(void 0===e)E._selfAccepted=!0;else if("function"==typeof e)E._selfAccepted=e;else if("object"==typeof e&&null!==e)for(var n=0;n<e.length;n++)E._acceptedDependencies[e[n]]=t||function(){},E._acceptedErrorHandlers[e[n]]=r;else E._acceptedDependencies[e]=t||function(){},E._acceptedErrorHandlers[e]=r},decline:function(e){if(void 0===e)E._selfDeclined=!0;else if("object"==typeof e&&null!==e)for(var t=0;t<e.length;t++)E._declinedDependencies[e[t]]=!0;else E._declinedDependencies[e]=!0},dispose:function(e){E._disposeHandlers.push(e)},addDisposeHandler:function(e){E._disposeHandlers.push(e)},removeDisposeHandler:function(e){var t=E._disposeHandlers.indexOf(e);t>=0&&E._disposeHandlers.splice(t,1)},invalidate:function(){switch(this._selfInvalidated=!0,a){case"idle":r=[],Object.keys(i.hmrI).forEach((function(e){i.hmrI[e](m,r)})),c("ready");break;case"ready":Object.keys(i.hmrI).forEach((function(e){i.hmrI[e](m,r)}));break;case"prepare":case"check":case"dispose":case"apply":(n=n||[]).push(m)}},check:u,apply:f,status:function(e){if(!e)return a;l.push(e)},addStatusHandler:function(e){l.push(e)},removeStatusHandler:function(e){var t=l.indexOf(e);t>=0&&l.splice(t,1)},data:o[m]},e=void 0,E),g.parents=s,g.children=[],s=[],h.require=b})),i.hmrC={},i.hmrI={}})(),(()=>{var e;i.g.importScripts&&(e=i.g.location+"");var t=i.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var r=t.getElementsByTagName("script");r.length&&(e=r[r.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),i.p=e})(),(()=>{var e,t,r,n,o={695:0},d={};function s(e){return new Promise(((t,r)=>{d[e]=t;var n=i.p+i.hu(e),o=new Error;i.l(n,(t=>{if(d[e]){d[e]=void 0;var n=t&&("load"===t.type?"missing":t.type),i=t&&t.target&&t.target.src;o.message="Loading hot update chunk "+e+" failed.\n("+n+": "+i+")",o.name="ChunkLoadError",o.type=n,o.request=i,r(o)}}))}))}function l(d){function s(e){for(var t=[e],r={},n=t.map((function(e){return{chain:[e],id:e}}));n.length>0;){var o=n.pop(),d=o.id,s=o.chain,a=i.c[d];if(a&&(!a.hot._selfAccepted||a.hot._selfInvalidated)){if(a.hot._selfDeclined)return{type:"self-declined",chain:s,moduleId:d};if(a.hot._main)return{type:"unaccepted",chain:s,moduleId:d};for(var c=0;c<a.parents.length;c++){var p=a.parents[c],u=i.c[p];if(u){if(u.hot._declinedDependencies[d])return{type:"declined",chain:s.concat([p]),moduleId:d,parentId:p};-1===t.indexOf(p)&&(u.hot._acceptedDependencies[d]?(r[p]||(r[p]=[]),l(r[p],[d])):(delete r[p],t.push(p),n.push({chain:s.concat([p]),id:p})))}}}}return{type:"accepted",moduleId:e,outdatedModules:t,outdatedDependencies:r}}function l(e,t){for(var r=0;r<t.length;r++){var n=t[r];-1===e.indexOf(n)&&e.push(n)}}i.f&&delete i.f.jsonpHmr,e=void 0;var a={},c=[],p={},u=function(e){console.warn("[HMR] unexpected require("+e.id+") to disposed module")};for(var f in t)if(i.o(t,f)){var h,m=t[f],v=!1,y=!1,E=!1,g="";switch((h=m?s(f):{type:"disposed",moduleId:f}).chain&&(g="\nUpdate propagation: "+h.chain.join(" -> ")),h.type){case"self-declined":d.onDeclined&&d.onDeclined(h),d.ignoreDeclined||(v=new Error("Aborted because of self decline: "+h.moduleId+g));break;case"declined":d.onDeclined&&d.onDeclined(h),d.ignoreDeclined||(v=new Error("Aborted because of declined dependency: "+h.moduleId+" in "+h.parentId+g));break;case"unaccepted":d.onUnaccepted&&d.onUnaccepted(h),d.ignoreUnaccepted||(v=new Error("Aborted because "+f+" is not accepted"+g));break;case"accepted":d.onAccepted&&d.onAccepted(h),y=!0;break;case"disposed":d.onDisposed&&d.onDisposed(h),E=!0;break;default:throw new Error("Unexception type "+h.type)}if(v)return{error:v};if(y)for(f in p[f]=m,l(c,h.outdatedModules),h.outdatedDependencies)i.o(h.outdatedDependencies,f)&&(a[f]||(a[f]=[]),l(a[f],h.outdatedDependencies[f]));E&&(l(c,[h.moduleId]),p[f]=u)}t=void 0;for(var b,_=[],x=0;x<c.length;x++){var w=c[x],k=i.c[w];k&&(k.hot._selfAccepted||k.hot._main)&&p[w]!==u&&!k.hot._selfInvalidated&&_.push({module:w,require:k.hot._requireSelf,errorHandler:k.hot._selfAccepted})}return{dispose:function(){var e;r.forEach((function(e){delete o[e]})),r=void 0;for(var t,n=c.slice();n.length>0;){var d=n.pop(),s=i.c[d];if(s){var l={},p=s.hot._disposeHandlers;for(x=0;x<p.length;x++)p[x].call(null,l);for(i.hmrD[d]=l,s.hot.active=!1,delete i.c[d],delete a[d],x=0;x<s.children.length;x++){var u=i.c[s.children[x]];u&&(e=u.parents.indexOf(d))>=0&&u.parents.splice(e,1)}}}for(var f in a)if(i.o(a,f)&&(s=i.c[f]))for(b=a[f],x=0;x<b.length;x++)t=b[x],(e=s.children.indexOf(t))>=0&&s.children.splice(e,1)},apply:function(e){for(var t in p)i.o(p,t)&&(i.m[t]=p[t]);for(var r=0;r<n.length;r++)n[r](i);for(var o in a)if(i.o(a,o)){var s=i.c[o];if(s){b=a[o];for(var l=[],u=[],f=[],h=0;h<b.length;h++){var m=b[h],v=s.hot._acceptedDependencies[m],y=s.hot._acceptedErrorHandlers[m];if(v){if(-1!==l.indexOf(v))continue;l.push(v),u.push(y),f.push(m)}}for(var E=0;E<l.length;E++)try{l[E].call(null,b)}catch(t){if("function"==typeof u[E])try{u[E](t,{moduleId:o,dependencyId:f[E]})}catch(r){d.onErrored&&d.onErrored({type:"accept-error-handler-errored",moduleId:o,dependencyId:f[E],error:r,originalError:t}),d.ignoreErrored||(e(r),e(t))}else d.onErrored&&d.onErrored({type:"accept-errored",moduleId:o,dependencyId:f[E],error:t}),d.ignoreErrored||e(t)}}}for(var g=0;g<_.length;g++){var x=_[g],w=x.module;try{x.require(w)}catch(t){if("function"==typeof x.errorHandler)try{x.errorHandler(t,{moduleId:w,module:i.c[w]})}catch(r){d.onErrored&&d.onErrored({type:"self-accept-error-handler-errored",moduleId:w,error:r,originalError:t}),d.ignoreErrored||(e(r),e(t))}else d.onErrored&&d.onErrored({type:"self-accept-errored",moduleId:w,error:t}),d.ignoreErrored||e(t)}}return c}}}self.webpackHotUpdatewd_viewer=(e,r,o)=>{for(var s in r)i.o(r,s)&&(t[s]=r[s]);o&&n.push(o),d[e]&&(d[e](),d[e]=void 0)},i.hmrI.jsonp=function(e,o){t||(t={},n=[],r=[],o.push(l)),i.o(t,e)||(t[e]=i.m[e])},i.hmrC.jsonp=function(d,a,c,p,u,f){u.push(l),e={},r=a,t=c.reduce((function(e,t){return e[t]=!1,e}),{}),n=[],d.forEach((function(t){i.o(o,t)&&void 0!==o[t]&&(p.push(s(t)),e[t]=!0)})),i.f&&(i.f.jsonpHmr=function(t,r){e&&!i.o(e,t)&&i.o(o,t)&&void 0!==o[t]&&(r.push(s(t)),e[t]=!0)})},i.hmrM=()=>{if("undefined"==typeof fetch)throw new Error("No browser support: need fetch API");return fetch(i.p+i.hmrF()).then((e=>{if(404!==e.status){if(!e.ok)throw new Error("Failed to fetch update manifest "+e.statusText);return e.json()}}))},i.O.j=e=>0===o[e];var a=(e,t)=>{var r,n,[d,s,l]=t,a=0;for(r in s)i.o(s,r)&&(i.m[r]=s[r]);if(l)var c=l(i);for(e&&e(t);a<d.length;a++)n=d[a],i.o(o,n)&&o[n]&&o[n][0](),o[d[a]]=0;return i.O(c)},c=self.webpackChunkwd_viewer=self.webpackChunkwd_viewer||[];c.forEach(a.bind(null,0)),c.push=a.bind(null,c.push.bind(c))})();var d=i.O(void 0,[839],(()=>i(87233)));return i.O(d)})()}));