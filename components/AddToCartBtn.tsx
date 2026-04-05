'use client';

import { CartItem, useCart } from '@/contexts/cartContext';
import React, { useState } from 'react';

import { FaExclamationTriangle } from 'react-icons/fa';

interface AddToCartButtonProps {
  item: {
    _id: string;
    name: string;
    price: number;
    prePayAmount: number;
    category: string;
    ownerId: string;
    storeName: string;
  };
  className?: string;
}

const AddToCartButton = ({ item, className }: AddToCartButtonProps) => {
  const { addToCart, clearCart } = useCart();
  const [showConflictModal, setShowConflictModal] = useState(false);

  const handleAdd = () => {
    const cartItem: CartItem = {
      _id: item._id,
      name: item.name,
      price: item.price,
      prePayAmount: Number(item.prePayAmount),
      quantity: 1,
      vandyId: item.ownerId,
      vandyName: item.storeName,
      category: item.category,
    };

    const result = addToCart(cartItem);

    if (result.conflict) {
      setShowConflictModal(true);
    }
  };

  const handleForceAdd = () => {
    clearCart();
    setTimeout(() => {
      addToCart({
        _id: item._id,
        name: item.name,
        price: item.price,
        prePayAmount: Number(item.prePayAmount),
        quantity: 1,
        vandyId: item.ownerId,
        vandyName: item.storeName,
        category: item.category,
      });
      setShowConflictModal(false);
    }, 10);
  };

  return (
    <>
      <button
        onClick={handleAdd}
        className={
          className ||
          'bg-black text-white px-5 py-2 rounded-2xl text-xs font-black uppercase hover:bg-orange-600 transition-all active:scale-95'
        }
      >
        Add to Plate
      </button>

      {/* Conflict Modal: Shows when switching vendors */}
      {showConflictModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-4xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
                <FaExclamationTriangle size={30} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">
                Clear your plate?
              </h3>
              <p className="text-gray-500 text-sm italic mb-6">
                You already have items from another Vandy. Your plate can only
                hold food from one Vandy at a time.
              </p>

              <div className="flex flex-col w-full gap-3">
                <button
                  onClick={handleForceAdd}
                  className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black uppercase text-sm hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200"
                >
                  Start fresh with {item.storeName}
                </button>
                <button
                  onClick={() => setShowConflictModal(false)}
                  className="w-full py-3 text-gray-400 font-bold uppercase text-xs hover:text-gray-600 transition-colors"
                >
                  Keep current plate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddToCartButton;
