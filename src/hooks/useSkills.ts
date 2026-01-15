import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';

export interface Skill {
  id: number;
  name: string;
  level: number;
  category?: string;
  created_at?: string;
  updated_at?: string;
}

export const useTechnicalSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all technical skills
  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('technical_skills')
        .select('*')
        .order('level', { ascending: false })
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;
      setSkills(data || []);
      return data || [];
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to fetch technical skills';
      setError(errorMsg);
      toast.error(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Create skill
  const createSkill = async (skillData: Omit<Skill, 'id' | 'created_at' | 'updated_at'>): Promise<Skill | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: insertError } = await supabase
        .from('technical_skills')
        .insert([skillData])
        .select()
        .single();

      if (insertError) throw insertError;

      toast.success('Skill added successfully!');
      await fetchSkills();
      return data;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to create skill';
      setError(errorMsg);
      toast.error(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update skill
  const updateSkill = async (id: number, skillData: Partial<Omit<Skill, 'id' | 'created_at' | 'updated_at'>>): Promise<Skill | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('technical_skills')
        .update({
          ...skillData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      toast.success('Skill updated successfully!');
      await fetchSkills();
      return data;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to update skill';
      setError(errorMsg);
      toast.error(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete skill
  const deleteSkill = async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('technical_skills')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      toast.success('Skill deleted successfully!');
      await fetchSkills();
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to delete skill';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return {
    skills,
    loading,
    error,
    fetchSkills,
    createSkill,
    updateSkill,
    deleteSkill,
  };
};

export const useOtherSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all other skills
  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('other_skills')
        .select('*')
        .order('level', { ascending: false })
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;
      setSkills(data || []);
      return data || [];
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to fetch other skills';
      setError(errorMsg);
      toast.error(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Create skill
  const createSkill = async (skillData: Omit<Skill, 'id' | 'created_at' | 'updated_at'>): Promise<Skill | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: insertError } = await supabase
        .from('other_skills')
        .insert([skillData])
        .select()
        .single();

      if (insertError) throw insertError;

      toast.success('Skill added successfully!');
      await fetchSkills();
      return data;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to create skill';
      setError(errorMsg);
      toast.error(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update skill
  const updateSkill = async (id: number, skillData: Partial<Omit<Skill, 'id' | 'created_at' | 'updated_at'>>): Promise<Skill | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('other_skills')
        .update({
          ...skillData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      toast.success('Skill updated successfully!');
      await fetchSkills();
      return data;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to update skill';
      setError(errorMsg);
      toast.error(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete skill
  const deleteSkill = async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('other_skills')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      toast.success('Skill deleted successfully!');
      await fetchSkills();
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to delete skill';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return {
    skills,
    loading,
    error,
    fetchSkills,
    createSkill,
    updateSkill,
    deleteSkill,
  };
};
