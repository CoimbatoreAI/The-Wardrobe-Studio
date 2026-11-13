import React from 'react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';

export const Favorites: React.FC = () => {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const { products: PRODUCTS } = useStore();
  
  const favoriteProducts = PRODUCTS.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center space-y-3 mb-12">
        <h1 className="font-cinzel text-3xl sm:text-4xl text-stone-900 font-semibold tracking-wider">
          YOUR FAVORITES
        </h1>
        <p className="font-serif italic text-stone-500">Curated pieces you love</p>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-stone-100">
          <Heart className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h2 className="font-serif text-xl text-stone-800 mb-2">No favorites yet</h2>
          <p className="text-stone-500 mb-6 text-sm">You haven't saved any items to your favorites.</p>
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 bg-cherry hover:bg-cherry-hover text-white px-6 py-3 rounded-full text-xs font-semibold tracking-widest uppercase transition-colors"
          >
            Explore Collections
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <div key={product.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-stone-100 overflow-hidden flex flex-col">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-cherry hover:bg-white transition-colors z-10"
                >
                  <Heart className="w-4 h-4 fill-cherry" />
                </button>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <p className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold mb-1">
                  {product.category}
                </p>
                <Link to={`/product/${product.id}`} className="font-serif text-lg text-stone-800 hover:text-cherry transition-colors mb-2 line-clamp-2">
                  {product.name}
                </Link>
                <p className="font-medium text-stone-900 mt-auto mb-4">
                  ₹{product.price.toLocaleString()}
                </p>
                <button
                  onClick={() => addToCart(product, 1)}
                  className="w-full flex items-center justify-center gap-2 border-2 border-cherry text-cherry hover:bg-cherry hover:text-white py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Add to Bag
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
