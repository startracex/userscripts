const mainElement = document.querySelector("#main");
const converters: ((cmd: string) => string)[] = [
  (cmd) => cmd,
  (cmd) => cmd.replace("npm", "pnpm"),
  (cmd) => cmd.replace("npm i", "yarn add"),
  (cmd) => cmd.replace("npm i", "bun add"),
  (cmd) => cmd.replace("npm i", "deno add"),
  (cmd) => cmd.replace("npm i ", "npx jsr add npm:"),
];

const expandInstallElements = () => {
  const installElement = mainElement.querySelector(":scope > div > :nth-child(4) > h3 + div");

  if (!installElement) {
    return;
  }

  const moreElements = converters.map((convert) => {
    const cloneElement = installElement.cloneNode(true) as HTMLElement;
    const element = cloneElement.cloneNode(true) as HTMLElement;
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
      }, 2000);
    });
    return element;
  });

  installElement.replaceWith(...moreElements);
};

if (mainElement) {
  expandInstallElements();
  const observer = new MutationObserver(expandInstallElements);

  observer.observe(mainElement, {
    childList: true,
  });
}
