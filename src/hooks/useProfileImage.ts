import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';

export interface ProfileImage {
  id: number;
  image_url: string;
  image_type: 'jpeg' | 'png' | 'link';
  file_name?: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export const useProfileImage = () => {
  const [images, setImages] = useState<ProfileImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all profile images
  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('profile_image')
        .select('*')
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setImages(data || []);
      return data || [];
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to fetch profile images';
      setError(errorMsg);
      toast.error(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get primary image
  const getPrimaryImage = async (): Promise<ProfileImage | null> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('profile_image')
        .select('*')
        .eq('is_primary', true)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
      return data || null;
    } catch (err: any) {
      console.error('Error fetching primary image:', err);
      return null;
    }
  };

  // Upload image file to storage
  const uploadImageFile = async (file: File): Promise<string | null> => {
    try {
      // Validate file type
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        throw new Error('Only JPEG and PNG images are allowed');
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('Image size must be less than 5MB');
      }

      const timestamp = Date.now();
      // Remove special characters from filename
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `Profile_image/${timestamp}-${cleanFileName}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('portfolio-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicURL } = supabase.storage
        .from('portfolio-files')
        .getPublicUrl(fileName);

      return publicURL?.publicUrl || null;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to upload image';
      console.error('Image upload error:', err);
      toast.error(errorMsg);
      return null;
    }
  };

  // Create profile image
  const createImage = async (
    image_url: string,
    image_type: 'jpeg' | 'png' | 'link',
    file_name?: string,
    is_primary?: boolean
  ): Promise<ProfileImage | null> => {
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!image_url || !image_type) {
        throw new Error('Image URL and type are required');
      }

      // If setting as primary, unset other primaries
      if (is_primary) {
        await supabase
          .from('profile_image')
          .update({ is_primary: false })
          .eq('is_primary', true);
      }

      const { data, error: insertError } = await supabase
        .from('profile_image')
        .insert([
          {
            image_url,
            image_type,
            file_name: file_name || null,
            is_primary: is_primary || false,
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error('Insert error details:', insertError);
        throw insertError;
      }

      toast.success('Profile image added successfully!');
      await fetchImages();
      return data;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to create profile image';
      console.error('Create image error:', err);
      setError(errorMsg);
      toast.error(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update image
  const updateImage = async (
    id: number,
    imageData: Partial<Omit<ProfileImage, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<ProfileImage | null> => {
    try {
      setLoading(true);
      setError(null);

      // If setting as primary, unset other primaries
      if (imageData.is_primary) {
        await supabase
          .from('profile_image')
          .update({ is_primary: false })
          .neq('id', id)
          .eq('is_primary', true);
      }

      const { data, error: updateError } = await supabase
        .from('profile_image')
        .update({
          ...imageData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      toast.success('Profile image updated successfully!');
      await fetchImages();
      return data;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to update profile image';
      setError(errorMsg);
      toast.error(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete image
  const deleteImage = async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('profile_image')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      toast.success('Profile image deleted successfully!');
      await fetchImages();
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to delete profile image';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return {
    images,
    loading,
    error,
    fetchImages,
    getPrimaryImage,
    uploadImageFile,
    createImage,
    updateImage,
    deleteImage,
  };
};
