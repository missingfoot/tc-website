import Link from "next/link";
import Photo from "@/components/ui/Photo";
import { sizes2x } from "@/lib/images";

/** What a card shows: plain data, worked out on the server, so the card also works in client lists. */
export type PostCardData = {
  slug: string;
  title: string;
  /** e.g. "15 June 2018" */
  date: string;
  category: string;
  author: string;
  cover: { src: string; blur?: string } | null;
};

/** A blog post as a card: cover photo, category, title, author and date. The whole card is the link. */
export default function PostCard({ post }: { post: PostCardData }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl bg-cream text-ink">
      <div className="relative aspect-video overflow-hidden bg-ink/10">
        {post.cover && (
          // The zoom is on a wrapper so its transition doesn't replace the photo's fade
          <div className="absolute inset-0 transition-transform duration-500 ease-smooth group-hover:scale-105 motion-reduce:transition-none">
            <Photo
              src={post.cover.src}
              alt=""
              preview={post.cover.blur}
              sizes={sizes2x(["(min-width: 1024px)", "33vw"], ["(min-width: 768px)", "50vw"], [null, "100vw"])}
              quality={90}
              className="object-cover"
            />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm font-medium text-stone">{post.category}</p>
        <h3 className="mt-2 text-2xl font-bold leading-heading group-hover:underline group-hover:underline-offset-4">{post.title}</h3>
        <p className="mt-auto pt-4 text-sm text-stone">
          {post.author} · {post.date}
        </p>
      </div>
    </Link>
  );
}
