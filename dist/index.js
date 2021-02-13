(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
  var __commonJS = (callback, module) => () => {
    if (!module) {
      module = {exports: {}};
      callback(module.exports, module);
    }
    return module.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, {get: all[name], enumerable: true});
  };
  var __exportStar = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, {get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable});
    }
    return target;
  };
  var __toModule = (module) => {
    if (module && module.__esModule)
      return module;
    return __exportStar(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", {value: module, enumerable: true})), module);
  };
  var __decorate = (decorators, target, key, kind) => {
    var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
    for (var i = decorators.length - 1, decorator; i >= 0; i--)
      if (decorator = decorators[i])
        result = (kind ? decorator(target, key, result) : decorator(result)) || result;
    if (kind && result)
      __defProp(target, key, result);
    return result;
  };

  // node_modules/custom-elements-hmr-polyfill/dist/CommonJS/reflow-strategy/rerenderInnerHTML.js
  var require_rerenderInnerHTML = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    exports.rerenderInnerHTML = void 0;
    function rerenderInnerHTML() {
      if (document.body) {
        requestAnimationFrame(() => {
          const oldBodyHtml = document.body.innerHTML;
          document.body.innerHTML = "";
          document.body.innerHTML = oldBodyHtml;
        });
      }
    }
    exports.rerenderInnerHTML = rerenderInnerHTML;
  });

  // node_modules/custom-elements-hmr-polyfill/dist/CommonJS/polyfill/hmrCache.js
  var require_hmrCache = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    exports.getSymbolObserver = exports.getSymbolAttributes = exports.setCacheAsInitialized = exports.isCacheInitialized = exports.setMostRecentImpl = exports.getMostRecentImpl = exports.initCache = void 0;
    function initCache() {
      if (!globalThis.hmrCache) {
        globalThis.hmrCache = {};
        globalThis.hmrCacheSymbolAttributes = {};
        globalThis.hmrCacheSymbolObserver = {};
      }
    }
    exports.initCache = initCache;
    function getMostRecentImpl(elementName) {
      return globalThis.hmrCache[elementName];
    }
    exports.getMostRecentImpl = getMostRecentImpl;
    function setMostRecentImpl(elementName, impl) {
      globalThis.hmrCache[elementName] = impl;
    }
    exports.setMostRecentImpl = setMostRecentImpl;
    function isCacheInitialized() {
      return globalThis.hmrCache.initialized;
    }
    exports.isCacheInitialized = isCacheInitialized;
    function setCacheAsInitialized() {
      globalThis.hmrCache.initialized = true;
    }
    exports.setCacheAsInitialized = setCacheAsInitialized;
    function getSymbolAttributes(elementName) {
      if (!globalThis.hmrCacheSymbolAttributes[elementName]) {
        globalThis.hmrCacheSymbolAttributes[elementName] = Symbol("observedAttributesArray");
        return globalThis.hmrCacheSymbolAttributes[elementName];
      } else {
        return globalThis.hmrCacheSymbolAttributes[elementName];
      }
    }
    exports.getSymbolAttributes = getSymbolAttributes;
    function getSymbolObserver(elementName) {
      if (!globalThis.hmrCacheSymbolObserver[elementName]) {
        globalThis.hmrCacheSymbolObserver[elementName] = Symbol("observedAttributesObserver");
        return globalThis.hmrCacheSymbolObserver[elementName];
      } else {
        return globalThis.hmrCacheSymbolObserver[elementName];
      }
    }
    exports.getSymbolObserver = getSymbolObserver;
  });

  // node_modules/custom-elements-hmr-polyfill/dist/CommonJS/polyfill/createHookClass.js
  var require_createHookClass = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    exports.createHookClass = void 0;
    var hmrCache_1 = require_hmrCache();
    function createHookClass(elementName, originalImpl) {
      return class extends originalImpl {
        static get observedAttributes() {
          return [];
        }
        connectedCallback() {
          const Impl = hmrCache_1.getMostRecentImpl(elementName);
          const mostRecentImpl = Impl.prototype;
          const attributes = Impl[hmrCache_1.getSymbolAttributes(elementName)];
          const observerOptions = {
            childList: false,
            attributes: true,
            attributeOldValue: true,
            subtree: false
          };
          const callback = (mutationList) => {
            mutationList.forEach((mutation) => {
              if (mostRecentImpl.attributeChangedCallback && attributes && attributes.indexOf(mutation.attributeName) !== -1) {
                mostRecentImpl.attributeChangedCallback.apply(this, [
                  mutation.attributeName,
                  mutation.oldValue,
                  this.getAttribute(mutation.attributeName),
                  null
                ]);
              }
            });
          };
          if (attributes) {
            if (Array.isArray(attributes)) {
              attributes.forEach((attributeName) => {
                const haveAtt = this.getAttributeNode(attributeName);
                if (haveAtt) {
                  mostRecentImpl.attributeChangedCallback.apply(this, [
                    attributeName,
                    null,
                    this.getAttribute(attributeName),
                    null
                  ]);
                }
              });
            } else {
              console.warn(`observedAttributes in ${elementName} is not array, please fix`);
            }
          }
          this[hmrCache_1.getSymbolObserver(elementName)] = new MutationObserver(callback);
          this[hmrCache_1.getSymbolObserver(elementName)].observe(this, observerOptions);
          if (mostRecentImpl.connectedCallback) {
            mostRecentImpl.connectedCallback.apply(this, arguments);
          }
        }
        disconnectedCallback() {
          this[hmrCache_1.getSymbolObserver(elementName)].disconnect();
          this[hmrCache_1.getSymbolObserver(elementName)] = null;
          const mostRecentImpl = hmrCache_1.getMostRecentImpl(elementName).prototype;
          if (mostRecentImpl.disconnectedCallback) {
            mostRecentImpl.disconnectedCallback.apply(this, arguments);
          }
        }
        adoptedCallback() {
          const mostRecentImpl = hmrCache_1.getMostRecentImpl(elementName).prototype;
          if (mostRecentImpl.adoptedCallback) {
            mostRecentImpl.adoptedCallback.apply(this, arguments);
          }
        }
      };
    }
    exports.createHookClass = createHookClass;
  });

  // node_modules/custom-elements-hmr-polyfill/dist/CommonJS/polyfill/patch.js
  var require_patch = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    exports.patch = void 0;
    function patch(recentImpl, targetImpl, BLACKLISTED_PATCH_METHODS) {
      const ownPropertyNamesProto = Object.getOwnPropertyNames(recentImpl);
      const whitelistedPrototypePropertyNamesProto = ownPropertyNamesProto.filter((propertyName) => {
        return BLACKLISTED_PATCH_METHODS.indexOf(propertyName) === -1;
      });
      for (let i = 0; i < whitelistedPrototypePropertyNamesProto.length; i++) {
        const propertyDescriptor = Object.getOwnPropertyDescriptor(recentImpl, whitelistedPrototypePropertyNamesProto[i]);
        if (propertyDescriptor) {
          if (propertyDescriptor.configurable) {
            Object.defineProperty(targetImpl, whitelistedPrototypePropertyNamesProto[i], propertyDescriptor);
          } else {
            console.warn("[custom-element-hmr-polyfill]", `${whitelistedPrototypePropertyNamesProto[i]} is not configurable, skipping`);
          }
        }
      }
    }
    exports.patch = patch;
  });

  // node_modules/custom-elements-hmr-polyfill/dist/CommonJS/polyfill/constructInstance.js
  var require_constructInstance = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    exports.constructInstance = exports.BLACKLISTED_STATIC_PATCH_METHODS = exports.BLACKLISTED_PROTOTYPE_PATCH_METHODS = void 0;
    var patch_1 = require_patch();
    exports.BLACKLISTED_PROTOTYPE_PATCH_METHODS = [];
    exports.BLACKLISTED_STATIC_PATCH_METHODS = ["name", "prototype", "length"];
    function constructInstance(mostRecentImpl, args, newTarget) {
      var _a, _b;
      let check = window[mostRecentImpl.__proto__.name];
      if (check) {
        check = window[mostRecentImpl.__proto__.name].prototype instanceof Element;
      }
      if (!check) {
        let proto = mostRecentImpl.__proto__;
        let base = null;
        while (proto) {
          if (((_b = window[(_a = proto === null || proto === void 0 ? void 0 : proto.__proto__) === null || _a === void 0 ? void 0 : _a.name]) === null || _b === void 0 ? void 0 : _b.prototype) instanceof Element) {
            base = proto;
          }
          if (base) {
            break;
          }
          proto = proto.__proto__;
        }
        if (!window.HMR_SKIP_DEEP_PATCH) {
          patch_1.patch(base.prototype, newTarget.prototype, exports.BLACKLISTED_PROTOTYPE_PATCH_METHODS);
        }
      }
      patch_1.patch(mostRecentImpl.prototype, newTarget.prototype, exports.BLACKLISTED_PROTOTYPE_PATCH_METHODS);
      const customElementInstance = Reflect.construct(mostRecentImpl, args, newTarget);
      return customElementInstance;
    }
    exports.constructInstance = constructInstance;
  });

  // node_modules/custom-elements-hmr-polyfill/dist/CommonJS/polyfill/overrideCustomElementDefine.js
  var require_overrideCustomElementDefine = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    exports.overrideCustomElementDefine = void 0;
    var hmrCache_1 = require_hmrCache();
    var createHookClass_1 = require_createHookClass();
    var constructInstance_1 = require_constructInstance();
    function overrideCustomElementDefine() {
      if (!hmrCache_1.isCacheInitialized()) {
        hmrCache_1.setCacheAsInitialized();
        const originalDefineFn = CustomElementRegistry.prototype.define;
        CustomElementRegistry.prototype.define = function(elementName, impl, options) {
          const registeredCustomElement = customElements.get(elementName);
          impl[hmrCache_1.getSymbolAttributes(elementName)] = impl.observedAttributes;
          hmrCache_1.setMostRecentImpl(elementName, impl);
          if (!registeredCustomElement) {
            const hookClass = new Proxy(createHookClass_1.createHookClass(elementName, impl), {
              construct: function(element, args, newTarget) {
                const mostRecentImpl = hmrCache_1.getMostRecentImpl(elementName);
                return constructInstance_1.constructInstance(mostRecentImpl, args, newTarget);
              }
            });
            originalDefineFn.apply(this, [elementName, hookClass, options]);
          } else {
            const onCustomElementChange = globalThis.hmrCache.onCustomElementChange;
            if (onCustomElementChange && typeof onCustomElementChange === "function") {
              onCustomElementChange(elementName, impl, options);
            }
          }
        };
      }
    }
    exports.overrideCustomElementDefine = overrideCustomElementDefine;
  });

  // node_modules/custom-elements-hmr-polyfill/dist/CommonJS/polyfill/onCustomElementChange.js
  var require_onCustomElementChange = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    exports.onCustomElementChange = void 0;
    var hmrCache_1 = require_hmrCache();
    exports.onCustomElementChange = (changeListener) => {
      hmrCache_1.initCache();
      if (!globalThis.hmrCache.onCustomElementChange) {
        globalThis.hmrCache.onCustomElementChange = changeListener;
      }
    };
  });

  // node_modules/custom-elements-hmr-polyfill/dist/CommonJS/polyfill/reflowStrategy.js
  var require_reflowStrategy = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    exports.ReflowStrategy = void 0;
    var ReflowStrategy;
    (function(ReflowStrategy2) {
      ReflowStrategy2["RERENDER_INNER_HTML"] = "rerenderInnnerHTML";
      ReflowStrategy2["NONE"] = "none";
    })(ReflowStrategy = exports.ReflowStrategy || (exports.ReflowStrategy = {}));
  });

  // node_modules/custom-elements-hmr-polyfill/dist/CommonJS/polyfill/createHookElementChangeListener.js
  var require_createHookElementChangeListener = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    exports.createHookElementChangeListener = void 0;
    var reflowStrategy_1 = require_reflowStrategy();
    var rerenderInnerHTML_1 = require_rerenderInnerHTML();
    exports.createHookElementChangeListener = (reflowStrategy = reflowStrategy_1.ReflowStrategy.RERENDER_INNER_HTML, reflowDelayMs = 250, onCustomElementChangeListener) => {
      let timer;
      let elementsChanged = [];
      if (!onCustomElementChangeListener) {
        onCustomElementChangeListener = () => {
        };
      }
      return (elementName, impl, options) => {
        if (onCustomElementChangeListener) {
          onCustomElementChangeListener(elementName, impl, options);
        }
        if (reflowStrategy && reflowStrategy === reflowStrategy_1.ReflowStrategy.RERENDER_INNER_HTML) {
          elementsChanged.push(elementName);
          clearTimeout(timer);
          timer = setTimeout(() => {
            rerenderInnerHTML_1.rerenderInnerHTML();
            elementsChanged = [];
          }, reflowDelayMs);
        }
      };
    };
  });

  // node_modules/custom-elements-hmr-polyfill/dist/CommonJS/polyfill/applyPolyfill.js
  var require_applyPolyfill = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    exports.applyPolyfill = void 0;
    var hmrCache_1 = require_hmrCache();
    var overrideCustomElementDefine_1 = require_overrideCustomElementDefine();
    var onCustomElementChange_1 = require_onCustomElementChange();
    var createHookElementChangeListener_1 = require_createHookElementChangeListener();
    var reflowStrategy_1 = require_reflowStrategy();
    function applyPolyfill(reflowStrategy = reflowStrategy_1.ReflowStrategy.NONE, reflowDelayMs = 250, onCustomElementChangeListener) {
      hmrCache_1.initCache();
      overrideCustomElementDefine_1.overrideCustomElementDefine();
      onCustomElementChange_1.onCustomElementChange(createHookElementChangeListener_1.createHookElementChangeListener(reflowStrategy, reflowDelayMs, onCustomElementChangeListener));
    }
    exports.applyPolyfill = applyPolyfill;
  });

  // node_modules/custom-elements-hmr-polyfill/dist/CommonJS/index.js
  var require_CommonJS = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    var rerenderInnerHTML_1 = require_rerenderInnerHTML();
    Object.defineProperty(exports, "rerenderInnerHTML", {enumerable: true, get: function() {
      return rerenderInnerHTML_1.rerenderInnerHTML;
    }});
    var applyPolyfill_1 = require_applyPolyfill();
    Object.defineProperty(exports, "applyPolyfill", {enumerable: true, get: function() {
      return applyPolyfill_1.applyPolyfill;
    }});
    var reflowStrategy_1 = require_reflowStrategy();
    Object.defineProperty(exports, "ReflowStrategy", {enumerable: true, get: function() {
      return reflowStrategy_1.ReflowStrategy;
    }});
  });

  // src/app-root.ts
  var require_app_root = __commonJS((exports) => {
    __markAsModule(exports);
    __export(exports, {
      default: () => app_root_default2
    });
    var app_root_default = class extends HTMLElement {
      render() {
        return html` <ifc-reader class="p-2"></ifc-reader> `;
      }
    };
    app_root_default = __decorate([
      customElement("app-root")
    ], app_root_default);
    var app_root_default2 = app_root_default;
  });

  // src/index.ts
  if (true) {
    const {applyPolyfill} = require_CommonJS();
    applyPolyfill();
  }

  // node_modules/lit-html/lib/directive.js
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  var directives = new WeakMap();
  var isDirective = (o) => {
    return typeof o === "function" && directives.has(o);
  };

  // node_modules/lit-html/lib/dom.js
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  var isCEPolyfill = typeof window !== "undefined" && window.customElements != null && window.customElements.polyfillWrapFlushCallback !== void 0;
  var removeNodes = (container, start, end = null) => {
    while (start !== end) {
      const n = start.nextSibling;
      container.removeChild(start);
      start = n;
    }
  };

  // node_modules/lit-html/lib/part.js
  /**
   * @license
   * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  var noChange = {};
  var nothing = {};

  // node_modules/lit-html/lib/template.js
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  var marker = `{{lit-${String(Math.random()).slice(2)}}}`;
  var nodeMarker = `<!--${marker}-->`;
  var markerRegex = new RegExp(`${marker}|${nodeMarker}`);
  var boundAttributeSuffix = "$lit$";
  var Template = class {
    constructor(result, element) {
      this.parts = [];
      this.element = element;
      const nodesToRemove = [];
      const stack = [];
      const walker = document.createTreeWalker(element.content, 133, null, false);
      let lastPartIndex = 0;
      let index = -1;
      let partIndex = 0;
      const {strings, values: {length}} = result;
      while (partIndex < length) {
        const node = walker.nextNode();
        if (node === null) {
          walker.currentNode = stack.pop();
          continue;
        }
        index++;
        if (node.nodeType === 1) {
          if (node.hasAttributes()) {
            const attributes = node.attributes;
            const {length: length2} = attributes;
            let count = 0;
            for (let i = 0; i < length2; i++) {
              if (endsWith(attributes[i].name, boundAttributeSuffix)) {
                count++;
              }
            }
            while (count-- > 0) {
              const stringForPart = strings[partIndex];
              const name = lastAttributeNameRegex.exec(stringForPart)[2];
              const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
              const attributeValue = node.getAttribute(attributeLookupName);
              node.removeAttribute(attributeLookupName);
              const statics = attributeValue.split(markerRegex);
              this.parts.push({type: "attribute", index, name, strings: statics});
              partIndex += statics.length - 1;
            }
          }
          if (node.tagName === "TEMPLATE") {
            stack.push(node);
            walker.currentNode = node.content;
          }
        } else if (node.nodeType === 3) {
          const data = node.data;
          if (data.indexOf(marker) >= 0) {
            const parent = node.parentNode;
            const strings2 = data.split(markerRegex);
            const lastIndex = strings2.length - 1;
            for (let i = 0; i < lastIndex; i++) {
              let insert;
              let s = strings2[i];
              if (s === "") {
                insert = createMarker();
              } else {
                const match = lastAttributeNameRegex.exec(s);
                if (match !== null && endsWith(match[2], boundAttributeSuffix)) {
                  s = s.slice(0, match.index) + match[1] + match[2].slice(0, -boundAttributeSuffix.length) + match[3];
                }
                insert = document.createTextNode(s);
              }
              parent.insertBefore(insert, node);
              this.parts.push({type: "node", index: ++index});
            }
            if (strings2[lastIndex] === "") {
              parent.insertBefore(createMarker(), node);
              nodesToRemove.push(node);
            } else {
              node.data = strings2[lastIndex];
            }
            partIndex += lastIndex;
          }
        } else if (node.nodeType === 8) {
          if (node.data === marker) {
            const parent = node.parentNode;
            if (node.previousSibling === null || index === lastPartIndex) {
              index++;
              parent.insertBefore(createMarker(), node);
            }
            lastPartIndex = index;
            this.parts.push({type: "node", index});
            if (node.nextSibling === null) {
              node.data = "";
            } else {
              nodesToRemove.push(node);
              index--;
            }
            partIndex++;
          } else {
            let i = -1;
            while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
              this.parts.push({type: "node", index: -1});
              partIndex++;
            }
          }
        }
      }
      for (const n of nodesToRemove) {
        n.parentNode.removeChild(n);
      }
    }
  };
  var endsWith = (str, suffix) => {
    const index = str.length - suffix.length;
    return index >= 0 && str.slice(index) === suffix;
  };
  var isTemplatePartActive = (part) => part.index !== -1;
  var createMarker = () => document.createComment("");
  var lastAttributeNameRegex = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

  // node_modules/lit-html/lib/template-instance.js
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  var TemplateInstance = class {
    constructor(template, processor, options) {
      this.__parts = [];
      this.template = template;
      this.processor = processor;
      this.options = options;
    }
    update(values) {
      let i = 0;
      for (const part of this.__parts) {
        if (part !== void 0) {
          part.setValue(values[i]);
        }
        i++;
      }
      for (const part of this.__parts) {
        if (part !== void 0) {
          part.commit();
        }
      }
    }
    _clone() {
      const fragment = isCEPolyfill ? this.template.element.content.cloneNode(true) : document.importNode(this.template.element.content, true);
      const stack = [];
      const parts2 = this.template.parts;
      const walker = document.createTreeWalker(fragment, 133, null, false);
      let partIndex = 0;
      let nodeIndex = 0;
      let part;
      let node = walker.nextNode();
      while (partIndex < parts2.length) {
        part = parts2[partIndex];
        if (!isTemplatePartActive(part)) {
          this.__parts.push(void 0);
          partIndex++;
          continue;
        }
        while (nodeIndex < part.index) {
          nodeIndex++;
          if (node.nodeName === "TEMPLATE") {
            stack.push(node);
            walker.currentNode = node.content;
          }
          if ((node = walker.nextNode()) === null) {
            walker.currentNode = stack.pop();
            node = walker.nextNode();
          }
        }
        if (part.type === "node") {
          const part2 = this.processor.handleTextExpression(this.options);
          part2.insertAfterNode(node.previousSibling);
          this.__parts.push(part2);
        } else {
          this.__parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
        }
        partIndex++;
      }
      if (isCEPolyfill) {
        document.adoptNode(fragment);
        customElements.upgrade(fragment);
      }
      return fragment;
    }
  };

  // node_modules/lit-html/lib/template-result.js
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  var policy = window.trustedTypes && trustedTypes.createPolicy("lit-html", {createHTML: (s) => s});
  var commentMarker = ` ${marker} `;
  var TemplateResult = class {
    constructor(strings, values, type, processor) {
      this.strings = strings;
      this.values = values;
      this.type = type;
      this.processor = processor;
    }
    getHTML() {
      const l = this.strings.length - 1;
      let html2 = "";
      let isCommentBinding = false;
      for (let i = 0; i < l; i++) {
        const s = this.strings[i];
        const commentOpen = s.lastIndexOf("<!--");
        isCommentBinding = (commentOpen > -1 || isCommentBinding) && s.indexOf("-->", commentOpen + 1) === -1;
        const attributeMatch = lastAttributeNameRegex.exec(s);
        if (attributeMatch === null) {
          html2 += s + (isCommentBinding ? commentMarker : nodeMarker);
        } else {
          html2 += s.substr(0, attributeMatch.index) + attributeMatch[1] + attributeMatch[2] + boundAttributeSuffix + attributeMatch[3] + marker;
        }
      }
      html2 += this.strings[l];
      return html2;
    }
    getTemplateElement() {
      const template = document.createElement("template");
      let value = this.getHTML();
      if (policy !== void 0) {
        value = policy.createHTML(value);
      }
      template.innerHTML = value;
      return template;
    }
  };

  // node_modules/lit-html/lib/parts.js
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  var isPrimitive = (value) => {
    return value === null || !(typeof value === "object" || typeof value === "function");
  };
  var isIterable = (value) => {
    return Array.isArray(value) || !!(value && value[Symbol.iterator]);
  };
  var AttributeCommitter = class {
    constructor(element, name, strings) {
      this.dirty = true;
      this.element = element;
      this.name = name;
      this.strings = strings;
      this.parts = [];
      for (let i = 0; i < strings.length - 1; i++) {
        this.parts[i] = this._createPart();
      }
    }
    _createPart() {
      return new AttributePart(this);
    }
    _getValue() {
      const strings = this.strings;
      const l = strings.length - 1;
      const parts2 = this.parts;
      if (l === 1 && strings[0] === "" && strings[1] === "") {
        const v = parts2[0].value;
        if (typeof v === "symbol") {
          return String(v);
        }
        if (typeof v === "string" || !isIterable(v)) {
          return v;
        }
      }
      let text = "";
      for (let i = 0; i < l; i++) {
        text += strings[i];
        const part = parts2[i];
        if (part !== void 0) {
          const v = part.value;
          if (isPrimitive(v) || !isIterable(v)) {
            text += typeof v === "string" ? v : String(v);
          } else {
            for (const t of v) {
              text += typeof t === "string" ? t : String(t);
            }
          }
        }
      }
      text += strings[l];
      return text;
    }
    commit() {
      if (this.dirty) {
        this.dirty = false;
        this.element.setAttribute(this.name, this._getValue());
      }
    }
  };
  var AttributePart = class {
    constructor(committer) {
      this.value = void 0;
      this.committer = committer;
    }
    setValue(value) {
      if (value !== noChange && (!isPrimitive(value) || value !== this.value)) {
        this.value = value;
        if (!isDirective(value)) {
          this.committer.dirty = true;
        }
      }
    }
    commit() {
      while (isDirective(this.value)) {
        const directive2 = this.value;
        this.value = noChange;
        directive2(this);
      }
      if (this.value === noChange) {
        return;
      }
      this.committer.commit();
    }
  };
  var NodePart = class {
    constructor(options) {
      this.value = void 0;
      this.__pendingValue = void 0;
      this.options = options;
    }
    appendInto(container) {
      this.startNode = container.appendChild(createMarker());
      this.endNode = container.appendChild(createMarker());
    }
    insertAfterNode(ref) {
      this.startNode = ref;
      this.endNode = ref.nextSibling;
    }
    appendIntoPart(part) {
      part.__insert(this.startNode = createMarker());
      part.__insert(this.endNode = createMarker());
    }
    insertAfterPart(ref) {
      ref.__insert(this.startNode = createMarker());
      this.endNode = ref.endNode;
      ref.endNode = this.startNode;
    }
    setValue(value) {
      this.__pendingValue = value;
    }
    commit() {
      if (this.startNode.parentNode === null) {
        return;
      }
      while (isDirective(this.__pendingValue)) {
        const directive2 = this.__pendingValue;
        this.__pendingValue = noChange;
        directive2(this);
      }
      const value = this.__pendingValue;
      if (value === noChange) {
        return;
      }
      if (isPrimitive(value)) {
        if (value !== this.value) {
          this.__commitText(value);
        }
      } else if (value instanceof TemplateResult) {
        this.__commitTemplateResult(value);
      } else if (value instanceof Node) {
        this.__commitNode(value);
      } else if (isIterable(value)) {
        this.__commitIterable(value);
      } else if (value === nothing) {
        this.value = nothing;
        this.clear();
      } else {
        this.__commitText(value);
      }
    }
    __insert(node) {
      this.endNode.parentNode.insertBefore(node, this.endNode);
    }
    __commitNode(value) {
      if (this.value === value) {
        return;
      }
      this.clear();
      this.__insert(value);
      this.value = value;
    }
    __commitText(value) {
      const node = this.startNode.nextSibling;
      value = value == null ? "" : value;
      const valueAsString = typeof value === "string" ? value : String(value);
      if (node === this.endNode.previousSibling && node.nodeType === 3) {
        node.data = valueAsString;
      } else {
        this.__commitNode(document.createTextNode(valueAsString));
      }
      this.value = value;
    }
    __commitTemplateResult(value) {
      const template = this.options.templateFactory(value);
      if (this.value instanceof TemplateInstance && this.value.template === template) {
        this.value.update(value.values);
      } else {
        const instance = new TemplateInstance(template, value.processor, this.options);
        const fragment = instance._clone();
        instance.update(value.values);
        this.__commitNode(fragment);
        this.value = instance;
      }
    }
    __commitIterable(value) {
      if (!Array.isArray(this.value)) {
        this.value = [];
        this.clear();
      }
      const itemParts = this.value;
      let partIndex = 0;
      let itemPart;
      for (const item of value) {
        itemPart = itemParts[partIndex];
        if (itemPart === void 0) {
          itemPart = new NodePart(this.options);
          itemParts.push(itemPart);
          if (partIndex === 0) {
            itemPart.appendIntoPart(this);
          } else {
            itemPart.insertAfterPart(itemParts[partIndex - 1]);
          }
        }
        itemPart.setValue(item);
        itemPart.commit();
        partIndex++;
      }
      if (partIndex < itemParts.length) {
        itemParts.length = partIndex;
        this.clear(itemPart && itemPart.endNode);
      }
    }
    clear(startNode = this.startNode) {
      removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
    }
  };
  var BooleanAttributePart = class {
    constructor(element, name, strings) {
      this.value = void 0;
      this.__pendingValue = void 0;
      if (strings.length !== 2 || strings[0] !== "" || strings[1] !== "") {
        throw new Error("Boolean attributes can only contain a single expression");
      }
      this.element = element;
      this.name = name;
      this.strings = strings;
    }
    setValue(value) {
      this.__pendingValue = value;
    }
    commit() {
      while (isDirective(this.__pendingValue)) {
        const directive2 = this.__pendingValue;
        this.__pendingValue = noChange;
        directive2(this);
      }
      if (this.__pendingValue === noChange) {
        return;
      }
      const value = !!this.__pendingValue;
      if (this.value !== value) {
        if (value) {
          this.element.setAttribute(this.name, "");
        } else {
          this.element.removeAttribute(this.name);
        }
        this.value = value;
      }
      this.__pendingValue = noChange;
    }
  };
  var PropertyCommitter = class extends AttributeCommitter {
    constructor(element, name, strings) {
      super(element, name, strings);
      this.single = strings.length === 2 && strings[0] === "" && strings[1] === "";
    }
    _createPart() {
      return new PropertyPart(this);
    }
    _getValue() {
      if (this.single) {
        return this.parts[0].value;
      }
      return super._getValue();
    }
    commit() {
      if (this.dirty) {
        this.dirty = false;
        this.element[this.name] = this._getValue();
      }
    }
  };
  var PropertyPart = class extends AttributePart {
  };
  var eventOptionsSupported = false;
  (() => {
    try {
      const options = {
        get capture() {
          eventOptionsSupported = true;
          return false;
        }
      };
      window.addEventListener("test", options, options);
      window.removeEventListener("test", options, options);
    } catch (_e) {
    }
  })();
  var EventPart = class {
    constructor(element, eventName, eventContext) {
      this.value = void 0;
      this.__pendingValue = void 0;
      this.element = element;
      this.eventName = eventName;
      this.eventContext = eventContext;
      this.__boundHandleEvent = (e) => this.handleEvent(e);
    }
    setValue(value) {
      this.__pendingValue = value;
    }
    commit() {
      while (isDirective(this.__pendingValue)) {
        const directive2 = this.__pendingValue;
        this.__pendingValue = noChange;
        directive2(this);
      }
      if (this.__pendingValue === noChange) {
        return;
      }
      const newListener = this.__pendingValue;
      const oldListener = this.value;
      const shouldRemoveListener = newListener == null || oldListener != null && (newListener.capture !== oldListener.capture || newListener.once !== oldListener.once || newListener.passive !== oldListener.passive);
      const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);
      if (shouldRemoveListener) {
        this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options);
      }
      if (shouldAddListener) {
        this.__options = getOptions(newListener);
        this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options);
      }
      this.value = newListener;
      this.__pendingValue = noChange;
    }
    handleEvent(event) {
      if (typeof this.value === "function") {
        this.value.call(this.eventContext || this.element, event);
      } else {
        this.value.handleEvent(event);
      }
    }
  };
  var getOptions = (o) => o && (eventOptionsSupported ? {capture: o.capture, passive: o.passive, once: o.once} : o.capture);

  // node_modules/lit-html/lib/default-template-processor.js
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  var DefaultTemplateProcessor = class {
    handleAttributeExpressions(element, name, strings, options) {
      const prefix = name[0];
      if (prefix === ".") {
        const committer2 = new PropertyCommitter(element, name.slice(1), strings);
        return committer2.parts;
      }
      if (prefix === "@") {
        return [new EventPart(element, name.slice(1), options.eventContext)];
      }
      if (prefix === "?") {
        return [new BooleanAttributePart(element, name.slice(1), strings)];
      }
      const committer = new AttributeCommitter(element, name, strings);
      return committer.parts;
    }
    handleTextExpression(options) {
      return new NodePart(options);
    }
  };
  var defaultTemplateProcessor = new DefaultTemplateProcessor();

  // node_modules/lit-html/lib/template-factory.js
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  function templateFactory(result) {
    let templateCache = templateCaches.get(result.type);
    if (templateCache === void 0) {
      templateCache = {
        stringsArray: new WeakMap(),
        keyString: new Map()
      };
      templateCaches.set(result.type, templateCache);
    }
    let template = templateCache.stringsArray.get(result.strings);
    if (template !== void 0) {
      return template;
    }
    const key = result.strings.join(marker);
    template = templateCache.keyString.get(key);
    if (template === void 0) {
      template = new Template(result, result.getTemplateElement());
      templateCache.keyString.set(key, template);
    }
    templateCache.stringsArray.set(result.strings, template);
    return template;
  }
  var templateCaches = new Map();

  // node_modules/lit-html/lib/render.js
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  var parts = new WeakMap();
  var render = (result, container, options) => {
    let part = parts.get(container);
    if (part === void 0) {
      removeNodes(container, container.firstChild);
      parts.set(container, part = new NodePart(Object.assign({templateFactory}, options)));
      part.appendInto(container);
    }
    part.setValue(result);
    part.commit();
  };

  // node_modules/lit-html/lit-html.js
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  if (typeof window !== "undefined") {
    (window["litHtmlVersions"] || (window["litHtmlVersions"] = [])).push("1.3.0");
  }
  var html = (strings, ...values) => new TemplateResult(strings, values, "html", defaultTemplateProcessor);

  // node_modules/@simple-html/core/dist/symbols.js
  function initSymbolCache() {
    if (!globalThis._STD_SYMBOL) {
      globalThis._STD_SYMBOL = {
        observedAttributesMap: Symbol("observedAttributesMap"),
        observedAttributes: Symbol("observedAttributes"),
        updateCallbackCallers: Symbol("updateCallbackCallers"),
        disconnectCallbackCaller: Symbol("disconnectCallbackCaller"),
        constructorDone: Symbol("constructorDone"),
        transmitter: Symbol("transmitter")
      };
      globalThis._PROP_SYMBOL = {};
    }
  }
  function stdSymbol() {
    return globalThis._STD_SYMBOL;
  }
  function getObservedAttributesMapSymbol() {
    return stdSymbol().observedAttributesMap;
  }
  function getObservedAttributesSymbol() {
    return stdSymbol().observedAttributes;
  }
  function getUpdateCallbackCallersSymbol() {
    return stdSymbol().updateCallbackCallers;
  }
  function getDisconnectCallbackCallerSymbol() {
    return stdSymbol().disconnectCallbackCaller;
  }
  function getConstructorDoneSymbol() {
    return stdSymbol().constructorDone;
  }
  function getTransmitterSymbol() {
    return stdSymbol().transmitter;
  }
  initSymbolCache();

  // node_modules/@simple-html/core/dist/customElement.js
  function customElement(elementName, extended) {
    return function reg(elementClass) {
      const observedAttributes = elementClass.observedAttributes;
      Object.defineProperty(elementClass, "observedAttributes", {
        set: function(value) {
          elementClass.prototype[getObservedAttributesSymbol()] = value;
          return true;
        },
        get: function() {
          return elementClass.prototype[getObservedAttributesSymbol()];
        },
        configurable: true
      });
      if (Array.isArray(observedAttributes) && Array.isArray(elementClass.observedAttributes)) {
        elementClass.observedAttributes = elementClass.observedAttributes.concat(observedAttributes);
      }
      if (Array.isArray(observedAttributes) && !Array.isArray(elementClass.observedAttributes)) {
        elementClass.observedAttributes = observedAttributes;
      }
      const Base = class extends elementClass {
        constructor(...result) {
          super(...result);
          this[getUpdateCallbackCallersSymbol()] = [];
          this[getDisconnectCallbackCallerSymbol()] = [];
          this[getConstructorDoneSymbol()] = true;
        }
        render(...result) {
          if (super.render) {
            const template = super.render.call(this, ...result);
            if (!(template === null || template === void 0 ? void 0 : template.then)) {
              render(template, this, {eventContext: this});
              const callers = this[getUpdateCallbackCallersSymbol()];
              if (super.updatedCallback || callers && callers.length) {
                requestAnimationFrame(() => {
                  if (callers && callers.length) {
                    callers.forEach((call) => call());
                  }
                  this[getUpdateCallbackCallersSymbol()] = [];
                  if (super.updatedCallback) {
                    super.updatedCallback.call(this);
                  }
                });
              }
            } else {
              Promise.resolve(template).then((templates) => {
                render(templates, this, {eventContext: this});
                const callers = this[getUpdateCallbackCallersSymbol()];
                if (super.updatedCallback || callers && callers.length) {
                  requestAnimationFrame(() => {
                    if (callers && callers.length) {
                      callers.forEach((call) => call());
                    }
                    this[getUpdateCallbackCallersSymbol()] = [];
                    if (super.updatedCallback) {
                      super.updatedCallback.call(this);
                    }
                  });
                }
              });
            }
          }
        }
        adoptedCallback(...result) {
          if (super.adoptedCallback) {
            super.adoptedCallback.call(this, ...result);
          }
        }
        connectedCallback(...result) {
          if (super.connectedCallback) {
            super.connectedCallback.call(this, ...result);
          }
          this.render(this);
        }
        internalRegisterDisconnectCallback(call) {
          if (this[getDisconnectCallbackCallerSymbol()]) {
            this[getDisconnectCallbackCallerSymbol()].push(call);
          } else {
            console.warn("you tried to reregister disconnect callback when not allowed");
          }
        }
        internalRegisterUpdatedCallback(call) {
          if (this[getUpdateCallbackCallersSymbol()]) {
            this[getUpdateCallbackCallersSymbol()].push(call);
          } else {
            console.warn("you tried to reregister updated callback when not allowed");
          }
        }
        disconnectedCallback(...result) {
          this[getUpdateCallbackCallersSymbol()] = null;
          const callers = this[getDisconnectCallbackCallerSymbol()];
          this[getDisconnectCallbackCallerSymbol()] = null;
          if (callers.length) {
            callers.forEach((call) => call());
          }
          if (super.disconnectedCallback) {
            super.disconnectedCallback.call(this, ...result);
          }
        }
        attributeChangedCallback(name, oldValue, newValue) {
          if (!this[getObservedAttributesMapSymbol()]) {
            const attribute2 = name.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/\s+/g, "-").toLowerCase();
            this[getObservedAttributesMapSymbol()] = new Map();
            this[getObservedAttributesMapSymbol()].set(attribute2, name);
          }
          const nameProp = this[getObservedAttributesMapSymbol()].get(name);
          this[nameProp] = newValue || "";
          if (super.attributeChangedCallback) {
            super.attributeChangedCallback.call(this, name, oldValue, newValue);
          }
          if (super.valuesChangedCallback) {
            super.valuesChangedCallback.call(this, "attribute", name, oldValue, newValue);
          }
        }
      };
      if (!customElements.get(elementName)) {
        if (extended) {
          customElements.define(elementName, Base, extended);
        } else {
          customElements.define(elementName, Base);
        }
      } else {
        if (globalThis.hmrCache) {
          if (extended) {
            customElements.define(elementName, Base, extended);
          } else {
            customElements.define(elementName, Base);
          }
        }
      }
    };
  }

  // node_modules/@simple-html/core/dist/transmitter.js
  if (!globalThis[getTransmitterSymbol()]) {
    globalThis[getTransmitterSymbol()] = {};
  }

  // node_modules/@simple-html/core/dist/state.js
  var state = window.state || {};
  var keys = new Set();
  if (!window.state) {
    window.state = {};
    window.addEventListener("SIMPLE_HTML_SAVE_STATE", () => {
      window.state = state;
      console.log("SIMPLE_HTML_HMR", window.state);
    });
  }

  // src/ifc-reader/lexer.ts
  var Lexer = class {
    constructor() {
      this.nextToken = function() {
        this.skipTokens();
        if (this.pos >= this.buflen) {
          return null;
        }
        var c = this.buf.charAt(this.pos);
        var op = this.optable[c];
        if (op !== void 0) {
          return {name: op, value: c, pos: this.pos++};
        } else {
          switch (true) {
            case this.isID(c):
              return this.processID();
            case this.isArg(c):
              return this.processIdentifier();
            case c === "'":
              return this.processString();
            default:
              throw "unknow token" + c;
          }
        }
      };
      this.pos = 0;
      this.buf = null;
      this.buflen = 0;
      this.optable = {
        ",": "COMMA",
        "(": "L_PAREN",
        ")": "R_PAREN"
      };
    }
    input(buf) {
      this.pos = 0;
      this.buf = buf;
      this.buflen = buf.length;
    }
    isID(c) {
      return c === "#";
    }
    isNewLine(c) {
      return c === "\r" || c === "\n";
    }
    isDigit(c) {
      return c >= "0" && c <= "9";
    }
    isArg(c) {
      return c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c >= "0" && c <= "9" || c === "_" || c === "-" || c === "*" || c === "$" || c === ":" || c === ".";
    }
    processID() {
      var endpos = this.pos + 1;
      while (endpos < this.buflen && this.isDigit(this.buf.charAt(endpos))) {
        endpos++;
      }
      var tok = {
        name: "ID",
        value: this.buf.substring(this.pos, endpos),
        pos: this.pos
      };
      this.pos = endpos;
      return tok;
    }
    processNumber() {
      var endpos = this.pos + 1;
      while (endpos < this.buflen && this.isDigit(this.buf.charAt(endpos))) {
        endpos++;
      }
      var tok = {
        name: "NUMBER",
        value: this.buf.substring(this.pos, endpos),
        pos: this.pos
      };
      this.pos = endpos;
      return tok;
    }
    processIdentifier() {
      var endpos = this.pos + 1;
      while (endpos < this.buflen && this.isArg(this.buf.charAt(endpos))) {
        endpos++;
      }
      var tok = {
        name: "IDENTIFIER",
        value: this.buf.substring(this.pos, endpos),
        pos: this.pos
      };
      this.pos = endpos;
      return tok;
    }
    processString() {
      var end_index = this.buf.indexOf("'", this.pos + 1);
      if (end_index === -1) {
        throw Error("Unterminated STRING at " + this.pos);
      } else {
        var tok = {
          name: "STRING",
          value: this.buf.substring(this.pos + 1, end_index),
          pos: this.pos
        };
        this.pos = end_index + 1;
        return tok;
      }
    }
    skipTokens() {
      while (this.pos < this.buflen) {
        var c = this.buf.charAt(this.pos);
        if (c === " " || c === "	" || c === "\r" || c === "\n" || c === "," || c === "=" || c === ";") {
          this.pos++;
        } else {
          break;
        }
      }
    }
  };

  // src/ifc-reader/parser.ts
  var lexer = new Lexer();
  function lexString(d) {
    lexer.input(d);
    let ID = lexer.nextToken();
    let NAME = lexer.nextToken();
    let tokens = [ID, NAME];
    let t;
    while (t !== null) {
      t = lexer.nextToken();
      if (t) {
        tokens.push(t);
      }
    }
  }

  // src/ifc-reader/ifc-reader.ts
  var IFCReader = class extends HTMLElement {
    render() {
      return html`
      <style>
        ifc-reader {
          display: flex;
        }
      </style>

      <input @change=${this.openFile} type="file" />
    `;
    }
    openFile(e) {
      console.time("file");
      const file = e.target.files[0];
      const reader = new FileReader();
      const encoder = new TextDecoder();
      const decoder = new TextEncoder();
      const dataTagBuffer = decoder.encode("DATA;");
      const dataTagUintArray = new Uint8Array(dataTagBuffer);
      let readFrom = 0;
      let readTo = 0;
      reader.onload = () => {
        const byteLength = reader.result.byteLength;
        let i = readFrom;
        const y = dataTagUintArray;
        while (i !== byteLength) {
          const buffer = reader.result.slice(i, i + 5);
          const x = new Uint8Array(buffer);
          if (x[0] === y[0] && x[1] === y[1] && x[2] === y[2] && x[3] === y[3] && x[4] === y[4]) {
            readFrom = i + 5;
            break;
          }
          i++;
        }
        while (readTo < byteLength) {
          let i2 = readFrom;
          while (i2 !== byteLength) {
            const buffer2 = reader.result.slice(i2, i2 + 2);
            const x = new Uint8Array(buffer2);
            if (x[0] === 10 || x[0] === 13) {
              readTo = i2 + 1;
              if (x[1] === 10 || x[1] === 13) {
                readTo = i2 + 2;
              }
              break;
            }
            i2++;
          }
          const buffer = reader.result.slice(readFrom, readTo);
          let data = encoder.decode(buffer);
          lexString(data);
          readFrom = readTo;
        }
      };
      reader.onloadend = () => {
        console.timeEnd("file");
      };
      reader.onprogress = (e2) => {
        console.log(e2);
      };
      reader.readAsArrayBuffer(file);
    }
  };
  IFCReader = __decorate([
    customElement("ifc-reader")
  ], IFCReader);

  // src/index.ts
  Promise.resolve().then(() => __toModule(require_app_root())).then(() => {
    if (document.body) {
      document.body.innerHTML = "<app-root></app-root>";
    }
  });
})();
//# sourceMappingURL=index.js.map
