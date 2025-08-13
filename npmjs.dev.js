// ==UserScript==
// @name         Shiro Wang's npmjs extension
// @description  A user script to display more install commands on npmjs.
// @version      0.1.0
// @author       startracex
// @license      MIT
// @updateURL    https://raw.githubusercontent.com/startracex/userscripts/release/npmjs.dev.js
// @downloadURL  https://raw.githubusercontent.com/startracex/userscripts/release/npmjs.dev.js
// @homepage     https://github.com/startracex/userscripts/blob/main/packages/npmjs
// @homepageURL  https://github.com/startracex/userscripts/blob/main/packages/npmjs/README.md
// @supportURL   https://github.com/startracex/userscripts/issues
// @namespace    http://github.com/startracex
// @match        https://www.npmjs.com/
// @match        https://www.npmjs.com/package/*
// ==/UserScript==
(function () {
  'use strict';

  const mainElement = document.querySelector("#main");
  const converters = [
  	(cmd) => cmd.replace("npm", "pnpm"),
  	(cmd) => cmd.replace("npm i", "yarn add"),
  	(cmd) => cmd.replace("npm i", "bun add"),
  	(cmd) => cmd.replace("npm i", "deno add"),
  	(cmd) => cmd.replace("npm i", "npx jsr add")
  ];
  const expandInstallElements = () => {
  	const installElement = mainElement.querySelector(":scope > div > :nth-child(4) > h3 + div");
  	if (!installElement) {
  		return;
  	}
  	const moreElements = converters.map((convert) => {
  		const cloneElement = installElement.cloneNode(true);
  		const element = cloneElement.cloneNode(true);
  		const code = element.querySelector("code");
  		code.textContent = convert(code.textContent);
  		const button = element.querySelector("button");
  		button.addEventListener("click", async () => {
  			await navigator.clipboard.writeText(code.textContent);
  			const banner = document.createElement("div");
  			banner.className = "fixed top-0 pa3 ph5-ns tl z-999 w-100 flex flex-row justify-between";
  			banner.textContent = "copied to clipboard";
  			banner.style.borderBottom = "1px solid";
  			banner.style.backgroundColor = "var(--color-bg-success)";
  			banner.style.borderColor = "var(--color-border-success)";
  			banner.style.color = "var(--color-fg-success)";
  			document.body.appendChild(banner);
  			setTimeout(() => {
  				banner.remove();
  			}, 2e3);
  		});
  		return element;
  	});
  	installElement.after(...moreElements);
  };
  if (mainElement) {
  	expandInstallElements();
  	const observer = new MutationObserver(expandInstallElements);
  	observer.observe(mainElement, { childList: true });
  }

})();
