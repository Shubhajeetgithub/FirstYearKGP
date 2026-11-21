// Generates the social preview image (public/og.png) and small favicons from public/ai.png.
// Run with `npm run images` after changing the title or the logo; the outputs are committed.
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const root = new URL("../", import.meta.url);
const path = (p) => fileURLToPath(new URL(p, root));
const font = (weight) => readFile(path(`node_modules/@fontsource/inter/files/inter-latin-${weight}-normal.woff`));

// satori takes React-element-shaped objects; plain objects avoid needing JSX here.
const h = (type, style, children) => ({ type, props: { style, children } });

async function og() {
  const tree = h(
    "div",
    {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "0 96px",
      background: "#07070a",
      backgroundImage:
        "radial-gradient(circle at 15% 10%, rgba(79,70,229,0.28), transparent 45%), radial-gradient(circle at 90% 95%, rgba(147,51,234,0.25), transparent 45%)",
      fontFamily: "Inter",
    },
    [
      h(
        "div",
        {
          display: "flex",
          alignSelf: "flex-start",
          padding: "10px 22px",
          borderRadius: 999,
          border: "2px solid rgba(99,102,241,0.35)",
          background: "rgba(99,102,241,0.12)",
          color: "#a5b4fc",
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: 3,
          textTransform: "uppercase",
        },
        "Department of Artificial Intelligence · IIT Kharagpur"
      ),
      h("div", { display: "flex", marginTop: 40, color: "#ffffff", fontSize: 76, fontWeight: 800 }, "Academic Archive"),
      h(
        "div",
        {
          display: "flex",
          fontSize: 116,
          fontWeight: 800,
          lineHeight: 1.1,
          backgroundImage: "linear-gradient(90deg, #818cf8, #c084fc 55%, #60a5fa)",
          backgroundClip: "text",
          color: "transparent",
        },
        "AI Batch 2024"
      ),
      h(
        "div",
        { display: "flex", marginTop: 36, color: "#94a3b8", fontSize: 34, fontWeight: 400 },
        "Student-maintained notes and study material"
      ),
    ]
  );

  const svg = await satori(tree, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Inter", data: await font(400), weight: 400, style: "normal" },
      { name: "Inter", data: await font(700), weight: 700, style: "normal" },
      { name: "Inter", data: await font(800), weight: 800, style: "normal" },
    ],
  });
  await writeFile(path("public/og.png"), new Resvg(svg).render().asPng());
}

/** Downscales the 1024px logo by drawing it into an SVG of the target size. */
async function icon(size, out) {
  const logo = (await readFile(path("public/ai.png"))).toString("base64");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${size}" height="${size}" viewBox="0 0 1024 1024"><image width="1024" height="1024" xlink:href="data:image/png;base64,${logo}"/></svg>`;
  const png = new Resvg(svg, { fitTo: { mode: "width", value: size } }).render().asPng();
  await writeFile(path(out), png);
}

await og();
await icon(48, "public/favicon.png");
await icon(180, "public/apple-touch-icon.png");
console.log("Wrote public/og.png, public/favicon.png, public/apple-touch-icon.png");
