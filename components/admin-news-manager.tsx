"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Newspaper, Pencil, Plus, Trash2 } from "lucide-react";

import { deleteNewsPost } from "@/app/admin/news/actions";
import { AdminNewsForm } from "@/components/admin-news-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ForumPost } from "@/lib/forum";

export function AdminNewsManager({ posts }: { posts: ForumPost[] }) {
  const [showCreate, setShowCreate] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  return (
    <section id="news" className="mt-16">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <Newspaper className="h-5 w-5 text-brass" />
            <Badge>News / Aktualności</Badge>
          </div>
          <h2 className="font-serif text-4xl font-bold">Manage news</h2>
          <p className="mt-3 max-w-2xl leading-7 text-ink/65">
            Use the <strong>+ New news</strong> button to publish an announcement or click{" "}
            <strong>Edit</strong> on any existing post to modify its title, image, or content.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="brass"
            onClick={() => setShowCreate((prev) => !prev)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {showCreate ? "Hide create form" : "New news post"}
          </Button>
          <Button asChild variant="outline">
            <Link href="/news">View public news</Link>
          </Button>
        </div>
      </div>

      {showCreate ? (
        <div className="mb-10 rounded-[2.25rem] border border-brass/30 bg-vellum/60 p-6 md:p-8">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-serif text-3xl font-bold">Create news post</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowCreate(false)}
            >
              Close
            </Button>
          </div>
          <AdminNewsForm onSuccess={() => setShowCreate(false)} />
        </div>
      ) : null}

      <div className="grid gap-6">
        {posts.map((post) => {
          const isEditing = editingPostId === post.id;

          return (
            <article
              key={post.id}
              className="rounded-[2rem] border border-ink/10 bg-paper/75 p-5 shadow-glass backdrop-blur md:p-6"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{post.is_pinned ? "Featured on Homepage" : "News"}</Badge>
                    <span className="text-xs font-medium text-ink/50">
                      {format(new Date(post.created_at), "yyyy-MM-dd HH:mm")}
                    </span>
                  </div>
                  <h4 className="mt-3 font-serif text-3xl font-bold">{post.title}</h4>
                  <p className="mt-2 line-clamp-2 max-w-3xl text-sm text-ink/65">{post.body}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant={isEditing ? "brass" : "outline"}
                    size="sm"
                    onClick={() => setEditingPostId(isEditing ? null : post.id)}
                  >
                    <Pencil className="h-4 w-4" />
                    {isEditing ? "Close editor" : "Edit"}
                  </Button>
                  <form action={deleteNewsPost}>
                    <input type="hidden" name="postId" value={post.id} />
                    <Button type="submit" variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </form>
                </div>
              </div>

              {isEditing ? (
                <div className="mt-6 border-t border-ink/10 pt-6">
                  <AdminNewsForm post={post} onSuccess={() => setEditingPostId(null)} />
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
