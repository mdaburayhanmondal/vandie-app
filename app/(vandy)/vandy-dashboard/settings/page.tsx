'use client';

import { useState, useEffect, useMemo } from 'react';
import { getVandyDetails, updateStore } from '@/lib/actions/store.actions';
import { useUser } from '@clerk/nextjs';
import {
  FaStore,
  FaMapMarkerAlt,
  FaIdCard,
  FaSpinner,
  FaCheckCircle,
  FaArrowLeft,
} from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CldImageUpload from '@/components/CldImageUpload';

export default function VandySettingsPage() {
  const { user } = useUser();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [storeData, setStoreData] = useState<any>(null);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [coverImageUrl, setCoverImageUrl] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Memoize local preview URL
  const localPreviewUrl = useMemo(() => {
    if (selectedFile) return URL.createObjectURL(selectedFile);
    return null;
  }, [selectedFile]);

  useEffect(() => {
    if (user) {
      getVandyDetails(user.id).then((data) => {
        if (data?.vandy) {
          setStoreData(data.vandy);
          setCoverImageUrl(data.vandy.coverImage || '');
        }
        setLoading(false);
      });
    }
  }, [user]);

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append(
      'upload_preset',
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
    );

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData },
      );
      const data = await response.json();
      return data.secure_url || null;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;

    setSaving(true);
    setMessage(null);

    let finalImageUrl = coverImageUrl;

    // 1. Handle actual Cloudinary upload if a new file is chosen
    if (selectedFile) {
      const uploadedUrl = await uploadToCloudinary(selectedFile);
      if (!uploadedUrl) {
        setMessage({
          type: 'error',
          text: 'Image upload failed. Please try again.',
        });
        setSaving(false);
        return;
      }
      finalImageUrl = uploadedUrl;
    }

    // 2. Prepare FormData from the captured form reference
    const formData = new FormData(formElement);
    formData.set('coverImage', finalImageUrl);

    const result = await updateStore(formData);

    if (result.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });

      // Update local states to refresh the UI properly
      setCoverImageUrl(finalImageUrl);
      setSelectedFile(null); // Clear the local blob to show the Cloudinary URL

      setTimeout(() => setMessage(null), 3000);
      router.refresh();
    } else {
      setMessage({
        type: 'error',
        text: result.error || 'Something went wrong.',
      });
    }
    setSaving(false);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-orange-600" size={30} />
      </div>
    );

  return (
    <section className="max-w-4xl mx-auto p-6 pb-20">
      <header className="mb-10">
        <Link
          href="/vandy-dashboard"
          className="inline-flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-orange-600 transition-colors mb-6"
        >
          <FaArrowLeft /> Command Center
        </Link>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900">
          Customize Profile
        </h1>
        <p className="text-gray-500 font-medium italic">
          Shape your brand and how foodies see your shop.
        </p>
      </header>

      {message && (
        <div
          className={`mb-8 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 border ${
            message.type === 'success' ?
              'bg-green-50 text-green-700 border-green-100'
            : 'bg-red-50 text-red-700 border-red-100'
          }`}
        >
          <FaCheckCircle />
          <span className="text-sm font-black uppercase tracking-tight">
            {message.text}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left: Preview */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="h-32 bg-orange-100 relative overflow-hidden flex items-center justify-center">
              {localPreviewUrl || coverImageUrl ?
                <Image
                  src={localPreviewUrl || coverImageUrl}
                  alt="Cover Preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              : <span className="text-orange-200 font-black italic uppercase text-2xl opacity-40">
                  Cover Preview
                </span>
              }
            </div>
            <div className="p-6">
              <h3 className="font-black text-gray-900 italic uppercase truncate">
                {storeData?.storeName}
              </h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                {storeData?.location}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-50">
                <p className="text-[10px] text-gray-500 italic leading-relaxed line-clamp-3">
                  "{storeData?.bio || 'No bio set yet...'}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: The Edit Form */}
        <div className="md:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-10 shadow-sm space-y-6"
          >
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <FaStore className="text-orange-600" /> Store Name
              </label>
              <input
                type="text"
                name="storeName"
                defaultValue={storeData?.storeName}
                required
                className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-black text-gray-900 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <FaIdCard className="text-orange-600" /> Your Story (Bio)
              </label>
              <textarea
                name="bio"
                defaultValue={storeData?.bio}
                required
                maxLength={200}
                className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-medium italic text-gray-900 h-32 outline-none focus:ring-4 focus:ring-orange-100 transition-all resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <FaMapMarkerAlt className="text-orange-600" /> Exact Location
              </label>
              <input
                type="text"
                name="location"
                defaultValue={storeData?.location}
                required
                className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-gray-900 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-50">
              <CldImageUpload
                label="Store Cover Banner"
                defaultValue={coverImageUrl}
                onFileSelect={(file) => setSelectedFile(file)}
              />
              {/* Ensure the hidden input always has a valid string value */}
              <input
                type="hidden"
                name="coverImage"
                value={coverImageUrl || ''}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase text-sm tracking-[0.2em] shadow-xl hover:bg-orange-600 transition-all active:scale-95 disabled:bg-gray-200 disabled:shadow-none flex items-center justify-center gap-3"
            >
              {saving ?
                <>
                  <FaSpinner className="animate-spin" /> Updating...
                </>
              : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
