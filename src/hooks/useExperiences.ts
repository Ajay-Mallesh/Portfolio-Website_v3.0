import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

export interface Experience {
  id: number;
  company_name: string;
  designation: string;
  total_experience: string;
  from_year: string;
  to_year: string;
  roles_and_responsibilities: string;
  promotion_details: string;
  promotion_from_year: string;
  promotion_to_year: string;
  promotion_roles: string;
  skills_acquired: string;
  tools_utilised: string;
  certification_ids: string;
  created_at?: string;
}

export const useExperiences = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('experience')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setExperiences(data || []);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch experiences';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createExperience = async (data: Omit<Experience, 'id' | 'created_at'>) => {
    try {
      const { data: result, error: insertError } = await supabase
        .from('experience')
        .insert([data])
        .select();

      if (insertError) throw insertError;
      await fetchExperiences();
      toast.success('Experience added successfully');
      return result[0];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add experience';
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateExperience = async (id: number, data: Partial<Experience>) => {
    try {
      const { data: result, error: updateError } = await supabase
        .from('experience')
        .update(data)
        .eq('id', id)
        .select();

      if (updateError) throw updateError;
      await fetchExperiences();
      toast.success('Experience updated successfully');
      return result[0];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update experience';
      toast.error(errorMessage);
      throw err;
    }
  };

  const deleteExperience = async (id: number) => {
    try {
      const { error: deleteError } = await supabase
        .from('experience')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await fetchExperiences();
      toast.success('Experience deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete experience';
      toast.error(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  return {
    experiences,
    loading,
    error,
    fetchExperiences,
    createExperience,
    updateExperience,
    deleteExperience,
  };
};
