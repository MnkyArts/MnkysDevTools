(()=>{"use strict";var e={156:e=>{var t=function(e){var t;return!!e&&"object"==typeof e&&"[object RegExp]"!==(t=Object.prototype.toString.call(e))&&"[object Date]"!==t&&e.$$typeof!==o},o="function"==typeof Symbol&&Symbol.for?Symbol.for("react.element"):60103;function n(e,t){return!1!==t.clone&&t.isMergeableObject(e)?a(Array.isArray(e)?[]:{},e,t):e}function i(e,t,o){return e.concat(t).map(function(e){return n(e,o)})}function s(e){return Object.keys(e).concat(Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(e).filter(function(t){return Object.propertyIsEnumerable.call(e,t)}):[])}function r(e,t){try{return t in e}catch(e){return!1}}function a(e,o,l){(l=l||{}).arrayMerge=l.arrayMerge||i,l.isMergeableObject=l.isMergeableObject||t,l.cloneUnlessOtherwiseSpecified=n;var c,d,p=Array.isArray(o);return p!==Array.isArray(e)?n(o,l):p?l.arrayMerge(e,o,l):(d={},(c=l).isMergeableObject(e)&&s(e).forEach(function(t){d[t]=n(e[t],c)}),s(o).forEach(function(t){(!r(e,t)||Object.hasOwnProperty.call(e,t)&&Object.propertyIsEnumerable.call(e,t))&&(r(e,t)&&c.isMergeableObject(o[t])?d[t]=(function(e,t){if(!t.customMerge)return a;var o=t.customMerge(e);return"function"==typeof o?o:a})(t,c)(e[t],o[t],c):d[t]=n(o[t],c))}),d)}a.all=function(e,t){if(!Array.isArray(e))throw Error("first argument should be an array");return e.reduce(function(e,o){return a(e,o,t)},{})},e.exports=a}},t={};function o(n){var i=t[n];if(void 0!==i)return i.exports;var s=t[n]={exports:{}};return e[n](s,s.exports,o),s.exports}o.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return o.d(t,{a:t}),t},o.d=(e,t)=>{for(var n in t)o.o(t,n)&&!o.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t);var n=o(156),i=o.n(n);class s{static ucFirst(e){return e.charAt(0).toUpperCase()+e.slice(1)}static lcFirst(e){return e.charAt(0).toLowerCase()+e.slice(1)}static toDashCase(e){return e.replace(/([A-Z])/g,"-$1").replace(/^-/,"").toLowerCase()}static toLowerCamelCase(e,t){let o=s.toUpperCamelCase(e,t);return s.lcFirst(o)}static toUpperCamelCase(e,t){return t?e.split(t).map(e=>s.ucFirst(e.toLowerCase())).join(""):s.ucFirst(e.toLowerCase())}static parsePrimitive(e){try{return/^\d+(.|,)\d+$/.test(e)&&(e=e.replace(",",".")),JSON.parse(e)}catch(t){return e.toString()}}}class r{constructor(e=document){this._el=e,e.$emitter=this,this._listeners=[]}publish(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},o=arguments.length>2&&void 0!==arguments[2]&&arguments[2],n=new CustomEvent(e,{detail:t,cancelable:o});return this.el.dispatchEvent(n),n}subscribe(e,t){let o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},n=this,i=e.split("."),s=o.scope?t.bind(o.scope):t;if(o.once&&!0===o.once){let t=s;s=function(o){n.unsubscribe(e),t(o)}}return this.el.addEventListener(i[0],s),this.listeners.push({splitEventName:i,opts:o,cb:s}),!0}unsubscribe(e){let t=e.split(".");return this.listeners=this.listeners.reduce((e,o)=>([...o.splitEventName].sort().toString()===t.sort().toString()?this.el.removeEventListener(o.splitEventName[0],o.cb):e.push(o),e),[]),!0}reset(){return this.listeners.forEach(e=>{this.el.removeEventListener(e.splitEventName[0],e.cb)}),this.listeners=[],!0}get el(){return this._el}set el(e){this._el=e}get listeners(){return this._listeners}set listeners(e){this._listeners=e}}class a{constructor(e,t={},o=!1){if(!(e instanceof Node)){console.warn(`There is no valid element given while trying to create a plugin instance for "${o}".`);return}this.el=e,this.$emitter=new r(this.el),this._pluginName=this._getPluginName(o),this.options=this._mergeOptions(t),this._initialized=!1,this._registerInstance(),this._init()}init(){console.warn(`The "init" method for the plugin "${this._pluginName}" is not defined. The plugin will not be initialized.`)}update(){}_init(){this._initialized||(this.init(),this._initialized=!0)}_update(){this._initialized&&this.update()}_mergeOptions(e){let t=[this.constructor.options,this.options,e];return t.push(this._getConfigFromDataAttribute()),t.push(this._getOptionsFromDataAttribute()),i().all(t.filter(e=>e instanceof Object&&!(e instanceof Array)).map(e=>e||{}))}_getConfigFromDataAttribute(){let e={};if("function"!=typeof this.el.getAttribute)return e;let t=s.toDashCase(this._pluginName),o=this.el.getAttribute(`data-${t}-config`);return o?window.PluginConfigManager.get(this._pluginName,o):e}_getOptionsFromDataAttribute(){let e={};if("function"!=typeof this.el.getAttribute)return e;let t=s.toDashCase(this._pluginName),o=this.el.getAttribute(`data-${t}-options`);if(o)try{return JSON.parse(o)}catch(e){console.error(`The data attribute "data-${t}-options" could not be parsed to json: ${e.message}`)}return e}_registerInstance(){window.PluginManager.getPluginInstancesFromElement(this.el).set(this._pluginName,this),window.PluginManager.getPlugin(this._pluginName,!1).get("instances").push(this)}_getPluginName(e){return e||(e=this.constructor.name),e}}let l={accent:"#00D9FF",accentHover:"#00B8D9",accentMuted:"rgba(0, 217, 255, 0.15)",error:"#FF5252",bgDeep:"#0D1117",bg:"#161B22",bgElevated:"#21262D",bgHover:"#30363D",bgGlass:"rgba(22, 27, 34, 0.85)",text:"#F0F6FC",textSecondary:"#8B949E",textMuted:"#6E7681",border:"#30363D",borderHover:"#8B949E",borderAccent:"rgba(0, 217, 255, 0.4)",overlay:"rgba(0, 217, 255, 0.12)",overlayBorder:"#00D9FF",syntax:{keyword:"#FF79C6",string:"#A5D6FF",variable:"#79C0FF",number:"#A5D6A7",comment:"#6E7681",tag:"#7EE787",attribute:"#D2A8FF"}},c={mono:'"JetBrains Mono", "Fira Code", "SF Mono", "Consolas", monospace',system:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'},d={overlay:0x7ffffff8,tooltip:0x7ffffff9,panel:0x7ffffffa,detailPanel:0x7ffffffb,notification:0x80000002,toggle:0x7fffffee},p={xs:"4px",sm:"8px",md:"12px",lg:"16px",xl:"20px",xxl:"24px"},h={sm:"6px",md:"10px",lg:"14px",full:"9999px"},u={sm:"0 2px 8px rgba(0, 0, 0, 0.3)",md:"0 4px 16px rgba(0, 0, 0, 0.4)",lg:"0 8px 32px rgba(0, 0, 0, 0.5)",glow:"0 0 20px rgba(0, 217, 255, 0.3)",glowStrong:"0 0 30px rgba(0, 217, 255, 0.4)"};function b(e){return"string"!=typeof e?e:e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function m(e){return e.replace(/^@Storefront\//,"").replace(/^@(\w+)\//,"$1/").replace(/^storefront\//,"")}function g(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"success",o=document.createElement("div");o.className=`devtools-notification ${t}`,o.textContent=e,document.body.appendChild(o),requestAnimationFrame(()=>o.style.opacity="1"),setTimeout(()=>{o.style.opacity="0",setTimeout(()=>o.remove(),200)},2500)}function v(e){if(e.closest(["__mnkys-devtools-overlay__","__mnkys-devtools-tooltip__","__mnkys-devtools-panel__","__mnkys-devtools-detail__","__mnkys-devtools-toggle__"].map(e=>`#${e}`).join(", ")))return null;for(;e&&e!==document.body&&e!==document.documentElement;){if(e.dataset&&e.dataset.twigBlock)return e;e=e.parentElement}return null}function y(e){try{return JSON.parse(e.dataset.twigBlock)}catch(e){return console.warn("DevTools: Failed to parse twig data",e),null}}class f{constructor(e={}){this.options={overlayColor:"rgba(66, 184, 131, 0.15)",overlayBorderColor:"#1699F7",overlayBorderWidth:"2px",transitionDuration:"0.12s",...e},this.element=null}create(){this.element||(this.element=document.createElement("div"),this.element.id="__mnkys-devtools-overlay__",document.body.appendChild(this.element))}destroy(){this.element?.remove(),this.element=null}show(){this.element&&(this.element.style.display="block")}hide(){this.element&&(this.element.style.display="none")}highlight(e){if(!this.element||!e)return;let t=e.getBoundingClientRect(),o=parseInt(this.options.overlayBorderWidth,10);Object.assign(this.element.style,{display:"block",left:`${t.left-o}px`,top:`${t.top-o}px`,width:`${t.width+2*o}px`,height:`${t.height+2*o}px`})}isVisible(){return this.element&&"none"!==this.element.style.display}}class _{constructor(){this.element=null}create(){this.element||(this.element=document.createElement("div"),this.element.id="__mnkys-devtools-tooltip__",document.body.appendChild(this.element))}destroy(){this.element?.remove(),this.element=null}show(){this.element&&(this.element.style.display="block")}hide(){this.element&&(this.element.style.display="none")}update(e,t){let o=y(e);if(!o)return;let n=e.tagName.toLowerCase(),i=e.id?`#${e.id}`:"",s=e.className&&"string"==typeof e.className?"."+e.className.trim().split(/\s+/).slice(0,2).join("."):"";this.element.innerHTML=`
            <div class="element-tag">&lt;${n}${i}${s}&gt;</div>
            <div class="block-name">${b(o.block)}</div>
            <div class="template-path">${b(o.template)}:${o.line}</div>
        `,this.show(),this.position(t)}position(e){if(!this.element||"none"===this.element.style.display)return;let t=this.element.getBoundingClientRect(),o=window.innerWidth,n=window.innerHeight,i=e.clientX+15,s=e.clientY+15;i+t.width>o-15&&(i=e.clientX-t.width-15),s+t.height>n-15&&(s=e.clientY-t.height-15),i=Math.max(15,i),s=Math.max(15,s),this.element.style.left=`${i}px`,this.element.style.top=`${s}px`}isVisible(){return this.element&&"none"!==this.element.style.display}}class ${constructor(e={}){this.options={onToggle:null,...e},this.element=null,this.isActive=!1}create(){this.element||document.getElementById("__mnkys-devtools-toggle__")||(this.element=document.createElement("button"),this.element.id="__mnkys-devtools-toggle__",this.element.innerHTML=`
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
            </svg>
            <span>Inspect</span>
        `,this.element.title="Toggle Component Inspector (Ctrl+Shift+C)",this.element.setAttribute("aria-label","Toggle DevTools Inspector"),this.element.setAttribute("aria-pressed","false"),this.element.addEventListener("click",e=>{e.stopPropagation(),this.options.onToggle?.()}),document.body.appendChild(this.element))}destroy(){this.element?.remove(),this.element=null}setActive(e){if(!this.element)return;this.isActive=e,this.element.classList.toggle("active",e),this.element.setAttribute("aria-pressed",String(e));let t=this.element.querySelector("span");t&&(t.textContent=e?"Exit":"Inspect");let o=this.element.querySelector("svg");o&&(e?o.innerHTML=`
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                `:o.innerHTML=`
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                `)}exists(){return!!this.element}}let x=new class{constructor(){this._request=null,this._errorHandlingInternal=!1}get(e,t){let o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"application/json",n=this._createPreparedRequest("GET",e,o);return this._sendRequest(n,null,t)}post(e,t,o){let n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"application/json";n=this._getContentType(t,n);let i=this._createPreparedRequest("POST",e,n);return this._sendRequest(i,t,o)}delete(e,t,o){let n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"application/json";n=this._getContentType(t,n);let i=this._createPreparedRequest("DELETE",e,n);return this._sendRequest(i,t,o)}patch(e,t,o){let n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"application/json";n=this._getContentType(t,n);let i=this._createPreparedRequest("PATCH",e,n);return this._sendRequest(i,t,o)}abort(){if(this._request)return this._request.abort()}setErrorHandlingInternal(e){this._errorHandlingInternal=e}_registerOnLoaded(e,t){t&&(!0===this._errorHandlingInternal?(e.addEventListener("load",()=>{t(e.responseText,e)}),e.addEventListener("abort",()=>{console.warn(`the request to ${e.responseURL} was aborted`)}),e.addEventListener("error",()=>{console.warn(`the request to ${e.responseURL} failed with status ${e.status}`)}),e.addEventListener("timeout",()=>{console.warn(`the request to ${e.responseURL} timed out`)})):e.addEventListener("loadend",()=>{t(e.responseText,e)}))}_sendRequest(e,t,o){return this._registerOnLoaded(e,o),e.send(t),e}_getContentType(e,t){return e instanceof FormData&&(t=!1),t}_createPreparedRequest(e,t,o){return this._request=new XMLHttpRequest,this._request.open(e,t),this._request.setRequestHeader("X-Requested-With","XMLHttpRequest"),o&&this._request.setRequestHeader("Content-type",o),this._request}},k={openEditor:"/devtools/open-editor",blockInfo:"/devtools/block-info"};function w(e,t){return new Promise((o,n)=>{let i=`${k.openEditor}?file=${encodeURIComponent(e)}&line=${t}`;x.get(i,e=>{try{let t=JSON.parse(e);o(t)}catch(e){n(Error("Failed to parse response"))}},"application/json",!0)})}function T(){let e=document.getElementById("devtools-block-data");if(!e)return[];try{return(JSON.parse(e.textContent)||[]).sort((e,t)=>{let o=e.template.localeCompare(t.template);return 0!==o?o:e.block.localeCompare(t.block)})}catch(e){return console.warn("DevTools: Failed to parse block data",e),[]}}class E{constructor(e={}){this.options={onBlockSelect:null,...e},this.element=null,this.blocks=[],this.filteredBlocks=[],this.searchTerm=""}create(){this.element||(this.blocks=T(),this.filteredBlocks=[...this.blocks],this.element=document.createElement("div"),this.element.id="__mnkys-devtools-panel__",this.element.innerHTML=this._buildHTML(),document.body.appendChild(this.element),this._attachEvents())}destroy(){this.element?.remove(),this.element=null,this.blocks=[],this.filteredBlocks=[],this.searchTerm=""}reload(){this.blocks=T(),this.filteredBlocks=[...this.blocks],this._updateList()}getBlocks(){return this.blocks}hasBlocks(){return this.blocks.length>0}_buildHTML(){return`
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
                <div class="block-item-path">${this._highlightMatch(m(e.template))}:${e.line}</div>
            </div>
        `).join("")}_highlightMatch(e){if(!this.searchTerm)return b(e);let t=b(e),o=RegExp(`(${this.searchTerm.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`,"gi");return t.replace(o,'<span class="highlight">$1</span>')}_attachEvents(){let e=this.element.querySelector(".panel-search");e?.addEventListener("input",e=>{this.searchTerm=e.target.value.toLowerCase(),this._filterBlocks(),this._updateList()}),this.element.addEventListener("click",e=>{let t=e.target.closest(".block-item");if(t){let e={block:t.dataset.block,template:t.dataset.template,line:parseInt(t.dataset.line,10),blockId:t.dataset.blockId};this.options.onBlockSelect?.(e)}})}_filterBlocks(){if(!this.searchTerm){this.filteredBlocks=[...this.blocks];return}this.filteredBlocks=this.blocks.filter(e=>e.block.toLowerCase().includes(this.searchTerm)||e.template.toLowerCase().includes(this.searchTerm))}_updateList(){let e=this.element?.querySelector(".panel-list");e&&(e.innerHTML=this._buildListHTML());let t=this.element?.querySelector(".panel-stats");t&&(t.textContent=this.searchTerm?`${this.filteredBlocks.length} of ${this.blocks.length} blocks`:`${this.blocks.length} blocks`)}}class C{constructor(e={}){this.options={onClose:null,onOpenEditor:null,...e},this.element=null,this.currentBlock=null,this.contextData={},this.blockInfo=null,this.activeTab="context",this.isLoading=!1}create(){this.element||(this.contextData=function(){let e=document.getElementById("devtools-context-data");if(!e)return{};try{return JSON.parse(e.textContent)||{}}catch(e){return console.warn("DevTools: Failed to parse context data",e),{}}}(),this.element=document.createElement("div"),this.element.id="__mnkys-devtools-detail__",this.element.style.display="none",document.body.appendChild(this.element))}async show(e,t){this.element||this.create(),this.currentBlock=e,this.blockInfo=null,this.activeTab="context";let o=t.tagName.toLowerCase(),n=t.id?`#${t.id}`:"",i=t.className&&"string"==typeof t.className?"."+t.className.trim().split(/\s+/).slice(0,2).join("."):"";this.elementInfo=`<${o}${n}${i}>`,this.render(),this.element.style.display="flex",this.fetchBlockInfo()}hide(){this.element&&(this.element.style.display="none"),this.currentBlock=null,this.blockInfo=null}destroy(){this.element?.remove(),this.element=null}async fetchBlockInfo(){if(this.currentBlock){this.isLoading=!0,this.updateTabContent();try{var e,t,o;let n=await (e=this.currentBlock.template,t=this.currentBlock.block,o=this.currentBlock.line,new Promise((n,i)=>{let s=new URLSearchParams({template:e,block:t,line:String(o)}),r=`${k.blockInfo}?${s}`;x.get(r,e=>{try{let t=JSON.parse(e);n(t)}catch(e){i(Error("Failed to parse response"))}},"application/json",!0)}));n.success&&n.data&&(this.blockInfo=n.data)}catch(e){console.warn("DevTools: Failed to fetch block info",e)}finally{this.isLoading=!1,this.updateTabContent()}}}render(){if(!this.element||!this.currentBlock)return;let{block:e,template:t,line:o,blockId:n}=this.currentBlock;this.element.innerHTML=`
            <div class="detail-header">
                <div class="element-info">${b(this.elementInfo)}</div>
                <div class="block-title">{% block ${b(e)} %}</div>
                <div class="template-info">
                    ${b(m(t))}
                    <span class="line-num">:${o}</span>
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
        `,this.attachEvents()}updateTabContent(){if(!this.element)return;let e=this.element.querySelector('[data-pane="context"]'),t=this.element.querySelector('[data-pane="hierarchy"]'),o=this.element.querySelector('[data-pane="source"]');e&&(e.innerHTML=this.renderContextTab()),t&&(t.innerHTML=this.renderHierarchyTab()),o&&(o.innerHTML=this.renderSourceTab()),this.attachTreeEvents()}renderContextTab(){let{blockId:e}=this.currentBlock,t=this.contextData[e];if(!t||!t.context)return'<div class="source-loading">No context data available</div>';let o=t.context,n=Object.keys(o);return 0===n.length?'<div class="source-loading">No variables in context</div>':`
            <ul class="var-tree">
                ${n.map(e=>this.renderVariable(e,o[e])).join("")}
            </ul>
        `}renderVariable(e,t){let o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,n=this.hasExpandableContent(t),i=this.getTypeClass(t.type),s=this.getDisplayValue(t);return`
            <li class="var-item" data-depth="${o}">
                <div class="var-row">
                    <span class="var-toggle ${n?"expandable":""}"></span>
                    <span class="var-name">${b(e)}</span>
                    <span class="var-type">${b(this.getTypeLabel(t))}</span>
                    ${s?`<span class="var-value ${i}">${b(s)}</span>`:""}
                </div>
                ${n?`<ul class="var-children">${this.renderVariableChildren(t)}</ul>`:""}
            </li>
        `}hasExpandableContent(e){return!!e&&(!!e.properties&&Object.keys(e.properties).length>0||!!e.items&&Object.keys(e.items).length>0||!!e.keys&&e.keys.length>0)}renderVariableChildren(e){let t=[];if(e.properties)for(let[o,n]of Object.entries(e.properties))t.push(this.renderVariable(o,n,1));if(e.items)for(let[o,n]of Object.entries(e.items))t.push(this.renderVariable(o,n,1));if(e.keys&&!e.items)for(let o of e.keys)t.push(`
                    <li class="var-item">
                        <div class="var-row">
                            <span class="var-toggle"></span>
                            <span class="var-name">${b(o)}</span>
                            <span class="var-type">key</span>
                        </div>
                    </li>
                `);return t.join("")}getTypeClass(e){switch(e){case"string":return"string";case"int":case"float":return"number";case"bool":return"bool";case"null":return"null";case"object":return"object";default:return""}}getTypeLabel(e){if(!e)return"unknown";let t=e.type;return e.class&&(t=e.class),void 0!==e.count&&(t+=`(${e.count})`),void 0!==e.length&&"string"===e.type&&(t+=`[${e.length}]`),t}getDisplayValue(e){return e?void 0!==e.value?"bool"===e.type?e.value?"true":"false":"string"===e.type?`"${e.value}"`:String(e.value):e.preview?`"${e.preview}"`:e.name?e.name:e.id?`id: ${e.id}`:"":""}renderHierarchyTab(){if(this.isLoading)return'<div class="source-loading"><span class="devtools-loading"></span> Loading hierarchy...</div>';if(!this.blockInfo||!this.blockInfo.hierarchy)return'<div class="source-loading">Hierarchy information not available</div>';let e=this.blockInfo.hierarchy,t=this.currentBlock.template;return`
            <div class="hierarchy-tree">
                ${e.map((e,o)=>{let n=e.template===t,i="└─".repeat(o),s=e.blocks?e.blocks.length:0;return`
                        <div class="hierarchy-item ${n?"current":""} ${n?"":"clickable"}"
                             data-template="${b(e.template)}"
                             data-line="1">
                            <span class="hierarchy-indent">${i}</span>
                            <span class="hierarchy-template">${b(m(e.template))}</span>
                            <span class="hierarchy-blocks">${s} blocks</span>
                        </div>
                    `}).join("")}
            </div>
            
            ${this.blockInfo.blocks?this.renderBlockList():""}
        `}renderBlockList(){let e=this.blockInfo.blocks,t=Object.keys(e);return 0===t.length?"":`
            <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #333;">
                <div style="color: #888; font-size: 10px; margin-bottom: 8px;">
                    Blocks in this template:
                </div>
                ${t.map(t=>{let o=t===this.currentBlock.block;return`
                        <div class="hierarchy-item ${o?"current":""}"
                             style="padding: 4px 8px; font-size: 11px;">
                            <span style="color: ${o?"#42b883":"#9cdcfe"}">
                                ${b(t)}
                            </span>
                            <span class="hierarchy-blocks">:${e[t].line}</span>
                        </div>
                    `}).join("")}
            </div>
        `}renderSourceTab(){if(this.isLoading)return'<div class="source-loading"><span class="devtools-loading"></span> Loading source...</div>';if(!this.blockInfo||!this.blockInfo.source)return'<div class="source-loading">Source code not available</div>';let{lines:e,blockStart:t,blockEnd:o}=this.blockInfo.source;return e&&0!==e.length?`
            <div class="source-container">
                ${e.map(e=>{let t=e.isBlockLine,o=e.isStartLine;return`
                        <div class="source-line ${t?"highlight":""} ${o?"block-start":""}">
                            <span class="line-number">${e.number}</span>
                            <span class="line-content">${b(e.content).replace(/(\{#.*?#\})/g,'<span class="twig-comment">$1</span>').replace(/(\{%\s*)(\w+)(.*?)(%\})/g,'<span class="twig-tag">$1</span><span class="twig-name">$2</span>$3<span class="twig-tag">$4</span>').replace(/(\{\{)(.*?)(\}\})/g,'<span class="twig-tag">$1</span>$2<span class="twig-tag">$3</span>').replace(/(&quot;[^&]*&quot;|&#039;[^&]*&#039;)/g,'<span class="twig-string">$1</span>').replace(/(&lt;\/?)(\w+)((?:\s+[^&]*?)?)(&gt;)/g,'$1<span class="html-tag">$2</span>$3$4')}</span>
                        </div>
                    `}).join("")}
            </div>
        `:'<div class="source-loading">No source lines available</div>'}attachEvents(){this.element&&(this.element.querySelectorAll(".detail-tab").forEach(e=>{e.addEventListener("click",e=>{this.activeTab=e.target.dataset.tab,this.updateTabs()})}),this.element.querySelector('[data-action="close"]')?.addEventListener("click",()=>{this.hide(),this.options.onClose?.()}),this.element.querySelector('[data-action="open-editor"]')?.addEventListener("click",()=>{this.handleOpenEditor()}),this.element.querySelectorAll(".hierarchy-item.clickable").forEach(e=>{e.addEventListener("click",()=>{w(e.dataset.template,parseInt(e.dataset.line,10)||1)})}),this.attachTreeEvents())}attachTreeEvents(){this.element&&this.element.querySelectorAll(".var-row").forEach(e=>{e.addEventListener("click",t=>{let o=e.closest(".var-item");o&&e.querySelector(".var-toggle.expandable")&&o.classList.toggle("expanded")})})}updateTabs(){this.element&&(this.element.querySelectorAll(".detail-tab").forEach(e=>{e.classList.toggle("active",e.dataset.tab===this.activeTab)}),this.element.querySelectorAll(".tab-pane").forEach(e=>{e.classList.toggle("active",e.dataset.pane===this.activeTab)}))}async handleOpenEditor(){if(this.currentBlock)try{let e=await w(this.currentBlock.template,this.currentBlock.line);e.success?this.options.onOpenEditor?.(e):e.editorUrl?window.location.href=e.editorUrl:e.error&&console.warn("DevTools: Failed to open editor:",e.error)}catch(e){console.warn("DevTools: Failed to open editor",e)}}}class L extends a{static #e=this.options={overlayColor:"rgba(66, 184, 131, 0.15)",overlayBorderColor:"#1699F7",overlayBorderWidth:"2px",keyboardShortcut:!0,transitionDuration:"0.12s"};init(){this._enabled=!1,this._currentTarget=null,this._overlay=null,this._tooltip=null,this._blockPanel=null,this._detailPanel=null,this._toggle=null,this._onMouseMove=this._onMouseMove.bind(this),this._onClick=this._onClick.bind(this),this._onKeyDown=this._onKeyDown.bind(this),this._initToggle(),this.options.keyboardShortcut&&document.addEventListener("keydown",this._onKeyDown)}_initToggle(){this._isDevToolsEnabled()?this._createToggle():setTimeout(()=>{!this._toggle?.exists()&&this._isDevToolsEnabled()&&this._createToggle()},100)}_createToggle(){this._toggle=new $({onToggle:()=>this.toggle()}),this._toggle.create()}_isDevToolsEnabled(){return!!("true"===document.body.dataset.devtoolsEnabled||document.getElementById("devtools-block-data"))}toggle(){this._enabled?this.disable():this.enable()}enable(){this._enabled||(this._enabled=!0,function(){if(document.getElementById("__mnkys-devtools-styles__"))return;let e=document.createElement("style");e.id="__mnkys-devtools-styles__",e.textContent=`
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
   Toggle Button - Floating Action
   ======================================== */

#__mnkys-devtools-toggle__ {
    position: fixed;
    bottom: ${p.xl};
    left: ${p.xl};
    z-index: ${d.toggle};
    
    display: flex;
    align-items: center;
    gap: ${p.sm};
    padding: ${p.md} ${p.lg};
    
    background: ${l.bgGlass};
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    
    color: ${l.accent};
    border: 1px solid ${l.borderAccent};
    border-radius: ${h.full};
    
    cursor: pointer;
    font-family: ${c.system};
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.02em;
    
    box-shadow: ${u.md}, ${u.glow};
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateY(0);
}

#__mnkys-devtools-toggle__:hover {
    background: ${l.accent};
    color: ${l.bgDeep};
    border-color: ${l.accent};
    transform: translateY(-2px);
    box-shadow: ${u.lg}, ${u.glowStrong};
}

#__mnkys-devtools-toggle__:active {
    transform: translateY(0) scale(0.98);
}

#__mnkys-devtools-toggle__.active {
    background: ${l.accent};
    color: ${l.bgDeep};
    border-color: ${l.accent};
    box-shadow: ${u.lg}, ${u.glowStrong};
}

#__mnkys-devtools-toggle__ svg {
    transition: transform 0.2s ease;
}

#__mnkys-devtools-toggle__:hover svg {
    transform: scale(1.1);
}

#__mnkys-devtools-toggle__.active svg {
    transform: rotate(45deg);
}

/* ========================================
   Highlight Overlay
   ======================================== */

#__mnkys-devtools-overlay__ {
    position: fixed;
    pointer-events: none;
    z-index: ${d.overlay};
    
    background: ${l.overlay};
    border: 2px solid ${l.overlayBorder};
    border-radius: ${h.sm};
    
    box-shadow: 0 0 0 4px ${l.accentMuted},
                inset 0 0 20px ${l.accentMuted};
    
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
    
    background: ${l.bgGlass};
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    
    color: ${l.text};
    padding: ${p.md} ${p.lg};
    border-radius: ${h.md};
    
    font-size: 12px;
    font-family: ${c.mono};
    line-height: 1.5;
    
    border: 1px solid ${l.borderAccent};
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
    color: ${l.textMuted};
    font-size: 10px;
    margin-bottom: ${p.sm};
    font-family: ${c.mono};
    opacity: 0.8;
}

#__mnkys-devtools-tooltip__ .block-name {
    color: ${l.accent};
    font-weight: 700;
    font-size: 14px;
    margin-bottom: ${p.xs};
    display: flex;
    align-items: center;
    gap: ${p.xs};
}

#__mnkys-devtools-tooltip__ .block-name::before {
    content: '{% block';
    color: ${l.syntax.keyword};
    font-weight: 400;
    font-size: 12px;
}

#__mnkys-devtools-tooltip__ .block-name::after {
    content: '%}';
    color: ${l.syntax.keyword};
    font-weight: 400;
    font-size: 12px;
}

#__mnkys-devtools-tooltip__ .template-path {
    color: ${l.syntax.variable};
    font-size: 11px;
    word-break: break-all;
    padding: ${p.sm} ${p.md};
    background: ${l.bgDeep};
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
    
    background: ${l.bgGlass};
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    
    color: ${l.text};
    border-radius: ${h.lg};
    font-size: 12px;
    font-family: ${c.mono};
    
    border: 1px solid ${l.border};
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
    border-bottom: 1px solid ${l.border};
    flex-shrink: 0;
    background: ${l.bgElevated};
}

#__mnkys-devtools-panel__ .panel-title {
    color: ${l.text};
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
    background: ${l.accent};
    border-radius: 50%;
    box-shadow: 0 0 8px ${l.accent};
}

#__mnkys-devtools-panel__ .panel-search {
    width: 100%;
    padding: ${p.md} ${p.md};
    background: ${l.bgDeep};
    border: 1px solid ${l.border};
    border-radius: ${h.sm};
    color: ${l.text};
    font-size: 12px;
    font-family: inherit;
    outline: none;
    box-sizing: border-box;
    transition: all 0.2s ease;
}

#__mnkys-devtools-panel__ .panel-search::placeholder {
    color: ${l.textMuted};
}

#__mnkys-devtools-panel__ .panel-search:focus {
    border-color: ${l.accent};
    box-shadow: 0 0 0 3px ${l.accentMuted};
}

#__mnkys-devtools-panel__ .panel-stats {
    font-size: 11px;
    color: ${l.textSecondary};
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
    background: ${l.border};
    border-radius: ${h.full};
}

#__mnkys-devtools-panel__ .panel-list::-webkit-scrollbar-thumb:hover {
    background: ${l.borderHover};
}

#__mnkys-devtools-panel__ .block-item {
    padding: ${p.md} ${p.lg};
    cursor: pointer;
    border-left: 3px solid transparent;
    transition: all 0.15s ease;
    margin: 2px 0;
}

#__mnkys-devtools-panel__ .block-item:hover {
    background: ${l.bgHover};
    border-left-color: ${l.accent};
}

#__mnkys-devtools-panel__ .block-item-name {
    color: ${l.accent};
    font-weight: 600;
    font-size: 12px;
}

#__mnkys-devtools-panel__ .block-item-path {
    color: ${l.textMuted};
    font-size: 10px;
    margin-top: ${p.xs};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

#__mnkys-devtools-panel__ .panel-footer {
    padding: ${p.md} ${p.lg};
    border-top: 1px solid ${l.border};
    font-size: 10px;
    color: ${l.textMuted};
    background: ${l.bgElevated};
}

#__mnkys-devtools-panel__ kbd {
    display: inline-block;
    background: ${l.bgDeep};
    color: ${l.textSecondary};
    padding: 2px 6px;
    border-radius: ${h.sm};
    font-size: 10px;
    font-family: ${c.mono};
    border: 1px solid ${l.border};
}

#__mnkys-devtools-panel__ .panel-empty {
    padding: ${p.xxl};
    text-align: center;
    color: ${l.textMuted};
}

#__mnkys-devtools-panel__ .highlight {
    background: ${l.accentMuted};
    color: ${l.accent};
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
    
    background: ${l.bg};
    color: ${l.text};
    border-radius: ${h.lg};
    font-size: 12px;
    font-family: ${c.mono};
    
    border: 1px solid ${l.border};
    box-shadow: ${u.lg};
    
    z-index: ${d.detailPanel};
    display: flex;
    flex-direction: column;
    overflow: hidden;
    
    animation: detailSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
    border-bottom: 1px solid ${l.border};
    flex-shrink: 0;
    background: linear-gradient(180deg, ${l.bgElevated} 0%, ${l.bg} 100%);
}

.detail-header .element-info {
    color: ${l.textMuted};
    font-size: 11px;
    margin-bottom: ${p.sm};
    font-family: ${c.mono};
}

.detail-header .block-title {
    color: ${l.accent};
    font-size: 16px;
    font-weight: 700;
    margin-bottom: ${p.sm};
    display: flex;
    align-items: center;
    gap: ${p.sm};
}

.detail-header .template-info {
    color: ${l.syntax.variable};
    font-size: 11px;
    word-break: break-all;
    padding: ${p.sm} ${p.md};
    background: ${l.bgDeep};
    border-radius: ${h.sm};
    display: inline-block;
}

.detail-header .template-info .line-num {
    color: ${l.syntax.number};
    font-weight: 600;
}

/* Detail Panel Tabs */
.detail-tabs {
    display: flex;
    border-bottom: 1px solid ${l.border};
    flex-shrink: 0;
    background: ${l.bgElevated};
    padding: 0 ${p.sm};
}

.detail-tab {
    flex: 1;
    padding: ${p.md} ${p.lg};
    text-align: center;
    cursor: pointer;
    background: transparent;
    border: none;
    color: ${l.textSecondary};
    font-size: 12px;
    font-weight: 500;
    font-family: ${c.system};
    border-bottom: 2px solid transparent;
    transition: all 0.2s ease;
    margin-bottom: -1px;
}

.detail-tab:hover {
    color: ${l.text};
    background: ${l.bgHover};
}

.detail-tab:focus {
    outline: none;
    box-shadow: inset 0 0 0 2px ${l.accentMuted};
}

.detail-tab.active {
    color: ${l.accent};
    border-bottom-color: ${l.accent};
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
    background: ${l.bgDeep};
}

.detail-content::-webkit-scrollbar-thumb {
    background: ${l.border};
    border-radius: ${h.full};
    border: 2px solid ${l.bgDeep};
}

.detail-content::-webkit-scrollbar-thumb:hover {
    background: ${l.borderHover};
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
    background: ${l.bgHover};
}

.var-toggle {
    width: 18px;
    color: ${l.textMuted};
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
    color: ${l.syntax.variable};
    margin-right: ${p.sm};
    font-weight: 500;
}

.var-type {
    color: ${l.textMuted};
    font-size: 10px;
    margin-right: ${p.sm};
    padding: 1px 6px;
    background: ${l.bgDeep};
    border-radius: ${h.sm};
}

.var-value {
    color: ${l.syntax.string};
    font-size: 11px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 220px;
}

.var-value.string { color: ${l.syntax.string}; }
.var-value.number { color: ${l.syntax.number}; }
.var-value.bool { color: ${l.syntax.keyword}; }
.var-value.null { color: ${l.syntax.keyword}; font-style: italic; }
.var-value.object { color: ${l.syntax.tag}; }

.var-children {
    display: none;
    margin-left: ${p.lg};
    border-left: 2px solid ${l.border};
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
.hierarchy-tree {
    padding: ${p.sm} 0;
}

.hierarchy-item {
    padding: ${p.md} ${p.lg};
    margin: ${p.xs} 0;
    border-radius: ${h.sm};
    display: flex;
    align-items: center;
    gap: ${p.md};
    transition: all 0.15s ease;
}

.hierarchy-item.current {
    background: ${l.accentMuted};
    border-left: 3px solid ${l.accent};
    padding-left: calc(${p.lg} - 3px);
}

.hierarchy-indent {
    color: ${l.textMuted};
    font-size: 11px;
    font-family: ${c.mono};
    opacity: 0.5;
}

.hierarchy-template {
    color: ${l.syntax.variable};
    font-size: 12px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.hierarchy-blocks {
    color: ${l.textMuted};
    font-size: 10px;
    padding: 2px 8px;
    background: ${l.bgDeep};
    border-radius: ${h.full};
}

.hierarchy-item.clickable {
    cursor: pointer;
}

.hierarchy-item.clickable:hover {
    background: ${l.bgHover};
}

/* Source Tab */
.source-container {
    background: ${l.bgDeep};
    border-radius: ${h.md};
    overflow: hidden;
    border: 1px solid ${l.border};
}

.source-line {
    display: flex;
    font-size: 12px;
    line-height: 1.6;
    transition: background 0.1s ease;
}

.source-line:hover {
    background: ${l.bgHover};
}

.source-line.highlight {
    background: rgba(0, 217, 255, 0.08);
}

.source-line.block-start {
    background: rgba(0, 217, 255, 0.15);
    border-left: 3px solid ${l.accent};
}

.line-number {
    width: 48px;
    padding: 0 ${p.md};
    text-align: right;
    color: ${l.textMuted};
    background: rgba(0, 0, 0, 0.2);
    flex-shrink: 0;
    user-select: none;
    font-size: 11px;
}

.line-content {
    padding: 0 ${p.lg};
    white-space: pre;
    overflow-x: auto;
    flex: 1;
}

.source-loading {
    padding: ${p.xxl};
    text-align: center;
    color: ${l.textMuted};
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${p.md};
}

/* Twig Syntax Highlighting */
.twig-tag { color: ${l.syntax.keyword}; }
.twig-name { color: ${l.syntax.variable}; }
.twig-string { color: ${l.syntax.string}; }
.twig-comment { color: ${l.syntax.comment}; font-style: italic; }
.html-tag { color: ${l.syntax.tag}; }
.html-attr { color: ${l.syntax.attribute}; }
.html-value { color: ${l.syntax.string}; }

/* Detail Panel Footer */
.detail-footer {
    padding: ${p.lg} ${p.xl};
    border-top: 1px solid ${l.border};
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    background: ${l.bgElevated};
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
    box-shadow: 0 0 0 3px ${l.accentMuted};
}

.detail-btn-primary {
    background: ${l.accent};
    color: ${l.bgDeep};
}

.detail-btn-primary:hover {
    background: ${l.accentHover};
    transform: translateY(-1px);
    box-shadow: ${u.sm}, 0 0 12px ${l.accentMuted};
}

.detail-btn-primary:active {
    transform: translateY(0);
}

.detail-btn-secondary {
    background: ${l.bgHover};
    color: ${l.text};
    border: 1px solid ${l.border};
}

.detail-btn-secondary:hover {
    background: ${l.border};
    border-color: ${l.borderHover};
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
    background: ${l.bgGlass};
    color: ${l.accent};
    border: 1px solid ${l.borderAccent};
}

.devtools-notification.error {
    background: rgba(255, 82, 82, 0.9);
    color: #fff;
    border: 1px solid ${l.error};
}

/* ========================================
   Loading Spinner
   ======================================== */

.devtools-loading {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid ${l.border};
    border-top-color: ${l.accent};
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
    outline: 2px solid ${l.accent};
    outline-offset: 2px;
}

/* ========================================
   Selection
   ======================================== */

#__mnkys-devtools-panel__ ::selection,
#__mnkys-devtools-detail__ ::selection,
#__mnkys-devtools-tooltip__ ::selection {
    background: ${l.accentMuted};
    color: ${l.text};
}
`,document.head.appendChild(e)}(),this._createUIComponents(),document.addEventListener("mousemove",this._onMouseMove,!0),document.addEventListener("click",this._onClick,!0),document.body.classList.add("mnkys-devtools-active"),this._toggle?.setActive(!0),g("Inspector enabled - Hover to inspect, Click for details"))}disable(){this._enabled&&(this._enabled=!1,document.removeEventListener("mousemove",this._onMouseMove,!0),document.removeEventListener("click",this._onClick,!0),this._destroyUIComponents(),document.body.classList.remove("mnkys-devtools-active"),this._toggle?.setActive(!1),this._currentTarget=null)}_createUIComponents(){this._overlay=new f({overlayColor:this.options.overlayColor,overlayBorderColor:this.options.overlayBorderColor,overlayBorderWidth:this.options.overlayBorderWidth,transitionDuration:this.options.transitionDuration}),this._overlay.create(),this._tooltip=new _,this._tooltip.create(),this._blockPanel=new E({onBlockSelect:e=>this._handleBlockSelect(e)}),this._blockPanel.create(),this._detailPanel=new C({onClose:()=>{},onOpenEditor:()=>{g("Opening in editor...")}}),this._detailPanel.create()}_destroyUIComponents(){this._overlay?.destroy(),this._tooltip?.destroy(),this._blockPanel?.destroy(),this._detailPanel?.destroy(),this._overlay=null,this._tooltip=null,this._blockPanel=null,this._detailPanel=null}_handleBlockSelect(e){let t=document.querySelector(`[data-twig-block*="${e.block}"]`);this._detailPanel?.show(e,t||document.body)}_onMouseMove(e){if(!this._enabled)return;if(e.target.closest("#__mnkys-devtools-detail__")){this._hideHoverUI();return}let t=v(e.target);t&&t!==this._currentTarget?(this._currentTarget=t,this._overlay?.highlight(t),this._tooltip?.update(t,e)):!t&&this._currentTarget?(this._hideHoverUI(),this._currentTarget=null):t===this._currentTarget&&this._tooltip?.position(e)}_onClick(e){if(!this._enabled||e.target.closest("#__mnkys-devtools-panel__, #__mnkys-devtools-toggle__, #__mnkys-devtools-detail__"))return;let t=v(e.target);if(t){e.preventDefault(),e.stopPropagation();let o=y(t);o&&this._detailPanel?.show(o,t)}}_onKeyDown(e){e.ctrlKey&&e.shiftKey&&"C"===e.key&&(e.preventDefault(),this._isDevToolsEnabled()&&this.toggle()),"Escape"===e.key&&this._enabled&&(this._detailPanel?.element?.style.display!=="none"?this._detailPanel.hide():this.disable())}_hideHoverUI(){this._overlay?.hide(),this._tooltip?.hide()}}window.PluginManager.register("MnkysDevToolsComponentPicker",L,"body")})();