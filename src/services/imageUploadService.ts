
import { supabase } from "@/integrations/supabase/client";

export const uploadImage = async (file: File, bucket: string, path?: string): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};

export const uploadMultipleImages = async (files: File[], bucket: string, path?: string): Promise<string[]> => {
  const uploadPromises = files.map(file => uploadImage(file, bucket, path));
  return Promise.all(uploadPromises);
};
