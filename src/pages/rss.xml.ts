import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getPostAuthors, getPosts } from "../lib/blog";
import { postUrl } from "../lib/posts";
import { SITE } from "../config/site";

export const GET: APIRoute = async ({ site }) => {
  const posts = await getPosts();
  const items = await Promise.all(
    posts.map(async (post) => {
      const authors = await getPostAuthors(post);
      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        link: postUrl(post.id),
        categories: post.data.tags,
        // RSS <author> must be an email address; Dublin Core's creator takes names.
        customData: `<dc:creator><![CDATA[${authors.map((a) => a.data.name).join(", ")}]]></dc:creator>`,
      };
    })
  );
  return rss({
    title: `${SITE.name} Blog`,
    description: "Notes, explainers and exam tips from the AI Batch 2024 at IIT Kharagpur.",
    site: site ?? SITE.url,
    xmlns: { dc: "http://purl.org/dc/elements/1.1/" },
    trailingSlash: false,
    items,
    customData: "<language>en-in</language>",
  });
};
