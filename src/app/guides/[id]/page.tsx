"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import DOMPurify from "dompurify";
import { useAuth } from "@/lib/auth";
import { useGuides } from "@/lib/guides";
import { getAllChampions } from "@/lib/champions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const allChampions = getAllChampions();

export default function GuideDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { getGuide, vote, addComment, deleteGuide } = useGuides();

  const guide = getGuide(params.id);
  const [commentText, setCommentText] = useState("");

  if (!guide) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 text-center">
        <p className="text-muted-foreground">Guide not found.</p>
        <Button asChild className="mt-4">
          <Link href="/guides">Back to Guides</Link>
        </Button>
      </div>
    );
  }

  const champion = guide.champion_id
    ? allChampions.find((c) => c.id === guide.champion_id)
    : undefined;

  const score = guide.upvotes.length - guide.downvotes.length;
  const userUpvoted = user ? guide.upvotes.includes(user.id) : false;
  const userDownvoted = user ? guide.downvotes.includes(user.id) : false;
  const isAuthor = user?.id === guide.author_id;

  const handleVote = (direction: "up" | "down") => {
    if (!user) return;
    vote(guide.id, user.id, direction);
  };

  const handleComment = () => {
    if (!user || !commentText.trim()) return;
    addComment(guide.id, user.id, user.display_name, commentText.trim());
    setCommentText("");
  };

  const handleDelete = () => {
    deleteGuide(guide.id);
    router.push("/guides");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/guides"
        className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Back to Guides
      </Link>

      {/* Header */}
      <div className="mb-6 flex gap-4">
        {/* Voting */}
        <div className="flex flex-col items-center gap-1 pt-1">
          <button
            onClick={() => handleVote("up")}
            disabled={!user}
            className={`text-lg leading-none ${
              userUpvoted ? "text-green-400" : "text-muted-foreground hover:text-green-400"
            } disabled:opacity-50`}
          >
            &#9650;
          </button>
          <span
            className={`text-sm font-bold ${
              score > 0
                ? "text-green-400"
                : score < 0
                ? "text-red-400"
                : "text-muted-foreground"
            }`}
          >
            {score}
          </span>
          <button
            onClick={() => handleVote("down")}
            disabled={!user}
            className={`text-lg leading-none ${
              userDownvoted ? "text-red-400" : "text-muted-foreground hover:text-red-400"
            } disabled:opacity-50`}
          >
            &#9660;
          </button>
        </div>

        <div className="flex-1">
          <div className="flex items-start gap-3">
            {champion?.avatar_url && (
              <Link href={`/champions/${champion.slug}`}>
                <img
                  src={champion.avatar_url}
                  alt={champion.name}
                  className="h-14 w-14 rounded-lg object-cover"
                />
              </Link>
            )}
            <div>
              <h1 className="text-2xl font-bold">{guide.title}</h1>
              {champion && (
                <Link
                  href={`/champions/${champion.slug}`}
                  className="text-sm text-primary hover:underline"
                >
                  {champion.name}
                </Link>
              )}
              <p className="text-xs text-muted-foreground">
                by {guide.author_name} &middot;{" "}
                {new Date(guide.created_at).toLocaleDateString()}
              </p>
              {guide.tags.length > 0 && (
                <div className="mt-1 flex gap-1">
                  {guide.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-[10px]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {isAuthor && (
            <Button
              size="sm"
              variant="destructive"
              className="mt-3"
              onClick={handleDelete}
            >
              Delete Guide
            </Button>
          )}
        </div>
      </div>

      {/* Body */}
      <Card className="mb-6">
        <CardContent className="py-6">
          <div
            className="prose prose-invert prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(guide.body) }}
          />
          {!guide.body && (
            <p className="text-sm text-muted-foreground italic">
              This guide has no content yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Comments */}
      <Card>
        <CardHeader>
          <CardTitle>
            Comments ({guide.comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {guide.comments.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No comments yet. Be the first!
            </p>
          )}

          {guide.comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-md border border-border p-3"
            >
              <div className="mb-1 flex items-center gap-2">
                <span className="text-sm font-medium">{comment.user_name}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{comment.content}</p>
            </div>
          ))}

          {user ? (
            <div className="flex gap-2">
              <Input
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleComment();
                }}
              />
              <Button onClick={handleComment} disabled={!commentText.trim()}>
                Post
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              <Link href="/login" className="text-primary hover:underline">
                Log in
              </Link>{" "}
              to comment.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
