
import { supabase } from "@/integrations/supabase/client";

export const uploadImage = async (file: File, bucket: string, path?: string): Promise<string> => {
  try {
    // Check if bucket exists, if not return placeholder
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError || !buckets?.some(b => b.name === bucket)) {
      console.warn(`Storage bucket '${bucket}' not found, using placeholder image`);
      return '/placeholder.svg';
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      console.warn('Upload failed, using placeholder:', uploadError);
      return '/placeholder.svg';
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return '/placeholder.svg';
  }
};

export const uploadMultipleImages = async (files: File[], bucket: string, path?: string): Promise<string[]> => {
  const uploadPromises = files.map(file => uploadImage(file, bucket, path));
  return Promise.all(uploadPromises);
};
