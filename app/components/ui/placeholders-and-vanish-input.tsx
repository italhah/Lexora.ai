import React, { useState, useRef, useEffect } from 'react';
import { IconUpload } from "@tabler/icons-react";
import { IconSend } from "@tabler/icons-react";
import { IconX } from "@tabler/icons-react";
import { IconPlayerStop } from "@tabler/icons-react";

interface PlaceholdersAndVanishInputProps {
  placeholders: string[];
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onFileUpload: (file: File | null) => void;
  onStopGeneration: () => void;
  isGenerating: boolean;
  isLoading: boolean;
  loadingText: string;
  value: string;
}

export const PlaceholdersAndVanishInput: React.FC<PlaceholdersAndVanishInputProps> = ({
  placeholders,
  onChange,
  onSubmit,
  onFileUpload,
  onStopGeneration,
  isGenerating,
  isLoading,
  loadingText,
  value,
}) => {
  const [placeholder, setPlaceholder] = useState(placeholders[0]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let i = 0;
    const intervalId = setInterval(() => {
      i = (i + 1) % placeholders.length;
      setPlaceholder(placeholders[i]);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [placeholders]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value.trim() || selectedFile) {
      onSubmit(e);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileUpload(file);
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    onFileUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative bg-zinc-900 rounded-lg p-4 flex flex-col">
      <div className="mb-4 flex-grow">
        <textarea
          ref={inputRef}
          name="input"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-2 py-2 text-gray-200 bg-zinc-900 border xs:text-xs sm:text-xs md:text-sm lg:text-sm border-zinc-800 rounded-lg focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-600 focus:ring-opacity-60 resize-none overflow-hidden"
          disabled={isGenerating}
          rows={1}
        />
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {selectedFile ? (
            <button
              type="button"
              onClick={handleRemoveFile}
              className="flex items-center px-3 py-2 bg-zinc-800 rounded-full mr-2 hover:bg-zinc-900 transition-colors"
              disabled={isGenerating}
            >
              <IconX className="h-5 w-5 text-gray-300" />
              <span className="text-sm text-gray-300 truncate max-w-[150px]">{selectedFile.name}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFileUploadClick}
              className="flex items-center px-3 py-2 bg-zinc-800 rounded-full mr-2 hover:bg-gray-600 transition-colors"
              disabled={isGenerating}
            >
              <IconUpload className="h-5 w-5 text-gray-300" />
              <span className="text-sm text-gray-300"></span>
            </button>
          )}
        </div>
        {isGenerating ? (
          <button
            type="button"
            onClick={onStopGeneration}
            className="flex items-center justify-center px-4 py-2 text-white bg-red-500 rounded-full hover:bg-red-600 focus:bg-red-600 focus:outline-none transition-colors"
          >
            <IconPlayerStop className="h-5 w-5" />
            <span className="text-sm"></span>
          </button>
        ) : (
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center px-4 py-2 text-white bg-blue-600 rounded-full hover:bg-blue-800 focus:bg-blue-600 focus:outline-none transition-colors disabled:opacity-100"
          >
            {isLoading ? (
              <span className="text-sm">{loadingText}</span>
            ) : (
              <>
                <IconSend className="h-5 w-5" />
                <span className="text-sm"></span>
              </>
            )}
          </button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />
    </form>
  );
};

