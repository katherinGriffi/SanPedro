import { supabase } from '../lib/supabase';

export async function authenticateUser(username: string, password: string): Promise<boolean> {
  try {
    // Root admin authentication
    if (username === 'root' && password === 'root') {
      return true;
    }

    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('username', username)
      .eq('password', password)
      .single();

    if (error) {
      console.error('Authentication error:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Authentication error:', error);
    return false;
  }
}