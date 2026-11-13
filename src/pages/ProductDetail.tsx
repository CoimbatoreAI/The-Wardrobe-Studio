import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Star, Ruler, ShieldCheck, Truck, ChevronRight, Check } from 'lucide-react';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { BRAND_CONFIG } from '../data/products';
import { Product, SizeType } from '../types';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { SizeGuideModal } from '../components/SizeGuideModal';
import { ProductCard } from '../components/ProductCard';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, loading } = useStore();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        {loading ? (
          <div className="w-10 h-10 border-2 border-cherry border-t-transparent rounded-full animate-spin mx-auto" />
        ) : (
          <>
            <h1 className="font-serif text-2xl text-stone-900">This piece is no longer available</h1>
            <Link to="/collections" className="inline-block text-xs font-semibold uppercase tracking-wider text-cherry">
              Browse the collection
            </Link>
          </>
        )}
      </div>
    );
  }

  // Keyed so gallery/size state resets when moving between products
  return <ProductView key={product.id} product={product} products={products} />;
};

const ProductView: React.FC<{ product: Product; products: Product[] }> = ({ product, products: PRODUCTS }) => {
  const navigate = useNavigate();
  const { addToCart, wishlist, toggleWishlist } = useCart();

  const [selectedImage, setSelectedImage] = useState<string>(product.images[0]);
  const [selectedSize, setSelectedSize] = useState<SizeType>(product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'reviews'>('details');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const isWishlisted = wishlist.includes(product.id);

  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  const handleBuyNowWhatsApp = () => {
    const text = `Hello The Wardrobe Studio, I want to buy:\n- Product: ${product.name}\n- Category: ${product.category}\n- Size: ${selectedSize}\n- Quantity: ${quantity}\n- Price: ₹${(product.price * quantity).toLocaleString('en-IN')}\n\nPlease share availability and order steps.`;
    window.open(`https://wa.me/${BRAND_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
        <Link to="/" className="hover:text-cherry">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
        <Link to="/collections" className="hover:text-cherry">Collections</Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
        <span className="text-stone-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Images Gallery Column */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto shrink-0 max-h-[550px]">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === img
                    ? 'border-cherry shadow-md scale-105'
                    : 'border-stone-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`${product.name} view ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Featured Large Image */}
          <div className="relative flex-1 aspect-[3/4] bg-[#FAF8F5] rounded-2xl overflow-hidden border border-sky-100 shadow-md">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-500"
            />
            {product.isBestseller && (
              <span className="absolute top-4 left-4 bg-cherry text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-sm shadow">
                Bestseller
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-3 rounded-full transition-all shadow-md ${
                isWishlisted ? 'bg-cherry text-white' : 'bg-white/90 hover:bg-white text-stone-700'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Right: Product Info & Buy Controls */}
        <div className="lg:col-span-5 space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-sky-100 shadow-sm">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="bg-sky-soft text-sky-dark font-bold uppercase tracking-widest px-2.5 py-0.5 rounded">
                {product.category} • {product.fabric}
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-semibold text-xs">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-stone-400">({product.reviewsCount} reviews)</span>
              </div>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 font-medium leading-snug">
              {product.name}
            </h1>
            <p className="text-stone-500 text-xs italic font-light mt-1">
              {product.subtitle}
            </p>
          </div>

          {/* Pricing */}
          <div className="p-4 bg-sky-soft/60 rounded-xl border border-sky-200/80 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-2xl font-bold text-stone-900">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-stone-400 line-through font-serif">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold">
                Inclusive of all taxes • Free Shipping
              </span>
            </div>
            {product.originalPrice && (
              <span className="bg-cherry/10 text-cherry text-xs font-bold px-2.5 py-1 rounded">
                Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Short Description */}
          <p className="text-stone-600 text-xs sm:text-sm font-light leading-relaxed">
            {product.description}
          </p>

          {/* Size Selector */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-800 uppercase tracking-wider">
                Select Size: <strong className="text-cherry">{selectedSize}</strong>
              </span>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-sky-dark hover:text-cherry font-medium flex items-center gap-1 hover:underline"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all border ${
                    selectedSize === sz
                      ? 'bg-stone-900 text-white border-stone-900 shadow'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 pt-2">
            <span className="text-xs font-semibold text-stone-800 uppercase tracking-wider">
              Quantity:
            </span>
            <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-stone-50">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1.5 text-stone-600 hover:bg-stone-200 font-bold text-sm"
              >
                -
              </button>
              <span className="px-4 text-xs font-bold text-stone-800">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-1.5 text-stone-600 hover:bg-stone-200 font-bold text-sm"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-xl font-semibold text-xs uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                isAdded
                  ? 'bg-emerald-700 text-white'
                  : 'bg-cherry hover:bg-cherry-hover text-white hover:scale-[1.01]'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Shopping Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </>
              )}
            </button>

            <button
              onClick={handleBuyNowWhatsApp}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3.5 rounded-xl font-semibold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>Instant Order on WhatsApp</span>
            </button>
          </div>

          {/* Guarantees */}
          <div className="pt-4 border-t border-stone-100 grid grid-cols-2 gap-3 text-[11px] text-stone-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-sky-dark shrink-0" />
              <span>Dispatch in 24 Hours</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Handloom Certified</span>
            </div>
          </div>

          {/* Details Accordion Tabs */}
          <div className="pt-6 border-t border-stone-200">
            <div className="flex border-b border-stone-200 text-xs">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-2 px-4 font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                  activeTab === 'details'
                    ? 'border-cherry text-cherry'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Fabric Specs
              </button>
              <button
                onClick={() => setActiveTab('care')}
                className={`py-2 px-4 font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                  activeTab === 'care'
                    ? 'border-cherry text-cherry'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Wash Care
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-2 px-4 font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                  activeTab === 'reviews'
                    ? 'border-cherry text-cherry'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Reviews ({product.reviewsCount})
              </button>
            </div>

            <div className="py-4 text-xs text-stone-600 leading-relaxed">
              {activeTab === 'details' && (
                <ul className="space-y-2 list-disc list-inside">
                  {product.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              )}

              {activeTab === 'care' && (
                <ul className="space-y-2 list-disc list-inside">
                  {product.careInstructions.map((care, idx) => (
                    <li key={idx}>{care}</li>
                  ))}
                </ul>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-3">
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-semibold text-stone-800">Radhika N. (Verified Buyer)</span>
                      <span className="text-amber-500 font-bold">★★★★★</span>
                    </div>
                    <p className="italic text-stone-600 font-light">
                      "Extremely comfortable fabric. The Mul Chanderi draping feels so opulent yet soft. Loved the packaging!"
                    </p>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-semibold text-stone-800">Kavitha M.</span>
                      <span className="text-amber-500 font-bold">★★★★★</span>
                    </div>
                    <p className="italic text-stone-600 font-light">
                      "Sizing is very accurate. Perfect length and gorgeous color in real life."
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Recommendation */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-stone-200">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-cherry text-xs font-bold uppercase tracking-[0.25em] block mb-1">
              You May Also Love
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-stone-900">
              Matching Ethnic Ensembles
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
};
