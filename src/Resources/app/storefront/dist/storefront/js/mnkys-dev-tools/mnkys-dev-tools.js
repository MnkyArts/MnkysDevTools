(()=>{"use strict";var t={156:t=>{var e=function(t){var e;return!!t&&"object"==typeof t&&"[object RegExp]"!==(e=Object.prototype.toString.call(t))&&"[object Date]"!==e&&t.$$typeof!==o},o="function"==typeof Symbol&&Symbol.for?Symbol.for("react.element"):60103;function i(t,e){return!1!==e.clone&&e.isMergeableObject(t)?r(Array.isArray(t)?[]:{},t,e):t}function s(t,e,o){return t.concat(e).map(function(t){return i(t,o)})}function n(t){return Object.keys(t).concat(Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(t).filter(function(e){return Object.propertyIsEnumerable.call(t,e)}):[])}function l(t,e){try{return e in t}catch(t){return!1}}function r(t,o,a){(a=a||{}).arrayMerge=a.arrayMerge||s,a.isMergeableObject=a.isMergeableObject||e,a.cloneUnlessOtherwiseSpecified=i;var c,d,p=Array.isArray(o);return p!==Array.isArray(t)?i(o,a):p?a.arrayMerge(t,o,a):(d={},(c=a).isMergeableObject(t)&&n(t).forEach(function(e){d[e]=i(t[e],c)}),n(o).forEach(function(e){(!l(t,e)||Object.hasOwnProperty.call(t,e)&&Object.propertyIsEnumerable.call(t,e))&&(l(t,e)&&c.isMergeableObject(o[e])?d[e]=(function(t,e){if(!e.customMerge)return r;var o=e.customMerge(t);return"function"==typeof o?o:r})(e,c)(t[e],o[e],c):d[e]=i(o[e],c))}),d)}r.all=function(t,e){if(!Array.isArray(t))throw Error("first argument should be an array");return t.reduce(function(t,o){return r(t,o,e)},{})},t.exports=r}},e={};function o(i){var s=e[i];if(void 0!==s)return s.exports;var n=e[i]={exports:{}};return t[i](n,n.exports,o),n.exports}o.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return o.d(e,{a:e}),e},o.d=(t,e)=>{for(var i in e)o.o(e,i)&&!o.o(t,i)&&Object.defineProperty(t,i,{enumerable:!0,get:e[i]})},o.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e);var i=o(156),s=o.n(i);class n{static ucFirst(t){return t.charAt(0).toUpperCase()+t.slice(1)}static lcFirst(t){return t.charAt(0).toLowerCase()+t.slice(1)}static toDashCase(t){return t.replace(/([A-Z])/g,"-$1").replace(/^-/,"").toLowerCase()}static toLowerCamelCase(t,e){let o=n.toUpperCamelCase(t,e);return n.lcFirst(o)}static toUpperCamelCase(t,e){return e?t.split(e).map(t=>n.ucFirst(t.toLowerCase())).join(""):n.ucFirst(t.toLowerCase())}static parsePrimitive(t){try{return/^\d+(.|,)\d+$/.test(t)&&(t=t.replace(",",".")),JSON.parse(t)}catch(e){return t.toString()}}}class l{constructor(t=document){this._el=t,t.$emitter=this,this._listeners=[]}publish(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},o=arguments.length>2&&void 0!==arguments[2]&&arguments[2],i=new CustomEvent(t,{detail:e,cancelable:o});return this.el.dispatchEvent(i),i}subscribe(t,e){let o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},i=this,s=t.split("."),n=o.scope?e.bind(o.scope):e;if(o.once&&!0===o.once){let e=n;n=function(o){i.unsubscribe(t),e(o)}}return this.el.addEventListener(s[0],n),this.listeners.push({splitEventName:s,opts:o,cb:n}),!0}unsubscribe(t){let e=t.split(".");return this.listeners=this.listeners.reduce((t,o)=>([...o.splitEventName].sort().toString()===e.sort().toString()?this.el.removeEventListener(o.splitEventName[0],o.cb):t.push(o),t),[]),!0}reset(){return this.listeners.forEach(t=>{this.el.removeEventListener(t.splitEventName[0],t.cb)}),this.listeners=[],!0}get el(){return this._el}set el(t){this._el=t}get listeners(){return this._listeners}set listeners(t){this._listeners=t}}class r{constructor(t,e={},o=!1){if(!(t instanceof Node)){console.warn(`There is no valid element given while trying to create a plugin instance for "${o}".`);return}this.el=t,this.$emitter=new l(this.el),this._pluginName=this._getPluginName(o),this.options=this._mergeOptions(e),this._initialized=!1,this._registerInstance(),this._init()}init(){console.warn(`The "init" method for the plugin "${this._pluginName}" is not defined. The plugin will not be initialized.`)}update(){}_init(){this._initialized||(this.init(),this._initialized=!0)}_update(){this._initialized&&this.update()}_mergeOptions(t){let e=[this.constructor.options,this.options,t];return e.push(this._getConfigFromDataAttribute()),e.push(this._getOptionsFromDataAttribute()),s().all(e.filter(t=>t instanceof Object&&!(t instanceof Array)).map(t=>t||{}))}_getConfigFromDataAttribute(){let t={};if("function"!=typeof this.el.getAttribute)return t;let e=n.toDashCase(this._pluginName),o=this.el.getAttribute(`data-${e}-config`);return o?window.PluginConfigManager.get(this._pluginName,o):t}_getOptionsFromDataAttribute(){let t={};if("function"!=typeof this.el.getAttribute)return t;let e=n.toDashCase(this._pluginName),o=this.el.getAttribute(`data-${e}-options`);if(o)try{return JSON.parse(o)}catch(t){console.error(`The data attribute "data-${e}-options" could not be parsed to json: ${t.message}`)}return t}_registerInstance(){window.PluginManager.getPluginInstancesFromElement(this.el).set(this._pluginName,this),window.PluginManager.getPlugin(this._pluginName,!1).get("instances").push(this)}_getPluginName(t){return t||(t=this.constructor.name),t}}class a{constructor(){this._request=null,this._errorHandlingInternal=!1}get(t,e){let o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"application/json",i=this._createPreparedRequest("GET",t,o);return this._sendRequest(i,null,e)}post(t,e,o){let i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"application/json";i=this._getContentType(e,i);let s=this._createPreparedRequest("POST",t,i);return this._sendRequest(s,e,o)}delete(t,e,o){let i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"application/json";i=this._getContentType(e,i);let s=this._createPreparedRequest("DELETE",t,i);return this._sendRequest(s,e,o)}patch(t,e,o){let i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"application/json";i=this._getContentType(e,i);let s=this._createPreparedRequest("PATCH",t,i);return this._sendRequest(s,e,o)}abort(){if(this._request)return this._request.abort()}setErrorHandlingInternal(t){this._errorHandlingInternal=t}_registerOnLoaded(t,e){e&&(!0===this._errorHandlingInternal?(t.addEventListener("load",()=>{e(t.responseText,t)}),t.addEventListener("abort",()=>{console.warn(`the request to ${t.responseURL} was aborted`)}),t.addEventListener("error",()=>{console.warn(`the request to ${t.responseURL} failed with status ${t.status}`)}),t.addEventListener("timeout",()=>{console.warn(`the request to ${t.responseURL} timed out`)})):t.addEventListener("loadend",()=>{e(t.responseText,t)}))}_sendRequest(t,e,o){return this._registerOnLoaded(t,o),t.send(e),t}_getContentType(t,e){return t instanceof FormData&&(e=!1),e}_createPreparedRequest(t,e,o){return this._request=new XMLHttpRequest,this._request.open(t,e),this._request.setRequestHeader("X-Requested-With","XMLHttpRequest"),o&&this._request.setRequestHeader("Content-type",o),this._request}}class c extends r{static #t=this.options={overlayColor:"rgba(66, 184, 131, 0.15)",overlayBorderColor:"#42b883",overlayBorderWidth:"2px",tooltipBgColor:"#1e1e1e",tooltipTextColor:"#e0e0e0",tooltipAccentColor:"#42b883",panelWidth:"380px",panelMaxHeight:"55vh",openEditorEndpoint:"/devtools/open-editor",keyboardShortcut:!0,transitionDuration:"0.12s"};init(){this._client=new a,this._enabled=!1,this._overlay=null,this._tooltip=null,this._blockPanel=null,this._currentTarget=null,this._activationButton=null,this._blocks=[],this._filteredBlocks=[],this._searchTerm="",this._onMouseMove=this._onMouseMove.bind(this),this._onClick=this._onClick.bind(this),this._onKeyDown=this._onKeyDown.bind(this),this._loadBlockData(),this._isEnabledViaAdmin()&&this._createActivationButton(),this.options.keyboardShortcut&&document.addEventListener("keydown",this._onKeyDown)}_loadBlockData(){let t=document.getElementById("devtools-block-data");if(!t){this._blocks=[];return}try{this._blocks=JSON.parse(t.textContent)||[],this._blocks.sort((t,e)=>{let o=t.template.localeCompare(e.template);return 0!==o?o:t.block.localeCompare(e.block)}),this._filteredBlocks=[...this._blocks]}catch(t){console.warn("DevTools: Failed to parse block data",t),this._blocks=[],this._filteredBlocks=[]}}toggle(){this._enabled?this.disable():this.enable()}enable(){this._enabled||(this._enabled=!0,this._createOverlay(),this._createTooltip(),this._createBlockPanel(),document.addEventListener("mousemove",this._onMouseMove,!0),document.addEventListener("click",this._onClick,!0),document.body.classList.add("mnkys-devtools-active"),this._updateActivationButton(!0),this._showNotification("Inspector enabled - Hover to inspect, Click to open in editor"))}disable(){this._enabled&&(this._enabled=!1,this._destroyUI(),document.removeEventListener("mousemove",this._onMouseMove,!0),document.removeEventListener("click",this._onClick,!0),document.body.classList.remove("mnkys-devtools-active"),this._updateActivationButton(!1),this._currentTarget=null)}_isEnabledViaAdmin(){return"true"===document.body.dataset.devtoolsEnabled}_createActivationButton(){this._activationButton=document.createElement("button"),this._activationButton.id="__mnkys-devtools-toggle__",this._activationButton.innerHTML=`
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
            </svg>
            <span>Inspect</span>
        `,this._activationButton.title="Toggle Component Inspector (Ctrl+Shift+C)",Object.assign(this._activationButton.style,{position:"fixed",bottom:"20px",left:"20px",zIndex:"2147483630",display:"flex",alignItems:"center",gap:"6px",padding:"8px 12px",backgroundColor:"#1e1e1e",color:"#42b883",border:"2px solid #42b883",borderRadius:"6px",cursor:"pointer",fontFamily:"system-ui, -apple-system, sans-serif",fontSize:"12px",fontWeight:"600",boxShadow:"0 2px 8px rgba(0, 0, 0, 0.3)",transition:"all 0.15s ease"}),this._activationButton.addEventListener("mouseenter",()=>{this._activationButton.style.backgroundColor="#42b883",this._activationButton.style.color="#1e1e1e"}),this._activationButton.addEventListener("mouseleave",()=>{this._enabled||(this._activationButton.style.backgroundColor="#1e1e1e",this._activationButton.style.color="#42b883")}),this._activationButton.addEventListener("click",t=>{t.stopPropagation(),this.toggle()}),document.body.appendChild(this._activationButton)}_updateActivationButton(t){this._activationButton&&(t?(this._activationButton.style.backgroundColor="#42b883",this._activationButton.style.color="#1e1e1e",this._activationButton.querySelector("span").textContent="Exit"):(this._activationButton.style.backgroundColor="#1e1e1e",this._activationButton.style.color="#42b883",this._activationButton.querySelector("span").textContent="Inspect"))}_createOverlay(){this._overlay=document.createElement("div"),this._overlay.id="__mnkys-devtools-overlay__",Object.assign(this._overlay.style,{position:"fixed",pointerEvents:"none",zIndex:"2147483640",backgroundColor:this.options.overlayColor,border:`${this.options.overlayBorderWidth} solid ${this.options.overlayBorderColor}`,borderRadius:"3px",transition:`all ${this.options.transitionDuration} ease-out`,display:"none",boxSizing:"border-box"}),document.body.appendChild(this._overlay)}_createTooltip(){this._tooltip=document.createElement("div"),this._tooltip.id="__mnkys-devtools-tooltip__",Object.assign(this._tooltip.style,{position:"fixed",pointerEvents:"none",zIndex:"2147483641",backgroundColor:this.options.tooltipBgColor,color:this.options.tooltipTextColor,padding:"10px 14px",borderRadius:"6px",fontSize:"12px",fontFamily:'"JetBrains Mono", "Fira Code", Menlo, Monaco, monospace',boxShadow:"0 4px 16px rgba(0, 0, 0, 0.4)",maxWidth:"400px",display:"none",border:`1px solid ${this.options.overlayBorderColor}`,lineHeight:"1.4"});let t=document.createElement("style");t.id="__mnkys-devtools-tooltip-styles__",t.textContent=`
            #__mnkys-devtools-tooltip__ .block-name {
                color: ${this.options.tooltipAccentColor};
                font-weight: 700;
                font-size: 13px;
                margin-bottom: 4px;
            }
            #__mnkys-devtools-tooltip__ .block-name::before {
                content: '{% block ';
                color: #666;
                font-weight: 400;
            }
            #__mnkys-devtools-tooltip__ .block-name::after {
                content: ' %}';
                color: #666;
                font-weight: 400;
            }
            #__mnkys-devtools-tooltip__ .template-path {
                color: #9cdcfe;
                font-size: 11px;
                word-break: break-all;
            }
            #__mnkys-devtools-tooltip__ .element-tag {
                color: #888;
                font-size: 10px;
                margin-bottom: 6px;
                font-style: italic;
            }
        `,document.head.appendChild(this._tooltipStyle=t),document.body.appendChild(this._tooltip)}_createBlockPanel(){this._blockPanel=document.createElement("div"),this._blockPanel.id="__mnkys-devtools-panel__",Object.assign(this._blockPanel.style,{position:"fixed",right:"20px",top:"20px",width:this.options.panelWidth,maxHeight:this.options.panelMaxHeight,backgroundColor:this.options.tooltipBgColor,color:this.options.tooltipTextColor,borderRadius:"8px",fontSize:"12px",fontFamily:'"JetBrains Mono", "Fira Code", Menlo, Monaco, monospace',boxShadow:"0 4px 20px rgba(0, 0, 0, 0.5)",zIndex:"2147483642",border:`1px solid ${this.options.overlayBorderColor}`,display:"flex",flexDirection:"column",overflow:"hidden"}),this._addPanelStyles(),this._blockPanel.innerHTML=this._buildPanelHTML(),document.body.appendChild(this._blockPanel),this._attachPanelEvents()}_addPanelStyles(){let t=document.createElement("style");t.id="__mnkys-devtools-panel-styles__",t.textContent=`
            #__mnkys-devtools-panel__ .panel-header {
                padding: 12px;
                border-bottom: 1px solid #333;
                flex-shrink: 0;
            }
            #__mnkys-devtools-panel__ .panel-title {
                color: ${this.options.tooltipAccentColor};
                font-size: 13px;
                font-weight: 600;
                margin: 0 0 8px;
            }
            #__mnkys-devtools-panel__ .panel-search {
                width: 100%;
                padding: 6px 10px;
                background: #2d2d2d;
                border: 1px solid #444;
                border-radius: 4px;
                color: #e0e0e0;
                font-size: 11px;
                font-family: inherit;
                outline: none;
            }
            #__mnkys-devtools-panel__ .panel-search:focus {
                border-color: ${this.options.tooltipAccentColor};
            }
            #__mnkys-devtools-panel__ .panel-stats {
                font-size: 10px;
                color: #666;
                margin-top: 6px;
            }
            #__mnkys-devtools-panel__ .panel-list {
                flex: 1;
                overflow-y: auto;
                padding: 4px 0;
            }
            #__mnkys-devtools-panel__ .panel-list::-webkit-scrollbar {
                width: 6px;
            }
            #__mnkys-devtools-panel__ .panel-list::-webkit-scrollbar-thumb {
                background: #444;
                border-radius: 3px;
            }
            #__mnkys-devtools-panel__ .block-item {
                padding: 6px 12px;
                cursor: pointer;
                border-left: 2px solid transparent;
                transition: all 0.1s;
            }
            #__mnkys-devtools-panel__ .block-item:hover {
                background: #2a2a2a;
                border-left-color: ${this.options.tooltipAccentColor};
            }
            #__mnkys-devtools-panel__ .block-item-name {
                color: ${this.options.tooltipAccentColor};
                font-weight: 500;
            }
            #__mnkys-devtools-panel__ .block-item-path {
                color: #666;
                font-size: 10px;
                margin-top: 2px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            #__mnkys-devtools-panel__ .panel-footer {
                padding: 8px 12px;
                border-top: 1px solid #333;
                font-size: 10px;
                color: #666;
            }
            #__mnkys-devtools-panel__ kbd {
                background: #333;
                padding: 1px 4px;
                border-radius: 2px;
            }
            #__mnkys-devtools-panel__ .panel-empty {
                padding: 20px;
                text-align: center;
                color: #666;
            }
            #__mnkys-devtools-panel__ .highlight {
                background: rgba(66, 184, 131, 0.3);
                border-radius: 2px;
            }
        `,document.head.appendChild(this._panelStyle=t)}_buildPanelHTML(){return`
            <div class="panel-header">
                <div class="panel-title">Twig Blocks</div>
                <input type="text" class="panel-search" placeholder="Search blocks..." />
                <div class="panel-stats">${this._blocks.length} blocks</div>
            </div>
            <div class="panel-list">
                ${this._buildBlockListHTML()}
            </div>
            <div class="panel-footer">
                <kbd>Esc</kbd> close &bull; <kbd>Click</kbd> element or list item to open
            </div>
        `}_buildBlockListHTML(){return 0===this._filteredBlocks.length?'<div class="panel-empty">No blocks found</div>':this._filteredBlocks.map(t=>`
            <div class="block-item" data-template="${this._escapeHtml(t.template)}" data-line="${t.line}">
                <div class="block-item-name">${this._highlightMatch(t.block)}</div>
                <div class="block-item-path">${this._highlightMatch(this._shortenPath(t.template))}:${t.line}</div>
            </div>
        `).join("")}_highlightMatch(t){if(!this._searchTerm)return this._escapeHtml(t);let e=this._escapeHtml(t),o=RegExp(`(${this._escapeRegex(this._searchTerm)})`,"gi");return e.replace(o,'<span class="highlight">$1</span>')}_escapeRegex(t){return t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}_attachPanelEvents(){let t=this._blockPanel.querySelector(".panel-search");t?.addEventListener("input",t=>{this._searchTerm=t.target.value.toLowerCase(),this._filterBlocks(),this._updatePanelList()}),this._blockPanel.addEventListener("click",t=>{let e=t.target.closest(".block-item");e&&this._openInEditor(e.dataset.template,parseInt(e.dataset.line,10))})}_filterBlocks(){if(!this._searchTerm){this._filteredBlocks=[...this._blocks];return}this._filteredBlocks=this._blocks.filter(t=>t.block.toLowerCase().includes(this._searchTerm)||t.template.toLowerCase().includes(this._searchTerm))}_updatePanelList(){this._blockPanel.querySelector(".panel-list").innerHTML=this._buildBlockListHTML(),this._blockPanel.querySelector(".panel-stats").textContent=this._searchTerm?`${this._filteredBlocks.length} of ${this._blocks.length} blocks`:`${this._blocks.length} blocks`}_onMouseMove(t){if(!this._enabled)return;let e=this._findTwigElement(t.target);e&&e!==this._currentTarget?(this._currentTarget=e,this._highlightElement(e),this._updateTooltip(e,t)):!e&&this._currentTarget?(this._hideOverlay(),this._currentTarget=null):e===this._currentTarget&&this._positionTooltip(t)}_onClick(t){if(!this._enabled||t.target.closest("#__mnkys-devtools-panel__, #__mnkys-devtools-toggle__"))return;let e=this._findTwigElement(t.target);if(e){t.preventDefault(),t.stopPropagation();let o=this._getTwigData(e);o&&this._openInEditor(o.template,o.line)}}_onKeyDown(t){t.ctrlKey&&t.shiftKey&&"C"===t.key&&(t.preventDefault(),this._isEnabledViaAdmin()&&this.toggle()),"Escape"===t.key&&this._enabled&&this.disable()}_findTwigElement(t){if(t.closest("#__mnkys-devtools-overlay__, #__mnkys-devtools-tooltip__, #__mnkys-devtools-panel__, #__mnkys-devtools-toggle__"))return null;for(;t&&t!==document.body&&t!==document.documentElement;){if(t.dataset&&t.dataset.twigBlock)return t;t=t.parentElement}return null}_getTwigData(t){try{return JSON.parse(t.dataset.twigBlock)}catch(t){return console.warn("DevTools: Failed to parse twig data",t),null}}_highlightElement(t){let e=t.getBoundingClientRect(),o=parseInt(this.options.overlayBorderWidth);Object.assign(this._overlay.style,{display:"block",left:`${e.left-o}px`,top:`${e.top-o}px`,width:`${e.width+2*o}px`,height:`${e.height+2*o}px`})}_updateTooltip(t,e){let o=this._getTwigData(t);if(!o)return;let i=t.tagName.toLowerCase(),s=t.id?`#${t.id}`:"",n=t.className&&"string"==typeof t.className?"."+t.className.trim().split(/\s+/).slice(0,2).join("."):"";this._tooltip.innerHTML=`
            <div class="element-tag">&lt;${i}${s}${n}&gt;</div>
            <div class="block-name">${this._escapeHtml(o.block)}</div>
            <div class="template-path">${this._escapeHtml(o.template)}:${o.line}</div>
        `,this._tooltip.style.display="block",this._positionTooltip(e)}_positionTooltip(t){if(!this._tooltip||"none"===this._tooltip.style.display)return;let e=this._tooltip.getBoundingClientRect(),o=window.innerWidth,i=window.innerHeight,s=t.clientX+15,n=t.clientY+15;s+e.width>o-15&&(s=t.clientX-e.width-15),n+e.height>i-15&&(n=t.clientY-e.height-15),s=Math.max(15,s),n=Math.max(15,n),this._tooltip.style.left=`${s}px`,this._tooltip.style.top=`${n}px`}_hideOverlay(){this._overlay&&(this._overlay.style.display="none"),this._tooltip&&(this._tooltip.style.display="none")}_openInEditor(t,e){let o=`${this.options.openEditorEndpoint}?file=${encodeURIComponent(t)}&line=${e}`;this._client.get(o,o=>{try{let i=JSON.parse(o);i.success?this._showNotification(`Opening ${this._shortenPath(t)}:${e}`):i.editorUrl?window.location.href=i.editorUrl:i.error&&this._showNotification(`Error: ${i.error}`,"error")}catch(t){console.warn("DevTools: Failed to parse response",t)}},"application/json",!0)}_destroyUI(){this._overlay?.remove(),this._tooltip?.remove(),this._blockPanel?.remove(),this._tooltipStyle?.remove(),this._panelStyle?.remove(),this._overlay=null,this._tooltip=null,this._blockPanel=null,this._tooltipStyle=null,this._panelStyle=null}_shortenPath(t){return t.replace(/^@[^\/]+\//,"").replace(/^storefront\//,"")}_escapeHtml(t){return"string"!=typeof t?t:t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}_showNotification(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"success",o=document.createElement("div");Object.assign(o.style,{position:"fixed",top:"20px",left:"50%",transform:"translateX(-50%)",padding:"10px 20px",backgroundColor:"error"===e?"#dc3545":this.options.tooltipBgColor,color:"error"===e?"#fff":this.options.tooltipAccentColor,borderRadius:"6px",fontSize:"12px",fontFamily:"system-ui, -apple-system, sans-serif",boxShadow:"0 2px 12px rgba(0, 0, 0, 0.4)",zIndex:"2147483650",opacity:"0",transition:"opacity 0.2s",border:`1px solid ${"error"===e?"#dc3545":this.options.overlayBorderColor}`}),o.textContent=t,document.body.appendChild(o),requestAnimationFrame(()=>o.style.opacity="1"),setTimeout(()=>{o.style.opacity="0",setTimeout(()=>o.remove(),200)},2500)}}window.PluginManager.register("MnkysDevToolsComponentPicker",c,"body")})();