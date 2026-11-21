---
# Copy this file to src/content/blog/<your-post-slug>/index.md (or <your-post-slug>.md).
# Files whose names start with "_" are ignored by the site.

# Required
title: Your post title
description: One or two sentences, 160 characters at most. Shown in search results and link previews.
pubDate: 2026-01-31              # YYYY-MM-DD
author: shubhajeet-das            # a file name in src/content/authors (without .json)
# author: [shubhajeet-das, kingshuk-patra]   # co-authored posts take a list
tags: [signals, exam-tips]       # lowercase; spaces become hyphens

# Optional
updatedDate: 2026-02-15
subject: AI20203                 # course code
cover: cover.png                 # an image next to this file; aim for ≤ 300 KB, WebP or PNG
coverAlt: Describe the cover image for screen readers
math: false                      # true loads KaTeX for $inline$ and $$display$$ maths
draft: true                      # drafts show in `npm run dev` but are not published
---

Write the post here in Markdown.

## Headings

Use `##` and `###`. They become the table of contents.

## Maths

Inline: $e^{j\pi} + 1 = 0$. Display:

$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$

## Images

Put the image next to this file and link it by name:

![Describe the image](my-figure.png)

## Code

```python
print("hello")
```
