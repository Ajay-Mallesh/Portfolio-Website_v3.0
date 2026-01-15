import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

export interface Project {
  id: string;
  title: string;
  synopsis: string;
  abstract: string;
  techStack: string[];
  github?: string;
  live?: string;
  outcomes: string;
  created_at?: string;
}

export interface ProjectFile {
  id: string;
  project_id: string;
  file_url: string;
  file_type: string;
  file_name: string;
  created_at?: string;
}

// Database record type matching schema
interface ProjectRecord {
  id: string;
  title: string;
  synopsis: string;
  abstract: string;
  technologies: string | string[];
  github_link: string;
  outcome: string;
  created_at?: string;
}

// Helper to transform database record to app format
const transformFromDb = (record: any): Project => {
  let techStack: string[] = [];
  try {
    if (Array.isArray(record.technologies)) {
      techStack = record.technologies;
    } else if (typeof record.technologies === 'string') {
      techStack = JSON.parse(record.technologies);
    }
  } catch (e) {
    console.error('Error parsing techStack:', e);
    techStack = [];
  }

  return {
    id: record.id.toString(),
    title: record.title,
    synopsis: record.synopsis,
    abstract: record.abstract,
    techStack,
    github: record.github_link,
    outcomes: record.outcome,
    created_at: record.created_at,
  };
};

// Helper to transform app format to database record
const transformToDb = (project: Partial<Omit<Project, 'id' | 'created_at'>>) => {
  const dbData: Record<string, any> = {};

  if (project.title !== undefined) dbData.title = project.title;
  if (project.synopsis !== undefined) dbData.synopsis = project.synopsis;
  if (project.abstract !== undefined) dbData.abstract = project.abstract;
  if (project.techStack !== undefined) {
    try {
      dbData.technologies = JSON.stringify(project.techStack);
    } catch (e) {
      console.error('Error stringifying techStack:', e);
      dbData.technologies = '[]';
    }
  }
  if (project.github !== undefined) dbData.github_link = project.github || '';
  if (project.outcomes !== undefined) dbData.outcome = project.outcomes;

  return dbData;
};

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      const transformedProjects = (data || []).map(transformFromDb);
      setProjects(transformedProjects);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch projects';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: Omit<Project, 'id' | 'created_at'>) => {
    try {
      const dbData = transformToDb(projectData);

      const { data, error: insertError } = await supabase
        .from('projects')
        .insert([dbData])
        .select();

      if (insertError) {
        throw insertError;
      }

      const newProject = data?.[0] ? transformFromDb(data[0]) : null;
      if (newProject) {
        setProjects([newProject, ...projects]);
      }
      toast.success('Project created successfully');
      return newProject;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      console.error('Create project error:', err);
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateProject = async (id: string, projectData: Partial<Project>) => {
    try {
      const dbData = transformToDb(projectData);

      const { data, error: updateError } = await supabase
        .from('projects')
        .update(dbData)
        .eq('id', id)
        .select();

      if (updateError) {
        throw updateError;
      }

      const updatedProject = data?.[0] ? transformFromDb(data[0]) : null;
      if (updatedProject) {
        setProjects(projects.map((p) => (p.id === id ? updatedProject : p)));
      }
      toast.success('Project updated successfully');
      return updatedProject;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update project';
      console.error('Update project error:', err);
      toast.error(errorMessage);
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      setProjects(projects.filter((p) => p.id !== id));
      toast.success('Project deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete project';
      console.error('Delete project error:', err);
      toast.error(errorMessage);
      throw err;
    }
  };

  const uploadProjectFile = async (projectId: string, file: File, fileType: 'diagram' | 'report') => {
    try {
      if (!file) return null;

      console.log(`Starting upload for ${fileType}:`, file.name);

      // Generate unique file path in projects folder
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const fileName = `projects/${projectId}/${fileType}_${timestamp}.${fileExt}`;

      console.log('Uploading to path:', fileName);

      // Upload file to storage
      const { data, error: uploadError } = await supabase.storage
        .from('portfolio-files')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        // Check if bucket doesn't exist
        if (uploadError.message.includes('Bucket not found')) {
          throw new Error(`Storage bucket 'portfolio-files' not found.`);
        }
        throw uploadError;
      }

      console.log('File uploaded successfully:', data);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('portfolio-files')
        .getPublicUrl(fileName);

      console.log('Generated public URL:', urlData.publicUrl);

      // Save file reference to database
      const { data: fileRecord, error: dbError } = await supabase
        .from('project_files')
        .insert([
          {
            project_id: projectId,
            file_url: urlData.publicUrl,
            file_type: fileType,
            file_name: file.name,
          },
        ])
        .select();

      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }

      toast.success(`${fileType === 'diagram' ? 'Block diagram' : 'Report'} uploaded successfully`);
      return fileRecord?.[0];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to upload ${fileType}`;
      console.error(`Upload ${fileType} error:`, err);
      toast.error(errorMessage);
      throw err;
    }
  };

  const fetchProjectFiles = async (projectId: string): Promise<ProjectFile[]> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('project_files')
        .select('*')
        .eq('project_id', projectId);

      if (fetchError) {
        throw fetchError;
      }

      return data || [];
    } catch (err) {
      console.error('Fetch project files error:', err);
      return [];
    }
  };

  const deleteProjectFile = async (fileId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('project_files')
        .delete()
        .eq('id', fileId);

      if (deleteError) {
        throw deleteError;
      }

      toast.success('File deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete file';
      console.error('Delete file error:', err);
      toast.error(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    uploadProjectFile,
    fetchProjectFiles,
    deleteProjectFile,
  };
};
