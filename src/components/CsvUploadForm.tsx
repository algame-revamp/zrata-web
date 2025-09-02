'use client';

import React, { useState, useRef } from 'react';
import { useFileUpload } from '../hooks/useFileUpload';

interface CsvUploadFormProps {
  uploadUrl?: string;
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
}

export default function CsvUploadForm({ 
  uploadUrl = '/api/upload/csv',
  onSuccess,
  onError 
}: CsvUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploading, error, success, result, uploadFile, reset } = useFileUpload();

  const handleFileSelect = (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    reset();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const result = await uploadFile(selectedFile, uploadUrl);
      onSuccess?.(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      onError?.(errorMessage);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Upload CSV File</h2>
      
      {/* File Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          dragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        {selectedFile ? (
          <div className="text-green-600">
            <div className="text-4xl mb-2">📄</div>
            <p className="font-medium">{selectedFile.name}</p>
            <p className="text-sm text-gray-500">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
          </div>
        ) : (
          <div className="text-gray-500">
            <div className="text-4xl mb-2">📁</div>
            <p className="mb-2">Drop your CSV file here</p>
            <p className="text-sm">or click to browse</p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && result && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          <p>✅ File uploaded successfully!</p>
          {result.message && <p className="text-sm mt-1">{result.message}</p>}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3">
        {selectedFile && !success && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`flex-1 py-2 px-4 rounded font-medium ${
              uploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        )}
        
        {(selectedFile || success) && (
          <button
            onClick={handleReset}
            className="py-2 px-4 border border-gray-300 rounded font-medium hover:bg-gray-50"
          >
            {success ? 'Upload Another' : 'Clear'}
          </button>
        )}
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: '50%' }} // You can make this dynamic
            />
          </div>
          <p className="text-sm text-gray-600 mt-1 text-center">Processing...</p>
        </div>
      )}
    </div>
  );
}