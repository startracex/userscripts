// ==UserScript==
// @version            0.2.0
// @name               Remove black and white filter
// @name:zh-CN         清除黑白滤镜
// @description        Remove grayscale filter
// @description:zh-CN  清除 grayscale 滤镜
// @match              *://*/*
// @author             startracex
// @license            MIT
// @updateURL          https://raw.githubusercontent.com/startracex/userscripts/release/remove-grayscale.js
// @downloadURL        https://raw.githubusercontent.com/startracex/userscripts/release/remove-grayscale.js
// @namespace          https://github.com/startracex
// @homepage           https://github.com/startracex/userscripts/blob/main/packages/remove-grayscale
// @homepageURL        https://github.com/startracex/userscripts/blob/main/packages/remove-grayscale/README.md
// @supportURL         https://github.com/startracex/userscripts/issues
// ==/UserScript==
(function () {
  'use strict';

  [
  	document.documentElement,
  	document.body,
  	...document.body.children
  ].forEach((e) => {
  	if (getComputedStyle(e).filter.includes("grayscale")) {
  		e.style.filter = e.style.filter.replace(/\s*grayscale\s*\([^)]*\)\s*/gi, "").trim() || "none";
  	}
  });

})();
