import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const uploadFile = async (
  bucket: string,
  path: string,
  file: File,
  onProgress?: (progress: number) => void
) => {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: false,
    // @ts-ignore: onUploadProgress not typed yet
    onUploadProgress: (event) => {
      if (onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    },
  });
  if (error) throw error;
  return data;
};

export const getSignedUrl = async (bucket: string, path: string, expiresIn = 3600) => {
  // Server side will generate signed URL; client calls our API
  const response = await fetch(`/api/file/${bucket}/${encodeURIComponent(path)}?expires=${expiresIn}`);
  if (!response.ok) throw new Error('Failed to get signed URL');
  const { signedUrl } = await response.json();
  return signedUrl;
};

export const listFiles = async (bucket: string, prefix = '') => {
  const { data, error } = await supabase.storage.from(bucket).list(prefix);
  if (error) throw error;
  return data;
};
