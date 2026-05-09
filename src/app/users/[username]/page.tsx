"use client";

import { use, useEffect, useState } from "react";
import { userApi } from "@/lib/api";
import { Button } from "@/components/ui/Button";

interface UserProfile {
  id: string;
  username: string;
  bio?: string;
  profilePictureUrl?: string;
  createdAt: string;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export default function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await userApi.getProfile(username);
        setProfile(data);
      } catch (err: any) {
        setError(err.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [username]);

  const toggleFollow = async () => {
    if (!profile) return;
    try {
      if (profile.isFollowing) {
        await userApi.unfollow(profile.id);
        setProfile({ ...profile, isFollowing: false, followerCount: profile.followerCount - 1 });
      } else {
        await userApi.follow(profile.id);
        setProfile({ ...profile, isFollowing: true, followerCount: profile.followerCount + 1 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-muted-foreground">Loading profile...</div>;
  }

  if (error || !profile) {
    return <div className="text-center py-10 text-red-500">{error || "User not found."}</div>;
  }

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6">
      <div className="p-6 border border-border rounded-lg bg-background flex flex-col items-center text-center gap-4">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-3xl font-bold">
          {profile.username.charAt(0).toUpperCase()}
        </div>
        
        <div>
          <h1 className="text-2xl font-bold">{profile.username}</h1>
          <p className="text-sm text-muted-foreground mt-1">Joined {new Date(profile.createdAt).toLocaleDateString()}</p>
        </div>

        {profile.bio && <p className="text-sm max-w-sm">{profile.bio}</p>}

        <div className="flex gap-6 mt-2">
          <div className="flex flex-col">
            <span className="font-bold text-lg">{profile.followerCount}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Followers</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg">{profile.followingCount}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Following</span>
          </div>
        </div>

        <Button 
          variant={profile.isFollowing ? "outline" : "default"} 
          className="mt-4 w-32"
          onClick={toggleFollow}
        >
          {profile.isFollowing ? "Unfollow" : "Follow"}
        </Button>
      </div>
    </div>
  );
}
