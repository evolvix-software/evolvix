"use client";

import { useState, useRef } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { uploadDocument } from '@/store/features/verification/verificationThunks';
import { Button } from '@/components/forms/Button';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';

interface DocumentUploadProps {
  label: string;
  description?: string;
  acceptedTypes?: string;
  maxSize?: number; // in MB
  onUploadComplete?: (url: string) => void;
  required?: boolean;
}

export function DocumentUpload({ 
  label, 
  description, 
  acceptedTypes = "image/*,.pdf,.doc,.docx",
  maxSize = 10,
  onUploadComplete,
  required = false
}: DocumentUploadProps) {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    setError(null);
    setUploadedFile(file);
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      const result = await dispatch(uploadDocument({ 
        file: uploadedFile, 
        documentType: label 
      })).unwrap();
      
      if (onUploadComplete) {
        onUploadComplete(result.documentUrl);
      }
      
      setUploadProgress(100);
    } catch (err) {
      setError('Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        )}
      </div>

      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
        {!uploadedFile ? (
          <div className="text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-orange-600 hover:text-orange-500 font-medium"
              >
                Click to upload
              </button>
              <span className="mx-2">or drag and drop</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {acceptedTypes} (max {maxSize}MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedTypes}
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {uploadedFile.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(uploadedFile.size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {uploadProgress === 100 ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {uploadProgress === 0 && (
              <Button
                type="button"
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full"
              >
                {isUploading ? 'Uploading...' : 'Upload Document'}
              </Button>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

