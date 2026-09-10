import Link from "next/link";
import { format } from "date-fns";
import { Newspaper, Trash2 } from "lucide-react";

import { deleteNewsPost } from "@/app/admin/news/actions";
import { AdminNewsForm } from "@/components/admin-news-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ForumPost } from "@/lib/forum";

export function AdminNewsManager({ posts }: { posts: ForumPost[] }) {
  return (
    <section id="news" className="mt-16">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <Newspaper className="h-5 w-5 text-brass" />
            <Badge>News</Badge>
          </div>
          <h2 className="font-serif text-4xl font-bold">Manage news</h2>
          <p className="mt-3 max-w-2xl leading-7 text-ink/65">
            Create, edit, feature, and delete public news posts from the main admin area.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/news">View public news</Link>
        </Button>
      </div>

      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <section>
          <h3 className="mb-5 font-serif text-3xl font-bold">Create news</h3>
          <AdminNewsForm />
        </section>

        <section>
          <h3 className="mb-5 font-serif text-3xl font-bold">Existing news</h3>
          <div className="grid gap-6">
            {posts.map((post) => (
              <article key={post.id} className="rounded-[2rem] border border-ink/10 bg-paper/75 p-5 md:p-6">
                <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <Badge>{post.is_pinned ? "Featured" : "News"}</Badge>
                    <h4 className="mt-4 font-serif text-3xl font-bold">{post.title}</h4>
                    <p className="mt-2 text-sm text-ink/55">{format(new Date(post.created_at), "yyyy-MM-dd HH:mm")}</p>
                  </div>
                  <form action={deleteNewsPost}>
                    <input type="hidden" name="postId" value={post.id} />
                    <Button type="submit" variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </form>
                </div>
                <details className="rounded-[1.5rem] border border-ink/10 bg-white/50 p-4">
                  <summary className="cursor-pointer font-semibold text-wine">Edit news</summary>
                  <div className="mt-5">
                    <AdminNewsForm post={post} />
                  </div>
                </details>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
