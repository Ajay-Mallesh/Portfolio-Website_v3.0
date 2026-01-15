import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

export interface Education {
  id: number;
  qualification: string;
  college: string;
  university: string;
  year_from: number;
  year_to: number;
  percentage: string;
  location: string;
  created_at?: string;
}

export const useEducation = () => {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEducation = async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('education')
        .select('*')
        .order('year_to', { ascending: false });

      if (fetchError) throw fetchError;
      setEducation(data || []);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch education';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createEducation = async (data: Omit<Education, 'id' | 'created_at'>) => {
    try {
      const { data: result, error: insertError } = await supabase
        .from('education')
        .insert([data])
        .select();

      if (insertError) throw insertError;
      setEducation([...education, result[0]]);
      toast.success('Education added successfully');
      return result[0];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add education';
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateEducation = async (id: number, data: Partial<Education>) => {
    try {
      const { data: result, error: updateError } = await supabase
        .from('education')
        .update(data)
        .eq('id', id)
        .select();

      if (updateError) throw updateError;
      setEducation(education.map((e) => (e.id === id ? result[0] : e)));
      toast.success('Education updated successfully');
      return result[0];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update education';
      toast.error(errorMessage);
      throw err;
    }
  };

  const deleteEducation = async (id: number) => {
    try {
      const { error: deleteError } = await supabase
        .from('education')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setEducation(education.filter((e) => e.id !== id));
      toast.success('Education deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete education';
      toast.error(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  return {
    education,
    loading,
    error,
    createEducation,
    updateEducation,
    deleteEducation,
  };
};
