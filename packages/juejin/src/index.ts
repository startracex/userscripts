import { createLogFactory } from "@userscripts/shared/log";
import { waitForQuery } from "@userscripts/shared/query";
import emojiRegex from "emoji-regex";
import { block } from "./block.ts";

const info = createLogFactory({
  level: "INFO",
  backgroundColor: "#2196F3",
  textColor: "#ffffff",
});

const emojiRe = emojiRegex();

const executeHide = (item: HTMLLIElement) => {
  const title = item.querySelector(".jj-link").getAttribute("title");
  if (!title) {
    return;
  }
  for (const b of block) {
    if (b.test(title.replace(emojiRe, ""))) {
      item.style.display = "none";
      info`${title} has been hidden because it matches ${b}`;
      break;
    }
  }
};

[
  {
    matches: /^\/(backend|frontend|android|ios|ai|freebie|career|article)(\/.*)?$|^\/$/,
    handler: () => {
      waitForQuery(
        () => document.querySelector(".entry-list"),
        (list) => {
          [...list.children].forEach(executeHide);
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                  executeHide(node as HTMLLIElement);
                }
              });
            });
          });
          observer.observe(list, { childList: true });
        },
        250,
      );
    },
  },
  {
    matches: /^\/post\/.*$/,
    handler: () => {
      waitForQuery(
        () => document.querySelector(`.entry-list.recommended-entry-list`),
        (list) => {
          [...list.children].forEach(executeHide);
        },
        250,
      );
      const styleElement = document.createElement("style");
      styleElement.textContent = ".author-info-block + img { display:none !important }";
      document.head.appendChild(styleElement);
    },
  },
].forEach((sc) => {
  const matches = Array.isArray(sc.matches) ? sc.matches : [sc.matches];
  if (matches.some((match) => match.test(location.pathname))) {
    sc.handler();
  }
});

waitForQuery(
  () => document.querySelector<HTMLElement>(".global-banner-close"),
  (e) => {
    e.click();
  },
  250,
);

const styleElement = document.createElement("style");
styleElement.textContent = `
.banner-block:has(.close-btn) { display:none }
.bottom-login-guide { display:none !important }
`;
document.head.appendChild(styleElement);
