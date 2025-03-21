"use client";
import { useSession } from "next-auth/react";

import React, { useEffect, useState } from "react";
import PostCard from "@/components/post/PostCard";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      // Fetch user's posts
      const fetchUserPosts = async () => {
        try {
          const response = await axios.post("/api/posts/userposts", {
            userId: session.user.id,
          });
          setUserPosts(response.data.posts);
        } catch (error) {
          console.error("Error fetching user posts:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserPosts();
    }
  }, [session]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div>
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center">
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-xl">
              {session.user?.name}
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold">{session.user?.name}</h1>
              <p className="text-gray-600">{session.user?.email}</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Your Posts</h2>

        {loading ? (
          <div className="text-center py-4">Loading posts...</div>
        ) : userPosts.length > 0 ? (
          <div className="space-y-6">
            {userPosts.map((post, id) => (
              <PostCard key={id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-4 bg-white rounded-lg shadow-md">
            <p>You haven't created any posts yet.</p>
            <button
              onClick={() => router.push("/create")}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Create Your First Post
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
