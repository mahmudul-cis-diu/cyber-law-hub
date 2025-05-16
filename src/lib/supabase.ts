
import { createClient } from '@supabase/supabase-js';

// Define the Supabase URL and anonymous key as constants
const supabaseUrl = "";
const supabaseAnonKey = "";

// Create a timeout wrapper for Supabase operations
export const withTimeout = async (promise: Promise<any>, timeout = 8000) => {
  let timeoutId: NodeJS.Timeout;
  
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error('Operation timed out'));
    }, timeout);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types based on your database schema
export type Profile = {
  id: string;
  username: string;
  full_name: string;
  bio: string;
  avatar_url: string;
  role: 'user' | 'admin';
  created_at: string;
};

export type Law = {
  id: string;
  title: string;
  content: string;
  country: string;
  category: string;
  author_id: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
};

export type Comment = {
  id: string;
  law_id: string;
  user_id: string;
  content: string;
  created_at: string;
};

export type Rating = {
  id: string;
  law_id: string;
  user_id: string;
  rating: number;
  created_at: string;
};

export type Like = {
  id: string;
  law_id: string;
  user_id: string;
  created_at: string;
};

export type Notification = {
  id: string;
  recipient_id: string;
  type: 'comment' | 'moderation' | 'like' | 'update';
  related_law_id: string;
  is_read: boolean;
  message: string;
  created_at: string;
};
