// ==UserScript==
// @name         Shiro Wang's npmjs extension
// @description  A user script to display more install commands on npmjs.
// @version      0.1.0
// @author       startracex
// @license      MIT
// @updateURL    https://raw.githubusercontent.com/startracex/userscripts/release/npmjs.js
// @downloadURL  https://raw.githubusercontent.com/startracex/userscripts/release/npmjs.js
// @homepage     https://github.com/startracex/userscripts/blob/main/packages/npmjs
// @homepageURL  https://github.com/startracex/userscripts/blob/main/packages/npmjs/README.md
// @supportURL   https://github.com/startracex/userscripts/issues
// @namespace    http://github.com/startracex
// @match        https://www.npmjs.com/
// @match        https://www.npmjs.com/package/*
// ==/UserScript==
(function(){"use strict";let e=document.querySelector(`#main`),t=[e=>e.replace(`npm`,`pnpm`),e=>e.replace(`npm i`,`yarn add`),e=>e.replace(`npm i`,`bun add`),e=>e.replace(`npm i`,`deno add`),e=>e.replace(`npm i`,`npx jsr add`)],n=()=>{let n=e.querySelector(`:scope > div > :nth-child(4) > h3 + div`);if(!n)return;let r=t.map(e=>{let t=n.cloneNode(!0),r=t.cloneNode(!0),i=r.querySelector(`code`);i.textContent=e(i.textContent);let a=r.querySelector(`button`);return a.addEventListener(`click`,async()=>{await navigator.clipboard.writeText(i.textContent);let e=document.createElement(`div`);e.className=`fixed top-0 pa3 ph5-ns tl z-999 w-100 flex flex-row justify-between`,e.textContent=`copied to clipboard`,e.style.borderBottom=`1px solid`,e.style.backgroundColor=`var(--color-bg-success)`,e.style.borderColor=`var(--color-border-success)`,e.style.color=`var(--color-fg-success)`,document.body.appendChild(e),setTimeout(()=>{e.remove()},2e3)}),r});n.after(...r)};if(e){n();let t=new MutationObserver(n);t.observe(e,{childList:!0})}})();
