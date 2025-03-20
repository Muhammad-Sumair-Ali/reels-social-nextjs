"use client"

import type React from "react"
import { useState } from "react"
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Twitter,
  Facebook,
  Link2,
  Copy,
  Bookmark,
  BookmarkCheck,
  UserPlus,
  UserCheck,
} from "lucide-react"
import axios from "axios"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { PostCardProps } from "@/lib/types"
import { formatDateIntoAgoTimes, getFirstNameFromEmail, getInitials } from "@/lib/helpers"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "../reuseable/Toast"
import { useAuth } from "@/app/context/useAuth"
import Image from "next/image"

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const {user} = useAuth()
  const {toast } = useToast();
  const [liked, setLiked] = useState(post?.likes.some((postUser:any) => postUser._id === user?._id?.toString()))
  const [likesCount, setLikesCount] = useState(post?.likes.length)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [comments, setComments] = useState(post?.comments)
  const [saved, setSaved] = useState(false)

  const [isFollowing, setIsFollowing] = useState(
    post?.user?.following?.map(id => id.toString()).includes(user?._id?.toString() ?? "") ?? false
  );
  

  const handleLike = async () => {
    try {
      const response = await axios.post("/api/posts/like", {
        postId: post._id,
      })
      setLiked(response.data.liked)
      setLikesCount((prev) => (response.data.liked ? prev + 1 : prev - 1))
    } catch (error) {
      console.error("Error liking post:", error)
      toast({
        title: "Error",
        description: "Could not like post. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!commentText.trim()) return
    try {
      const response = await axios.post("/api/posts/comment", {
        postId: post._id,
        text: commentText,
      })

      if (response.data) {
        const newComment = response.data
        setComments((prev) => [
          ...prev,
          {
            ...newComment,
          },
        ])
        setCommentText("")
      }
    } catch (error) {
      console.error("Error adding comment:", error)
      toast({
        title: "Error",
        description: "Could not add comment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleFollow = async () => {
    try {
      const response = await axios.post("/api/posts/follow", {
        userId: post.user._id,
      })
      setIsFollowing(response.data.following)
      toast({
        title: response.data.following ? "Following" : "Unfollowed",
        description: response.data.following
          ? `You are now following ${post.user.name || getFirstNameFromEmail(post.user.email)}`
          : `You unfollowed ${post.user.name || getFirstNameFromEmail(post.user.email)}`,
      })
    } catch (error) {
      console.error("Error following user:", error)
      toast({
        title: "Error",
        description: "Could not follow user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSave = () => {
    setSaved(!saved)
    toast({
      title: saved ? "Removed from saved" : "Saved",
      description: saved ? "Post removed from your saved items" : "Post added to your saved items",
    })
  }

  const handleShare = (platform: string) => {
    const postUrl = `${window.location.origin}/posts/${post._id}`

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.caption || "Check out this post!")}`,
        )
        break
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`)
        break
      case "copy":
        navigator.clipboard.writeText(postUrl)
        toast({
          title: "Link copied",
          description: "Post link copied to clipboard",
        })
        break
      default:
        break
    }
  }

  const isOwnPost = post?.user?._id.toString() === user?._id?.toString()

  return (
    <Card className="w-full max-w-md mx-auto mb-6 overflow-hidden border border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-xl">
      <CardHeader className="p-4 space-y-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border ring-2 ring-background">
              <AvatarImage src={post?.user.image || ""} alt={post?.user.name} />
              <AvatarFallback className="bg-gradient-to-br from-pink-500 to-rose-500 text-white font-medium">
                {getInitials(post?.user?.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">
                {post.user.name ? post.user.name : getFirstNameFromEmail(post.user.email)}
              </p>
              <p className="text-xs text-muted-foreground">{formatDateIntoAgoTimes(post.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isOwnPost && (
              <Button
                onClick={handleFollow}
                variant={isFollowing ? "outline" : "default"}
                size="sm"
                className={`rounded-full text-xs px-3 h-8 transition-all ${isFollowing ? "border-primary/30 hover:bg-primary/10" : ""}`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="h-3.5 w-3.5 mr-1" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="h-3.5 w-3.5 mr-1" />
                    Follow
                  </>
                )}
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleSave} className="cursor-pointer">
                  {saved ? (
                    <>
                      <BookmarkCheck className="h-4 w-4 mr-2" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4 mr-2" />
                      Save post
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleShare("copy")} className="cursor-pointer">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("twitter")} className="cursor-pointer">
                  <Twitter className="h-4 w-4 mr-2" />
                  Share to Twitter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("facebook")} className="cursor-pointer">
                  <Facebook className="h-4 w-4 mr-2" />
                  Share to Facebook
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      {post.caption && (
        <CardContent className="px-4 py-2">
          <p className="text-sm">{post.caption}</p>
        </CardContent>
      )}

      <div className="w-full relative group">
        {post.mediaType === "image" ? (
          <Image
          width={200}
          height={200}
          unoptimized
            src={post.mediaUrl || "/placeholder.svg"}
            alt="Post content"
            className="w-full object-cover max-h-[500px]"
          />
        ) : (
          <video src={post.mediaUrl} className="w-full max-h-[500px]" controls preload="metadata" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <CardFooter className="flex flex-col p-0">
        <div className="w-full px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleLike}
              variant="ghost"
              size="sm"
              className={`p-0 h-auto flex items-center gap-1.5 ${
                liked ? "text-red-500" : "text-muted-foreground"
              } hover:text-red-500 transition-colors duration-200`}
            >
              <Heart
                className={`w-5 h-5 ${liked ? "fill-red-500" : ""} transition-all duration-200`}
                strokeWidth={liked ? 0 : 2}
              />
              <span className="text-sm font-medium">{likesCount}</span>
            </Button>
            <Button
              onClick={() => setShowComments(!showComments)}
              variant="ghost"
              size="sm"
              className="p-0 h-auto flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{comments.length}</span>
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-auto text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleShare("copy")} className="cursor-pointer">
                <Link2 className="h-4 w-4 mr-2" />
                Copy link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare("twitter")} className="cursor-pointer">
                <Twitter className="h-4 w-4 mr-2" />
                Share to Twitter
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare("facebook")} className="cursor-pointer">
                <Facebook className="h-4 w-4 mr-2" />
                Share to Facebook
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {showComments && (
          <>
            <Separator className="w-[95%] mx-auto opacity-50" />
            <div className="w-full px-4 py-3">
              <div className="max-h-60 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                {comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <div key={index} className="flex gap-2">
                      <Avatar className="h-8 w-8 border">
                        <AvatarImage src={comment?.user?.image || ""} alt={comment?.user?.name} />
                        <AvatarFallback className="bg-gradient-to-br from-pink-500 to-rose-500 text-white text-xs font-medium">
                          {comment?.user?.email?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-muted/50 rounded-2xl px-3 py-2">
                          <p className="text-xs font-medium">
                            {comment.user.name ? comment.user.name : getFirstNameFromEmail(comment.user.email)}
                          </p>
                          <p className="text-sm">{comment.text}</p>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1 ml-1">
                          {formatDateIntoAgoTimes(comment.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>

              <form onSubmit={handleComment} className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 h-9 px-3 rounded-full bg-muted/50 border-none text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Add a comment..."
                />
                <Button type="submit" size="sm" className="rounded-full px-4 h-9" disabled={!commentText.trim()}>
                  Post
                </Button>
              </form>
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  )
}

export default PostCard

