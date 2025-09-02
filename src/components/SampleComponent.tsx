'use client';

import React from 'react';
import CsvUploadForm from './CsvUploadForm';
import { useApi } from '../hooks/useApi';

export default function CsvUploadPage() {
  const api = useApi({ baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api' });

  const handleUploadSuccess = (result: any) => {
    console.log('Upload successful:', result);
    // Handle success - maybe redirect or show success message
  };

  const handleUploadError = (error: string) => {
    console.error('Upload failed:', error);
    // Handle error - show error message to user
  };

  const handleGetData = async () => {
    try {
      const data = await api.get('/data');
      console.log('Data:', data);
    } catch (error) {
      console.error('Failed to get data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">CSV Upload</h1>
        
        <CsvUploadForm 
          uploadUrl="/api/upload/csv"
          onSuccess={handleUploadSuccess}
          onError={handleUploadError}
        />

        {/* Example API usage */}
        <div className="max-w-md mx-auto mt-8">
          <button
            onClick={handleGetData}
            disabled={api.loading}
            className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {api.loading ? 'Loading...' : 'Get Data from API'}
          </button>
          
          {api.error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
              {api.error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}