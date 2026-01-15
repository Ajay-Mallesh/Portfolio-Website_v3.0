import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

export interface SocialMedia {
  id: string;
  label: string;
  href: string;
  icon_name: string;
  created_at?: string;
}

export const useSocialMedia = () => {
  const [socialLinks, setSocialLinks] = useState<SocialMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSocialMedia = async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('social_media')
        .select('*')
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      setSocialLinks(data || []);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch social media links';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createSocialLink = async (data: Omit<SocialMedia, 'id' | 'created_at'>) => {
    try {
      const { data: result, error: insertError } = await supabase
        .from('social_media')
        .insert([data])
        .select();

      if (insertError) throw insertError;
      setSocialLinks([...socialLinks, result[0]]);
      toast.success('Social link added successfully');
      return result[0];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add social link';
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateSocialLink = async (id: string, data: Partial<SocialMedia>) => {
    try {
      const { data: result, error: updateError } = await supabase
        .from('social_media')
        .update(data)
        .eq('id', id)
        .select();

      if (updateError) throw updateError;
      setSocialLinks(socialLinks.map((s) => (s.id === id ? result[0] : s)));
      toast.success('Social link updated successfully');
      return result[0];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update social link';
      toast.error(errorMessage);
      throw err;
    }
  };

  const deleteSocialLink = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('social_media')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setSocialLinks(socialLinks.filter((s) => s.id !== id));
      toast.success('Social link deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete social link';
      toast.error(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    fetchSocialMedia();
  }, []);

  return {
    socialLinks,
    loading,
    error,
    createSocialLink,
    updateSocialLink,
    deleteSocialLink,
  };
};
