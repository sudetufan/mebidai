export interface Category {
  id: number;
  name: string;
}


export interface Post {

  id: number;

  title: string;

  content: string;


  user_id: number;

  username: string;


  like_count: number;

  comment_count: number;


  liked_by_me: boolean;


  created_at: string;


  category?: Category;
}