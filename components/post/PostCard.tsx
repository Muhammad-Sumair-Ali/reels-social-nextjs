"use client";
import type React from "react";
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
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { PostCardProps } from "@/lib/types";
import {
  formatDateIntoAgoTimes,
  getFirstNameFromEmail,
} from "@/lib/helpers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import CustomVideoPlayer from "../CustomVideoPlayer";
import { usePostsActions } from "@/hooks/usePostsActions";

const PostCard: React.FC<PostCardProps> = ({ post }) => {

  const {
    handleComment,
    handleFollow,
    handleLike,
    handleShare,
    handleSave,
    liked,
    isOwnPost,
    likesCount,
    isFollowing,
    comments,
    commentText,
    setCommentText,
    showComments,
    setShowComments,
    saved,
  } = usePostsActions({ post });

  console.log("whos posted ", post);
  return (
    <Card className="w-full max-w-md mx-auto  overflow-hidden border border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-xl">
      <CardHeader className="p-x-4 py-2 -my-5 bg-zinc-50 ">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border ring-2 ring-background">
              <AvatarImage src={post?.user.image || ""} alt={post?.user.name} />
              <AvatarFallback className="bg-gradient-to-br from-pink-500 to-rose-500 text-white font-medium">
                {post?.user?.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">
                {post.user.fullName
                  ? post.user.fullName
                  : getFirstNameFromEmail(post.user.email)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDateIntoAgoTimes(post.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isOwnPost && (
              <Button
                onClick={handleFollow}
                variant={isFollowing ? "outline" : "default"}
                size="sm"
                className={`rounded-full text-xs px-3 h-8 transition-all ${
                  isFollowing ? "border-primary/30 hover:bg-primary/10" : ""
                }`}
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-muted"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={handleSave}
                  className="cursor-pointer"
                >
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
                <DropdownMenuItem
                  onClick={() => handleShare("copy")}
                  className="cursor-pointer"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy link
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleShare("twitter")}
                  className="cursor-pointer"
                >
                  <Twitter className="h-4 w-4 mr-2" />
                  Share to Twitter
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleShare("facebook")}
                  className="cursor-pointer"
                >
                  <Facebook className="h-4 w-4 mr-2" />
                  Share to Facebook
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      {post.caption && (
        <CardContent className="px-4 py-1">
          <p className="text-sm">{post.caption}</p>
        </CardContent>
      )}

      <div className="w-full relative group">
        {post.mediaType === "image" ? (
          <Image
            priority
            width={200}
            height={200}
            unoptimized
            src={post.mediaUrl}
            alt="Post content"
            className="w-full object-contain max-h-[500px]"
          />
        ) : (
          <CustomVideoPlayer
            src={post.mediaUrl}
            width="100%"
            height="100%"
            className="object-contain"
            autoPlay={true}
            loop={true}
            muted={true}
          />
        )}
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
                className={`w-8 h-8 ${
                  liked ? "fill-red-500" : ""
                } transition-all duration-200`}
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
              <MessageCircle className="w-8 h-8" />
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
                <Share2 className="w-8 h-8" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => handleShare("copy")}
                className="cursor-pointer"
              >
                <Link2 className="h-4 w-4 mr-2" />
                Copy link
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleShare("twitter")}
                className="cursor-pointer"
              >
                <Twitter className="h-4 w-4 mr-2" />
                Share to Twitter
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleShare("facebook")}
                className="cursor-pointer"
              >
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
                        <AvatarImage
                          src={comment?.user?.image || ""}
                          alt={comment?.user?.name}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-pink-500 to-rose-500 text-white text-xs font-medium">
                          {comment?.user?.email?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-muted/50 rounded-2xl px-3 py-2">
                          <p className="text-xs font-medium">
                            {comment.user.name
                              ? comment.user.name
                              : getFirstNameFromEmail(comment.user.email)}
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
                <Button
                  type="submit"
                  size="sm"
                  className="rounded-full px-4 h-9"
                  disabled={!commentText.trim()}
                >
                  Post
                </Button>
              </form>
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default PostCard;
