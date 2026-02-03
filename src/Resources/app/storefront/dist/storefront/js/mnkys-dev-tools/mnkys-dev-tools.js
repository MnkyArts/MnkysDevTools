(()=>{"use strict";var e={156:e=>{var t=function(e){var t;return!!e&&"object"==typeof e&&"[object RegExp]"!==(t=Object.prototype.toString.call(e))&&"[object Date]"!==t&&e.$$typeof!==n},n="function"==typeof Symbol&&Symbol.for?Symbol.for("react.element"):60103;function o(e,t){return!1!==t.clone&&t.isMergeableObject(e)?l(Array.isArray(e)?[]:{},e,t):e}function i(e,t,n){return e.concat(t).map(function(e){return o(e,n)})}function s(e){return Object.keys(e).concat(Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(e).filter(function(t){return Object.propertyIsEnumerable.call(e,t)}):[])}function r(e,t){try{return t in e}catch(e){return!1}}function l(e,n,a){(a=a||{}).arrayMerge=a.arrayMerge||i,a.isMergeableObject=a.isMergeableObject||t,a.cloneUnlessOtherwiseSpecified=o;var c,d,p=Array.isArray(n);return p!==Array.isArray(e)?o(n,a):p?a.arrayMerge(e,n,a):(d={},(c=a).isMergeableObject(e)&&s(e).forEach(function(t){d[t]=o(e[t],c)}),s(n).forEach(function(t){(!r(e,t)||Object.hasOwnProperty.call(e,t)&&Object.propertyIsEnumerable.call(e,t))&&(r(e,t)&&c.isMergeableObject(n[t])?d[t]=(function(e,t){if(!t.customMerge)return l;var n=t.customMerge(e);return"function"==typeof n?n:l})(t,c)(e[t],n[t],c):d[t]=o(n[t],c))}),d)}l.all=function(e,t){if(!Array.isArray(e))throw Error("first argument should be an array");return e.reduce(function(e,n){return l(e,n,t)},{})},e.exports=l}},t={};function n(o){var i=t[o];if(void 0!==i)return i.exports;var s=t[o]={exports:{}};return e[o](s,s.exports,n),s.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var o in t)n.o(t,o)&&!n.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t);var o=n(156),i=n.n(o);class s{static ucFirst(e){return e.charAt(0).toUpperCase()+e.slice(1)}static lcFirst(e){return e.charAt(0).toLowerCase()+e.slice(1)}static toDashCase(e){return e.replace(/([A-Z])/g,"-$1").replace(/^-/,"").toLowerCase()}static toLowerCamelCase(e,t){let n=s.toUpperCamelCase(e,t);return s.lcFirst(n)}static toUpperCamelCase(e,t){return t?e.split(t).map(e=>s.ucFirst(e.toLowerCase())).join(""):s.ucFirst(e.toLowerCase())}static parsePrimitive(e){try{return/^\d+(.|,)\d+$/.test(e)&&(e=e.replace(",",".")),JSON.parse(e)}catch(t){return e.toString()}}}class r{constructor(e=document){this._el=e,e.$emitter=this,this._listeners=[]}publish(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],o=new CustomEvent(e,{detail:t,cancelable:n});return this.el.dispatchEvent(o),o}subscribe(e,t){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},o=this,i=e.split("."),s=n.scope?t.bind(n.scope):t;if(n.once&&!0===n.once){let t=s;s=function(n){o.unsubscribe(e),t(n)}}return this.el.addEventListener(i[0],s),this.listeners.push({splitEventName:i,opts:n,cb:s}),!0}unsubscribe(e){let t=e.split(".");return this.listeners=this.listeners.reduce((e,n)=>([...n.splitEventName].sort().toString()===t.sort().toString()?this.el.removeEventListener(n.splitEventName[0],n.cb):e.push(n),e),[]),!0}reset(){return this.listeners.forEach(e=>{this.el.removeEventListener(e.splitEventName[0],e.cb)}),this.listeners=[],!0}get el(){return this._el}set el(e){this._el=e}get listeners(){return this._listeners}set listeners(e){this._listeners=e}}class l{constructor(e,t={},n=!1){if(!(e instanceof Node)){console.warn(`There is no valid element given while trying to create a plugin instance for "${n}".`);return}this.el=e,this.$emitter=new r(this.el),this._pluginName=this._getPluginName(n),this.options=this._mergeOptions(t),this._initialized=!1,this._registerInstance(),this._init()}init(){console.warn(`The "init" method for the plugin "${this._pluginName}" is not defined. The plugin will not be initialized.`)}update(){}_init(){this._initialized||(this.init(),this._initialized=!0)}_update(){this._initialized&&this.update()}_mergeOptions(e){let t=[this.constructor.options,this.options,e];return t.push(this._getConfigFromDataAttribute()),t.push(this._getOptionsFromDataAttribute()),i().all(t.filter(e=>e instanceof Object&&!(e instanceof Array)).map(e=>e||{}))}_getConfigFromDataAttribute(){let e={};if("function"!=typeof this.el.getAttribute)return e;let t=s.toDashCase(this._pluginName),n=this.el.getAttribute(`data-${t}-config`);return n?window.PluginConfigManager.get(this._pluginName,n):e}_getOptionsFromDataAttribute(){let e={};if("function"!=typeof this.el.getAttribute)return e;let t=s.toDashCase(this._pluginName),n=this.el.getAttribute(`data-${t}-options`);if(n)try{return JSON.parse(n)}catch(e){console.error(`The data attribute "data-${t}-options" could not be parsed to json: ${e.message}`)}return e}_registerInstance(){window.PluginManager.getPluginInstancesFromElement(this.el).set(this._pluginName,this),window.PluginManager.getPlugin(this._pluginName,!1).get("instances").push(this)}_getPluginName(e){return e||(e=this.constructor.name),e}}let a={accent:"#00D9FF",accentHover:"#00B8D9",accentMuted:"rgba(0, 217, 255, 0.15)",error:"#FF5252",bgDeep:"#0D1117",bg:"#161B22",bgElevated:"#21262D",bgHover:"#30363D",bgGlass:"rgba(22, 27, 34, 0.85)",text:"#F0F6FC",textSecondary:"#8B949E",textMuted:"#6E7681",border:"#30363D",borderHover:"#8B949E",borderAccent:"rgba(0, 217, 255, 0.4)",overlay:"rgba(0, 217, 255, 0.12)",overlayBorder:"#00D9FF",syntax:{keyword:"#FF79C6",string:"#A5D6FF",variable:"#79C0FF",number:"#A5D6A7",comment:"#6E7681",tag:"#7EE787",attribute:"#D2A8FF"}},c={mono:'"JetBrains Mono", "Fira Code", "SF Mono", "Consolas", monospace',system:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'},d={overlay:0x7ffffff8,tooltip:0x7ffffff9,panel:0x7ffffffa,detailPanel:0x7ffffffb,notification:0x80000002},p={xs:"4px",sm:"8px",md:"12px",lg:"16px",xl:"20px",xxl:"24px"},h={sm:"6px",md:"10px",lg:"14px",full:"9999px"},u={sm:"0 2px 8px rgba(0, 0, 0, 0.3)",lg:"0 8px 32px rgba(0, 0, 0, 0.5)",glow:"0 0 20px rgba(0, 217, 255, 0.3)",glowStrong:"0 0 30px rgba(0, 217, 255, 0.4)"},m=["__mnkys-devtools-overlay__","__mnkys-devtools-tooltip__","__mnkys-devtools-panel__","__mnkys-devtools-detail__","__mnkys-devtools-toggle__"];function b(e){return"string"!=typeof e?e:e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function g(e){return e.replace(/^@Storefront\//,"").replace(/^@(\w+)\//,"$1/").replace(/^storefront\//,"")}function v(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"success",n=document.createElement("div");n.className=`devtools-notification ${t}`,n.textContent=e,document.body.appendChild(n),requestAnimationFrame(()=>n.style.opacity="1"),setTimeout(()=>{n.style.opacity="0",setTimeout(()=>n.remove(),200)},2500)}function f(e){if(e.closest(m.map(e=>`#${e}`).join(", ")))return null;for(;e&&e!==document.body&&e!==document.documentElement;){if(e.dataset&&e.dataset.twigBlock)return e;e=e.parentElement}return null}function y(e){try{return JSON.parse(e.dataset.twigBlock)}catch(e){return console.warn("DevTools: Failed to parse twig data",e),null}}class x{constructor(){this.element=null}create(){this.element||(this.element=document.createElement("div"),this.element.id="__mnkys-devtools-overlay__",document.body.appendChild(this.element))}destroy(){this.element?.remove(),this.element=null}show(){this.element&&(this.element.style.display="block")}hide(){this.element&&(this.element.style.display="none")}highlight(e){if(!this.element||!e)return;let t=e.getBoundingClientRect();Object.assign(this.element.style,{display:"block",left:`${t.left-2}px`,top:`${t.top-2}px`,width:`${t.width+4}px`,height:`${t.height+4}px`})}isVisible(){return this.element&&"none"!==this.element.style.display}}class _{constructor(){this.element=null}create(){this.element||(this.element=document.createElement("div"),this.element.id="__mnkys-devtools-tooltip__",document.body.appendChild(this.element))}destroy(){this.element?.remove(),this.element=null}show(){this.element&&(this.element.style.display="block")}hide(){this.element&&(this.element.style.display="none")}update(e,t){let n=y(e);if(!n)return;let o=e.tagName.toLowerCase(),i=e.id?`#${e.id}`:"",s=e.className&&"string"==typeof e.className?"."+e.className.trim().split(/\s+/).slice(0,2).join("."):"";this.element.innerHTML=`
            <div class="element-tag">&lt;${o}${i}${s}&gt;</div>
            <div class="block-name">${b(n.block)}</div>
            <div class="template-path">${b(n.template)}:${n.line}</div>
        `,this.show(),this.position(t)}position(e){if(!this.element||"none"===this.element.style.display)return;let t=this.element.getBoundingClientRect(),n=window.innerWidth,o=window.innerHeight,i=e.clientX+15,s=e.clientY+15;i+t.width>n-15&&(i=e.clientX-t.width-15),s+t.height>o-15&&(s=e.clientY-t.height-15),i=Math.max(15,i),s=Math.max(15,s),this.element.style.left=`${i}px`,this.element.style.top=`${s}px`}isVisible(){return this.element&&"none"!==this.element.style.display}}class k{constructor(e={}){this.options={onToggle:null,...e},this.element=null,this.isActive=!1}create(){this.element||document.getElementById("__mnkys-devtools-toggle__")||(this._injectStyles(),this.element=document.createElement("button"),this.element.id="__mnkys-devtools-toggle__",this.element.innerHTML=`
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
            </svg>
            <span>Inspect</span>
        `,this.element.title="Toggle Component Inspector (Ctrl+Shift+C)",this.element.setAttribute("aria-label","Toggle DevTools Inspector"),this.element.setAttribute("aria-pressed","false"),this.element.addEventListener("click",e=>{e.stopPropagation(),this.options.onToggle?.()}),document.body.appendChild(this.element))}destroy(){this.element?.remove(),this.element=null}setActive(e){if(!this.element)return;this.isActive=e,this.element.classList.toggle("active",e),this.element.setAttribute("aria-pressed",String(e));let t=this.element.querySelector("span");t&&(t.textContent=e?"Exit":"Inspect");let n=this.element.querySelector("svg");n&&(e?n.innerHTML=`
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                `:n.innerHTML=`
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                `)}exists(){return!!this.element}_injectStyles(){if(document.getElementById("__mnkys-devtools-toggle-styles__"))return;let e=document.createElement("style");e.id="__mnkys-devtools-toggle-styles__",e.textContent=`
            #__mnkys-devtools-toggle__ {
                position: fixed;
                bottom: 20px;
                left: 20px;
                z-index: 2147483630;
                
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 12px 16px;
                
                background: rgba(22, 27, 34, 0.85);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                
                color: #00D9FF;
                border: 1px solid rgba(0, 217, 255, 0.4);
                border-radius: 9999px;
                
                cursor: pointer;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                font-size: 13px;
                font-weight: 600;
                letter-spacing: 0.02em;
                
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 217, 255, 0.3);
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                transform: translateY(0);
            }

            #__mnkys-devtools-toggle__:hover {
                background: #00D9FF;
                color: #0D1117;
                border-color: #00D9FF;
                transform: translateY(-2px);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 217, 255, 0.4);
            }

            #__mnkys-devtools-toggle__:active {
                transform: translateY(0) scale(0.98);
            }

            #__mnkys-devtools-toggle__.active {
                background: #00D9FF;
                color: #0D1117;
                border-color: #00D9FF;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 217, 255, 0.4);
            }

            #__mnkys-devtools-toggle__ svg {
                transition: transform 0.2s ease;
            }

            #__mnkys-devtools-toggle__:hover svg {
                transform: scale(1.1);
            }

            #__mnkys-devtools-toggle__.active svg {
                transform: rotate(0deg);
            }

            #__mnkys-devtools-toggle__:focus {
                outline: none;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4), 0 0 0 3px rgba(0, 217, 255, 0.3);
            }

            #__mnkys-devtools-toggle__:focus-visible {
                outline: 2px solid #00D9FF;
                outline-offset: 2px;
            }

            /* Respect reduced motion preference */
            @media (prefers-reduced-motion: reduce) {
                #__mnkys-devtools-toggle__ {
                    transition: none;
                }
                #__mnkys-devtools-toggle__ svg {
                    transition: none;
                }
            }
        `,document.head.appendChild(e)}}let $=new class{constructor(){this._request=null,this._errorHandlingInternal=!1}get(e,t){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"application/json",o=this._createPreparedRequest("GET",e,n);return this._sendRequest(o,null,t)}post(e,t,n){let o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"application/json";o=this._getContentType(t,o);let i=this._createPreparedRequest("POST",e,o);return this._sendRequest(i,t,n)}delete(e,t,n){let o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"application/json";o=this._getContentType(t,o);let i=this._createPreparedRequest("DELETE",e,o);return this._sendRequest(i,t,n)}patch(e,t,n){let o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"application/json";o=this._getContentType(t,o);let i=this._createPreparedRequest("PATCH",e,o);return this._sendRequest(i,t,n)}abort(){if(this._request)return this._request.abort()}setErrorHandlingInternal(e){this._errorHandlingInternal=e}_registerOnLoaded(e,t){t&&(!0===this._errorHandlingInternal?(e.addEventListener("load",()=>{t(e.responseText,e)}),e.addEventListener("abort",()=>{console.warn(`the request to ${e.responseURL} was aborted`)}),e.addEventListener("error",()=>{console.warn(`the request to ${e.responseURL} failed with status ${e.status}`)}),e.addEventListener("timeout",()=>{console.warn(`the request to ${e.responseURL} timed out`)})):e.addEventListener("loadend",()=>{t(e.responseText,e)}))}_sendRequest(e,t,n){return this._registerOnLoaded(e,n),e.send(t),e}_getContentType(e,t){return e instanceof FormData&&(t=!1),t}_createPreparedRequest(e,t,n){return this._request=new XMLHttpRequest,this._request.open(e,t),this._request.setRequestHeader("X-Requested-With","XMLHttpRequest"),n&&this._request.setRequestHeader("Content-type",n),this._request}},w={openEditor:"/devtools/open-editor",blockInfo:"/devtools/block-info"};function z(e){return new Promise((t,n)=>{let o=null;o=setTimeout(()=>{n(Error("Request timeout"))},1e4),$.get(e,e=>{clearTimeout(o);try{let n=JSON.parse(e);t(n)}catch(e){n(Error("Failed to parse response"))}},"application/json",!0)})}async function E(e,t){let n=`${w.openEditor}?file=${encodeURIComponent(e)}&line=${t}`;try{return await z(n)}catch(e){return console.warn("DevTools: Failed to open editor",e),{success:!1,error:e.message}}}async function T(e,t,n){let o=new URLSearchParams({template:e,block:t,line:String(n)}),i=`${w.blockInfo}?${o}`;try{return await z(i)}catch(e){return console.warn("DevTools: Failed to fetch block info",e),{success:!1,error:e.message}}}function C(){let e=document.getElementById("devtools-block-data");if(!e)return[];try{return(JSON.parse(e.textContent)||[]).sort((e,t)=>{let n=e.template.localeCompare(t.template);return 0!==n?n:e.block.localeCompare(t.block)})}catch(e){return console.warn("DevTools: Failed to parse block data",e),[]}}let L="mnkys-devtools-panel-state";function S(){try{let e=localStorage.getItem(L);return e?JSON.parse(e):{}}catch(e){return{}}}function M(e){try{localStorage.setItem(L,JSON.stringify(e))}catch(e){}}function I(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n={panelId:e.id||"panel",dragHandleSelector:t.dragHandle||".panel-header, .detail-header",minWidth:t.minWidth||280,minHeight:t.minHeight||200,maxWidth:t.maxWidth||window.innerWidth-40,maxHeight:t.maxHeight||window.innerHeight-40,resizable:!1!==t.resizable,persistState:!1!==t.persistState,...t},o=!1,i=!1,s=null,r=0,l=0,a=0,c=0,d=0,p=0,h=null;if(n.resizable&&(h=function(){let t=document.createElement("div");return t.className="panel-resize-frame",t.innerHTML=`
            <div class="panel-resize-handle panel-resize-top" data-edge="top"></div>
            <div class="panel-resize-handle panel-resize-right" data-edge="right"></div>
            <div class="panel-resize-handle panel-resize-bottom" data-edge="bottom"></div>
            <div class="panel-resize-handle panel-resize-left" data-edge="left"></div>
            <div class="panel-resize-handle panel-resize-top-left" data-edge="top-left"></div>
            <div class="panel-resize-handle panel-resize-top-right" data-edge="top-right"></div>
            <div class="panel-resize-handle panel-resize-bottom-left" data-edge="bottom-left"></div>
            <div class="panel-resize-handle panel-resize-bottom-right" data-edge="bottom-right"></div>
        `,e.appendChild(t),t.querySelectorAll(".panel-resize-handle").forEach(e=>{e.addEventListener("mousedown",v)}),t}()),n.persistState){let t=S()[n.panelId];t&&(t.width&&(e.style.width=`${t.width}px`),t.height&&(e.style.height=`${t.height}px`),void 0!==t.left&&(e.style.left=`${t.left}px`,e.style.right="auto"),void 0!==t.top&&(e.style.top=`${t.top}px`,e.style.bottom="auto"))}function u(){if(!n.persistState)return;let t=e.getBoundingClientRect(),o=S();o[n.panelId]={width:t.width,height:t.height,left:t.left,top:t.top},M(o)}function m(t){if(!t.target.closest(n.dragHandleSelector)||t.target.closest("button, input, textarea, select, a, .panel-resize-handle"))return;o=!0,r=t.clientX,l=t.clientY;let i=e.getBoundingClientRect();d=i.left,p=i.top,e.style.left=`${d}px`,e.style.top=`${p}px`,e.style.right="auto",e.style.bottom="auto",e.classList.add("is-dragging"),t.preventDefault(),document.body.style.userSelect="none",document.body.style.webkitUserSelect="none",document.body.style.cursor="move",document.addEventListener("mousemove",b),document.addEventListener("mouseup",g)}function b(t){if(!o)return;let n=t.clientX-r,i=t.clientY-l,s=d+n,a=p+i,c=e.getBoundingClientRect();s=Math.max(0,Math.min(s,window.innerWidth-c.width)),a=Math.max(0,Math.min(a,window.innerHeight-c.height)),e.style.left=`${s}px`,e.style.top=`${a}px`,t.preventDefault()}function g(t){o&&(o=!1,e.classList.remove("is-dragging"),document.body.style.userSelect="",document.body.style.webkitUserSelect="",document.body.style.cursor="",document.removeEventListener("mousemove",b),document.removeEventListener("mouseup",g),u())}function v(t){i=!0,s=t.target.dataset.edge,r=t.clientX,l=t.clientY;let n=e.getBoundingClientRect();a=n.width,c=n.height,d=n.left,p=n.top,e.style.left=`${d}px`,e.style.top=`${p}px`,e.style.right="auto",e.style.bottom="auto",e.style.width=`${a}px`,e.style.height=`${c}px`,e.style.maxHeight="none",e.classList.add("is-resizing"),t.preventDefault(),t.stopPropagation(),document.body.style.userSelect="none",document.body.style.webkitUserSelect="none",document.body.style.cursor=({top:"ns-resize",bottom:"ns-resize",left:"ew-resize",right:"ew-resize","top-left":"nwse-resize","bottom-right":"nwse-resize","top-right":"nesw-resize","bottom-left":"nesw-resize"})[s]||"default",document.addEventListener("mousemove",f),document.addEventListener("mouseup",y)}function f(t){if(!i)return;let o=t.clientX-r,h=t.clientY-l,u=a,m=c,b=d,g=p;if(s.includes("right")&&(u=Math.max(n.minWidth,Math.min(n.maxWidth,a+o))),s.includes("left")){let e=a-o;e>=n.minWidth&&e<=n.maxWidth&&(u=e,b=d+o)}if(s.includes("bottom")&&(m=Math.max(n.minHeight,Math.min(n.maxHeight,c+h))),s.includes("top")){let e=c-h;e>=n.minHeight&&e<=n.maxHeight&&(m=e,g=p+h)}b=Math.max(0,b),g=Math.max(0,g),e.style.width=`${u}px`,e.style.height=`${m}px`,e.style.left=`${b}px`,e.style.top=`${g}px`,t.preventDefault()}function y(t){i&&(i=!1,s=null,e.classList.remove("is-resizing"),document.body.style.userSelect="",document.body.style.webkitUserSelect="",document.body.style.cursor="",document.removeEventListener("mousemove",f),document.removeEventListener("mouseup",y),u())}return e.addEventListener("mousedown",m),{reset:function(){if(e.style.width="",e.style.height="",e.style.left="",e.style.top="",e.style.right="",e.style.bottom="",e.style.maxHeight="",n.persistState){let e=S();delete e[n.panelId],M(e)}},destroy:function(){e.removeEventListener("mousedown",m),document.removeEventListener("mousemove",b),document.removeEventListener("mouseup",g),document.removeEventListener("mousemove",f),document.removeEventListener("mouseup",y),h?.remove()},saveState:u}}class D{constructor(e={}){this.options={onBlockSelect:null,...e},this.element=null,this.blocks=[],this.filteredBlocks=[],this.searchTerm="",this.panelInteractions=null}create(){this.element||(this.blocks=C(),this.filteredBlocks=[...this.blocks],this.element=document.createElement("div"),this.element.id="__mnkys-devtools-panel__",this.element.innerHTML=this._buildHTML(),document.body.appendChild(this.element),this._attachEvents(),this.panelInteractions=I(this.element,{panelId:"block-panel",dragHandle:".panel-header",minWidth:260,minHeight:200,maxWidth:window.innerWidth-40,maxHeight:window.innerHeight-40}))}destroy(){this.panelInteractions?.destroy(),this.panelInteractions=null,this.element?.remove(),this.element=null,this.blocks=[],this.filteredBlocks=[],this.searchTerm=""}reload(){this.blocks=C(),this.filteredBlocks=[...this.blocks],this._updateList()}getBlocks(){return this.blocks}hasBlocks(){return this.blocks.length>0}_buildHTML(){return`
            <div class="panel-header">
                <div class="panel-title">Twig Blocks</div>
                <input type="text" class="panel-search" placeholder="Search blocks..." />
                <div class="panel-stats">${this.blocks.length} blocks</div>
            </div>
            <div class="panel-list">
                ${this._buildListHTML()}
            </div>
            <div class="panel-footer">
                <kbd>Esc</kbd> close &bull; <kbd>Click</kbd> for details
            </div>
        `}_buildListHTML(){return 0===this.filteredBlocks.length?'<div class="panel-empty">No blocks found</div>':this.filteredBlocks.map(e=>`
            <div class="block-item" 
                 data-template="${b(e.template)}" 
                 data-block="${b(e.block)}"
                 data-line="${e.line}"
                 data-block-id="${b(e.blockId||"")}">
                <div class="block-item-name">${this._highlightMatch(e.block)}</div>
                <div class="block-item-path">${this._highlightMatch(g(e.template))}:${e.line}</div>
            </div>
        `).join("")}_highlightMatch(e){if(!this.searchTerm)return b(e);let t=b(e),n=RegExp(`(${this.searchTerm.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`,"gi");return t.replace(n,'<span class="highlight">$1</span>')}_attachEvents(){let e=this.element.querySelector(".panel-search");e?.addEventListener("input",e=>{this.searchTerm=e.target.value.toLowerCase(),this._filterBlocks(),this._updateList()}),this.element.addEventListener("click",e=>{let t=e.target.closest(".block-item");if(t){let e={block:t.dataset.block,template:t.dataset.template,line:parseInt(t.dataset.line,10),blockId:t.dataset.blockId};this.options.onBlockSelect?.(e)}})}_filterBlocks(){if(!this.searchTerm){this.filteredBlocks=[...this.blocks];return}this.filteredBlocks=this.blocks.filter(e=>e.block.toLowerCase().includes(this.searchTerm)||e.template.toLowerCase().includes(this.searchTerm))}_updateList(){let e=this.element?.querySelector(".panel-list");e&&(e.innerHTML=this._buildListHTML());let t=this.element?.querySelector(".panel-stats");t&&(t.textContent=this.searchTerm?`${this.filteredBlocks.length} of ${this.blocks.length} blocks`:`${this.blocks.length} blocks`)}}class H{constructor(e={}){this.options={onClose:null,onOpenEditor:null,...e},this.element=null,this.currentBlock=null,this.contextData={},this.blockInfo=null,this.activeTab="context",this.isLoading=!1,this.panelInteractions=null}create(){this.element||(this.contextData=function(){let e=document.getElementById("devtools-context-data");if(!e)return{};try{return JSON.parse(e.textContent)||{}}catch(e){return console.warn("DevTools: Failed to parse context data",e),{}}}(),this.element=document.createElement("div"),this.element.id="__mnkys-devtools-detail__",this.element.style.display="none",this.contentContainer=document.createElement("div"),this.contentContainer.className="detail-panel-content",this.element.appendChild(this.contentContainer),document.body.appendChild(this.element))}_initInteractions(){this.panelInteractions||(this.panelInteractions=I(this.element,{panelId:"detail-panel",dragHandle:".detail-header",minWidth:380,minHeight:300,maxWidth:window.innerWidth-40,maxHeight:window.innerHeight-40}))}async show(e,t){this.element||this.create(),this.currentBlock=e,this.blockInfo=null,this.activeTab="context";let n=t.tagName.toLowerCase(),o=t.id?`#${t.id}`:"",i=t.className&&"string"==typeof t.className?"."+t.className.trim().split(/\s+/).slice(0,2).join("."):"";this.elementInfo=`<${n}${o}${i}>`,this.render(),this.element.style.display="flex",this._initInteractions(),this.fetchBlockInfo()}hide(){this.element&&(this.element.style.display="none"),this.currentBlock=null,this.blockInfo=null}destroy(){this.panelInteractions?.destroy(),this.panelInteractions=null,this.element?.remove(),this.element=null}async fetchBlockInfo(){if(this.currentBlock){this.isLoading=!0,this.updateTabContent();try{let e=await T(this.currentBlock.template,this.currentBlock.block,this.currentBlock.line);e.success&&e.data&&(this.blockInfo=e.data)}catch(e){console.warn("DevTools: Failed to fetch block info",e)}finally{this.isLoading=!1,this.updateTabContent()}}}render(){if(!this.contentContainer||!this.currentBlock)return;let{block:e,template:t,line:n,blockId:o}=this.currentBlock;this.contentContainer.innerHTML=`
            <div class="detail-header">
                <div class="element-info">${b(this.elementInfo)}</div>
                <div class="block-title">{% block ${b(e)} %}</div>
                <div class="template-info">
                    ${b(g(t))}
                    <span class="line-num">:${n}</span>
                </div>
            </div>
            
            <div class="detail-tabs">
                <button class="detail-tab ${"context"===this.activeTab?"active":""}" data-tab="context">
                    Context
                </button>
                <button class="detail-tab ${"hierarchy"===this.activeTab?"active":""}" data-tab="hierarchy">
                    Hierarchy
                </button>
                <button class="detail-tab ${"source"===this.activeTab?"active":""}" data-tab="source">
                    Source
                </button>
            </div>
            
            <div class="detail-content">
                <div class="tab-pane ${"context"===this.activeTab?"active":""}" data-pane="context">
                    ${this.renderContextTab()}
                </div>
                <div class="tab-pane ${"hierarchy"===this.activeTab?"active":""}" data-pane="hierarchy">
                    ${this.renderHierarchyTab()}
                </div>
                <div class="tab-pane ${"source"===this.activeTab?"active":""}" data-pane="source">
                    ${this.renderSourceTab()}
                </div>
            </div>
            
            <div class="detail-footer">
                <button class="detail-btn detail-btn-secondary" data-action="close">
                    Close
                </button>
                <button class="detail-btn detail-btn-primary" data-action="open-editor">
                    Open in Editor
                </button>
            </div>
        `,this.attachEvents()}updateTabContent(){if(!this.element)return;let e=this.element.querySelector('[data-pane="context"]'),t=this.element.querySelector('[data-pane="hierarchy"]'),n=this.element.querySelector('[data-pane="source"]');e&&(e.innerHTML=this.renderContextTab()),t&&(t.innerHTML=this.renderHierarchyTab()),n&&(n.innerHTML=this.renderSourceTab()),this.attachTreeEvents()}renderContextTab(){let{blockId:e}=this.currentBlock,t=this.contextData[e];if(!t||!t.context)return'<div class="source-loading">No context data available</div>';let n=t.context,o=Object.keys(n);return 0===o.length?'<div class="source-loading">No variables in context</div>':`
            <ul class="var-tree">
                ${o.map(e=>this.renderVariable(e,n[e])).join("")}
            </ul>
        `}renderVariable(e,t){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,o=this.hasExpandableContent(t),i=this.getTypeClass(t.type),s=this.getDisplayValue(t);return`
            <li class="var-item" data-depth="${n}">
                <div class="var-row">
                    <span class="var-toggle ${o?"expandable":""}"></span>
                    <span class="var-name">${b(e)}</span>
                    <span class="var-type">${b(this.getTypeLabel(t))}</span>
                    ${s?`<span class="var-value ${i}">${b(s)}</span>`:""}
                </div>
                ${o?`<ul class="var-children">${this.renderVariableChildren(t)}</ul>`:""}
            </li>
        `}hasExpandableContent(e){return!!e&&(!!e.properties&&Object.keys(e.properties).length>0||!!e.items&&Object.keys(e.items).length>0||!!e.keys&&e.keys.length>0)}renderVariableChildren(e){let t=[];if(e.properties)for(let[n,o]of Object.entries(e.properties))t.push(this.renderVariable(n,o,1));if(e.items)for(let[n,o]of Object.entries(e.items))t.push(this.renderVariable(n,o,1));if(e.keys&&!e.items)for(let n of e.keys)t.push(`
                    <li class="var-item">
                        <div class="var-row">
                            <span class="var-toggle"></span>
                            <span class="var-name">${b(n)}</span>
                            <span class="var-type">key</span>
                        </div>
                    </li>
                `);return t.join("")}getTypeClass(e){switch(e){case"string":return"string";case"int":case"float":return"number";case"bool":return"bool";case"null":return"null";case"object":return"object";default:return""}}getTypeLabel(e){if(!e)return"unknown";let t=e.type;return e.class&&(t=e.class),void 0!==e.count&&(t+=`(${e.count})`),void 0!==e.length&&"string"===e.type&&(t+=`[${e.length}]`),t}getDisplayValue(e){return e?void 0!==e.value?"bool"===e.type?e.value?"true":"false":"string"===e.type?`"${e.value}"`:String(e.value):e.preview?`"${e.preview}"`:e.name?e.name:e.id?`id: ${e.id}`:"":""}renderHierarchyTab(){if(this.isLoading)return'<div class="source-loading"><span class="devtools-loading"></span> Loading hierarchy...</div>';if(!this.blockInfo||!this.blockInfo.hierarchy)return'<div class="source-loading">Hierarchy information not available</div>';let e=this.blockInfo.hierarchy,t=this.currentBlock.template,n=e.length;return`
            <div class="hierarchy-section">
                <div class="hierarchy-label">Template Inheritance Chain</div>
                <div class="hierarchy-tree">
                    ${e.map((e,o)=>{let i=e.template===t,s=e.isRoot||0===o,r=e.blocks?e.blocks.length:0,l="";if(o>0){for(let e=0;e<o-1;e++)l+='<span class="tree-line">│</span>';l+=o===n-1?'<span class="tree-line">└</span><span class="tree-branch">─</span>':'<span class="tree-line">├</span><span class="tree-branch">─</span>'}return`
                            <div class="hierarchy-item ${i?"current":""} ${i?"":"clickable"}"
                                 data-template="${b(e.template)}"
                                 data-line="1"
                                 data-depth="${o}">
                                <div class="hierarchy-tree-line">${l}</div>
                                <div class="hierarchy-content">
                                    ${s?'<span class="hierarchy-icon root" title="Base template">◆</span>':'<span class="hierarchy-icon child" title="Extends parent">◇</span>'}
                                    <span class="hierarchy-template" title="${b(e.template)}">${b(g(e.template))}</span>
                                    <span class="hierarchy-blocks">${r}</span>
                                </div>
                                ${i?'<span class="hierarchy-current-badge">current</span>':""}
                            </div>
                        `}).join("")}
                </div>
            </div>
            
            ${this.blockInfo.blocks?this.renderBlockList():""}
        `}renderBlockList(){let e=this.blockInfo.blocks,t=e.flat||e,n=e.tree||Object.keys(t);if(!t||0===Object.keys(t).length)return"";let o=this.currentBlock.block,i=(e,n,s,r)=>{let l=t[e];if(!l)return"";let a=e===o,c=l.children||[],d=c.length>0,p="";for(let e=0;e<r.length;e++)p+=r[e]?'<span class="tree-line">│</span>':'<span class="tree-line"> </span>';n>0&&(p+=s?'<span class="tree-line">└</span><span class="tree-branch">─</span>':'<span class="tree-line">├</span><span class="tree-branch">─</span>');let h=`
                <div class="block-entry ${a?"current":""}" 
                     data-block="${b(e)}" 
                     data-line="${l.line}"
                     data-depth="${n}">
                    <div class="block-tree-line">${p}</div>
                    <span class="block-icon">{%</span>
                    <span class="block-entry-name">${b(e)}</span>
                    <span class="block-line">:${l.line}</span>
                    ${a?'<span class="block-current-badge">●</span>':""}
                </div>
            `;if(d){let e=[...r,!s];c.forEach((t,o)=>{let s=o===c.length-1;h+=i(t,n+1,s,e)})}return h},s="";return n.forEach((e,t)=>{let o=t===n.length-1;s+=i(e,0,o,[])}),`
            <div class="hierarchy-section blocks-section">
                <div class="hierarchy-label">Blocks in Current Template</div>
                <div class="blocks-tree">
                    ${s}
                </div>
            </div>
        `}renderSourceTab(){if(this.isLoading)return'<div class="source-loading"><span class="devtools-loading"></span> Loading source...</div>';if(!this.blockInfo||!this.blockInfo.source)return'<div class="source-loading">Source code not available</div>';let{lines:e,blockStart:t,blockEnd:n}=this.blockInfo.source;return e&&0!==e.length?`
            <div class="source-container">
                <div class="source-code">
                    ${e.map(e=>{let t=e.isBlockLine,n=e.isStartLine;return`
                            <div class="source-line ${t?"highlight":""} ${n?"block-start":""}">
                                <span class="line-number">${e.number}</span>
                                <span class="line-content">${b(e.content).replace(/(\{#.*?#\})/g,'<span class="twig-comment">$1</span>').replace(/(\{%\s*)(\w+)(.*?)(%\})/g,'<span class="twig-tag">$1</span><span class="twig-name">$2</span>$3<span class="twig-tag">$4</span>').replace(/(\{\{)(.*?)(\}\})/g,'<span class="twig-tag">$1</span>$2<span class="twig-tag">$3</span>').replace(/(&quot;[^&]*&quot;|&#039;[^&]*&#039;)/g,'<span class="twig-string">$1</span>').replace(/(&lt;\/?)(\w+)((?:\s+[^&]*?)?)(&gt;)/g,'$1<span class="html-tag">$2</span>$3$4')}</span>
                            </div>
                        `}).join("")}
                </div>
            </div>
        `:'<div class="source-loading">No source lines available</div>'}attachEvents(){this.element&&(this.element.querySelectorAll(".detail-tab").forEach(e=>{e.addEventListener("click",e=>{this.activeTab=e.target.dataset.tab,this.updateTabs()})}),this.element.querySelector('[data-action="close"]')?.addEventListener("click",()=>{this.hide(),this.options.onClose?.()}),this.element.querySelector('[data-action="open-editor"]')?.addEventListener("click",()=>{this.handleOpenEditor()}),this.element.querySelectorAll(".hierarchy-item.clickable").forEach(e=>{e.addEventListener("click",()=>{E(e.dataset.template,parseInt(e.dataset.line,10)||1)})}),this.attachTreeEvents())}attachTreeEvents(){this.element&&this.element.querySelectorAll(".var-row").forEach(e=>{e.addEventListener("click",t=>{let n=e.closest(".var-item");n&&e.querySelector(".var-toggle.expandable")&&n.classList.toggle("expanded")})})}updateTabs(){this.element&&(this.element.querySelectorAll(".detail-tab").forEach(e=>{e.classList.toggle("active",e.dataset.tab===this.activeTab)}),this.element.querySelectorAll(".tab-pane").forEach(e=>{e.classList.toggle("active",e.dataset.pane===this.activeTab)}))}async handleOpenEditor(){if(this.currentBlock)try{let e=await E(this.currentBlock.template,this.currentBlock.line);e.success?this.options.onOpenEditor?.(e):e.editorUrl?window.location.href=e.editorUrl:e.error&&console.warn("DevTools: Failed to open editor:",e.error)}catch(e){console.warn("DevTools: Failed to open editor",e)}}}class B extends l{static #e=this.options={keyboardShortcut:!0};init(){this._enabled=!1,this._currentTarget=null,this._overlay=null,this._tooltip=null,this._blockPanel=null,this._detailPanel=null,this._toggle=null,this._onMouseMove=this._onMouseMove.bind(this),this._onClick=this._onClick.bind(this),this._onKeyDown=this._onKeyDown.bind(this),this._initToggle(),this.options.keyboardShortcut&&document.addEventListener("keydown",this._onKeyDown)}_initToggle(){this._isDevToolsEnabled()?this._createToggle():setTimeout(()=>{!this._toggle?.exists()&&this._isDevToolsEnabled()&&this._createToggle()},100)}_createToggle(){this._toggle=new k({onToggle:()=>this.toggle()}),this._toggle.create()}_isDevToolsEnabled(){return!!("true"===document.body.dataset.devtoolsEnabled||document.getElementById("devtools-block-data"))}toggle(){this._enabled?this.disable():this.enable()}enable(){this._enabled||(this._enabled=!0,function(){if(document.getElementById("__mnkys-devtools-styles__"))return;let e=document.createElement("style");e.id="__mnkys-devtools-styles__",e.textContent=`
/* ========================================
   DevTools Inspector - Modern UI
   ======================================== */

/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

/* Base active state */
.mnkys-devtools-active {
    cursor: crosshair !important;
}

.mnkys-devtools-active * {
    cursor: crosshair !important;
}

/* ========================================
   Highlight Overlay
   ======================================== */

#__mnkys-devtools-overlay__ {
    position: fixed;
    pointer-events: none;
    z-index: ${d.overlay};
    
    background: ${a.overlay};
    border: 2px solid ${a.overlayBorder};
    border-radius: ${h.sm};
    
    box-shadow: 0 0 0 4px ${a.accentMuted},
                inset 0 0 20px ${a.accentMuted};
    
    transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    display: none;
    box-sizing: border-box;
}

/* ========================================
   Tooltip - Glassmorphism Card
   ======================================== */

#__mnkys-devtools-tooltip__ {
    position: fixed;
    pointer-events: none;
    z-index: ${d.tooltip};
    
    background: ${a.bgGlass};
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    
    color: ${a.text};
    padding: ${p.md} ${p.lg};
    border-radius: ${h.md};
    
    font-size: 12px;
    font-family: ${c.mono};
    line-height: 1.5;
    
    border: 1px solid ${a.borderAccent};
    box-shadow: ${u.lg}, ${u.glow};
    
    max-width: 420px;
    display: none;
    
    animation: tooltipIn 0.15s ease-out;
}

@keyframes tooltipIn {
    from {
        opacity: 0;
        transform: translateY(4px) scale(0.98);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

#__mnkys-devtools-tooltip__ .element-tag {
    color: ${a.textMuted};
    font-size: 10px;
    margin-bottom: ${p.sm};
    font-family: ${c.mono};
    opacity: 0.8;
}

#__mnkys-devtools-tooltip__ .block-name {
    color: ${a.accent};
    font-weight: 700;
    font-size: 14px;
    margin-bottom: ${p.xs};
    display: flex;
    align-items: center;
    gap: ${p.xs};
}

#__mnkys-devtools-tooltip__ .block-name::before {
    content: '{% block';
    color: ${a.syntax.keyword};
    font-weight: 400;
    font-size: 12px;
}

#__mnkys-devtools-tooltip__ .block-name::after {
    content: '%}';
    color: ${a.syntax.keyword};
    font-weight: 400;
    font-size: 12px;
}

#__mnkys-devtools-tooltip__ .template-path {
    color: ${a.syntax.variable};
    font-size: 11px;
    word-break: break-all;
    padding: ${p.sm} ${p.md};
    background: ${a.bgDeep};
    border-radius: ${h.sm};
    margin-top: ${p.sm};
}

/* ========================================
   Block List Panel (Right Side)
   ======================================== */

#__mnkys-devtools-panel__ {
    position: fixed;
    right: ${p.xl};
    top: ${p.xl};
    width: 340px;
    max-height: 50vh;
    
    background: ${a.bgGlass};
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    
    color: ${a.text};
    border-radius: ${h.lg};
    font-size: 12px;
    font-family: ${c.mono};
    
    border: 1px solid ${a.border};
    box-shadow: ${u.lg};
    
    z-index: ${d.panel};
    display: flex;
    flex-direction: column;
    overflow: hidden;
    
    animation: panelSlideIn 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes panelSlideIn {
    from {
        opacity: 0;
        transform: translateX(20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

#__mnkys-devtools-panel__ .panel-header {
    padding: ${p.lg};
    border-bottom: 1px solid ${a.border};
    flex-shrink: 0;
    background: ${a.bgElevated};
}

#__mnkys-devtools-panel__ .panel-title {
    color: ${a.text};
    font-size: 14px;
    font-weight: 700;
    margin: 0 0 ${p.md};
    display: flex;
    align-items: center;
    gap: ${p.sm};
}

#__mnkys-devtools-panel__ .panel-title::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    background: ${a.accent};
    border-radius: 50%;
    box-shadow: 0 0 8px ${a.accent};
}

#__mnkys-devtools-panel__ .panel-search {
    width: 100%;
    padding: ${p.md} ${p.md};
    background: ${a.bgDeep};
    border: 1px solid ${a.border};
    border-radius: ${h.sm};
    color: ${a.text};
    font-size: 12px;
    font-family: inherit;
    outline: none;
    box-sizing: border-box;
    transition: all 0.2s ease;
}

#__mnkys-devtools-panel__ .panel-search::placeholder {
    color: ${a.textMuted};
}

#__mnkys-devtools-panel__ .panel-search:focus {
    border-color: ${a.accent};
    box-shadow: 0 0 0 3px ${a.accentMuted};
}

#__mnkys-devtools-panel__ .panel-stats {
    font-size: 11px;
    color: ${a.textSecondary};
    margin-top: ${p.sm};
}

#__mnkys-devtools-panel__ .panel-list {
    flex: 1;
    overflow-y: auto;
    padding: ${p.sm} 0;
}

#__mnkys-devtools-panel__ .panel-list::-webkit-scrollbar {
    width: 6px;
}

#__mnkys-devtools-panel__ .panel-list::-webkit-scrollbar-track {
    background: transparent;
}

#__mnkys-devtools-panel__ .panel-list::-webkit-scrollbar-thumb {
    background: ${a.border};
    border-radius: ${h.full};
}

#__mnkys-devtools-panel__ .panel-list::-webkit-scrollbar-thumb:hover {
    background: ${a.borderHover};
}

#__mnkys-devtools-panel__ .block-item {
    padding: ${p.md} ${p.lg};
    cursor: pointer;
    border-left: 3px solid transparent;
    transition: all 0.15s ease;
    margin: 2px 0;
}

#__mnkys-devtools-panel__ .block-item:hover {
    background: ${a.bgHover};
    border-left-color: ${a.accent};
}

#__mnkys-devtools-panel__ .block-item-name {
    color: ${a.accent};
    font-weight: 600;
    font-size: 12px;
}

#__mnkys-devtools-panel__ .block-item-path {
    color: ${a.textMuted};
    font-size: 10px;
    margin-top: ${p.xs};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

#__mnkys-devtools-panel__ .panel-footer {
    padding: ${p.md} ${p.lg};
    border-top: 1px solid ${a.border};
    font-size: 10px;
    color: ${a.textMuted};
    background: ${a.bgElevated};
}

#__mnkys-devtools-panel__ kbd {
    display: inline-block;
    background: ${a.bgDeep};
    color: ${a.textSecondary};
    padding: 2px 6px;
    border-radius: ${h.sm};
    font-size: 10px;
    font-family: ${c.mono};
    border: 1px solid ${a.border};
}

#__mnkys-devtools-panel__ .panel-empty {
    padding: ${p.xxl};
    text-align: center;
    color: ${a.textMuted};
}

#__mnkys-devtools-panel__ .highlight {
    background: ${a.accentMuted};
    color: ${a.accent};
    border-radius: 2px;
    padding: 0 2px;
}

/* ========================================
   Detail Panel (Inspector Panel)
   ======================================== */

#__mnkys-devtools-detail__ {
    position: fixed;
    right: ${p.xl};
    top: ${p.xl};
    width: 480px;
    max-height: 85vh;
    
    background: ${a.bg};
    color: ${a.text};
    border-radius: ${h.lg};
    font-size: 12px;
    font-family: ${c.mono};
    
    border: 1px solid ${a.border};
    box-shadow: ${u.lg};
    
    z-index: ${d.detailPanel};
    display: flex;
    flex-direction: column;
    overflow: hidden;
    
    animation: detailSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Content container - fills the panel */
#__mnkys-devtools-detail__ .detail-panel-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow: hidden;
}

@keyframes detailSlideIn {
    from {
        opacity: 0;
        transform: translateX(30px) scale(0.98);
    }
    to {
        opacity: 1;
        transform: translateX(0) scale(1);
    }
}

/* Detail Panel Header */
.detail-header {
    padding: ${p.lg} ${p.xl};
    border-bottom: 1px solid ${a.border};
    flex-shrink: 0;
    background: linear-gradient(180deg, ${a.bgElevated} 0%, ${a.bg} 100%);
}

.detail-header .element-info {
    color: ${a.textMuted};
    font-size: 11px;
    margin-bottom: ${p.sm};
    font-family: ${c.mono};
}

.detail-header .block-title {
    color: ${a.accent};
    font-size: 16px;
    font-weight: 700;
    margin-bottom: ${p.sm};
    display: flex;
    align-items: center;
    gap: ${p.sm};
}

.detail-header .template-info {
    color: ${a.syntax.variable};
    font-size: 11px;
    word-break: break-all;
    padding: ${p.sm} ${p.md};
    background: ${a.bgDeep};
    border-radius: ${h.sm};
    display: inline-block;
}

.detail-header .template-info .line-num {
    color: ${a.syntax.number};
    font-weight: 600;
}

/* Detail Panel Tabs */
.detail-tabs {
    display: flex;
    border-bottom: 1px solid ${a.border};
    flex-shrink: 0;
    background: ${a.bgElevated};
    padding: 0 ${p.sm};
}

.detail-tab {
    flex: 1;
    padding: ${p.md} ${p.lg};
    text-align: center;
    cursor: pointer;
    background: transparent;
    border: none;
    color: ${a.textSecondary};
    font-size: 12px;
    font-weight: 500;
    font-family: ${c.system};
    border-bottom: 2px solid transparent;
    transition: all 0.2s ease;
    margin-bottom: -1px;
}

.detail-tab:hover {
    color: ${a.text};
    background: ${a.bgHover};
}

.detail-tab:focus {
    outline: none;
    box-shadow: inset 0 0 0 2px ${a.accentMuted};
}

.detail-tab.active {
    color: ${a.accent};
    border-bottom-color: ${a.accent};
    background: transparent;
}

/* Detail Panel Content */
.detail-content {
    flex: 1;
    overflow-y: auto;
    padding: ${p.lg} 0;
}

.detail-content::-webkit-scrollbar {
    width: 8px;
}

.detail-content::-webkit-scrollbar-track {
    background: ${a.bgDeep};
}

.detail-content::-webkit-scrollbar-thumb {
    background: ${a.border};
    border-radius: ${h.full};
    border: 2px solid ${a.bgDeep};
}

.detail-content::-webkit-scrollbar-thumb:hover {
    background: ${a.borderHover};
}

.tab-pane {
    display: none;
    padding: 0 ${p.xl};
}

.tab-pane.active {
    display: block;
    animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* Context Tab - Variable Tree */
.var-tree {
    list-style: none;
    margin: 0;
    padding: 0;
}

.var-item {
    margin: 2px 0;
}

.var-row {
    display: flex;
    align-items: flex-start;
    padding: ${p.sm} ${p.md};
    border-radius: ${h.sm};
    cursor: pointer;
    transition: background 0.15s ease;
}

.var-row:hover {
    background: ${a.bgHover};
}

.var-toggle {
    width: 18px;
    color: ${a.textMuted};
    flex-shrink: 0;
    font-size: 10px;
    transition: transform 0.15s ease;
}

.var-toggle.expandable::before {
    content: '▶';
}

.var-item.expanded > .var-row .var-toggle.expandable {
    transform: rotate(90deg);
}

.var-item.expanded > .var-row .var-toggle.expandable::before {
    content: '▶';
}

.var-name {
    color: ${a.syntax.variable};
    margin-right: ${p.sm};
    font-weight: 500;
}

.var-type {
    color: ${a.textMuted};
    font-size: 10px;
    margin-right: ${p.sm};
    padding: 1px 6px;
    background: ${a.bgDeep};
    border-radius: ${h.sm};
}

.var-value {
    color: ${a.syntax.string};
    font-size: 11px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 220px;
}

.var-value.string { color: ${a.syntax.string}; }
.var-value.number { color: ${a.syntax.number}; }
.var-value.bool { color: ${a.syntax.keyword}; }
.var-value.null { color: ${a.syntax.keyword}; font-style: italic; }
.var-value.object { color: ${a.syntax.tag}; }

.var-children {
    display: none;
    margin-left: ${p.lg};
    border-left: 2px solid ${a.border};
    padding-left: ${p.md};
    margin-top: ${p.xs};
}

.var-item.expanded > .var-children {
    display: block;
    animation: expandIn 0.2s ease;
}

@keyframes expandIn {
    from {
        opacity: 0;
        transform: translateY(-4px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Hierarchy Tab */
.hierarchy-section {
    margin-bottom: ${p.lg};
}

.hierarchy-section.blocks-section {
    margin-top: ${p.lg};
    padding-top: ${p.lg};
    border-top: 1px solid ${a.border};
}

.hierarchy-label {
    color: ${a.textMuted};
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: ${p.md};
    padding: 0 ${p.sm};
}

.hierarchy-tree {
    padding: ${p.xs} 0;
}

.hierarchy-item {
    padding: ${p.sm} ${p.md};
    margin: 2px 0;
    border-radius: ${h.sm};
    display: flex;
    align-items: center;
    gap: ${p.sm};
    transition: all 0.15s ease;
    position: relative;
}

.hierarchy-item.current {
    background: ${a.accentMuted};
    border-left: 3px solid ${a.accent};
    margin-left: -3px;
}

.hierarchy-tree-line {
    display: flex;
    align-items: center;
    color: ${a.textMuted};
    font-family: ${c.mono};
    font-size: 12px;
    opacity: 0.4;
    flex-shrink: 0;
}

.tree-line {
    display: inline-block;
    width: 16px;
    text-align: center;
}

.tree-branch {
    display: inline-block;
    width: 8px;
}

.hierarchy-content {
    display: flex;
    align-items: center;
    gap: ${p.sm};
    flex: 1;
    min-width: 0;
}

.hierarchy-icon {
    font-size: 10px;
    flex-shrink: 0;
}

.hierarchy-icon.root {
    color: ${a.accent};
}

.hierarchy-icon.child {
    color: ${a.textMuted};
}

.hierarchy-template {
    color: ${a.syntax.variable};
    font-size: 12px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
}

.hierarchy-item.current .hierarchy-template {
    color: ${a.accent};
    font-weight: 500;
}

.hierarchy-blocks {
    color: ${a.textMuted};
    font-size: 10px;
    padding: 2px 6px;
    background: ${a.bgDeep};
    border-radius: ${h.full};
    flex-shrink: 0;
}

.hierarchy-blocks::after {
    content: ' blocks';
}

.hierarchy-current-badge {
    font-size: 9px;
    color: ${a.accent};
    background: ${a.bgDeep};
    padding: 2px 6px;
    border-radius: ${h.full};
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    flex-shrink: 0;
}

.hierarchy-item.clickable {
    cursor: pointer;
}

.hierarchy-item.clickable:hover {
    background: ${a.bgHover};
}

.hierarchy-item.clickable:hover .hierarchy-template {
    color: ${a.text};
}

/* Blocks List */
.blocks-list,
.blocks-tree {
    display: flex;
    flex-direction: column;
    gap: 1px;
}

.block-entry {
    display: flex;
    align-items: center;
    gap: ${p.sm};
    padding: ${p.xs} ${p.md};
    border-radius: ${h.sm};
    transition: all 0.15s ease;
    cursor: pointer;
    min-height: 28px;
}

.block-entry:hover {
    background: ${a.bgHover};
}

.block-entry.current {
    background: ${a.accentMuted};
}

.block-tree-line {
    display: flex;
    align-items: center;
    color: ${a.textMuted};
    font-family: ${c.mono};
    font-size: 12px;
    opacity: 0.4;
    flex-shrink: 0;
    line-height: 1;
}

.block-tree-line .tree-line {
    display: inline-block;
    width: 16px;
    text-align: center;
}

.block-tree-line .tree-branch {
    display: inline-block;
    width: 8px;
}

.block-icon {
    color: ${a.syntax.keyword};
    font-size: 10px;
    font-family: ${c.mono};
    opacity: 0.7;
    flex-shrink: 0;
}

.block-entry-name {
    color: ${a.syntax.variable};
    font-size: 12px;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.block-entry.current .block-entry-name {
    color: ${a.accent};
    font-weight: 500;
}

.block-line {
    color: ${a.textMuted};
    font-size: 10px;
}

.block-current-badge {
    color: ${a.accent};
    font-size: 8px;
}

/* Source Tab */
.source-container {
    background: ${a.bgDeep};
    border-radius: ${h.md};
    overflow-x: auto;
    overflow-y: visible;
    border: 1px solid ${a.border};
}

/* Custom scrollbar for source container */
.source-container::-webkit-scrollbar {
    height: 8px;
}

.source-container::-webkit-scrollbar-track {
    background: ${a.bgDeep};
}

.source-container::-webkit-scrollbar-thumb {
    background: ${a.border};
    border-radius: ${h.full};
}

.source-container::-webkit-scrollbar-thumb:hover {
    background: ${a.borderHover};
}

.source-code {
    display: inline-block;
    min-width: 100%;
}

.source-line {
    display: flex;
    font-size: 12px;
    line-height: 1.6;
    transition: background 0.1s ease;
}

.source-line:hover {
    background: ${a.bgHover};
}

.source-line.highlight {
    background: rgba(0, 217, 255, 0.08);
}

.source-line.block-start {
    background: rgba(0, 217, 255, 0.15);
}

.source-line.block-start .line-number {
    box-shadow: inset 3px 0 0 ${a.accent};
}

.line-number {
    flex-shrink: 0;
    width: 48px;
    min-width: 48px;
    padding: 0 ${p.md};
    text-align: right;
    color: ${a.textMuted};
    background: rgba(0, 0, 0, 0.2);
    user-select: none;
    font-size: 11px;
}

.line-content {
    flex: 1;
    padding: 0 ${p.lg};
    white-space: pre;
}

.source-loading {
    padding: ${p.xxl};
    text-align: center;
    color: ${a.textMuted};
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${p.md};
}

/* Twig Syntax Highlighting */
.twig-tag { color: ${a.syntax.keyword}; }
.twig-name { color: ${a.syntax.variable}; }
.twig-string { color: ${a.syntax.string}; }
.twig-comment { color: ${a.syntax.comment}; font-style: italic; }
.html-tag { color: ${a.syntax.tag}; }
.html-attr { color: ${a.syntax.attribute}; }
.html-value { color: ${a.syntax.string}; }

/* Detail Panel Footer */
.detail-footer {
    padding: ${p.lg} ${p.xl};
    border-top: 1px solid ${a.border};
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    background: ${a.bgElevated};
}

.detail-btn {
    padding: ${p.md} ${p.xl};
    border-radius: ${h.sm};
    font-size: 13px;
    font-weight: 600;
    font-family: ${c.system};
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    display: flex;
    align-items: center;
    gap: ${p.sm};
}

.detail-btn:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${a.accentMuted};
}

.detail-btn-primary {
    background: ${a.accent};
    color: ${a.bgDeep};
}

.detail-btn-primary:hover {
    background: ${a.accentHover};
    transform: translateY(-1px);
    box-shadow: ${u.sm}, 0 0 12px ${a.accentMuted};
}

.detail-btn-primary:active {
    transform: translateY(0);
}

.detail-btn-secondary {
    background: ${a.bgHover};
    color: ${a.text};
    border: 1px solid ${a.border};
}

.detail-btn-secondary:hover {
    background: ${a.border};
    border-color: ${a.borderHover};
}

/* ========================================
   Notifications - Toast Style
   ======================================== */

.devtools-notification {
    position: fixed;
    top: ${p.xl};
    left: 50%;
    transform: translateX(-50%) translateY(-10px);
    
    padding: ${p.md} ${p.xl};
    border-radius: ${h.full};
    font-size: 13px;
    font-weight: 500;
    font-family: ${c.system};
    
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    
    box-shadow: ${u.lg};
    z-index: ${d.notification};
    
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.devtools-notification.success {
    background: ${a.bgGlass};
    color: ${a.accent};
    border: 1px solid ${a.borderAccent};
}

.devtools-notification.error {
    background: rgba(255, 82, 82, 0.9);
    color: #fff;
    border: 1px solid ${a.error};
}

/* ========================================
   Loading Spinner
   ======================================== */

.devtools-loading {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid ${a.border};
    border-top-color: ${a.accent};
    border-radius: 50%;
    animation: devtools-spin 0.8s linear infinite;
}

@keyframes devtools-spin {
    to { transform: rotate(360deg); }
}

/* ========================================
   Focus Visible (Accessibility)
   ======================================== */

:focus-visible {
    outline: 2px solid ${a.accent};
    outline-offset: 2px;
}

/* ========================================
   Selection
   ======================================== */

#__mnkys-devtools-panel__ ::selection,
#__mnkys-devtools-detail__ ::selection,
#__mnkys-devtools-tooltip__ ::selection {
    background: ${a.accentMuted};
    color: ${a.text};
}

/* ========================================
   Panel Resize & Drag
   ======================================== */

/* Resize frame - contains all resize handles */
.panel-resize-frame {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 100;
}

/* Resize handles */
.panel-resize-handle {
    position: absolute;
    pointer-events: auto;
    transition: background 0.15s ease;
}

/* Edge handles - visible borders */
.panel-resize-top {
    top: 0;
    left: 12px;
    right: 12px;
    height: 6px;
    cursor: ns-resize;
    border-top: 2px solid transparent;
}

.panel-resize-top:hover {
    border-top-color: ${a.accent};
}

.panel-resize-bottom {
    bottom: 0;
    left: 12px;
    right: 12px;
    height: 6px;
    cursor: ns-resize;
    border-bottom: 2px solid transparent;
}

.panel-resize-bottom:hover {
    border-bottom-color: ${a.accent};
}

.panel-resize-left {
    left: 0;
    top: 12px;
    bottom: 12px;
    width: 6px;
    cursor: ew-resize;
    border-left: 2px solid transparent;
}

.panel-resize-left:hover {
    border-left-color: ${a.accent};
}

.panel-resize-right {
    right: 0;
    top: 12px;
    bottom: 12px;
    width: 6px;
    cursor: ew-resize;
    border-right: 2px solid transparent;
}

.panel-resize-right:hover {
    border-right-color: ${a.accent};
}

/* Corner handles - larger grab areas */
.panel-resize-top-left {
    top: 0;
    left: 0;
    width: 14px;
    height: 14px;
    cursor: nwse-resize;
}

.panel-resize-top-right {
    top: 0;
    right: 0;
    width: 14px;
    height: 14px;
    cursor: nesw-resize;
}

.panel-resize-bottom-left {
    bottom: 0;
    left: 0;
    width: 14px;
    height: 14px;
    cursor: nesw-resize;
}

.panel-resize-bottom-right {
    bottom: 0;
    right: 0;
    width: 14px;
    height: 14px;
    cursor: nwse-resize;
}

/* Visual indicator on corner handles */
.panel-resize-bottom-right::before,
.panel-resize-bottom-left::before,
.panel-resize-top-right::before,
.panel-resize-top-left::before {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    border: 2px solid ${a.border};
    opacity: 0.4;
    transition: all 0.15s ease;
}

.panel-resize-bottom-right::before {
    bottom: 2px;
    right: 2px;
    border-top: none;
    border-left: none;
    border-radius: 0 0 4px 0;
}

.panel-resize-bottom-left::before {
    bottom: 2px;
    left: 2px;
    border-top: none;
    border-right: none;
    border-radius: 0 0 0 4px;
}

.panel-resize-top-right::before {
    top: 2px;
    right: 2px;
    border-bottom: none;
    border-left: none;
    border-radius: 0 4px 0 0;
}

.panel-resize-top-left::before {
    top: 2px;
    left: 2px;
    border-bottom: none;
    border-right: none;
    border-radius: 4px 0 0 0;
}

/* Hover states for corner handles */
.panel-resize-bottom-right:hover::before,
.panel-resize-bottom-left:hover::before,
.panel-resize-top-right:hover::before,
.panel-resize-top-left:hover::before {
    opacity: 1;
    border-color: ${a.accent};
}

/* Dragging state */
#__mnkys-devtools-panel__.is-dragging,
#__mnkys-devtools-detail__.is-dragging {
    opacity: 0.9;
    box-shadow: ${u.lg}, ${u.glowStrong};
    cursor: move !important;
    user-select: none !important;
}

#__mnkys-devtools-panel__.is-dragging *,
#__mnkys-devtools-detail__.is-dragging * {
    cursor: move !important;
    user-select: none !important;
}

/* Resizing state */
#__mnkys-devtools-panel__.is-resizing,
#__mnkys-devtools-detail__.is-resizing {
    opacity: 0.95;
    box-shadow: ${u.lg}, 0 0 0 2px ${a.accent};
    user-select: none !important;
}

#__mnkys-devtools-panel__.is-resizing *,
#__mnkys-devtools-detail__.is-resizing * {
    user-select: none !important;
}

/* Drag handle cursor and user-select on headers */
#__mnkys-devtools-panel__ .panel-header,
#__mnkys-devtools-detail__ .detail-header {
    cursor: move;
    user-select: none;
    -webkit-user-select: none;
}

/* Don't apply move cursor to interactive elements in headers */
#__mnkys-devtools-panel__ .panel-header input,
#__mnkys-devtools-panel__ .panel-header button,
#__mnkys-devtools-detail__ .detail-header button {
    cursor: pointer;
}

#__mnkys-devtools-panel__ .panel-search {
    cursor: text;
    user-select: text;
    -webkit-user-select: text;
}

/* Ensure content areas allow text selection */
#__mnkys-devtools-panel__ .panel-list,
#__mnkys-devtools-detail__ .detail-content {
    user-select: text;
    -webkit-user-select: text;
}
`,document.head.appendChild(e)}(),this._createUIComponents(),document.addEventListener("mousemove",this._onMouseMove,!0),document.addEventListener("click",this._onClick,!0),document.body.classList.add("mnkys-devtools-active"),this._toggle?.setActive(!0),v("Inspector enabled - Hover to inspect, Click for details"))}disable(){this._enabled&&(this._enabled=!1,document.removeEventListener("mousemove",this._onMouseMove,!0),document.removeEventListener("click",this._onClick,!0),this._destroyUIComponents(),document.body.classList.remove("mnkys-devtools-active"),this._toggle?.setActive(!1),this._currentTarget=null)}_createUIComponents(){this._overlay=new x,this._overlay.create(),this._tooltip=new _,this._tooltip.create(),this._blockPanel=new D({onBlockSelect:e=>this._handleBlockSelect(e)}),this._blockPanel.create(),this._detailPanel=new H({onClose:()=>{},onOpenEditor:()=>{v("Opening in editor...")}}),this._detailPanel.create()}_destroyUIComponents(){this._overlay?.destroy(),this._tooltip?.destroy(),this._blockPanel?.destroy(),this._detailPanel?.destroy(),this._overlay=null,this._tooltip=null,this._blockPanel=null,this._detailPanel=null}_handleBlockSelect(e){let t=document.querySelector(`[data-twig-block*="${e.block}"]`);this._detailPanel?.show(e,t||document.body)}_onMouseMove(e){if(!this._enabled)return;if(e.target.closest("#__mnkys-devtools-detail__")){this._hideHoverUI();return}let t=f(e.target);t&&t!==this._currentTarget?(this._currentTarget=t,this._overlay?.highlight(t),this._tooltip?.update(t,e)):!t&&this._currentTarget?(this._hideHoverUI(),this._currentTarget=null):t===this._currentTarget&&this._tooltip?.position(e)}_onClick(e){if(!this._enabled||e.target.closest("#__mnkys-devtools-panel__, #__mnkys-devtools-toggle__, #__mnkys-devtools-detail__"))return;let t=f(e.target);if(t){e.preventDefault(),e.stopPropagation();let n=y(t);n&&this._detailPanel?.show(n,t)}}_onKeyDown(e){e.ctrlKey&&e.shiftKey&&"C"===e.key&&(e.preventDefault(),this._isDevToolsEnabled()&&this.toggle()),"Escape"===e.key&&this._enabled&&(this._detailPanel?.element?.style.display!=="none"?this._detailPanel.hide():this.disable())}_hideHoverUI(){this._overlay?.hide(),this._tooltip?.hide()}}window.PluginManager.register("MnkysDevToolsComponentPicker",B,"body")})();