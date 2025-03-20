"use client";

import React from "react";
import Feed from "@/components/post/ListingPostsCards";


export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Feed />
    </main>
  );
}
