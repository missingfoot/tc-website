"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import PostCard, { type PostCardData } from "./PostCard";

const PAGE = 12;

/**
 * Post cards in a grid, a dozen at a time with a "Show more" button. Every card is in the page
 * (the rest just hidden), so search engines and links still reach every post; hidden cards'
 * lazy photos don't load until they're shown.
 */
export default function PostGrid({ posts }: { posts: PostCardData[] }) {
  const [shown, setShown] = useState(PAGE);
  return (
    <>
      <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <li key={post.slug} hidden={i >= shown}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
      {shown < posts.length && (
        <div className="mt-10 lg:mt-12 lg:text-center">
          <Button variant="dark" onClick={() => setShown(shown + PAGE)} className="w-full justify-center lg:w-auto">
            Show more posts
          </Button>
        </div>
      )}
    </>
  );
}
