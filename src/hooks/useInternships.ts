import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

export interface Internship {
  id: string;
  company: string;
  role: string;
  duration: string;
  location: string;
  description: string;
  skills: string[];
  created_at?: string;
}

export const useInternships = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('internships')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setInternships(data || []);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch internships';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createInternship = async (data: Omit<Internship, 'id' | 'created_at'>) => {
    try {
      const { data: result, error: insertError } = await supabase
        .from('internships')
        .insert([data])
        .select();

      if (insertError) throw insertError;
      await fetchInternships();
      toast.success('Internship added successfully');
      return result[0];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add internship';
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateInternship = async (id: string, data: Partial<Internship>) => {
    try {
      const { data: result, error: updateError } = await supabase
        .from('internships')
        .update(data)
        .eq('id', id)
        .select();

      if (updateError) throw updateError;
      await fetchInternships();
      toast.success('Internship updated successfully');
      return result[0];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update internship';
      toast.error(errorMessage);
      throw err;
    }
  };

  const deleteInternship = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('internships')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await fetchInternships();
      toast.success('Internship deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete internship';
      toast.error(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  return {
    internships,
    loading,
    error,
    fetchInternships,
    createInternship,
    updateInternship,
    deleteInternship,
  };
};
