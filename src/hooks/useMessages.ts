import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  created_at?: string;
}

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setMessages(data || []);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch messages';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createMessage = async (data: Omit<Message, 'id' | 'created_at' | 'timestamp'>) => {
    try {
      const { data: result, error: insertError } = await supabase
        .from('messages')
        .insert([
          {
            ...data,
            timestamp: new Date().toLocaleString(),
          },
        ])
        .select();

      if (insertError) throw insertError;
      setMessages([result[0], ...messages]);
      toast.success('Message sent successfully');
      return result[0];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      toast.error(errorMessage);
      throw err;
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setMessages(messages.filter((m) => m.id !== id));
      toast.success('Message deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete message';
      toast.error(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return {
    messages,
    loading,
    error,
    createMessage,
    deleteMessage,
  };
};
