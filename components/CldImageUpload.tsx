'use client';

import { useState, useRef, useEffect } from 'react';
import { FaImage, FaCloudUploadAlt } from 'react-icons/fa';
import Image from 'next/image';

interface CldImageUploadProps {
  onFileSelect: (file: File | null) => void;
  defaultValue?: string;
  label?: string;
}

export default function CldImageUpload({
  onFileSelect,
  defaultValue,
  label,
}: CldImageUploadProps) {
  // Initialize with defaultValue or empty string
  const [preview, setPreview] = useState(defaultValue || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync internal preview whenever the saved defaultValue changes (e.g., after a DB save)
  useEffect(() => {
    setPreview(defaultValue || '');
  }, [defaultValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      onFileSelect(null);
      return;
    }

    // Show local preview immediately for UX
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    // Pass the actual file object to the parent for later upload
    onFileSelect(file);
  };

  // Clean up the object URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="w-full">
      {label && (
        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
          <FaImage className="text-orange-600" /> {label}
        </label>
      )}

      <div
        onClick={() => fileInputRef.current?.click()}
        className="relative h-48 w-full rounded-4xl border-2 border-dashed cursor-pointer overflow-hidden transition-all flex items-center justify-center border-gray-100 hover:border-orange-200 bg-gray-50"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />

        {preview ?
          <>
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <FaCloudUploadAlt /> Change Photo
              </div>
            </div>
          </>
        : <div className="flex flex-col items-center gap-2 text-gray-300 group">
            <FaCloudUploadAlt
              size={40}
              className="group-hover:text-orange-400 transition-colors"
            />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Select Image
            </span>
          </div>
        }
      </div>
    </div>
  );
}
