[document.documentElement, document.body, ...document.body.children].forEach((e: HTMLElement) => {
  if (getComputedStyle(e).filter.includes("grayscale")) {
    e.style.filter = e.style.filter.replace(/\s*grayscale\s*\([^)]*\)\s*/gi, "").trim() || "none";
  }
});
