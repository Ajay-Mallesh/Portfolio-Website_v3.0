import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';

export interface Resume {
  id: number;
  title: string;
  type: 'pdf' | 'word' | 'link';
  file_url: string;
  file_name?: string;
  upload_file?: string | null;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export const useResume = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all resumes
  const fetchResumes = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('resume')
        .select('*')
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setResumes(data || []);
      return data || [];
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to fetch resumes';
      setError(errorMsg);
      toast.error(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get primary resume
  const getPrimaryResume = async (): Promise<Resume | null> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('resume')
        .select('*')
        .eq('is_primary', true)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
      return data || null;
    } catch (err: any) {
      console.error('Error fetching primary resume:', err);
      return null;
    }
  };

  // Upload resume file to storage
  const uploadResumeFile = async (file: File): Promise<string | null> => {
    try {
      const timestamp = Date.now();
      // Remove special characters from filename to avoid issues
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `resume/${timestamp}-${cleanFileName}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('portfolio-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicURL } = supabase.storage
        .from('portfolio-files')
        .getPublicUrl(fileName);

      return publicURL?.publicUrl || null;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to upload resume';
      toast.error(errorMsg);
      return null;
    }
  };

  // Create resume
  const createResume = async (resumeData: {
    title: string;
    type: 'pdf' | 'word' | 'link';
    file_url: string;
    file_name?: string;
    upload_file?: string | null;
    is_primary?: boolean;
  }): Promise<Resume | null> => {
    try {
      setLoading(true);
      setError(null);

      // If setting as primary, unset other primaries
      if (resumeData.is_primary) {
        await supabase
          .from('resume')
          .update({ is_primary: false })
          .eq('is_primary', true);
      }

      const { data, error: insertError } = await supabase
        .from('resume')
        .insert([
          {
            title: resumeData.title,
            type: resumeData.type,
            file_url: resumeData.file_url,
            file_name: resumeData.file_name || null,
            upload_file: resumeData.upload_file || null,
            is_primary: resumeData.is_primary || false,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      toast.success('Resume added successfully!');
      await fetchResumes();
      return data;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to create resume';
      setError(errorMsg);
      toast.error(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update resume
  const updateResume = async (
    id: number,
    resumeData: Partial<Omit<Resume, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<Resume | null> => {
    try {
      setLoading(true);
      setError(null);

      // If setting as primary, unset other primaries
      if (resumeData.is_primary) {
        await supabase
          .from('resume')
          .update({ is_primary: false })
          .neq('id', id)
          .eq('is_primary', true);
      }

      const { data, error: updateError } = await supabase
        .from('resume')
        .update({
          ...resumeData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      toast.success('Resume updated successfully!');
      await fetchResumes();
      return data;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to update resume';
      setError(errorMsg);
      toast.error(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete resume
  const deleteResume = async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('resume')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      toast.success('Resume deleted successfully!');
      await fetchResumes();
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to delete resume';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Open resume
  const openResume = (resume: Resume): void => {
    if (resume.type === 'link') {
      window.open(resume.file_url, '_blank');
    } else {
      // For PDF and Word files stored as URLs
      window.open(resume.file_url, '_blank');
    }
  };

  return {
    resumes,
    loading,
    error,
    fetchResumes,
    getPrimaryResume,
    createResume,
    updateResume,
    deleteResume,
    openResume,
    uploadResumeFile,
  };
};
