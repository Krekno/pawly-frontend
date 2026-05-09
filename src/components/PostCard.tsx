"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Heart } from "lucide-react";
import { postApi } from "@/lib/api";

export interface PostResponse {
  id: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    profilePictureUrl?: string;
  };
  likeCount: number;
  replyCount: number;
  parentPostId?: string;
  deleted: boolean;
}

export function PostCard({ post }: { post: PostResponse }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [loading, setLoading] = useState(false);

  if (post.deleted) {
    return (
      <div className="p-4 border border-border rounded-lg bg-muted text-muted-foreground italic">
        This post has been deleted.
      </div>
    );
  }

  const handleLike = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      if (liked) {
        await postApi.unlike(post.id);
        setLikeCount(prev => prev - 1);
        setLiked(false);
      } else {
        await postApi.like(post.id);
        setLikeCount(prev => prev + 1);
        setLiked(true);
      }
    } catch (err) {
      console.error("Failed to toggle like", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="p-4 border border-border rounded-lg bg-background hover:border-primary transition-colors flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold">
          {post.author.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <Link href={`/users/${post.author.username}`} className="font-semibold hover:underline">
            {post.author.username}
          </Link>
          <div className="text-xs text-muted-foreground">
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <p className="text-sm">{post.content}</p>

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Post attachment"
          className="rounded-md w-full max-h-96 object-cover"
        />
      )}

      <div className="flex items-center gap-6 text-muted-foreground mt-2">
        <button 
          onClick={handleLike}
          disabled={loading}
          className={`flex items-center gap-1.5 text-xs transition-colors ${
            liked ? "text-red-500" : "hover:text-red-500"
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
          <span>{likeCount}</span>
        </button>
        <Link href={`/posts/${post.id}`} className="flex items-center gap-1.5 text-xs hover:text-blue-500 transition-colors">
          <MessageCircle className="w-4 h-4" />
          <span>{post.replyCount}</span>
        </Link>
      </div>
    </article>
  );
}
