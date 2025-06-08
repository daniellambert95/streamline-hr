import React, { useState, useRef } from 'react';

interface FileUploadProps {
  accept: string;
  onChange: (file: File | null) => void;
  maxSize?: number; // in MB
  label?: string;
  initialFile?: File | null;
}

const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  onChange,
  maxSize = 5,
  label = 'Upload a file',
  initialFile = null,
}) => {
  const [file, setFile] = useState<File | null>(initialFile);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) {
      setFile(null);
      onChange(null);
      return;
    }

    // Check file size
    if (maxSize && selectedFile.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return;
    }

    // Check file type
    const fileType = selectedFile.type;
    const acceptedTypes = accept.split(',').map(type => type.trim());
    
    // If accept includes file extensions (e.g., .pdf)
    const fileExtension = `.${selectedFile.name.split('.').pop()?.toLowerCase()}`;
    const isAcceptedType = acceptedTypes.some(type => 
      type === fileType || 
      type === fileExtension || 
      (type.includes('/*') && fileType.startsWith(type.replace('/*', '/')))
    );

    if (!isAcceptedType) {
      setError(`File type not supported. Please upload ${accept} files.`);
      return;
    }

    setError(null);
    setFile(selectedFile);
    onChange(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full">
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragging 
              ? 'border-indigo-500 bg-indigo-50' 
              : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="mt-2 text-sm font-medium text-gray-900">{label}</p>
          <p className="mt-1 text-xs text-gray-500">
            Drag and drop or click to browse
          </p>
          {maxSize && (
            <p className="mt-1 text-xs text-gray-500">
              Maximum file size: {maxSize}MB
            </p>
          )}
          {error && (
            <p className="mt-2 text-xs text-red-600">{error}</p>
          )}
        </div>
      ) : (
        <div className="border rounded-lg p-4 flex items-center justify-between bg-gray-50">
          <div className="flex items-center space-x-3">
            <svg className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(file.size)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveFile();
            }}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={(e) => {
          const files = e.target.files;
          handleFileChange(files && files.length > 0 ? files[0] : null);
        }}
        className="hidden"
      />
    </div>
  );
};

export default FileUpload; 