import { readFile, readdir, access } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { runInNewContext } from "node:vm";
const root = resolve("dist");
const files = await readdir(root);
for (const file of files.filter((name) => name.endsWith(".js"))) {
  const result = spawnSync(process.execPath, ["--check", resolve(root, file)], {
    encoding: "utf8",
  });
  if (result.status !== 0)
    throw new Error(result.stderr || `Syntax check failed: ${file}`);
}
console.log("JavaScript syntax checks passed.");
if (process.argv.includes("--syntax-only")) process.exit(0);
let checked = 0;
for (const file of files.filter((name) => name.endsWith(".html"))) {
  const html = await readFile(resolve(root, file), "utf8");
  const references = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  for (const match of html.matchAll(/srcset=["']([^"']+)["']/g))
    references.push(
      ...match[1].split(",").map((value) => value.trim().split(/\s+/)[0]),
    );
  for (const ref of references) {
    if (/^(?:https?:|mailto:|tel:|data:|#)/.test(ref)) continue;
    if (ref.startsWith("/"))
      throw new Error(`Root-relative asset breaks project Pages URL: ${ref}`);
    await access(resolve(dirname(resolve(root, file)), ref.split(/[?#]/)[0]));
    checked += 1;
  }
}
for (const name of ["ha-long", "hoi-an", "sa-pa", "da-lat"]) {
  for (const width of [480, 960, 1280])
    await access(resolve(root, "assets", `${name}-${width}.webp`));
}
const html = await readFile(resolve(root, "index.html"), "utf8");
const design = await readFile(resolve(root, "design.css"), "utf8");
for (const role of [
  "meta",
  "ui",
  "body",
  "lead",
  "title",
  "section",
  "display",
]) {
  if (!design.includes(`--type-${role}:`))
    throw new Error(`Missing typography role: ${role}`);
}
if (/font-size:\s*[^;]*\d+(?:\.\d+)?px/.test(design))
  throw new Error("Font sizes must use shared relative typography tokens.");
if (!html.includes("GoEase") || !html.includes("Just go."))
  throw new Error("Brand invariant missing.");
if (/<iframe\b/.test(html))
  throw new Error("Website introduction must not contain a Facebook iframe.");
if ((html.match(/class="community-post"/g) || []).length !== 1)
  throw new Error("Exactly one website introduction is required.");
if ((html.match(/<dialog\b/g) || []).length !== 1)
  throw new Error("Expected exactly one download modal.");
if (!html.includes("Just go. We'll plan."))
  throw new Error("Exact official slogan missing.");
if (!/<meta\s+name="color-scheme"\s+content="light"/.test(html))
  throw new Error("Light-only theme invariant missing.");
const ids = new Set(
  [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]),
);
for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) {
  if (!ids.has(id)) throw new Error(`Broken page or SVG anchor: #${id}`);
}
const catalogueSource = await readFile(resolve(root, "app.js"), "utf8");
const catalogue = runInNewContext(
  catalogueSource.split("const nodes =")[0] + "\nen",
);
const translationKeys = new Set(
  [...html.matchAll(/data-i18n(?:-alt|-aria|-title)?="([^"]+)"/g)].map(
    (match) => match[1],
  ),
);
for (const key of translationKeys) {
  if (typeof catalogue[key] !== "string" || !catalogue[key].trim())
    throw new Error(`Missing English translation: ${key}`);
}
if (
  !html.includes("https://www.facebook.com/profile.php?id=61594839483458") ||
  !html.includes('id="goease-intro-post"')
)
  throw new Error("Official Facebook link or website introduction missing.");
if (
  (html.match(/role="tab"/g) || []).length !== 3 ||
  (html.match(/role="tabpanel"/g) || []).length !== 3
)
  throw new Error("Three guide tabs and panels required.");
console.log(
  `Brand, light theme, anchors, ${translationKeys.size} translations and product guide contracts passed.`,
);
console.log(
  `Static production artifact ready in dist: ${checked} local references verified. Run npm run build to regenerate the WebGL bundle before publication.`,
);
