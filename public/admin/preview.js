// Blog post preview for Sveltia CMS that renders maths the way the site does (KaTeX).
// Sveltia's built-in preview has no maths support. Loaded by /admin/index.html after the CMS,
// /vendor/marked/marked.umd.js and /vendor/katex/katex.min.js (copied by scripts/copy-vendor.mjs).
(function () {
  "use strict";

  var PLACEHOLDER = /<p>@@MATH(\d+)@@<\/p>|@@MATH(\d+)@@/g;

  /**
   * Markdown → HTML with $inline$ and $$display$$ maths rendered by KaTeX. Maths is swapped for
   * placeholders before Markdown parsing, so backslashes, * and _ inside it survive untouched.
   * Dollar signs inside code blocks and inline code are left alone.
   */
  function renderMarkdownWithMath(markdown, marked, katex) {
    var math = [];
    var keep = function (tex, display) {
      math.push({ tex: tex, display: display });
      return "@@MATH" + (math.length - 1) + "@@";
    };
    // Odd indices are code (fenced blocks or inline code spans), kept verbatim.
    var parts = String(markdown == null ? "" : markdown).split(/(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`)/g);
    var source = parts
      .map(function (part, i) {
        if (i % 2 === 1) return part;
        return part
          .replace(/\$\$([\s\S]+?)\$\$/g, function (_, tex) {
            return "\n\n" + keep(tex, true) + "\n\n";
          })
          // Inline: $...$ not preceded by a backslash (an escaped \$ is a literal dollar sign).
          .replace(/(^|[^\\$])\$(?!\s)([^$\n]+?)(?<!\s)\$(?!\d)/g, function (_, before, tex) {
            return before + keep(tex, false);
          });
      })
      .join("");

    var html = marked.parse(source, { async: false });
    return html.replace(PLACEHOLDER, function (_, block, inline) {
      var item = math[Number(block != null ? block : inline)];
      if (!item) return "";
      return katex.renderToString(item.tex, { displayMode: item.display, throwOnError: false });
    });
  }

  globalThis.renderMarkdownWithMath = renderMarkdownWithMath;

  var CMS = globalThis.CMS;
  var h = globalThis.h;
  if (!CMS || !h || !globalThis.marked || !globalThis.katex) return;

  CMS.registerPreviewStyle("/vendor/katex/katex.min.css");
  CMS.registerPreviewStyle("/admin/preview.css");

  /** Images next to the post are referenced by file name; ask the CMS for a displayable URL. */
  function resolveImages(html, getAsset) {
    if (typeof getAsset !== "function") return html;
    return html.replace(/(<img[^>]*\ssrc=")([^"]+)(")/g, function (match, start, src, end) {
      if (/^(https?:|data:|blob:|\/)/.test(src)) return match;
      try {
        var url = String(getAsset(src));
        return /^(https?:|data:|blob:|\/)/.test(url) ? start + url + end : match;
      } catch (e) {
        return match;
      }
    });
  }

  function PostPreview(props) {
    var get = function (key) {
      return props.entry.getIn(["data", key]);
    };
    var body = resolveImages(renderMarkdownWithMath(get("body") || "", globalThis.marked, globalThis.katex), props.getAsset);
    return h(
      "article",
      { className: "post-preview" },
      h("h1", null, get("title") || "Untitled"),
      get("description") ? h("p", { className: "post-preview-description" }, get("description")) : null,
      h("div", { className: "post-preview-body", dangerouslySetInnerHTML: { __html: body } })
    );
  }

  CMS.registerPreviewTemplate("blog", PostPreview);
})();
