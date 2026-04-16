import fs from "node:fs";
import path from "node:path";

import PageEnhancer from "./page-enhancer";

function getSourceMarkup() {
  const filePath = path.join(process.cwd(), "page.html");
  const raw = fs.readFileSync(filePath, "utf8");
  const bodyMatch = raw.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

  let html = bodyMatch?.[1] ?? raw;

  html = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(
      /<span class="__cf_email__"[\s\S]*?<\/span>/gi,
      "info@mook-group.de",
    )
    .replace(
      /href="\/cdn-cgi\/l\/email-protection#[^"]*"/gi,
      'href="mailto:info@mook-group.de"',
    )
    .replace(/\b(href|src)="\/(?!\/)/gi, '$1="https://stksteakhouse.com/')
    .replace(/ data-cfemail="[^"]*"/gi, "")
    .replace(/ï¿½/g, "'")
    .replace(/\r?\n+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

  return html;
}

export default function HomePage() {
  const html = getSourceMarkup();

  return (
    <>
      <div
        id="stk-clone"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <PageEnhancer />
    </>
  );
}
