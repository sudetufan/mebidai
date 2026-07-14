import { User } from "./user";


export interface Comment {

  id: number;

  content: string;


  post_id: number;


  created_at?: string;


  user: User;


  parent_id?: number;


  replies?: Comment[];

}