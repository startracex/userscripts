// ==UserScript==
// @version            0.2.1
// @name               npmjs: more install commands
// @name:zh-CN         npmjs: 更多安装命令
// @description        Display more install commands on npmjs.
// @description:zh-CN  为 npmjs 网站添加更多安装命令.
// @match              https://www.npmjs.com/
// @match              https://www.npmjs.com/package/*
// @author             startracex
// @license            MIT
// @updateURL          https://raw.githubusercontent.com/startracex/userscripts/release/npmjs.js
// @downloadURL        https://raw.githubusercontent.com/startracex/userscripts/release/npmjs.js
// @namespace          https://github.com/startracex
// @homepage           https://github.com/startracex/userscripts/blob/main/packages/npmjs
// @homepageURL        https://github.com/startracex/userscripts/blob/main/packages/npmjs/README.md
// @supportURL         https://github.com/startracex/userscripts/issues
// ==/UserScript==
(function () {
  'use strict';

  const mainElement = document.querySelector("#main");
  const converters = [
  	(cmd) => cmd,
  	(cmd) => cmd.replace("npm", "pnpm"),
  	(cmd) => cmd.replace("npm i", "yarn add"),
  	(cmd) => cmd.replace("npm i", "bun add"),
  	(cmd) => cmd.replace("npm i ", "deno add npm:"),
  	(cmd) => cmd.replace("npm i ", "npx jsr add npm:")
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
  		button.addEventListener("click", () => {
  			navigator.clipboard.writeText(code.textContent).then(() => {
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
  		});
  		return element;
  	});
  	installElement.replaceWith(...moreElements);
  };
  if (mainElement) {
  	expandInstallElements();
  	const observer = new MutationObserver(expandInstallElements);
  	observer.observe(mainElement, { childList: true });
  }

})();
