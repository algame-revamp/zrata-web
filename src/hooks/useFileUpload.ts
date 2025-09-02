import { useState } from 'react';

interface UploadState {
  uploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
  result: any | null;
}

export function useFileUpload() {
  const [state, setState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
    success: false,
    result: null,
  });

  const uploadFile = async (file: File, url: string) => {
    setState({
      uploading: true,
      progress: 0,
      error: null,
      success: false,
      result: null,
    });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      setState({
        uploading: false,
        progress: 100,
        error: null,
        success: true,
        result,
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setState({
        uploading: false,
        progress: 0,
        error: errorMessage,
        success: false,
        result: null,
      });
      throw error;
    }
  };

  const reset = () => {
    setState({
      uploading: false,
      progress: 0,
      error: null,
      success: false,
      result: null,
    });
  };

  return {
    ...state,
    uploadFile,
    reset,
  };
}