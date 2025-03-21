"use client";

import React from "react";
import ListingPostsCards from "@/components/post/ListingPostsCards";


export default function Home() {
  return (
    <main className="max-w-[1220px] mx-auto px-4 py-8">
      <ListingPostsCards />
    </main>
  );
}
