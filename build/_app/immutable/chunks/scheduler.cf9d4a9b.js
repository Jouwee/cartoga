function S(){}function C(n,t){for(const e in t)n[e]=t[e];return n}function P(n){return n()}function J(){return Object.create(null)}function q(n){n.forEach(P)}function K(n){return typeof n=="function"}function Q(n,t){return n!=n?t==t:n!==t||n&&typeof n=="object"||typeof n=="function"}function R(n){return Object.keys(n).length===0}function B(n,...t){if(n==null){for(const i of t)i(void 0);return S}const e=n.subscribe(...t);return e.unsubscribe?()=>e.unsubscribe():e}function V(n,t,e){n.$$.on_destroy.push(B(t,e))}function X(n,t,e,i){if(n){const c=w(n,t,e,i);return n[0](c)}}function w(n,t,e,i){return n[1]&&i?C(e.ctx.slice(),n[1](i(t))):e.ctx}function Y(n,t,e,i){if(n[2]&&i){const c=n[2](i(e));if(t.dirty===void 0)return c;if(typeof c=="object"){const s=[],l=Math.max(t.dirty.length,c.length);for(let u=0;u<l;u+=1)s[u]=t.dirty[u]|c[u];return s}return t.dirty|c}return t.dirty}function Z(n,t,e,i,c,s){if(c){const l=w(t,e,i,s);n.p(l,c)}}function $(n){if(n.ctx.length>32){const t=[],e=n.ctx.length/32;for(let i=0;i<e;i++)t[i]=-1;return t}return-1}let m=!1;function nn(){m=!0}function tn(){m=!1}function I(n,t,e,i){for(;n<t;){const c=n+(t-n>>1);e(c)<=i?n=c+1:t=c}return n}function L(n){if(n.hydrate_init)return;n.hydrate_init=!0;let t=n.childNodes;if(n.nodeName==="HEAD"){const r=[];for(let o=0;o<t.length;o++){const a=t[o];a.claim_order!==void 0&&r.push(a)}t=r}const e=new Int32Array(t.length+1),i=new Int32Array(t.length);e[0]=-1;let c=0;for(let r=0;r<t.length;r++){const o=t[r].claim_order,a=(c>0&&t[e[c]].claim_order<=o?c+1:I(1,c,j=>t[e[j]].claim_order,o))-1;i[r]=e[a]+1;const k=a+1;e[k]=r,c=Math.max(k,c)}const s=[],l=[];let u=t.length-1;for(let r=e[c]+1;r!=0;r=i[r-1]){for(s.push(t[r-1]);u>=r;u--)l.push(t[u]);u--}for(;u>=0;u--)l.push(t[u]);s.reverse(),l.sort((r,o)=>r.claim_order-o.claim_order);for(let r=0,o=0;r<l.length;r++){for(;o<s.length&&l[r].claim_order>=s[o].claim_order;)o++;const a=o<s.length?s[o]:null;n.insertBefore(l[r],a)}}function M(n,t){if(m){for(L(n),(n.actual_end_child===void 0||n.actual_end_child!==null&&n.actual_end_child.parentNode!==n)&&(n.actual_end_child=n.firstChild);n.actual_end_child!==null&&n.actual_end_child.claim_order===void 0;)n.actual_end_child=n.actual_end_child.nextSibling;t!==n.actual_end_child?(t.claim_order!==void 0||t.parentNode!==n)&&n.insertBefore(t,n.actual_end_child):n.actual_end_child=t.nextSibling}else(t.parentNode!==n||t.nextSibling!==null)&&n.appendChild(t)}function en(n,t,e){m&&!e?M(n,t):(t.parentNode!==n||t.nextSibling!=e)&&n.insertBefore(t,e||null)}function cn(n){n.parentNode&&n.parentNode.removeChild(n)}function ln(n,t){for(let e=0;e<n.length;e+=1)n[e]&&n[e].d(t)}function O(n){return document.createElement(n)}function x(n){return document.createTextNode(n)}function rn(){return x(" ")}function un(){return x("")}function sn(n,t,e,i){return n.addEventListener(t,e,i),()=>n.removeEventListener(t,e,i)}function on(n,t,e){e==null?n.removeAttribute(t):n.getAttribute(t)!==e&&n.setAttribute(t,e)}function an(n){return n.dataset.svelteH}function fn(n){return n===""?null:+n}function _n(n){return Array.from(n.childNodes)}function T(n){n.claim_info===void 0&&(n.claim_info={last_index:0,total_claimed:0})}function N(n,t,e,i,c=!1){T(n);const s=(()=>{for(let l=n.claim_info.last_index;l<n.length;l++){const u=n[l];if(t(u)){const r=e(u);return r===void 0?n.splice(l,1):n[l]=r,c||(n.claim_info.last_index=l),u}}for(let l=n.claim_info.last_index-1;l>=0;l--){const u=n[l];if(t(u)){const r=e(u);return r===void 0?n.splice(l,1):n[l]=r,c?r===void 0&&n.claim_info.last_index--:n.claim_info.last_index=l,u}}return i()})();return s.claim_order=n.claim_info.total_claimed,n.claim_info.total_claimed+=1,s}function D(n,t,e,i){return N(n,c=>c.nodeName===t,c=>{const s=[];for(let l=0;l<c.attributes.length;l++){const u=c.attributes[l];e[u.name]||s.push(u.name)}s.forEach(l=>c.removeAttribute(l))},()=>i(t))}function dn(n,t,e){return D(n,t,e,O)}function H(n,t){return N(n,e=>e.nodeType===3,e=>{const i=""+t;if(e.data.startsWith(i)){if(e.data.length!==i.length)return e.splitText(i.length)}else e.data=i},()=>x(t),!0)}function hn(n){return H(n," ")}function mn(n,t){t=""+t,n.data!==t&&(n.data=t)}function pn(n,t){n.value=t??""}function bn(n,t,e,i){e==null?n.style.removeProperty(t):n.style.setProperty(t,e,i?"important":"")}function yn(n,t,e){for(let i=0;i<n.options.length;i+=1){const c=n.options[i];if(c.__value===t){c.selected=!0;return}}(!e||t!==void 0)&&(n.selectedIndex=-1)}function gn(n){const t=n.querySelector(":checked");return t&&t.__value}function xn(n,t,e){n.classList.toggle(t,!!e)}function z(n,t,{bubbles:e=!1,cancelable:i=!1}={}){return new CustomEvent(n,{detail:t,bubbles:e,cancelable:i})}function vn(n,t){return new n(t)}let h;function p(n){h=n}function v(){if(!h)throw new Error("Function called outside component initialization");return h}function kn(n){v().$$.on_mount.push(n)}function En(n){v().$$.after_update.push(n)}function wn(){const n=v();return(t,e,{cancelable:i=!1}={})=>{const c=n.$$.callbacks[t];if(c){const s=z(t,e,{cancelable:i});return c.slice().forEach(l=>{l.call(n,s)}),!s.defaultPrevented}return!0}}const d=[],E=[];let _=[];const y=[],A=Promise.resolve();let g=!1;function F(){g||(g=!0,A.then(W))}function Nn(){return F(),A}function U(n){_.push(n)}function An(n){y.push(n)}const b=new Set;let f=0;function W(){if(f!==0)return;const n=h;do{try{for(;f<d.length;){const t=d[f];f++,p(t),G(t.$$)}}catch(t){throw d.length=0,f=0,t}for(p(null),d.length=0,f=0;E.length;)E.pop()();for(let t=0;t<_.length;t+=1){const e=_[t];b.has(e)||(b.add(e),e())}_.length=0}while(d.length);for(;y.length;)y.pop()();g=!1,b.clear(),p(n)}function G(n){if(n.fragment!==null){n.update(),q(n.before_update);const t=n.dirty;n.dirty=[-1],n.fragment&&n.fragment.p(n.ctx,t),n.after_update.forEach(U)}}function jn(n){const t=[],e=[];_.forEach(i=>n.indexOf(i)===-1?t.push(i):e.push(i)),e.forEach(i=>i()),_=t}export{an as A,xn as B,sn as C,q as D,wn as E,ln as F,pn as G,fn as H,gn as I,U as J,yn as K,An as L,J as M,W as N,K as O,R as P,jn as Q,h as R,p as S,P as T,d as U,F as V,nn as W,tn as X,rn as a,En as b,hn as c,cn as d,un as e,O as f,dn as g,_n as h,en as i,on as j,bn as k,x as l,H as m,mn as n,kn as o,E as p,vn as q,X as r,Q as s,Nn as t,Z as u,$ as v,Y as w,M as x,S as y,V as z};