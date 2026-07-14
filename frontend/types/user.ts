export interface User {
  id: number;

  username: string;

  email: string;

  role?: "user" | "admin";

  bio?: string;

  profile_picture?: string;

  follower_count?: number;

  following_count?: number;

  post_count?: number;

  comment_count?: number;

  like_count?: number;
}