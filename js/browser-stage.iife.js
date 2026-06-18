var BrowserStage=(function(d){"use strict";var de=Object.defineProperty;var kt=d=>{throw TypeError(d)};var be=(d,b,g)=>b in d?de(d,b,{enumerable:!0,configurable:!0,writable:!0,value:g}):d[b]=g;var ot=(d,b,g)=>be(d,typeof b!="symbol"?b+"":b,g),rt=(d,b,g)=>b.has(d)||kt("Cannot "+g);var f=(d,b,g)=>(rt(d,b,"read from private field"),g?g.call(d):b.get(d)),H=(d,b,g)=>b.has(d)?kt("Cannot add the same private member more than once"):b instanceof WeakSet?b.add(d):b.set(d,g),V=(d,b,g,y)=>(rt(d,b,"write to private field"),y?y.call(d,g):b.set(d,g),g),x=(d,b,g)=>(rt(d,b,"access private method"),g);var At=(d,b,g,y)=>({set _(W){V(d,b,W,g)},get _(){return f(d,b,y)}});/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var wt,P,M,F,$,v,Et,Ct,zt,St,at,it,Pt,Mt;const b=globalThis,g=b.ShadowRoot&&(b.ShadyCSS===void 0||b.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,y=Symbol(),W=new WeakMap;let nt=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==y)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(g&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=W.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&W.set(e,t))}return t}toString(){return this.cssText}};const Ot=r=>new nt(typeof r=="string"?r:r+"",void 0,y),Tt=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,o,a)=>s+(i=>{if(i._$cssResult$===!0)return i.cssText;if(typeof i=="number")return i;throw Error("Value passed to 'css' function must be a 'css' function result: "+i+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+r[a+1],r[0]);return new nt(e,r,y)},Ut=(r,t)=>{if(g)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),o=b.litNonce;o!==void 0&&s.setAttribute("nonce",o),s.textContent=e.cssText,r.appendChild(s)}},lt=g?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Ot(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Ht,defineProperty:Nt,getOwnPropertyDescriptor:Rt,getOwnPropertyNames:It,getOwnPropertySymbols:Lt,getPrototypeOf:Bt}=Object,w=globalThis,dt=w.trustedTypes,Dt=dt?dt.emptyScript:"",J=w.reactiveElementPolyfillSupport,N=(r,t)=>r,K={toAttribute(r,t){switch(t){case Boolean:r=r?Dt:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},bt=(r,t)=>!Ht(r,t),ct={attribute:!0,type:String,converter:K,reflect:!1,useDefault:!1,hasChanged:bt};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),w.litPropertyMetadata??(w.litPropertyMetadata=new WeakMap);let O=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ct){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),o=this.getPropertyDescriptor(t,s,e);o!==void 0&&Nt(this.prototype,t,o)}}static getPropertyDescriptor(t,e,s){const{get:o,set:a}=Rt(this.prototype,t)??{get(){return this[e]},set(i){this[e]=i}};return{get:o,set(i){const l=o==null?void 0:o.call(this);a==null||a.call(this,i),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ct}static _$Ei(){if(this.hasOwnProperty(N("elementProperties")))return;const t=Bt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(N("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(N("properties"))){const e=this.properties,s=[...It(e),...Lt(e)];for(const o of s)this.createProperty(o,e[o])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,o]of e)this.elementProperties.set(s,o)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const o=this._$Eu(e,s);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const o of s)e.unshift(lt(o))}else t!==void 0&&e.push(lt(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ut(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){var a;const s=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,s);if(o!==void 0&&s.reflect===!0){const i=(((a=s.converter)==null?void 0:a.toAttribute)!==void 0?s.converter:K).toAttribute(e,s.type);this._$Em=t,i==null?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(t,e){var a,i;const s=this.constructor,o=s._$Eh.get(t);if(o!==void 0&&this._$Em!==o){const l=s.getPropertyOptions(o),n=typeof l.converter=="function"?{fromAttribute:l.converter}:((a=l.converter)==null?void 0:a.fromAttribute)!==void 0?l.converter:K;this._$Em=o;const p=n.fromAttribute(e,l.type);this[o]=p??((i=this._$Ej)==null?void 0:i.get(o))??p,this._$Em=null}}requestUpdate(t,e,s,o=!1,a){var i;if(t!==void 0){const l=this.constructor;if(o===!1&&(a=this[t]),s??(s=l.getPropertyOptions(t)),!((s.hasChanged??bt)(a,e)||s.useDefault&&s.reflect&&a===((i=this._$Ej)==null?void 0:i.get(t))&&!this.hasAttribute(l._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:o,wrapped:a},i){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,i??e??this[t]),a!==!0||i!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),o===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[a,i]of this._$Ep)this[a]=i;this._$Ep=void 0}const o=this.constructor.elementProperties;if(o.size>0)for(const[a,i]of o){const{wrapped:l}=i,n=this[a];l!==!0||this._$AL.has(a)||n===void 0||this.C(a,void 0,i,n)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(o=>{var a;return(a=o.hostUpdate)==null?void 0:a.call(o)}),this.update(e)):this._$EM()}catch(o){throw t=!1,this._$EM(),o}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var o;return(o=s.hostUpdated)==null?void 0:o.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};O.elementStyles=[],O.shadowRootOptions={mode:"open"},O[N("elementProperties")]=new Map,O[N("finalized")]=new Map,J==null||J({ReactiveElement:O}),(w.reactiveElementVersions??(w.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const R=globalThis,pt=r=>r,q=R.trustedTypes,ht=q?q.createPolicy("lit-html",{createHTML:r=>r}):void 0,ut="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,gt="?"+k,jt=`<${gt}>`,E=document,I=()=>E.createComment(""),L=r=>r===null||typeof r!="object"&&typeof r!="function",Q=Array.isArray,Gt=r=>Q(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",tt=`[ 	
\f\r]`,B=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,mt=/-->/g,vt=/>/g,C=RegExp(`>|${tt}(?:([^\\s"'>=/]+)(${tt}*=${tt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ft=/'/g,xt=/"/g,$t=/^(?:script|style|textarea|title)$/i,Vt=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),m=Vt(1),T=Symbol.for("lit-noChange"),u=Symbol.for("lit-nothing"),_t=new WeakMap,z=E.createTreeWalker(E,129);function yt(r,t){if(!Q(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return ht!==void 0?ht.createHTML(t):t}const Wt=(r,t)=>{const e=r.length-1,s=[];let o,a=t===2?"<svg>":t===3?"<math>":"",i=B;for(let l=0;l<e;l++){const n=r[l];let p,h,c=-1,_=0;for(;_<n.length&&(i.lastIndex=_,h=i.exec(n),h!==null);)_=i.lastIndex,i===B?h[1]==="!--"?i=mt:h[1]!==void 0?i=vt:h[2]!==void 0?($t.test(h[2])&&(o=RegExp("</"+h[2],"g")),i=C):h[3]!==void 0&&(i=C):i===C?h[0]===">"?(i=o??B,c=-1):h[1]===void 0?c=-2:(c=i.lastIndex-h[2].length,p=h[1],i=h[3]===void 0?C:h[3]==='"'?xt:ft):i===xt||i===ft?i=C:i===mt||i===vt?i=B:(i=C,o=void 0);const A=i===C&&r[l+1].startsWith("/>")?" ":"";a+=i===B?n+jt:c>=0?(s.push(p),n.slice(0,c)+ut+n.slice(c)+k+A):n+k+(c===-2?l:A)}return[yt(r,a+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class D{constructor({strings:t,_$litType$:e},s){let o;this.parts=[];let a=0,i=0;const l=t.length-1,n=this.parts,[p,h]=Wt(t,e);if(this.el=D.createElement(p,s),z.currentNode=this.el.content,e===2||e===3){const c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(o=z.nextNode())!==null&&n.length<l;){if(o.nodeType===1){if(o.hasAttributes())for(const c of o.getAttributeNames())if(c.endsWith(ut)){const _=h[i++],A=o.getAttribute(c).split(k),Z=/([.?@])?(.*)/.exec(_);n.push({type:1,index:a,name:Z[2],strings:A,ctor:Z[1]==="."?Xt:Z[1]==="?"?Yt:Z[1]==="@"?Ft:X}),o.removeAttribute(c)}else c.startsWith(k)&&(n.push({type:6,index:a}),o.removeAttribute(c));if($t.test(o.tagName)){const c=o.textContent.split(k),_=c.length-1;if(_>0){o.textContent=q?q.emptyScript:"";for(let A=0;A<_;A++)o.append(c[A],I()),z.nextNode(),n.push({type:2,index:++a});o.append(c[_],I())}}}else if(o.nodeType===8)if(o.data===gt)n.push({type:2,index:a});else{let c=-1;for(;(c=o.data.indexOf(k,c+1))!==-1;)n.push({type:7,index:a}),c+=k.length-1}a++}}static createElement(t,e){const s=E.createElement("template");return s.innerHTML=t,s}}function U(r,t,e=r,s){var i,l;if(t===T)return t;let o=s!==void 0?(i=e._$Co)==null?void 0:i[s]:e._$Cl;const a=L(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==a&&((l=o==null?void 0:o._$AO)==null||l.call(o,!1),a===void 0?o=void 0:(o=new a(r),o._$AT(r,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=o:e._$Cl=o),o!==void 0&&(t=U(r,o._$AS(r,t.values),o,s)),t}class qt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,o=((t==null?void 0:t.creationScope)??E).importNode(e,!0);z.currentNode=o;let a=z.nextNode(),i=0,l=0,n=s[0];for(;n!==void 0;){if(i===n.index){let p;n.type===2?p=new j(a,a.nextSibling,this,t):n.type===1?p=new n.ctor(a,n.name,n.strings,this,t):n.type===6&&(p=new Zt(a,this,t)),this._$AV.push(p),n=s[++l]}i!==(n==null?void 0:n.index)&&(a=z.nextNode(),i++)}return z.currentNode=E,o}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class j{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,o){this.type=2,this._$AH=u,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=o,this._$Cv=(o==null?void 0:o.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=U(this,t,e),L(t)?t===u||t==null||t===""?(this._$AH!==u&&this._$AR(),this._$AH=u):t!==this._$AH&&t!==T&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Gt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==u&&L(this._$AH)?this._$AA.nextSibling.data=t:this.T(E.createTextNode(t)),this._$AH=t}$(t){var a;const{values:e,_$litType$:s}=t,o=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=D.createElement(yt(s.h,s.h[0]),this.options)),s);if(((a=this._$AH)==null?void 0:a._$AD)===o)this._$AH.p(e);else{const i=new qt(o,this),l=i.u(this.options);i.p(e),this.T(l),this._$AH=i}}_$AC(t){let e=_t.get(t.strings);return e===void 0&&_t.set(t.strings,e=new D(t)),e}k(t){Q(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,o=0;for(const a of t)o===e.length?e.push(s=new j(this.O(I()),this.O(I()),this,this.options)):s=e[o],s._$AI(a),o++;o<e.length&&(this._$AR(s&&s._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t!==this._$AB;){const o=pt(t).nextSibling;pt(t).remove(),t=o}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class X{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,o,a){this.type=1,this._$AH=u,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=a,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=u}_$AI(t,e=this,s,o){const a=this.strings;let i=!1;if(a===void 0)t=U(this,t,e,0),i=!L(t)||t!==this._$AH&&t!==T,i&&(this._$AH=t);else{const l=t;let n,p;for(t=a[0],n=0;n<a.length-1;n++)p=U(this,l[s+n],e,n),p===T&&(p=this._$AH[n]),i||(i=!L(p)||p!==this._$AH[n]),p===u?t=u:t!==u&&(t+=(p??"")+a[n+1]),this._$AH[n]=p}i&&!o&&this.j(t)}j(t){t===u?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Xt extends X{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===u?void 0:t}}class Yt extends X{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==u)}}class Ft extends X{constructor(t,e,s,o,a){super(t,e,s,o,a),this.type=5}_$AI(t,e=this){if((t=U(this,t,e,0)??u)===T)return;const s=this._$AH,o=t===u&&s!==u||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,a=t!==u&&(s===u||o);o&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Zt{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){U(this,t)}}const et=R.litHtmlPolyfillSupport;et==null||et(D,j),(R.litHtmlVersions??(R.litHtmlVersions=[])).push("3.3.3");const Jt=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let o=s._$litPart$;if(o===void 0){const a=(e==null?void 0:e.renderBefore)??null;s._$litPart$=o=new j(t.insertBefore(I(),a),a,void 0,e??{})}return o._$AI(r),o};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const S=globalThis;class G extends O{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Jt(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return T}}G._$litElement$=!0,G.finalized=!0,(wt=S.litElementHydrateSupport)==null||wt.call(S,{LitElement:G});const st=S.litElementPolyfillSupport;st==null||st({LitElement:G}),(S.litElementVersions??(S.litElementVersions=[])).push("4.2.2");function Kt({title:r=""}={}){return m`
    <div class="title-bar">
      <div class="window-controls">
        <button type="button" class="control close" aria-label="Close"></button>
        <button type="button" class="control minimize" aria-label="Minimize"></button>
        <button type="button" class="control maximize" aria-label="Maximize"></button>
      </div>
      <div class="title">${r}</div>
    </div>
  `}function Qt({tabs:r=[],activeTab:t=0,onTabClick:e=()=>{},tabGroups:s=[],onGroupToggle:o=()=>{}}={}){if(r.length===0)return m`
      <div class="tab-bar" role="tablist">
        <div class="tab placeholder" role="tab" aria-selected="false">
          <span class="tab-title"></span>
        </div>
      </div>
    `;const a=new Map(s.map(n=>[n.id,n])),i=new Set,l=[];for(let n=0;n<r.length;n++){const p=r[n],h=p.groupId?a.get(p.groupId):null;h&&!i.has(h.id)&&(i.add(h.id),l.push({kind:"group-label",group:h})),!(h!=null&&h.collapsed)&&l.push({kind:"tab",tab:p,index:n})}return m`
    <div class="tab-bar" role="tablist">
      ${l.map(n=>{if(n.kind==="group-label"){const{group:c}=n;return m`<div class="tab-group-label" role="button" tabindex="0" data-group-id="${c.id}" data-collapsed=${c.collapsed?"true":u} style="background-color: ${c.color}" @click=${()=>o(c.id)}>${c.label}</div>`}const{tab:p,index:h}=n;return m`
          <div
            class="tab ${h===t?"active":""}"
            role="tab"
            aria-selected="${h===t?"true":"false"}"
            data-index="${h}"
            @click=${()=>e(h)}
          >
            ${p.favicon?m`<img class="favicon" src="${p.favicon}" alt="" />`:""}
            <span class="tab-title">${p.title}</span>
          </div>
        `})}
    </div>
  `}function te({url:r=""}={}){return m`
    <div class="address-bar">
      <span class="address-bar-url">${r}</span>
    </div>
  `}function ee({toolbar:r=[],onIconClick:t=()=>{},activeId:e=null}={}){return m`
    <div class="toolbar" role="toolbar">
      ${r.map((s,o)=>m`
          <button
            type="button"
            class="toolbar-icon"
            data-index="${o}"
            data-id="${s.id}"
            aria-label="${s.title??""}"
            title="${s.title??""}"
            data-active=${s.active===!0||e!=null&&e===s.id?"true":u}
            @click=${()=>t(s,o)}
          >
            ${s.iconUrl?m`<img class="toolbar-icon-img" src="${s.iconUrl}" alt="" />`:m`<span class="toolbar-icon-glyph">${s.icon??""}</span>`}
            ${s.badge?m`<span class="toolbar-icon-badge">${s.badge}</span>`:""}
          </button>
        `)}
    </div>
  `}function se({onContextMenu:r}={}){return m`
    <div class="content-area" @contextmenu=${r??(()=>{})}>
      <slot></slot>
    </div>
  `}function oe({activeId:r=null}={}){return r?m`<div class="extension-popup" data-popup-id="${r}">
    <slot name="popup-${r}"></slot>
  </div>`:u}function re({toasts:r,onDismiss:t}){return r.length===0?u:m`<div class="toast-manager">
    ${r.map(e=>m`<div
          class="toast"
          data-toast-id="${e.id}"
          data-toast-type="${e.type}"
          @click="${()=>t==null?void 0:t(e.id)}"
        >
          ${e.message}
        </div>`)}
  </div>`}function ae({open:r,onClose:t}){return r?m`
    <aside class="side-panel" data-open="true" role="complementary" aria-label="Side panel">
      <button
        class="side-panel-close"
        type="button"
        aria-label="Close side panel"
        @click=${()=>t==null?void 0:t()}
      ></button>
      <slot name="side-panel"></slot>
    </aside>
  `:u}function ie({open:r,onClose:t}){return r?m`
    <div
      class="command-palette"
      data-open="true"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <button
        class="command-palette-close"
        type="button"
        aria-label="Close command palette"
        @click=${t}
      >
        ×
      </button>
      <slot name="command-palette"></slot>
    </div>
  `:u}function ne({open:r,x:t,y:e,onClose:s}={}){return r?m`
    <div
      .className=${"context-menu"}
      data-open="true"
      role="menu"
      aria-label="Context menu"
      style="top: ${e}px; left: ${t}px;"
    >
      <button
        .className=${"context-menu-close"}
        type="button"
        aria-label="Close context menu"
        @click=${()=>s==null?void 0:s()}
      >
        ×
      </button>
      <slot name="context-menu"></slot>
    </div>
  `:u}const le=3500;class Y extends G{constructor(){super();H(this,v);H(this,P);H(this,M);H(this,F,0);H(this,$);this.tabs=[],this.activeTab=0,this.toolbar=[],this.tabGroups=[],this.activePopupId=null,V(this,P,x(this,v,St).bind(this)),V(this,M,x(this,v,Mt).bind(this)),this._toasts=[],V(this,$,new Map),this.sidePanelOpen=!1,this.commandPaletteOpen=!1,this.contextMenuOpen=!1,this.contextMenuX=0,this.contextMenuY=0,this.bookmarks=[]}openCommandPalette(){this.commandPaletteOpen||(this.dispatchEvent(new CustomEvent("command-palette-toggle",{detail:{open:!0},bubbles:!0,composed:!0})),this.commandPaletteOpen=!0)}closeCommandPalette(){this.commandPaletteOpen&&(this.dispatchEvent(new CustomEvent("command-palette-toggle",{detail:{open:!1},bubbles:!0,composed:!0})),this.commandPaletteOpen=!1)}openContextMenu({x:e,y:s}){this.contextMenuOpen||(this.dispatchEvent(new CustomEvent("context-menu-toggle",{detail:{open:!0,x:e,y:s},bubbles:!0,composed:!0})),this.contextMenuX=e,this.contextMenuY=s,this.contextMenuOpen=!0)}closeContextMenu(){this.contextMenuOpen&&(this.dispatchEvent(new CustomEvent("context-menu-toggle",{detail:{open:!1,x:null,y:null},bubbles:!0,composed:!0})),this.contextMenuOpen=!1)}openSidePanel(){this.sidePanelOpen||(this.dispatchEvent(new CustomEvent("side-panel-toggle",{detail:{open:!0},bubbles:!0,composed:!0})),this.sidePanelOpen=!0)}closeSidePanel(){this.sidePanelOpen&&(this.dispatchEvent(new CustomEvent("side-panel-toggle",{detail:{open:!1},bubbles:!0,composed:!0})),this.sidePanelOpen=!1)}showToast(e,s){const o=At(this,F)._++,a=(s==null?void 0:s.type)??"info",i=(s==null?void 0:s.duration)??le,l={id:o,message:String(e??""),type:a};this._toasts=[...this._toasts,l];const n=setTimeout(()=>this.dismissToast(o),i);return f(this,$).set(o,n),o}dismissToast(e){f(this,$).has(e)&&(clearTimeout(f(this,$).get(e)),f(this,$).delete(e),this._toasts=this._toasts.filter(s=>s.id!==e))}connectedCallback(){super.connectedCallback(),this.activePopupId&&x(this,v,at).call(this),this.contextMenuOpen&&x(this,v,it).call(this)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("click",f(this,P)),document.removeEventListener("click",f(this,M));for(const e of f(this,$).values())clearTimeout(e);f(this,$).clear(),this._toasts=[]}updated(e){e.has("activePopupId")&&(this.activePopupId?x(this,v,at).call(this):document.removeEventListener("click",f(this,P))),e.has("contextMenuOpen")&&(this.contextMenuOpen?x(this,v,it).call(this):document.removeEventListener("click",f(this,M)))}render(){var e;return m`
      <div class="chrome">
        ${Kt()}
        ${Qt({tabs:this.tabs,activeTab:this.activeTab,onTabClick:s=>x(this,v,Et).call(this,s),tabGroups:this.tabGroups,onGroupToggle:s=>x(this,v,zt).call(this,s)})}
        <div class="nav-bar">
          <div class="nav-buttons">
            <button type="button" class="nav-button" aria-label="Back">
              <svg viewBox="0 0 24 24">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
              </svg>
            </button>
            <button type="button" class="nav-button" aria-label="Forward">
              <svg viewBox="0 0 24 24">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
              </svg>
            </button>
            <button type="button" class="nav-button" aria-label="Reload">
              <svg viewBox="0 0 24 24">
                <path
                  d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
                />
              </svg>
            </button>
          </div>
          ${te({url:((e=this.tabs[this.activeTab])==null?void 0:e.url)??""})}
          ${ee({toolbar:this.toolbar,onIconClick:(s,o)=>x(this,v,Ct).call(this,s,o),activeId:this.activePopupId})}
        </div>
        ${this.bookmarks.length>0?m`
              <div class="bookmarks-bar">
                ${this.bookmarks.map(s=>m`
                    <button type="button" class="bookmark" title="${s.url??""}">
                      ${s.icon?m`<span class="bookmark-icon">${s.icon}</span>`:""}
                      ${s.title??""}
                    </button>
                  `)}
              </div>
            `:""}
        ${se({onContextMenu:s=>x(this,v,Pt).call(this,s)})}
      </div>
      ${oe({activeId:this.activePopupId})}
      ${re({toasts:this._toasts,onDismiss:s=>this.dismissToast(s)})}
      ${ae({open:this.sidePanelOpen,onClose:()=>this.closeSidePanel()})}
      ${ie({open:this.commandPaletteOpen,onClose:()=>this.closeCommandPalette()})}
      ${ne({open:this.contextMenuOpen,x:this.contextMenuX,y:this.contextMenuY,onClose:()=>this.closeContextMenu()})}
    `}}return P=new WeakMap,M=new WeakMap,F=new WeakMap,$=new WeakMap,v=new WeakSet,Et=function(e){this.activeTab=e,this.dispatchEvent(new CustomEvent("tab-change",{detail:{index:e,tab:this.tabs[e]},bubbles:!0,composed:!0}))},Ct=function(e,s){this.dispatchEvent(new CustomEvent("toolbar-icon-click",{detail:{id:e.id,item:e,index:s},bubbles:!0,composed:!0})),this.activePopupId===e.id?this.activePopupId=null:this.activePopupId=e.id},zt=function(e){const s=this.tabGroups.find(a=>a.id===e);if(!s)return;const o=!s.collapsed;this.dispatchEvent(new CustomEvent("tab-group-toggle",{detail:{id:e,collapsed:o},bubbles:!0,composed:!0})),this.tabGroups=this.tabGroups.map(a=>a.id===e?{...a,collapsed:o}:a)},St=function(e){e.composedPath().includes(this)||(this.activePopupId=null)},at=function(){document.addEventListener("click",f(this,P))},it=function(){document.addEventListener("click",f(this,M))},Pt=function(e){e.preventDefault();const s=this.getBoundingClientRect(),o=e.clientX-s.left,a=e.clientY-s.top;this.openContextMenu({x:o,y:a})},Mt=function(e){var o;const s=(o=this.shadowRoot)==null?void 0:o.querySelector(".context-menu");s&&!e.composedPath().includes(s)&&this.closeContextMenu()},ot(Y,"properties",{tabs:{type:Array},activeTab:{type:Number},toolbar:{type:Array},tabGroups:{type:Array},activePopupId:{type:String},_toasts:{type:Array,state:!0},sidePanelOpen:{type:Boolean},commandPaletteOpen:{type:Boolean},contextMenuOpen:{type:Boolean},contextMenuX:{type:Number},contextMenuY:{type:Number},bookmarks:{type:Array}}),ot(Y,"styles",Tt`
    :host {
      display: block;
      position: relative;
      container-type: inline-size;
      container-name: browser-stage;
      --bs-chrome-bg: #f5f5f5;
      --bs-chrome-border: 1px solid #d0d0d0;
      --bs-chrome-radius: 8px;
      --bs-title-bar-bg: #e8e8e8;
      --bs-title-bar-height: 28px;
      --bs-title-color: #333;
      --bs-control-size: 12px;
      --bs-control-close: #ff5f57;
      --bs-control-minimize: #febc2e;
      --bs-control-maximize: #28c840;
      --bs-tab-bar-bg: #dedede;
      --bs-tab-bar-height: 36px;
      --bs-tab-bg: #cfcfcf;
      --bs-tab-active-bg: #f5f5f5;
      --bs-tab-color: #555;
      --bs-tab-active-color: #222;
      --bs-favicon-size: 16px;
      --bs-address-bar-bg: #ffffff;
      --bs-address-bar-height: 32px;
      --bs-address-bar-color: #555;
      --bs-address-bar-font-size: 13px;
      --bs-address-bar-padding: 0 12px;
      --bs-toolbar-bg: #ffffff;
      --bs-toolbar-height: 32px;
      --bs-toolbar-padding: 0 8px;
      --bs-toolbar-gap: 4px;
      --bs-toolbar-icon-size: 24px;
      --bs-toolbar-icon-bg: transparent;
      --bs-toolbar-icon-color: #333;
      --bs-toolbar-icon-hover-bg: #ececec;
      --bs-toolbar-badge-bg: #d32f2f;
      --bs-toolbar-badge-color: #ffffff;
      --bs-toolbar-badge-size: 12px;
      --bs-toolbar-badge-font-size: 9px;
      --bs-toolbar-badge-padding: 0 2px;
      --bs-toolbar-badge-radius: 6px;
      --bs-toolbar-badge-offset-top: 0;
      --bs-toolbar-badge-offset-right: 0;
      --bs-content-area-bg: #ffffff;
      --bs-content-area-min-height: 400px;
      --bs-content-area-padding: 0;
      --bs-tab-max-width-medium: 120px;
      --bs-tab-max-width-narrow: 80px;
      --bs-toolbar-icon-size-narrow: 20px;
      --bs-address-bar-font-size-narrow: 11px;
      --bs-title-bar-height-narrow: 20px;
      --bs-chrome-radius-narrow: 4px;
      --bs-popup-bg: #ffffff;
      --bs-popup-color: #222;
      --bs-popup-border: 1px solid #d0d0d0;
      --bs-popup-radius: 6px;
      /* prettier-ignore */
      --bs-popup-shadow: 0 4px 12px rgba(0,0,0,0.15);
      --bs-popup-width: 320px;
      --bs-popup-min-height: 200px;
      --bs-popup-padding: 12px;
      /* prettier-ignore */
      --bs-popup-top: calc(var(--bs-title-bar-height) + var(--bs-tab-bar-height) + var(--bs-address-bar-height) + var(--bs-toolbar-height));
      --bs-popup-right: 8px;
      --bs-popup-z-index: 10;
      --bs-toast-bg: #323232;
      --bs-toast-color: #ffffff;
      --bs-toast-border: none;
      --bs-toast-radius: 4px;
      /* prettier-ignore */
      --bs-toast-shadow: 0 2px 8px rgba(0,0,0,0.2);
      --bs-toast-padding: 12px 16px;
      --bs-toast-font-size: 13px;
      --bs-toast-min-width: 200px;
      --bs-toast-max-width: 360px;
      --bs-toast-gap: 8px;
      --bs-toast-bottom: 16px;
      --bs-toast-right: 16px;
      --bs-toast-z-index: 20;
      --bs-tab-group-label-color: #ffffff;
      --bs-tab-group-label-padding: 0 8px;
      --bs-tab-group-label-font-size: 11px;
      --bs-tab-group-label-radius: 4px;
      --bs-tab-group-label-height: 20px;
      --bs-tab-group-gap: 4px;
      --bs-side-panel-bg: #ffffff;
      --bs-side-panel-color: #222;
      --bs-side-panel-border: 1px solid #d0d0d0;
      --bs-side-panel-width: 320px;
      --bs-side-panel-padding: 12px;
      --bs-side-panel-top: 0;
      --bs-side-panel-bottom: 0;
      --bs-side-panel-z-index: 15;
      --bs-command-palette-bg: #ffffff;
      --bs-command-palette-color: #222;
      --bs-command-palette-border: 1px solid #d0d0d0;
      --bs-command-palette-radius: 8px;
      /* prettier-ignore */
      --bs-command-palette-shadow: 0 8px 24px rgba(0,0,0,0.18);
      --bs-command-palette-width: 480px;
      --bs-command-palette-padding: 16px;
      --bs-command-palette-z-index: 20;
      --bs-context-menu-bg: #ffffff;
      --bs-context-menu-color: #222;
      --bs-context-menu-border: 1px solid #d0d0d0;
      --bs-context-menu-radius: 6px;
      /* prettier-ignore */
      --bs-context-menu-shadow: 0 4px 12px rgba(0,0,0,0.15);
      --bs-context-menu-min-width: 180px;
      --bs-context-menu-padding: 4px 0;
      --bs-context-menu-z-index: 25;
      --bs-title-bar-border-bottom: none;
      --bs-tab-radius: 0;
      --bs-address-bar-url-bg: transparent;
      --bs-address-bar-url-radius: 0;
      --bs-address-bar-url-padding: 0;
      --bs-window-controls-gap: 6px;
      --bs-nav-button-size: 28px;
      --bs-nav-button-icon-size: 16px;
      --bs-nav-button-color: #555;
      --bs-nav-button-hover-bg: #ececec;
      --bs-nav-button-gap: 2px;
      --bs-nav-button-padding: 0 4px;
      --bs-bookmarks-bar-bg: #f5f5f5;
      --bs-bookmarks-bar-height: 28px;
      --bs-bookmarks-bar-padding: 0 12px;
      --bs-bookmarks-bar-font-size: 12px;
      --bs-bookmarks-bar-color: #555;
      --bs-bookmarks-bar-gap: 4px;
      --bs-bookmarks-bar-border-bottom: 1px solid #e0e0e0;
      --bs-bookmark-icon-size: 14px;
      --bs-bookmark-hover-bg: #e8e8e8;
      --bs-bookmark-radius: 4px;
      --bs-bookmark-padding: 4px 8px;
    }

    /* prettier-ignore */
    :host([theme="browserstage"]) {--bs-chrome-bg: #ececec; --bs-chrome-radius: 10px; --bs-title-bar-bg: #ececec; --bs-title-bar-border-bottom: 1px solid #d0d0d0; --bs-title-color: #333; --bs-window-controls-gap: 8px; --bs-tab-bar-bg: #d8d8d8; --bs-tab-bg: #cfcfcf; --bs-tab-active-bg: #f6f6f6; --bs-tab-color: #555; --bs-tab-active-color: #222; --bs-tab-radius: 8px 8px 0 0; --bs-tab-bar-height: 34px; --bs-address-bar-bg: #ececec; --bs-address-bar-url-bg: #ffffff; --bs-address-bar-url-radius: 16px; --bs-address-bar-url-padding: 4px 12px; --bs-address-bar-font-size: 12px; --bs-toolbar-bg: #ececec; --bs-toolbar-height: 30px; --bs-toolbar-badge-radius: 8px; --bs-nav-button-color: #444; --bs-nav-button-hover-bg: #d8d8d8; --bs-bookmarks-bar-bg: #ececec; --bs-bookmarks-bar-border-bottom: 1px solid #d0d0d0; --bs-bookmark-hover-bg: #d8d8d8;}

    .chrome {
      background: var(--bs-chrome-bg);
      border: var(--bs-chrome-border);
      border-radius: var(--bs-chrome-radius);
    }

    .title-bar {
      background: var(--bs-title-bar-bg);
      height: var(--bs-title-bar-height);
      display: flex;
      align-items: center;
      border-bottom: var(--bs-title-bar-border-bottom);
    }

    .title {
      color: var(--bs-title-color);
      flex: 1;
    }

    .window-controls {
      display: flex;
      align-items: center;
      gap: var(--bs-window-controls-gap);
      padding: 0 8px;
    }

    .control {
      width: var(--bs-control-size);
      height: var(--bs-control-size);
      border: none;
      border-radius: 50%;
      padding: 0;
      cursor: pointer;
    }

    .control.close {
      background: var(--bs-control-close);
    }

    .control.minimize {
      background: var(--bs-control-minimize);
    }

    .control.maximize {
      background: var(--bs-control-maximize);
    }

    .tab-bar {
      background: var(--bs-tab-bar-bg);
      height: var(--bs-tab-bar-height);
      display: flex;
      align-items: stretch;
    }

    .tab {
      background: var(--bs-tab-bg);
      color: var(--bs-tab-color);
      display: flex;
      align-items: center;
      padding: 0 12px;
      gap: 6px;
      cursor: pointer;
      user-select: none;
      border-radius: var(--bs-tab-radius);
    }

    .tab.active {
      background: var(--bs-tab-active-bg);
      color: var(--bs-tab-active-color);
    }

    .tab-group-label {
      color: var(--bs-tab-group-label-color);
      padding: var(--bs-tab-group-label-padding);
      font-size: var(--bs-tab-group-label-font-size);
      border-radius: var(--bs-tab-group-label-radius);
      height: var(--bs-tab-group-label-height);
      margin-right: var(--bs-tab-group-gap);
      display: flex;
      align-items: center;
      cursor: pointer;
      user-select: none;
    }

    .favicon {
      width: var(--bs-favicon-size);
      height: var(--bs-favicon-size);
    }

    .nav-bar {
      display: flex;
      align-items: center;
    }

    .nav-buttons {
      display: flex;
      align-items: center;
      gap: var(--bs-nav-button-gap);
      padding: var(--bs-nav-button-padding);
    }

    .nav-button {
      width: var(--bs-nav-button-size);
      height: var(--bs-nav-button-size);
      border: none;
      border-radius: 50%;
      background: transparent;
      color: var(--bs-nav-button-color);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }

    .nav-button:hover {
      background: var(--bs-nav-button-hover-bg);
    }

    .nav-button svg {
      width: var(--bs-nav-button-icon-size);
      height: var(--bs-nav-button-icon-size);
      fill: currentColor;
    }

    .bookmarks-bar {
      background: var(--bs-bookmarks-bar-bg);
      height: var(--bs-bookmarks-bar-height);
      padding: var(--bs-bookmarks-bar-padding);
      font-size: var(--bs-bookmarks-bar-font-size);
      color: var(--bs-bookmarks-bar-color);
      border-bottom: var(--bs-bookmarks-bar-border-bottom);
      display: flex;
      align-items: center;
      gap: var(--bs-bookmarks-bar-gap);
      overflow: hidden;
    }

    .bookmark {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: var(--bs-bookmark-padding);
      border-radius: var(--bs-bookmark-radius);
      cursor: pointer;
      white-space: nowrap;
      border: none;
      background: transparent;
      color: inherit;
      font-size: inherit;
    }

    .bookmark:hover {
      background: var(--bs-bookmark-hover-bg);
    }

    .bookmark-icon {
      display: inline-flex;
      width: var(--bs-bookmark-icon-size);
      height: var(--bs-bookmark-icon-size);
    }

    .address-bar {
      flex: 1;
      background: var(--bs-address-bar-bg);
      height: var(--bs-address-bar-height);
      padding: var(--bs-address-bar-padding);
      display: flex;
      align-items: center;
    }

    .address-bar-url {
      color: var(--bs-address-bar-color);
      font-size: var(--bs-address-bar-font-size);
      background: var(--bs-address-bar-url-bg);
      border-radius: var(--bs-address-bar-url-radius);
      padding: var(--bs-address-bar-url-padding);
    }

    .toolbar {
      background: var(--bs-toolbar-bg);
      height: var(--bs-toolbar-height);
      padding: var(--bs-toolbar-padding);
      display: flex;
      align-items: center;
      gap: var(--bs-toolbar-gap);
    }

    .toolbar-icon {
      width: var(--bs-toolbar-icon-size);
      height: var(--bs-toolbar-icon-size);
      background: var(--bs-toolbar-icon-bg);
      color: var(--bs-toolbar-icon-color);
      border: none;
      border-radius: 4px;
      padding: 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .toolbar-icon:hover {
      background: var(--bs-toolbar-icon-hover-bg);
    }

    .toolbar-icon-badge {
      background: var(--bs-toolbar-badge-bg);
      color: var(--bs-toolbar-badge-color);
      position: absolute;
      top: var(--bs-toolbar-badge-offset-top);
      right: var(--bs-toolbar-badge-offset-right);
      font-size: var(--bs-toolbar-badge-font-size);
      min-width: var(--bs-toolbar-badge-size);
      height: var(--bs-toolbar-badge-size);
      border-radius: var(--bs-toolbar-badge-radius);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--bs-toolbar-badge-padding);
    }

    .content-area {
      background: var(--bs-content-area-bg);
      min-height: var(--bs-content-area-min-height);
      padding: var(--bs-content-area-padding);
    }

    .extension-popup {
      position: absolute;
      top: var(--bs-popup-top);
      right: var(--bs-popup-right);
      width: var(--bs-popup-width);
      min-height: var(--bs-popup-min-height);
      z-index: var(--bs-popup-z-index);
      background: var(--bs-popup-bg);
      color: var(--bs-popup-color);
      border: var(--bs-popup-border);
      border-radius: var(--bs-popup-radius);
      box-shadow: var(--bs-popup-shadow);
      padding: var(--bs-popup-padding);
    }

    .toast-manager {
      position: absolute;
      bottom: var(--bs-toast-bottom);
      right: var(--bs-toast-right);
      z-index: var(--bs-toast-z-index);
      display: flex;
      flex-direction: column-reverse;
      gap: var(--bs-toast-gap);
    }

    .toast {
      background: var(--bs-toast-bg);
      color: var(--bs-toast-color);
      border: var(--bs-toast-border);
      border-radius: var(--bs-toast-radius);
      box-shadow: var(--bs-toast-shadow);
      padding: var(--bs-toast-padding);
      font-size: var(--bs-toast-font-size);
      min-width: var(--bs-toast-min-width);
      max-width: var(--bs-toast-max-width);
      cursor: pointer;
    }

    .side-panel {
      position: absolute;
      top: var(--bs-side-panel-top);
      bottom: var(--bs-side-panel-bottom);
      right: 0;
      width: var(--bs-side-panel-width);
      background: var(--bs-side-panel-bg);
      color: var(--bs-side-panel-color);
      border-left: var(--bs-side-panel-border);
      padding: var(--bs-side-panel-padding);
      z-index: var(--bs-side-panel-z-index);
      box-sizing: border-box;
      overflow-y: auto;
    }

    .side-panel-close {
      background: transparent;
      border: none;
      color: var(--bs-side-panel-color);
      cursor: pointer;
      position: absolute;
      top: 8px;
      right: 8px;
      width: 20px;
      height: 20px;
    }

    .side-panel-close::before {
      content: '×';
      font-size: 18px;
    }

    .command-palette {
      position: absolute;
      top: 15%;
      left: 50%;
      transform: translateX(-50%);
      width: var(--bs-command-palette-width);
      max-width: calc(100% - 32px);
      background: var(--bs-command-palette-bg);
      color: var(--bs-command-palette-color);
      border: var(--bs-command-palette-border);
      border-radius: var(--bs-command-palette-radius);
      box-shadow: var(--bs-command-palette-shadow);
      padding: var(--bs-command-palette-padding);
      z-index: var(--bs-command-palette-z-index);
      box-sizing: border-box;
    }

    .command-palette-close {
      background: transparent;
      border: none;
      color: var(--bs-command-palette-color);
      cursor: pointer;
      position: absolute;
      top: 8px;
      right: 8px;
      width: 20px;
      height: 20px;
      font-size: 18px;
      line-height: 1;
    }

    .context-menu {
      position: absolute;
      /* top / left set via inline style attribute */
      min-width: var(--bs-context-menu-min-width);
      background: var(--bs-context-menu-bg);
      color: var(--bs-context-menu-color);
      border: var(--bs-context-menu-border);
      border-radius: var(--bs-context-menu-radius);
      box-shadow: var(--bs-context-menu-shadow);
      padding: var(--bs-context-menu-padding);
      z-index: var(--bs-context-menu-z-index);
      box-sizing: border-box;
    }

    .context-menu-close {
      background: transparent;
      border: none;
      color: var(--bs-context-menu-color);
      cursor: pointer;
      position: absolute;
      top: 4px;
      right: 4px;
      width: 20px;
      height: 20px;
      font-size: 18px;
      line-height: 1;
    }

    /* breakpoints are hardcoded — CSS at-rule conditions cannot use var() */
    @container browser-stage (max-width: 799px) {
      .tab {
        max-width: var(--bs-tab-max-width-medium);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .address-bar-url {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .toolbar {
        flex-wrap: nowrap;
        overflow-x: auto;
      }
    }

    @container browser-stage (max-width: 479px) {
      .tab {
        max-width: var(--bs-tab-max-width-narrow);
      }

      .address-bar-url {
        font-size: var(--bs-address-bar-font-size-narrow);
      }

      .toolbar-icon {
        width: var(--bs-toolbar-icon-size-narrow);
        height: var(--bs-toolbar-icon-size-narrow);
      }

      .title-bar {
        height: var(--bs-title-bar-height-narrow);
      }

      .chrome {
        border-radius: var(--bs-chrome-radius-narrow);
      }

      .title {
        display: none;
      }
    }
  `),customElements.define("browser-stage",Y),d.BrowserStage=Y,Object.defineProperty(d,Symbol.toStringTag,{value:"Module"}),d})({});
