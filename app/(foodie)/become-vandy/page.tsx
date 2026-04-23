'use client';

import { useState, useEffect } from 'react';
import { createStore, getVandyDetails } from '@/lib/actions/store.actions';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  FaStore,
  FaMapMarkerAlt,
  FaIdCard,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowRight,
  FaPaperPlane,
} from 'react-icons/fa';
import Link from 'next/link';
import CldImageUpload from '@/components/CldImageUpload';

export default function BecomeVandyPage() {
  const { user } = useUser();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [storeData, setStoreData] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      getVandyDetails(user.id).then((data) => {
        if (data?.vandy) {
          setStoreData(data.vandy);
          if (data.vandy.applicationStatus === 'approved') {
            router.push('/vandy-dashboard');
          }
        }
        setLoading(false);
      });
    }
  }, [user, router]);

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
    } catch (err) {
      console.error('Cloudinary Error:', err);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    setSaving(true);
    setError('');

    // Start with the existing image if re-applying
    let finalImageUrl = storeData?.coverImage || '';

    // 1. Upload new image if selected
    if (selectedFile) {
      const uploadedUrl = await uploadToCloudinary(selectedFile);
      if (!uploadedUrl) {
        setError('Image upload failed. Please try again.');
        setSaving(false);
        return;
      }
      finalImageUrl = uploadedUrl;
    }

    // 2. Strict validation: Must have a photo for verification
    if (!finalImageUrl) {
      setError('A photo of your cart is mandatory for verification.');
      setSaving(false);
      return;
    }

    // 3. Prepare FormData
    const formData = new FormData(formElement);
    // Explicitly set the coverImage in case the hidden input hasn't updated
    formData.set('coverImage', finalImageUrl);

    const result = (await createStore(formData)) as {
      success: boolean;
      error?: string;
    } | void;

    if (result && result.success) {
      router.refresh();
      // On refresh, the useEffect will fetch the new 'pending' status
    } else {
      setError(result?.error || 'Failed to submit application.');
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-orange-600" size={30} />
      </div>
    );

  if (storeData?.applicationStatus === 'pending') {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-50">
        <div className="w-24 h-24 bg-white text-orange-600 rounded-[2.5rem] border border-orange-100 flex items-center justify-center mb-8 shadow-xl animate-bounce">
          <FaIdCard size={40} />
        </div>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900 mb-4">
          Verification in Progress
        </h1>
        <p className="text-gray-500 max-w-md italic font-medium leading-relaxed">
          The Warden is currently reviewing your application. We'll verify your
          cart photo and details shortly. Check back soon!
        </p>
        <Link
          href="/"
          className="mt-10 text-orange-600 font-black uppercase text-xs tracking-widest hover:underline flex items-center gap-2"
        >
          <FaArrowRight className="rotate-180" /> Return Home
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto p-6 py-20 min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black italic uppercase tracking-tighter text-gray-900">
          Join the Movement
        </h1>
        <p className="text-gray-500 mt-2 font-medium italic">
          Start your journey as a nomadic artisan.
        </p>

        {storeData?.applicationStatus === 'rejected' && (
          <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center gap-3 text-red-600">
            <FaExclamationTriangle />
            <span className="text-xs font-black uppercase tracking-tight">
              Application Rejected: Please update your photo or details.
            </span>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 md:p-12 rounded-[3rem] border border-gray-100 shadow-sm"
      >
        <div className="space-y-8">
          <CldImageUpload
            label="Live Cart Photo"
            defaultValue={storeData?.coverImage}
            onFileSelect={(file) => setSelectedFile(file)}
          />

          <div className="bg-black text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <FaCheckCircle size={80} />
            </div>
            <h4 className="text-xs font-black uppercase tracking-widest text-orange-500 mb-2">
              Warden's Rule
            </h4>
            <p className="text-xs italic text-gray-400 leading-relaxed">
              Anonymous vendors are not allowed. A clear photo of your physical
              stall ensures you get verified quickly.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[10px] font-black uppercase tracking-widest">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
              <FaStore className="text-orange-600" /> Shop Name
            </label>
            <input
              name="storeName"
              defaultValue={storeData?.storeName}
              required
              placeholder="e.g. Rayhan's Naga Pit"
              className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-black text-gray-900 focus:border-orange-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
              <FaIdCard className="text-orange-600" /> Shop Bio
            </label>
            <textarea
              name="bio"
              defaultValue={storeData?.bio}
              required
              minLength={20}
              placeholder="Tell us about your secret recipes..."
              className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-medium italic text-gray-900 h-32 outline-none focus:border-orange-500 transition-all resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
              <FaMapMarkerAlt className="text-orange-600" /> Primary Location
            </label>
            <input
              name="location"
              defaultValue={storeData?.location}
              required
              placeholder="e.g. Dhanmondi 27, KB Plaza Corner"
              className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-gray-900 focus:border-orange-500 outline-none transition-all"
            />
          </div>

          {/* Hidden input to ensure FormData captures the URL correctly */}
          <input
            type="hidden"
            name="coverImage"
            value={storeData?.coverImage || ''}
          />

          <button
            type="submit"
            disabled={saving}
            className="w-full py-6 bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-orange-600 transition-all active:scale-95 disabled:bg-gray-200 flex items-center justify-center gap-3 shadow-xl mt-4"
          >
            {saving ?
              <>
                <FaSpinner className="animate-spin" /> Submitting...
              </>
            : <>
                <FaPaperPlane /> Submit Application
              </>
            }
          </button>
        </div>
      </form>
    </section>
  );
}
