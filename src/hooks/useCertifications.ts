import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

export interface Certification {
  id: string;
  title: string;
  provider: string;
  date: string;
  skills: string[];
  credentialUrl?: string;
  issuedTo?: string;
  issuedBy?: string;
  expiryDate?: string;
  created_at?: string;
}

export const useCertifications = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCertifications = async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('certifications')
        .select('*')
        .order('date', { ascending: false });

      if (fetchError) throw fetchError;
      setCertifications(data || []);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch certifications';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createCertification = async (data: Omit<Certification, 'id' | 'created_at'>) => {
    try {
      const { data: result, error: insertError } = await supabase
        .from('certifications')
        .insert([data])
        .select();

      if (insertError) throw insertError;
      await fetchCertifications();
      toast.success('Certification added successfully');
      return result[0];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add certification';
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateCertification = async (id: string, data: Partial<Certification>) => {
    try {
      const { data: result, error: updateError } = await supabase
        .from('certifications')
        .update(data)
        .eq('id', id)
        .select();

      if (updateError) throw updateError;
      await fetchCertifications();
      toast.success('Certification updated successfully');
      return result[0];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update certification';
      toast.error(errorMessage);
      throw err;
    }
  };

  const deleteCertification = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('certifications')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await fetchCertifications();
      toast.success('Certification deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete certification';
      toast.error(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  return {
    certifications,
    loading,
    error,
    fetchCertifications,
    createCertification,
    updateCertification,
    deleteCertification,
  };
};
