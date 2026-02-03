(()=>{"use strict";var e={156:e=>{var t=function(e){var t;return!!e&&"object"==typeof e&&"[object RegExp]"!==(t=Object.prototype.toString.call(e))&&"[object Date]"!==t&&e.$$typeof!==o},o="function"==typeof Symbol&&Symbol.for?Symbol.for("react.element"):60103;function i(e,t){return!1!==t.clone&&t.isMergeableObject(e)?r(Array.isArray(e)?[]:{},e,t):e}function n(e,t,o){return e.concat(t).map(function(e){return i(e,o)})}function s(e){return Object.keys(e).concat(Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(e).filter(function(t){return Object.propertyIsEnumerable.call(e,t)}):[])}function l(e,t){try{return t in e}catch(e){return!1}}function r(e,o,a){(a=a||{}).arrayMerge=a.arrayMerge||n,a.isMergeableObject=a.isMergeableObject||t,a.cloneUnlessOtherwiseSpecified=i;var c,d,h=Array.isArray(o);return h!==Array.isArray(e)?i(o,a):h?a.arrayMerge(e,o,a):(d={},(c=a).isMergeableObject(e)&&s(e).forEach(function(t){d[t]=i(e[t],c)}),s(o).forEach(function(t){(!l(e,t)||Object.hasOwnProperty.call(e,t)&&Object.propertyIsEnumerable.call(e,t))&&(l(e,t)&&c.isMergeableObject(o[t])?d[t]=(function(e,t){if(!t.customMerge)return r;var o=t.customMerge(e);return"function"==typeof o?o:r})(t,c)(e[t],o[t],c):d[t]=i(o[t],c))}),d)}r.all=function(e,t){if(!Array.isArray(e))throw Error("first argument should be an array");return e.reduce(function(e,o){return r(e,o,t)},{})},e.exports=r}},t={};function o(i){var n=t[i];if(void 0!==n)return n.exports;var s=t[i]={exports:{}};return e[i](s,s.exports,o),s.exports}o.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return o.d(t,{a:t}),t},o.d=(e,t)=>{for(var i in t)o.o(t,i)&&!o.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})},o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t);var i=o(156),n=o.n(i);class s{static ucFirst(e){return e.charAt(0).toUpperCase()+e.slice(1)}static lcFirst(e){return e.charAt(0).toLowerCase()+e.slice(1)}static toDashCase(e){return e.replace(/([A-Z])/g,"-$1").replace(/^-/,"").toLowerCase()}static toLowerCamelCase(e,t){let o=s.toUpperCamelCase(e,t);return s.lcFirst(o)}static toUpperCamelCase(e,t){return t?e.split(t).map(e=>s.ucFirst(e.toLowerCase())).join(""):s.ucFirst(e.toLowerCase())}static parsePrimitive(e){try{return/^\d+(.|,)\d+$/.test(e)&&(e=e.replace(",",".")),JSON.parse(e)}catch(t){return e.toString()}}}class l{constructor(e=document){this._el=e,e.$emitter=this,this._listeners=[]}publish(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},o=arguments.length>2&&void 0!==arguments[2]&&arguments[2],i=new CustomEvent(e,{detail:t,cancelable:o});return this.el.dispatchEvent(i),i}subscribe(e,t){let o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},i=this,n=e.split("."),s=o.scope?t.bind(o.scope):t;if(o.once&&!0===o.once){let t=s;s=function(o){i.unsubscribe(e),t(o)}}return this.el.addEventListener(n[0],s),this.listeners.push({splitEventName:n,opts:o,cb:s}),!0}unsubscribe(e){let t=e.split(".");return this.listeners=this.listeners.reduce((e,o)=>([...o.splitEventName].sort().toString()===t.sort().toString()?this.el.removeEventListener(o.splitEventName[0],o.cb):e.push(o),e),[]),!0}reset(){return this.listeners.forEach(e=>{this.el.removeEventListener(e.splitEventName[0],e.cb)}),this.listeners=[],!0}get el(){return this._el}set el(e){this._el=e}get listeners(){return this._listeners}set listeners(e){this._listeners=e}}class r{constructor(e,t={},o=!1){if(!(e instanceof Node)){console.warn(`There is no valid element given while trying to create a plugin instance for "${o}".`);return}this.el=e,this.$emitter=new l(this.el),this._pluginName=this._getPluginName(o),this.options=this._mergeOptions(t),this._initialized=!1,this._registerInstance(),this._init()}init(){console.warn(`The "init" method for the plugin "${this._pluginName}" is not defined. The plugin will not be initialized.`)}update(){}_init(){this._initialized||(this.init(),this._initialized=!0)}_update(){this._initialized&&this.update()}_mergeOptions(e){let t=[this.constructor.options,this.options,e];return t.push(this._getConfigFromDataAttribute()),t.push(this._getOptionsFromDataAttribute()),n().all(t.filter(e=>e instanceof Object&&!(e instanceof Array)).map(e=>e||{}))}_getConfigFromDataAttribute(){let e={};if("function"!=typeof this.el.getAttribute)return e;let t=s.toDashCase(this._pluginName),o=this.el.getAttribute(`data-${t}-config`);return o?window.PluginConfigManager.get(this._pluginName,o):e}_getOptionsFromDataAttribute(){let e={};if("function"!=typeof this.el.getAttribute)return e;let t=s.toDashCase(this._pluginName),o=this.el.getAttribute(`data-${t}-options`);if(o)try{return JSON.parse(o)}catch(e){console.error(`The data attribute "data-${t}-options" could not be parsed to json: ${e.message}`)}return e}_registerInstance(){window.PluginManager.getPluginInstancesFromElement(this.el).set(this._pluginName,this),window.PluginManager.getPlugin(this._pluginName,!1).get("instances").push(this)}_getPluginName(e){return e||(e=this.constructor.name),e}}let a={accent:"#1699F7",accentDark:"#0881d8",bg:"#1e1e1e",bgLight:"#2d2d2d",bgLighter:"#333",text:"#e0e0e0",textMuted:"#888",textDark:"#666",border:"#444",error:"#dc3545",overlay:"rgba(66, 184, 131, 0.15)"},c={mono:'"JetBrains Mono", "Fira Code", "Consolas", monospace',system:"system-ui, -apple-system, sans-serif"},d={overlay:0x7ffffff8,tooltip:0x7ffffff9,panel:0x7ffffffa,detailPanel:0x7ffffffb,notification:0x80000002,toggle:0x7fffffee};function h(e){return"string"!=typeof e?e:e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function p(e){return e.replace(/^@Storefront\//,"").replace(/^@(\w+)\//,"$1/").replace(/^storefront\//,"")}function u(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"success",o=document.createElement("div");o.className=`devtools-notification ${t}`,o.textContent=e,document.body.appendChild(o),requestAnimationFrame(()=>o.style.opacity="1"),setTimeout(()=>{o.style.opacity="0",setTimeout(()=>o.remove(),200)},2500)}function g(e){if(e.closest(["__mnkys-devtools-overlay__","__mnkys-devtools-tooltip__","__mnkys-devtools-panel__","__mnkys-devtools-detail__","__mnkys-devtools-toggle__"].map(e=>`#${e}`).join(", ")))return null;for(;e&&e!==document.body&&e!==document.documentElement;){if(e.dataset&&e.dataset.twigBlock)return e;e=e.parentElement}return null}function b(e){try{return JSON.parse(e.dataset.twigBlock)}catch(e){return console.warn("DevTools: Failed to parse twig data",e),null}}class m{constructor(e={}){this.options={overlayColor:"rgba(66, 184, 131, 0.15)",overlayBorderColor:"#1699F7",overlayBorderWidth:"2px",transitionDuration:"0.12s",...e},this.element=null}create(){this.element||(this.element=document.createElement("div"),this.element.id="__mnkys-devtools-overlay__",document.body.appendChild(this.element))}destroy(){this.element?.remove(),this.element=null}show(){this.element&&(this.element.style.display="block")}hide(){this.element&&(this.element.style.display="none")}highlight(e){if(!this.element||!e)return;let t=e.getBoundingClientRect(),o=parseInt(this.options.overlayBorderWidth,10);Object.assign(this.element.style,{display:"block",left:`${t.left-o}px`,top:`${t.top-o}px`,width:`${t.width+2*o}px`,height:`${t.height+2*o}px`})}isVisible(){return this.element&&"none"!==this.element.style.display}}class v{constructor(){this.element=null}create(){this.element||(this.element=document.createElement("div"),this.element.id="__mnkys-devtools-tooltip__",document.body.appendChild(this.element))}destroy(){this.element?.remove(),this.element=null}show(){this.element&&(this.element.style.display="block")}hide(){this.element&&(this.element.style.display="none")}update(e,t){let o=b(e);if(!o)return;let i=e.tagName.toLowerCase(),n=e.id?`#${e.id}`:"",s=e.className&&"string"==typeof e.className?"."+e.className.trim().split(/\s+/).slice(0,2).join("."):"";this.element.innerHTML=`
            <div class="element-tag">&lt;${i}${n}${s}&gt;</div>
            <div class="block-name">${h(o.block)}</div>
            <div class="template-path">${h(o.template)}:${o.line}</div>
        `,this.show(),this.position(t)}position(e){if(!this.element||"none"===this.element.style.display)return;let t=this.element.getBoundingClientRect(),o=window.innerWidth,i=window.innerHeight,n=e.clientX+15,s=e.clientY+15;n+t.width>o-15&&(n=e.clientX-t.width-15),s+t.height>i-15&&(s=e.clientY-t.height-15),n=Math.max(15,n),s=Math.max(15,s),this.element.style.left=`${n}px`,this.element.style.top=`${s}px`}isVisible(){return this.element&&"none"!==this.element.style.display}}class _{constructor(e={}){this.options={onToggle:null,...e},this.element=null,this.isActive=!1}create(){this.element||document.getElementById("__mnkys-devtools-toggle__")||(this._injectStyles(),this.element=document.createElement("button"),this.element.id="__mnkys-devtools-toggle__",this.element.innerHTML=`
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
            </svg>
            <span>Inspect</span>
        `,this.element.title="Toggle Component Inspector (Ctrl+Shift+C)",this.element.addEventListener("click",e=>{e.stopPropagation(),this.options.onToggle?.()}),document.body.appendChild(this.element))}destroy(){this.element?.remove(),this.element=null}setActive(e){if(!this.element)return;this.isActive=e,this.element.classList.toggle("active",e);let t=this.element.querySelector("span");t&&(t.textContent=e?"Exit":"Inspect")}exists(){return!!this.element}_injectStyles(){if(document.getElementById("__mnkys-devtools-button-styles__"))return;let e=document.createElement("style");e.id="__mnkys-devtools-button-styles__",e.textContent=`
            #__mnkys-devtools-toggle__ {
                position: fixed;
                bottom: 20px;
                left: 20px;
                z-index: 2147483630;
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 8px 12px;
                background-color: #1e1e1e;
                color: #1699f7;
                border: 2px solid #1699f7;
                border-radius: 6px;
                cursor: pointer;
                font-family: system-ui, -apple-system, sans-serif;
                font-size: 12px;
                font-weight: 600;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                transition: all 0.15s ease;
            }
            #__mnkys-devtools-toggle__:hover,
            #__mnkys-devtools-toggle__.active {
                background-color: #42b883;
                color: #1e1e1e;
            }
        `,document.head.appendChild(e)}}let f=new class{constructor(){this._request=null,this._errorHandlingInternal=!1}get(e,t){let o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"application/json",i=this._createPreparedRequest("GET",e,o);return this._sendRequest(i,null,t)}post(e,t,o){let i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"application/json";i=this._getContentType(t,i);let n=this._createPreparedRequest("POST",e,i);return this._sendRequest(n,t,o)}delete(e,t,o){let i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"application/json";i=this._getContentType(t,i);let n=this._createPreparedRequest("DELETE",e,i);return this._sendRequest(n,t,o)}patch(e,t,o){let i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"application/json";i=this._getContentType(t,i);let n=this._createPreparedRequest("PATCH",e,i);return this._sendRequest(n,t,o)}abort(){if(this._request)return this._request.abort()}setErrorHandlingInternal(e){this._errorHandlingInternal=e}_registerOnLoaded(e,t){t&&(!0===this._errorHandlingInternal?(e.addEventListener("load",()=>{t(e.responseText,e)}),e.addEventListener("abort",()=>{console.warn(`the request to ${e.responseURL} was aborted`)}),e.addEventListener("error",()=>{console.warn(`the request to ${e.responseURL} failed with status ${e.status}`)}),e.addEventListener("timeout",()=>{console.warn(`the request to ${e.responseURL} timed out`)})):e.addEventListener("loadend",()=>{t(e.responseText,e)}))}_sendRequest(e,t,o){return this._registerOnLoaded(e,o),e.send(t),e}_getContentType(e,t){return e instanceof FormData&&(t=!1),t}_createPreparedRequest(e,t,o){return this._request=new XMLHttpRequest,this._request.open(e,t),this._request.setRequestHeader("X-Requested-With","XMLHttpRequest"),o&&this._request.setRequestHeader("Content-type",o),this._request}},y={openEditor:"/devtools/open-editor",blockInfo:"/devtools/block-info"};function x(e,t){return new Promise((o,i)=>{let n=`${y.openEditor}?file=${encodeURIComponent(e)}&line=${t}`;f.get(n,e=>{try{let t=JSON.parse(e);o(t)}catch(e){i(Error("Failed to parse response"))}},"application/json",!0)})}function k(){let e=document.getElementById("devtools-block-data");if(!e)return[];try{return(JSON.parse(e.textContent)||[]).sort((e,t)=>{let o=e.template.localeCompare(t.template);return 0!==o?o:e.block.localeCompare(t.block)})}catch(e){return console.warn("DevTools: Failed to parse block data",e),[]}}class ${constructor(e={}){this.options={onBlockSelect:null,...e},this.element=null,this.blocks=[],this.filteredBlocks=[],this.searchTerm=""}create(){this.element||(this.blocks=k(),this.filteredBlocks=[...this.blocks],this.element=document.createElement("div"),this.element.id="__mnkys-devtools-panel__",this.element.innerHTML=this._buildHTML(),document.body.appendChild(this.element),this._attachEvents())}destroy(){this.element?.remove(),this.element=null,this.blocks=[],this.filteredBlocks=[],this.searchTerm=""}reload(){this.blocks=k(),this.filteredBlocks=[...this.blocks],this._updateList()}getBlocks(){return this.blocks}hasBlocks(){return this.blocks.length>0}_buildHTML(){return`
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
                 data-template="${h(e.template)}" 
                 data-block="${h(e.block)}"
                 data-line="${e.line}"
                 data-block-id="${h(e.blockId||"")}">
                <div class="block-item-name">${this._highlightMatch(e.block)}</div>
                <div class="block-item-path">${this._highlightMatch(p(e.template))}:${e.line}</div>
            </div>
        `).join("")}_highlightMatch(e){if(!this.searchTerm)return h(e);let t=h(e),o=RegExp(`(${this.searchTerm.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`,"gi");return t.replace(o,'<span class="highlight">$1</span>')}_attachEvents(){let e=this.element.querySelector(".panel-search");e?.addEventListener("input",e=>{this.searchTerm=e.target.value.toLowerCase(),this._filterBlocks(),this._updateList()}),this.element.addEventListener("click",e=>{let t=e.target.closest(".block-item");if(t){let e={block:t.dataset.block,template:t.dataset.template,line:parseInt(t.dataset.line,10),blockId:t.dataset.blockId};this.options.onBlockSelect?.(e)}})}_filterBlocks(){if(!this.searchTerm){this.filteredBlocks=[...this.blocks];return}this.filteredBlocks=this.blocks.filter(e=>e.block.toLowerCase().includes(this.searchTerm)||e.template.toLowerCase().includes(this.searchTerm))}_updateList(){let e=this.element?.querySelector(".panel-list");e&&(e.innerHTML=this._buildListHTML());let t=this.element?.querySelector(".panel-stats");t&&(t.textContent=this.searchTerm?`${this.filteredBlocks.length} of ${this.blocks.length} blocks`:`${this.blocks.length} blocks`)}}class w{constructor(e={}){this.options={onClose:null,onOpenEditor:null,...e},this.element=null,this.currentBlock=null,this.contextData={},this.blockInfo=null,this.activeTab="context",this.isLoading=!1}create(){this.element||(this.contextData=function(){let e=document.getElementById("devtools-context-data");if(!e)return{};try{return JSON.parse(e.textContent)||{}}catch(e){return console.warn("DevTools: Failed to parse context data",e),{}}}(),this.element=document.createElement("div"),this.element.id="__mnkys-devtools-detail__",this.element.style.display="none",document.body.appendChild(this.element))}async show(e,t){this.element||this.create(),this.currentBlock=e,this.blockInfo=null,this.activeTab="context";let o=t.tagName.toLowerCase(),i=t.id?`#${t.id}`:"",n=t.className&&"string"==typeof t.className?"."+t.className.trim().split(/\s+/).slice(0,2).join("."):"";this.elementInfo=`<${o}${i}${n}>`,this.render(),this.element.style.display="flex",this.fetchBlockInfo()}hide(){this.element&&(this.element.style.display="none"),this.currentBlock=null,this.blockInfo=null}destroy(){this.element?.remove(),this.element=null}async fetchBlockInfo(){if(this.currentBlock){this.isLoading=!0,this.updateTabContent();try{var e,t,o;let i=await (e=this.currentBlock.template,t=this.currentBlock.block,o=this.currentBlock.line,new Promise((i,n)=>{let s=new URLSearchParams({template:e,block:t,line:String(o)}),l=`${y.blockInfo}?${s}`;f.get(l,e=>{try{let t=JSON.parse(e);i(t)}catch(e){n(Error("Failed to parse response"))}},"application/json",!0)}));i.success&&i.data&&(this.blockInfo=i.data)}catch(e){console.warn("DevTools: Failed to fetch block info",e)}finally{this.isLoading=!1,this.updateTabContent()}}}render(){if(!this.element||!this.currentBlock)return;let{block:e,template:t,line:o,blockId:i}=this.currentBlock;this.element.innerHTML=`
            <div class="detail-header">
                <div class="element-info">${h(this.elementInfo)}</div>
                <div class="block-title">{% block ${h(e)} %}</div>
                <div class="template-info">
                    ${h(p(t))}
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
        `,this.attachEvents()}updateTabContent(){if(!this.element)return;let e=this.element.querySelector('[data-pane="context"]'),t=this.element.querySelector('[data-pane="hierarchy"]'),o=this.element.querySelector('[data-pane="source"]');e&&(e.innerHTML=this.renderContextTab()),t&&(t.innerHTML=this.renderHierarchyTab()),o&&(o.innerHTML=this.renderSourceTab()),this.attachTreeEvents()}renderContextTab(){let{blockId:e}=this.currentBlock,t=this.contextData[e];if(!t||!t.context)return'<div class="source-loading">No context data available</div>';let o=t.context,i=Object.keys(o);return 0===i.length?'<div class="source-loading">No variables in context</div>':`
            <ul class="var-tree">
                ${i.map(e=>this.renderVariable(e,o[e])).join("")}
            </ul>
        `}renderVariable(e,t){let o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,i=this.hasExpandableContent(t),n=this.getTypeClass(t.type),s=this.getDisplayValue(t);return`
            <li class="var-item" data-depth="${o}">
                <div class="var-row">
                    <span class="var-toggle ${i?"expandable":""}"></span>
                    <span class="var-name">${h(e)}</span>
                    <span class="var-type">${h(this.getTypeLabel(t))}</span>
                    ${s?`<span class="var-value ${n}">${h(s)}</span>`:""}
                </div>
                ${i?`<ul class="var-children">${this.renderVariableChildren(t)}</ul>`:""}
            </li>
        `}hasExpandableContent(e){return!!e&&(!!e.properties&&Object.keys(e.properties).length>0||!!e.items&&Object.keys(e.items).length>0||!!e.keys&&e.keys.length>0)}renderVariableChildren(e){let t=[];if(e.properties)for(let[o,i]of Object.entries(e.properties))t.push(this.renderVariable(o,i,1));if(e.items)for(let[o,i]of Object.entries(e.items))t.push(this.renderVariable(o,i,1));if(e.keys&&!e.items)for(let o of e.keys)t.push(`
                    <li class="var-item">
                        <div class="var-row">
                            <span class="var-toggle"></span>
                            <span class="var-name">${h(o)}</span>
                            <span class="var-type">key</span>
                        </div>
                    </li>
                `);return t.join("")}getTypeClass(e){switch(e){case"string":return"string";case"int":case"float":return"number";case"bool":return"bool";case"null":return"null";case"object":return"object";default:return""}}getTypeLabel(e){if(!e)return"unknown";let t=e.type;return e.class&&(t=e.class),void 0!==e.count&&(t+=`(${e.count})`),void 0!==e.length&&"string"===e.type&&(t+=`[${e.length}]`),t}getDisplayValue(e){return e?void 0!==e.value?"bool"===e.type?e.value?"true":"false":"string"===e.type?`"${e.value}"`:String(e.value):e.preview?`"${e.preview}"`:e.name?e.name:e.id?`id: ${e.id}`:"":""}renderHierarchyTab(){if(this.isLoading)return'<div class="source-loading"><span class="devtools-loading"></span> Loading hierarchy...</div>';if(!this.blockInfo||!this.blockInfo.hierarchy)return'<div class="source-loading">Hierarchy information not available</div>';let e=this.blockInfo.hierarchy,t=this.currentBlock.template;return`
            <div class="hierarchy-tree">
                ${e.map((e,o)=>{let i=e.template===t,n="└─".repeat(o),s=e.blocks?e.blocks.length:0;return`
                        <div class="hierarchy-item ${i?"current":""} ${i?"":"clickable"}"
                             data-template="${h(e.template)}"
                             data-line="1">
                            <span class="hierarchy-indent">${n}</span>
                            <span class="hierarchy-template">${h(p(e.template))}</span>
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
                                ${h(t)}
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
                            <span class="line-content">${h(e.content).replace(/(\{#.*?#\})/g,'<span class="twig-comment">$1</span>').replace(/(\{%\s*)(\w+)(.*?)(%\})/g,'<span class="twig-tag">$1</span><span class="twig-name">$2</span>$3<span class="twig-tag">$4</span>').replace(/(\{\{)(.*?)(\}\})/g,'<span class="twig-tag">$1</span>$2<span class="twig-tag">$3</span>').replace(/(&quot;[^&]*&quot;|&#039;[^&]*&#039;)/g,'<span class="twig-string">$1</span>').replace(/(&lt;\/?)(\w+)((?:\s+[^&]*?)?)(&gt;)/g,'$1<span class="html-tag">$2</span>$3$4')}</span>
                        </div>
                    `}).join("")}
            </div>
        `:'<div class="source-loading">No source lines available</div>'}attachEvents(){this.element&&(this.element.querySelectorAll(".detail-tab").forEach(e=>{e.addEventListener("click",e=>{this.activeTab=e.target.dataset.tab,this.updateTabs()})}),this.element.querySelector('[data-action="close"]')?.addEventListener("click",()=>{this.hide(),this.options.onClose?.()}),this.element.querySelector('[data-action="open-editor"]')?.addEventListener("click",()=>{this.handleOpenEditor()}),this.element.querySelectorAll(".hierarchy-item.clickable").forEach(e=>{e.addEventListener("click",()=>{x(e.dataset.template,parseInt(e.dataset.line,10)||1)})}),this.attachTreeEvents())}attachTreeEvents(){this.element&&this.element.querySelectorAll(".var-row").forEach(e=>{e.addEventListener("click",t=>{let o=e.closest(".var-item");o&&e.querySelector(".var-toggle.expandable")&&o.classList.toggle("expanded")})})}updateTabs(){this.element&&(this.element.querySelectorAll(".detail-tab").forEach(e=>{e.classList.toggle("active",e.dataset.tab===this.activeTab)}),this.element.querySelectorAll(".tab-pane").forEach(e=>{e.classList.toggle("active",e.dataset.pane===this.activeTab)}))}async handleOpenEditor(){if(this.currentBlock)try{let e=await x(this.currentBlock.template,this.currentBlock.line);e.success?this.options.onOpenEditor?.(e):e.editorUrl?window.location.href=e.editorUrl:e.error&&console.warn("DevTools: Failed to open editor:",e.error)}catch(e){console.warn("DevTools: Failed to open editor",e)}}}class T extends r{static #e=this.options={overlayColor:"rgba(66, 184, 131, 0.15)",overlayBorderColor:"#1699F7",overlayBorderWidth:"2px",keyboardShortcut:!0,transitionDuration:"0.12s"};init(){this._enabled=!1,this._currentTarget=null,this._overlay=null,this._tooltip=null,this._blockPanel=null,this._detailPanel=null,this._toggle=null,this._onMouseMove=this._onMouseMove.bind(this),this._onClick=this._onClick.bind(this),this._onKeyDown=this._onKeyDown.bind(this),this._initToggle(),this.options.keyboardShortcut&&document.addEventListener("keydown",this._onKeyDown)}_initToggle(){this._isDevToolsEnabled()?this._createToggle():setTimeout(()=>{!this._toggle?.exists()&&this._isDevToolsEnabled()&&this._createToggle()},100)}_createToggle(){this._toggle=new _({onToggle:()=>this.toggle()}),this._toggle.create()}_isDevToolsEnabled(){return!!("true"===document.body.dataset.devtoolsEnabled||document.getElementById("devtools-block-data"))}toggle(){this._enabled?this.disable():this.enable()}enable(){this._enabled||(this._enabled=!0,function(){if(document.getElementById("__mnkys-devtools-styles__"))return;let e=document.createElement("style");e.id="__mnkys-devtools-styles__",e.textContent=`
/* ========================================
   DevTools Inspector - Base Styles
   ======================================== */

.mnkys-devtools-active {
    cursor: crosshair !important;
}

.mnkys-devtools-active * {
    cursor: crosshair !important;
}

/* ========================================
   Toggle Button
   ======================================== */

#__mnkys-devtools-toggle__ {
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: ${d.toggle};
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background-color: ${a.bg};
    color: ${a.accent};
    border: 2px solid ${a.accent};
    border-radius: 6px;
    cursor: pointer;
    font-family: ${c.system};
    font-size: 12px;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    transition: all 0.15s ease;
}

#__mnkys-devtools-toggle__:hover {
    background-color: ${a.accent};
    color: ${a.bg};
}

#__mnkys-devtools-toggle__.active {
    background-color: ${a.accent};
    color: ${a.bg};
}

/* ========================================
   Highlight Overlay
   ======================================== */

#__mnkys-devtools-overlay__ {
    position: fixed;
    pointer-events: none;
    z-index: ${d.overlay};
    background-color: ${a.overlay};
    border: 2px solid ${a.accent};
    border-radius: 3px;
    transition: all 0.12s ease-out;
    display: none;
    box-sizing: border-box;
}

/* ========================================
   Tooltip
   ======================================== */

#__mnkys-devtools-tooltip__ {
    position: fixed;
    pointer-events: none;
    z-index: ${d.tooltip};
    background-color: ${a.bg};
    color: ${a.text};
    padding: 10px 14px;
    border-radius: 6px;
    font-size: 12px;
    font-family: ${c.mono};
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
    max-width: 400px;
    display: none;
    border: 1px solid ${a.accent};
    line-height: 1.4;
}

#__mnkys-devtools-tooltip__ .element-tag {
    color: ${a.textMuted};
    font-size: 10px;
    margin-bottom: 6px;
    font-style: italic;
}

#__mnkys-devtools-tooltip__ .block-name {
    color: ${a.accent};
    font-weight: 700;
    font-size: 13px;
    margin-bottom: 4px;
}

#__mnkys-devtools-tooltip__ .block-name::before {
    content: '{% block ';
    color: ${a.textDark};
    font-weight: 400;
}

#__mnkys-devtools-tooltip__ .block-name::after {
    content: ' %}';
    color: ${a.textDark};
    font-weight: 400;
}

#__mnkys-devtools-tooltip__ .template-path {
    color: #9cdcfe;
    font-size: 11px;
    word-break: break-all;
}

/* ========================================
   Block List Panel (Right Side)
   ======================================== */

#__mnkys-devtools-panel__ {
    position: fixed;
    right: 20px;
    top: 20px;
    width: 320px;
    max-height: 45vh;
    background-color: ${a.bg};
    color: ${a.text};
    border-radius: 8px;
    font-size: 12px;
    font-family: ${c.mono};
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    z-index: ${d.panel};
    border: 1px solid ${a.accent};
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

#__mnkys-devtools-panel__ .panel-header {
    padding: 12px;
    border-bottom: 1px solid ${a.bgLighter};
    flex-shrink: 0;
}

#__mnkys-devtools-panel__ .panel-title {
    color: ${a.accent};
    font-size: 13px;
    font-weight: 600;
    margin: 0 0 8px;
}

#__mnkys-devtools-panel__ .panel-search {
    width: 100%;
    padding: 6px 10px;
    background: ${a.bgLight};
    border: 1px solid ${a.border};
    border-radius: 4px;
    color: ${a.text};
    font-size: 11px;
    font-family: inherit;
    outline: none;
    box-sizing: border-box;
}

#__mnkys-devtools-panel__ .panel-search:focus {
    border-color: ${a.accent};
}

#__mnkys-devtools-panel__ .panel-stats {
    font-size: 10px;
    color: ${a.textDark};
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
    background: ${a.border};
    border-radius: 3px;
}

#__mnkys-devtools-panel__ .block-item {
    padding: 6px 12px;
    cursor: pointer;
    border-left: 2px solid transparent;
    transition: all 0.1s;
}

#__mnkys-devtools-panel__ .block-item:hover {
    background: ${a.bgLight};
    border-left-color: ${a.accent};
}

#__mnkys-devtools-panel__ .block-item-name {
    color: ${a.accent};
    font-weight: 500;
}

#__mnkys-devtools-panel__ .block-item-path {
    color: ${a.textDark};
    font-size: 10px;
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

#__mnkys-devtools-panel__ .panel-footer {
    padding: 8px 12px;
    border-top: 1px solid ${a.bgLighter};
    font-size: 10px;
    color: ${a.textDark};
}

#__mnkys-devtools-panel__ kbd {
    background: ${a.bgLighter};
    padding: 1px 4px;
    border-radius: 2px;
}

#__mnkys-devtools-panel__ .panel-empty {
    padding: 20px;
    text-align: center;
    color: ${a.textDark};
}

#__mnkys-devtools-panel__ .highlight {
    background: rgba(66, 184, 131, 0.3);
    border-radius: 2px;
}

/* ========================================
   Detail Panel (Inspector Panel)
   ======================================== */

#__mnkys-devtools-detail__ {
    position: fixed;
    right: 20px;
    top: 20px;
    width: 450px;
    max-height: 80vh;
    background-color: ${a.bg};
    color: ${a.text};
    border-radius: 8px;
    font-size: 12px;
    font-family: ${c.mono};
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.6);
    z-index: ${d.detailPanel};
    border: 1px solid ${a.accent};
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* Detail Panel Header */
.detail-header {
    padding: 14px 16px;
    border-bottom: 1px solid ${a.bgLighter};
    flex-shrink: 0;
}

.detail-header .element-info {
    color: ${a.textMuted};
    font-size: 11px;
    margin-bottom: 6px;
}

.detail-header .block-title {
    color: ${a.accent};
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 4px;
}

.detail-header .template-info {
    color: #9cdcfe;
    font-size: 11px;
    word-break: break-all;
}

.detail-header .template-info .line-num {
    color: ${a.textMuted};
}

/* Detail Panel Tabs */
.detail-tabs {
    display: flex;
    border-bottom: 1px solid ${a.bgLighter};
    flex-shrink: 0;
}

.detail-tab {
    flex: 1;
    padding: 10px;
    text-align: center;
    cursor: pointer;
    background: transparent;
    border: none;
    color: ${a.textMuted};
    font-size: 11px;
    font-family: ${c.mono};
    border-bottom: 2px solid transparent;
    transition: all 0.15s;
}

.detail-tab:hover {
    color: ${a.text};
    background: ${a.bgLight};
}

.detail-tab.active {
    color: ${a.accent};
    border-bottom-color: ${a.accent};
}

/* Detail Panel Content */
.detail-content {
    flex: 1;
    overflow-y: auto;
    padding: 12px 0;
}

.detail-content::-webkit-scrollbar {
    width: 6px;
}

.detail-content::-webkit-scrollbar-thumb {
    background: ${a.border};
    border-radius: 3px;
}

.tab-pane {
    display: none;
    padding: 0 16px;
}

.tab-pane.active {
    display: block;
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
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.1s;
}

.var-row:hover {
    background: ${a.bgLight};
}

.var-toggle {
    width: 16px;
    color: ${a.textMuted};
    flex-shrink: 0;
}

.var-toggle.expandable::before {
    content: '▶';
    font-size: 8px;
}

.var-item.expanded > .var-row .var-toggle.expandable::before {
    content: '▼';
}

.var-name {
    color: #9cdcfe;
    margin-right: 6px;
}

.var-type {
    color: ${a.textMuted};
    font-size: 10px;
    margin-right: 6px;
}

.var-value {
    color: #ce9178;
    font-size: 11px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 200px;
}

.var-value.string { color: #ce9178; }
.var-value.number { color: #b5cea8; }
.var-value.bool { color: #569cd6; }
.var-value.null { color: #569cd6; }
.var-value.object { color: #4ec9b0; }

.var-children {
    display: none;
    margin-left: 16px;
    border-left: 1px solid ${a.bgLighter};
    padding-left: 8px;
}

.var-item.expanded > .var-children {
    display: block;
}

/* Hierarchy Tab */
.hierarchy-tree {
    padding: 8px 0;
}

.hierarchy-item {
    padding: 6px 12px;
    margin: 2px 0;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.hierarchy-item.current {
    background: rgba(66, 184, 131, 0.15);
    border-left: 3px solid ${a.accent};
}

.hierarchy-indent {
    color: ${a.textDark};
    font-size: 10px;
}

.hierarchy-template {
    color: #9cdcfe;
    font-size: 11px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.hierarchy-blocks {
    color: ${a.textMuted};
    font-size: 10px;
}

.hierarchy-item.clickable {
    cursor: pointer;
}

.hierarchy-item.clickable:hover {
    background: ${a.bgLight};
}

/* Source Tab */
.source-container {
    background: #1a1a1a;
    border-radius: 4px;
    overflow: hidden;
}

.source-line {
    display: flex;
    font-size: 11px;
    line-height: 1.5;
}

.source-line.highlight {
    background: rgba(66, 184, 131, 0.1);
}

.source-line.block-start {
    background: rgba(66, 184, 131, 0.2);
}

.line-number {
    width: 40px;
    padding: 0 8px;
    text-align: right;
    color: ${a.textDark};
    background: #151515;
    flex-shrink: 0;
    user-select: none;
}

.line-content {
    padding: 0 12px;
    white-space: pre;
    overflow-x: auto;
    flex: 1;
}

.source-loading {
    padding: 20px;
    text-align: center;
    color: ${a.textMuted};
}

/* Twig Syntax Highlighting */
.twig-tag { color: #c586c0; }
.twig-name { color: #9cdcfe; }
.twig-string { color: #ce9178; }
.twig-comment { color: #6a9955; font-style: italic; }
.html-tag { color: #569cd6; }
.html-attr { color: #9cdcfe; }
.html-value { color: #ce9178; }

/* Detail Panel Footer */
.detail-footer {
    padding: 12px 16px;
    border-top: 1px solid ${a.bgLighter};
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
}

.detail-btn {
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 12px;
    font-family: ${c.mono};
    cursor: pointer;
    transition: all 0.15s;
    border: none;
}

.detail-btn-primary {
    background: ${a.accent};
    color: ${a.bg};
}

.detail-btn-primary:hover {
    background: ${a.accentDark};
}

.detail-btn-secondary {
    background: ${a.bgLight};
    color: ${a.text};
    border: 1px solid ${a.border};
}

.detail-btn-secondary:hover {
    background: ${a.bgLighter};
}

/* ========================================
   Notifications
   ======================================== */

.devtools-notification {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 20px;
    border-radius: 6px;
    font-size: 12px;
    font-family: ${c.system};
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
    z-index: ${d.notification};
    opacity: 0;
    transition: opacity 0.2s;
}

.devtools-notification.success {
    background-color: ${a.bg};
    color: ${a.accent};
    border: 1px solid ${a.accent};
}

.devtools-notification.error {
    background-color: ${a.error};
    color: #fff;
    border: 1px solid ${a.error};
}

/* ========================================
   Loading State
   ======================================== */

.devtools-loading {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid ${a.bgLighter};
    border-top-color: ${a.accent};
    border-radius: 50%;
    animation: devtools-spin 0.8s linear infinite;
}

@keyframes devtools-spin {
    to { transform: rotate(360deg); }
}
`,document.head.appendChild(e)}(),this._createUIComponents(),document.addEventListener("mousemove",this._onMouseMove,!0),document.addEventListener("click",this._onClick,!0),document.body.classList.add("mnkys-devtools-active"),this._toggle?.setActive(!0),u("Inspector enabled - Hover to inspect, Click for details"))}disable(){this._enabled&&(this._enabled=!1,document.removeEventListener("mousemove",this._onMouseMove,!0),document.removeEventListener("click",this._onClick,!0),this._destroyUIComponents(),document.body.classList.remove("mnkys-devtools-active"),this._toggle?.setActive(!1),this._currentTarget=null)}_createUIComponents(){this._overlay=new m({overlayColor:this.options.overlayColor,overlayBorderColor:this.options.overlayBorderColor,overlayBorderWidth:this.options.overlayBorderWidth,transitionDuration:this.options.transitionDuration}),this._overlay.create(),this._tooltip=new v,this._tooltip.create(),this._blockPanel=new $({onBlockSelect:e=>this._handleBlockSelect(e)}),this._blockPanel.create(),this._detailPanel=new w({onClose:()=>{},onOpenEditor:()=>{u("Opening in editor...")}}),this._detailPanel.create()}_destroyUIComponents(){this._overlay?.destroy(),this._tooltip?.destroy(),this._blockPanel?.destroy(),this._detailPanel?.destroy(),this._overlay=null,this._tooltip=null,this._blockPanel=null,this._detailPanel=null}_handleBlockSelect(e){let t=document.querySelector(`[data-twig-block*="${e.block}"]`);this._detailPanel?.show(e,t||document.body)}_onMouseMove(e){if(!this._enabled)return;if(e.target.closest("#__mnkys-devtools-detail__")){this._hideHoverUI();return}let t=g(e.target);t&&t!==this._currentTarget?(this._currentTarget=t,this._overlay?.highlight(t),this._tooltip?.update(t,e)):!t&&this._currentTarget?(this._hideHoverUI(),this._currentTarget=null):t===this._currentTarget&&this._tooltip?.position(e)}_onClick(e){if(!this._enabled||e.target.closest("#__mnkys-devtools-panel__, #__mnkys-devtools-toggle__, #__mnkys-devtools-detail__"))return;let t=g(e.target);if(t){e.preventDefault(),e.stopPropagation();let o=b(t);o&&this._detailPanel?.show(o,t)}}_onKeyDown(e){e.ctrlKey&&e.shiftKey&&"C"===e.key&&(e.preventDefault(),this._isDevToolsEnabled()&&this.toggle()),"Escape"===e.key&&this._enabled&&(this._detailPanel?.element?.style.display!=="none"?this._detailPanel.hide():this.disable())}_hideHoverUI(){this._overlay?.hide(),this._tooltip?.hide()}}window.PluginManager.register("MnkysDevToolsComponentPicker",T,"body")})();