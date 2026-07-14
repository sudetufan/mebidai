import { User } from "./user";
import { Category } from "./post";


export interface AdminPost {
  id: number;

  title: string;

  content?: string;

  user: User;

  category?: Category;

  created_at?: string;
}



export interface AdminComment {
  id: number;

  content: string;

  post_id: number;

  user: User;

  created_at?: string;
}