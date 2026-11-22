// Previews for Sveltia CMS that look like the live site: dark theme, the post header (badges, tags,
// authors, date, reading time), the cover image, and maths rendered with KaTeX like the site does.
// Sveltia's built-in preview has no maths support and doesn't know the site's layout.
// Loaded by /admin/index.html after the CMS, /vendor/marked/marked.umd.js and
// /vendor/katex/katex.min.js (copied by scripts/copy-vendor.mjs).
(function () {
  "use strict";

  var PLACEHOLDER = /<p>@@MATH(\d+)@@<\/p>|@@MATH(\d+)@@/g;
  var URL_LIKE = /^(https?:|data:|blob:|\/)/;

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

  /**
   * Whole minutes to read, at least 1, at about 200 words a minute. Like the site
   * (src/lib/readingTime.ts), only prose counts: code, maths, images and HTML are left out.
   */
  function minutesToRead(markdown) {
    var prose = String(markdown || "")
      .replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, " ")
      .replace(/\$\$[\s\S]+?\$\$/g, " ")
      .replace(/(^|[^\\$])\$(?!\s)[^$\n]+?(?<!\s)\$(?!\d)/g, "$1 ")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/<[^>]+>/g, " ");
    var words = prose.split(/\s+/).filter(function (w) {
      return /[\p{L}\p{N}]/u.test(w);
    }).length;
    return Math.max(1, Math.round(words / 200));
  }

  /** "shubhajeet-das" → "Shubhajeet Das", for when the author's profile isn't at hand. */
  function nameFromId(id) {
    return String(id)
      .split(/[-_]+/)
      .filter(Boolean)
      .map(function (w) {
        return w.charAt(0).toUpperCase() + w.slice(1);
      })
      .join(" ");
  }

  function formatDate(value) {
    if (!value) return "";
    var date = new Date(value);
    if (isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(date);
  }

  /** A displayable URL for an image next to the post, or undefined while the CMS is still loading it. */
  function assetUrl(src, getAsset) {
    if (!src) return undefined;
    if (URL_LIKE.test(src)) return src;
    if (typeof getAsset !== "function") return undefined;
    try {
      var url = String(getAsset(src));
      return URL_LIKE.test(url) ? url : undefined;
    } catch (e) {
      return undefined;
    }
  }

  /**
   * Points images at the CMS's copies. An image the CMS hasn't resolved yet keeps no src (so the
   * browser doesn't request a wrong URL); the preview re-renders once it is ready.
   */
  function resolveImages(html, getAsset) {
    return html.replace(/<img([^>]*?)\ssrc="([^"]*)"/g, function (match, attrs, src) {
      var url = assetUrl(src, getAsset);
      return url ? "<img" + attrs + ' src="' + url + '"' : "<img" + attrs + ' data-pending-src="' + src + '"';
    });
  }

  /** External links open in a new tab, as on the site. */
  function externalLinks(html) {
    return html.replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"');
  }

  globalThis.renderMarkdownWithMath = renderMarkdownWithMath;
  globalThis.blogPreviewHelpers = { minutesToRead: minutesToRead, nameFromId: nameFromId, formatDate: formatDate, resolveImages: resolveImages, externalLinks: externalLinks };

  var CMS = globalThis.CMS;
  var h = globalThis.h;
  if (!CMS || !h || !globalThis.marked || !globalThis.katex) return;

  CMS.registerPreviewStyle("/vendor/katex/katex.min.css");
  CMS.registerPreviewStyle("/admin/preview.css");

  /** Reads a value from the entry (an Immutable map), as a plain JS value. */
  function reader(entry) {
    return function (key) {
      var value = entry.getIn(["data", key]);
      return value && typeof value.toJS === "function" ? value.toJS() : value;
    };
  }

  function list(value) {
    if (value == null || value === "") return [];
    return (Array.isArray(value) ? value : [value]).filter(function (v) {
      return v != null && v !== "";
    });
  }

  function PostPreview(props) {
    var get = reader(props.entry);
    var body = get("body") || "";
    var tags = list(get("tags"));
    var authors = list(get("author")).map(nameFromId);
    var cover = assetUrl(get("cover"), props.getAsset);
    var html = externalLinks(resolveImages(renderMarkdownWithMath(body, globalThis.marked, globalThis.katex), props.getAsset));
    var meta = [authors.join(" & "), formatDate(get("pubDate")), minutesToRead(body) + " min read"].filter(Boolean);

    return h(
      "article",
      { className: "post-preview" },
      h(
        "header",
        { className: "post-header" },
        h(
          "div",
          { className: "chips" },
          get("draft") ? h("span", { className: "chip chip-draft" }, "Draft (not published)") : null,
          get("subject") ? h("span", { className: "chip chip-subject" }, String(get("subject")).toUpperCase()) : null,
          tags.map(function (tag) {
            return h("span", { key: tag, className: "chip" }, "#" + String(tag).toLowerCase().replace(/[^a-z0-9]+/g, "-"));
          })
        ),
        h("h1", null, get("title") || "Untitled post"),
        get("description") ? h("p", { className: "description" }, get("description")) : null,
        h("p", { className: "meta" }, meta.join(" · "))
      ),
      cover ? h("img", { className: "cover", src: cover, alt: get("coverAlt") || "" }) : null,
      h("div", { className: "prose", dangerouslySetInnerHTML: { __html: html } })
    );
  }

  function AuthorPreview(props) {
    var get = reader(props.entry);
    var github = get("github");
    var avatar = get("avatar") || (github ? "https://avatars.githubusercontent.com/" + github + "?s=224" : "");
    return h(
      "article",
      { className: "author-preview" },
      avatar ? h("img", { className: "avatar", src: avatar, alt: "" }) : h("div", { className: "avatar" }),
      h("h1", null, get("name") || "New author"),
      get("role") ? h("p", { className: "role" }, get("role")) : null,
      get("bio") ? h("p", { className: "bio" }, get("bio")) : null,
      github ? h("p", { className: "github" }, "@" + github + " on GitHub") : null,
      get("core") ? h("p", { className: "chip" }, "Shown under Core Contributors on the home page") : null
    );
  }

  CMS.registerPreviewTemplate("blog", PostPreview);
  CMS.registerPreviewTemplate("authors", AuthorPreview);
})();
