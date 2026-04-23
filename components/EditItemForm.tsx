'use client';

import { useState } from 'react';
import { updateItem } from '@/lib/actions/item.actions';
import { useRouter } from 'next/navigation';
import {
  FaUtensils,
  FaTag,
  FaAlignLeft,
  FaMoneyBillWave,
  FaSpinner,
  FaSave,
  FaCheckCircle,
} from 'react-icons/fa';
import CldImageUpload from './CldImageUpload';

interface EditItemFormProps {
  item: {
    _id: string;
    name: string;
    price: number;
    prePayAmount: number;
    category: string;
    description: string;
    image: string;
    isAvailable: boolean;
  };
}

export default function EditItemForm({ item }: EditItemFormProps) {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Image states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(item.image || '');

  /* uploadToCloudinary */
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

    let finalImageUrl = currentImageUrl;

    // 1. If a new file is picked, upload it first
    if (selectedFile) {
      const uploadedUrl = await uploadToCloudinary(selectedFile);
      if (!uploadedUrl) {
        setError('Image upload failed. Please try again.');
        setSaving(false);
        return;
      }
      finalImageUrl = uploadedUrl;
    }

    // 2. Prepare Final Data
    const formData = new FormData(formElement);
    formData.set('image', finalImageUrl);

    const res = await updateItem(item._id, formData);

    if (res.success) {
      setCurrentImageUrl(finalImageUrl);
      setSelectedFile(null);
      router.push('/vandy-dashboard');
      router.refresh();
    } else {
      setError(res.error || 'Something went wrong.');
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-10"
    >
      {/* Left: Image Section */}
      <div className="space-y-6">
        <CldImageUpload
          label="Dish Photo"
          defaultValue={currentImageUrl}
          onFileSelect={(file) => setSelectedFile(file)}
        />
        <div className="bg-gray-50 p-6 rounded-4xl border border-gray-100">
          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 flex items-center gap-2">
            <FaCheckCircle className="text-green-500" /> Current Status
          </p>
          <p className="text-xs italic text-gray-500 leading-relaxed">
            {item.isAvailable ?
              'This item is currently visible to foodies.'
            : 'This item is currently marked as Sold Out.'}
          </p>
        </div>
      </div>

      {/* Right: Fields Section */}
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
            defaultValue={item.name}
            required
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
              defaultValue={item.price}
              required
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
              defaultValue={item.prePayAmount}
              required
              className="w-full px-6 py-4 bg-white border-2 border-gray-100 rounded-2xl font-black text-gray-900 focus:border-orange-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
            <FaTag className="text-orange-600" /> Category
          </label>
          <select
            name="category"
            defaultValue={item.category}
            className="w-full px-6 py-4 bg-white border-2 border-gray-100 rounded-2xl font-black text-gray-900 focus:border-orange-500 outline-none transition-all"
          >
            <option value="Snacks">Snacks</option>
            <option value="Meals">Meals</option>
            <option value="Drinks">Drinks</option>
            <option value="Desserts">Desserts</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
            Availability
          </label>
          <select
            name="isAvailable"
            defaultValue={item.isAvailable.toString()}
            className="w-full px-6 py-4 bg-white border-2 border-gray-100 rounded-2xl font-black text-gray-900 focus:border-orange-500 outline-none transition-all"
          >
            <option value="true">Available</option>
            <option value="false">Sold Out</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
            <FaAlignLeft className="text-orange-600" /> Description
          </label>
          <textarea
            name="description"
            defaultValue={item.description}
            placeholder="Tell us what makes this special..."
            className="w-full px-6 py-4 bg-white border-2 border-gray-100 rounded-2xl font-medium italic text-gray-900 h-32 outline-none focus:border-orange-500 transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-orange-600 transition-all flex items-center justify-center gap-3 disabled:bg-gray-200 shadow-xl active:scale-95"
        >
          {saving ?
            <>
              <FaSpinner className="animate-spin" /> Saving...
            </>
          : <>
              <FaSave /> Save Changes
            </>
          }
        </button>
      </div>
    </form>
  );
}
