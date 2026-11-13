import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { Product, SizeType } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const [selectedSize, setSelectedSize] = useState<SizeType>(product.sizes[0] || 'M');
  const [isHovered, setIsHovered] = useState(false);

  const isWishlisted = wishlist.includes(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedSize);
  };

  return (
    <div
      className="group relative bg-white rounded-xl overflow-hidden border border-[#E8EFF6] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[3/4] bg-[#FAF8F5] overflow-hidden cursor-pointer">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isBestseller && (
            <span className="bg-cherry text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-sm shadow-sm">
              Bestseller
            </span>
          )}
          {product.isNew && (
            <span className="bg-[#1C3347] text-sky-100 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-sm shadow-sm">
              New Arrival
            </span>
          )}
          <span className="bg-sky-soft/90 backdrop-blur-sm text-sky-dark border border-sky-300 text-[9px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-sm">
            {product.fabric}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full transition-all duration-300 z-10 shadow-md ${
            isWishlisted
              ? 'bg-cherry text-white'
              : 'bg-white/80 hover:bg-white text-stone-700 hover:text-cherry backdrop-blur-sm'
          }`}
          aria-label="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Overlay Bar */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-stone-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <Link
            to={`/product/${product.id}`}
            className="bg-white/95 hover:bg-white text-stone-900 text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full flex items-center gap-1.5 shadow-md transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-stone-600" />
            View Details
          </Link>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-gradient-to-b from-white to-[#FAF8F5]/50">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="uppercase tracking-wider font-medium text-[10px] text-sky-800 bg-sky-50 px-2 py-0.5 rounded">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-medium text-[11px]">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-stone-400 text-[10px]">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <Link to={`/product/${product.id}`}>
            <h3 className="font-serif text-stone-900 text-base font-medium line-clamp-1 group-hover:text-cherry transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-stone-500 text-xs line-clamp-1 mt-0.5 font-light italic">
            {product.subtitle}
          </p>

          {/* Sizes Pill Selector */}
          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider mr-1">Size:</span>
            {product.sizes.map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => setSelectedSize(sz)}
                className={`text-[10px] font-semibold w-6 h-6 rounded-md transition-all flex items-center justify-center ${
                  selectedSize === sz
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-semibold text-stone-900 font-serif">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-stone-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-700 font-medium">Taxes Included</span>
          </div>

          <button
            onClick={handleQuickAdd}
            className="bg-cherry hover:bg-cherry-hover text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-sm hover:shadow active:scale-95"
            title={`Add Size ${selectedSize} to Bag`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
