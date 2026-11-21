// Content-collection queries shared by the blog pages.
import { getCollection, getEntries } from "astro:content";
import type { CollectionEntry } from "astro:content";
import { isVisible, sortByDateDesc } from "./posts";

export type Post = CollectionEntry<"blog">;
export type Author = CollectionEntry<"authors">;

export const POSTS_PER_PAGE = 10;

/** Published posts (drafts too in dev), newest first. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection("blog", (post) => isVisible(post, import.meta.env.PROD));
  return sortByDateDesc(posts);
}

/** The post's authors, resolved from its `author` reference(s), in frontmatter order. */
export async function getPostAuthors(post: Post): Promise<Author[]> {
  const refs = Array.isArray(post.data.author) ? post.data.author : [post.data.author];
  return getEntries(refs);
}

/** Posts that list the author among their authors. */
export function postsByAuthor(posts: readonly Post[], authorId: string): Post[] {
  return posts.filter((post) => {
    const refs = Array.isArray(post.data.author) ? post.data.author : [post.data.author];
    return refs.some((ref) => ref.id === authorId);
  });
}
