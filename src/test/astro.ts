import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { getContainerRenderer as reactRenderer } from "@astrojs/react/container-renderer";
import { JSDOM } from "jsdom";

type AstroComponent = Parameters<AstroContainer["renderToString"]>[0];

let container: Promise<AstroContainer> | undefined;

/**
 * Renders an .astro component to HTML as if requested at `path`, with the React renderer
 * loaded (lucide icons are React components). Astro components must render in the "node"
 * test environment, not jsdom.
 */
export async function renderAstro(
  component: AstroComponent,
  { path = "/", props = {} }: { path?: string; props?: Record<string, unknown> } = {}
): Promise<string> {
  container ??= loadRenderers([reactRenderer()]).then((renderers) => AstroContainer.create({ renderers }));
  return (await container).renderToString(component, {
    props,
    request: new Request(new URL(path, "https://ai2024-chi.vercel.app")),
  });
}

/** Parses rendered HTML into a queryable document. */
export function parseHtml(html: string): Document {
  return new JSDOM(html).window.document;
}
