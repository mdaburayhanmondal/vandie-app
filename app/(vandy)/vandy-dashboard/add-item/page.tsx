'use client';

import { useState } from 'react';
import { addItem } from '@/lib/actions/item.actions';
import { useRouter } from 'next/navigation';
import {
  FaUtensils,
  FaTag,
  FaAlignLeft,
  FaMoneyBillWave,
  FaSpinner,
  FaPlus,
  FaArrowLeft,
  FaCheckCircle,
} from 'react-icons/fa';
import Link from 'next/link';
import CldImageUpload from '@/components/CldImageUpload';

export default function AddItemPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');

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

    let imageUrl = '';
    // 1. Upload image if selected
    if (selectedFile) {
      const uploadedUrl = await uploadToCloudinary(selectedFile);
      if (!uploadedUrl) {
        setError('Image upload failed. Please try again.');
        setSaving(false);
        return;
      }
      imageUrl = uploadedUrl;
    }

    // 2. Prepare FormData
    const formData = new FormData(formElement);
    formData.set('image', imageUrl);

    // 3. Call Server Action
    const res = await addItem(formData);

    if (res.success) {
      router.push('/vandy-dashboard');
      router.refresh();
    } else {
      setError(res.error || 'Something went wrong.');
      setSaving(false);
    }
  };

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
          New Plate
        </h1>
        <p className="text-gray-500 font-medium italic">
          Add a masterpiece to your nomadic menu.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-10"
      >
        {/* Left: Image Selection & Tips */}
        <div className="space-y-6">
          <CldImageUpload
            label="Dish Photo"
            onFileSelect={(file) => setSelectedFile(file)}
          />
          <div className="bg-orange-50 p-6 rounded-4xl border border-orange-100">
            <h4 className="text-xs font-black uppercase tracking-widest text-orange-600 mb-2">
              Visual Matters
            </h4>
            <p className="text-xs italic text-orange-800/60 leading-relaxed">
              Foodies eat with their eyes first! High-quality, close-up shots of
              your food in natural lighting perform significantly better.
            </p>
          </div>
        </div>

        {/* Right: Item Details */}
        <div className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold uppercase">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
              <FaUtensils className="text-orange-600" /> Item Name
            </label>
            <input
              name="name"
              required
              placeholder="e.g. Naga Monster Burger"
              className="w-full px-6 py-4 bg-white border-2 border-gray-100 rounded-2xl font-black text-gray-900 focus:border-orange-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                <FaMoneyBillWave className="text-orange-600" /> Price (৳)
              </label>
              <input
                name="price"
                type="number"
                required
                placeholder="150"
                className="w-full px-6 py-4 bg-white border-2 border-gray-100 rounded-2xl font-black text-gray-900 focus:border-orange-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                <FaTag className="text-orange-600" /> Pre-Pay (৳)
              </label>
              <input
                name="prePayAmount"
                type="number"
                required
                placeholder="20"
                className="w-full px-6 py-4 bg-white border-2 border-gray-100 rounded-2xl font-black text-gray-900 focus:border-orange-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                <FaTag className="text-orange-600" /> Category
              </label>
              <select
                name="category"
                required
                className="w-full px-6 py-4 bg-white border-2 border-gray-100 rounded-2xl font-black text-gray-900 focus:border-orange-500 outline-none transition-all"
              >
                <option value="Snacks">Snacks</option>
                <option value="Meals">Meals</option>
                <option value="Drinks">Drinks</option>
                <option value="Desserts">Desserts</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Added Availability Selection */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                <FaCheckCircle className="text-orange-600" /> Availability
              </label>
              <select
                name="isAvailable"
                required
                className="w-full px-6 py-4 bg-white border-2 border-gray-100 rounded-2xl font-black text-gray-900 focus:border-orange-500 outline-none transition-all"
              >
                <option value="true">Available</option>
                <option value="false">Sold Out</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
              <FaAlignLeft className="text-orange-600" /> Description
            </label>
            <textarea
              name="description"
              required
              placeholder="Tell us what's inside..."
              className="w-full px-6 py-4 bg-white border-2 border-gray-100 rounded-2xl font-medium italic text-gray-900 h-32 outline-none focus:border-orange-500 transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-orange-600 transition-all active:scale-95 disabled:bg-gray-200 flex items-center justify-center gap-3 shadow-xl"
          >
            {saving ?
              <>
                <FaSpinner className="animate-spin" /> Adding...
              </>
            : <>
                <FaPlus /> Add to Menu
              </>
            }
          </button>
        </div>
      </form>
    </section>
  );
}
