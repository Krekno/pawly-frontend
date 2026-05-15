"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { postApi, authApi } from "@/lib/api";
import { PostCard, PostResponse } from "@/components/PostCard";
import { Button } from "@/components/ui/Button";

export default function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<PostResponse | null>(null);
  const [replies, setReplies] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadPostAndReplies() {
      try {
        const [postData, repliesData, meRes] = await Promise.all([
          postApi.getById(id),
          postApi.getReplies(id),
          authApi.getMe().catch(() => null)
        ]);
        setPost(postData);
        setCurrentUser(meRes);
        
        if (repliesData && repliesData.content) {
          setReplies(repliesData.content);
        } else if (Array.isArray(repliesData)) {
          setReplies(repliesData);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load post.");
      } finally {
        setLoading(false);
      }
    }

    loadPostAndReplies();
  }, [id]);

  const handleMainPostDeleted = (deletedId: string) => {
    router.push("/");
  };

  const handleReplyDeleted = (deletedId: string) => {
    setReplies((prev) => prev.filter((r) => r.id !== deletedId));
  };

  if (loading) {
    return <div className="text-center py-10 text-muted-foreground">Loading...</div>;
  }

  if (error || !post) {
    return <div className="text-center py-10 text-red-500">{error || "Post not found."}</div>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto">
      <PostCard post={post} currentUser={currentUser} onDelete={handleMainPostDeleted} />
      
      <div className="mt-4 border-t border-border pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Replies</h2>
          <Button variant="outline" size="sm">Reply</Button>
        </div>
        
        <div className="flex flex-col gap-4">
          {replies.length === 0 ? (
            <p className="text-sm text-muted-foreground">No replies yet.</p>
          ) : (
            replies.map((reply) => (
              <PostCard 
                key={reply.id} 
                post={reply} 
                currentUser={currentUser} 
                onDelete={handleReplyDeleted} 
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
