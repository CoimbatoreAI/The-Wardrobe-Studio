import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CategoryType } from '../types';
import { ProductCard } from '../components/ProductCard';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../components/animations/Reveal';

export const Collections: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products: PRODUCTS, categories: CATEGORIES_DATA } = useStore();
  const categoryParam = searchParams.get('category');

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'All');
  const [selectedFabric, setSelectedFabric] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [showMobileFilter, setShowMobileFilter] = useState<boolean>(false);

  useEffect(() => {
    if (categoryParam) {
      // Header links use slugs (?category=2-piece-kurta-suit-set); map them to the real category name
      const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const match = CATEGORIES_DATA.find((c) => slug(c.name) === slug(categoryParam));
      setSelectedCategory(match ? match.name : categoryParam);
    }
  }, [categoryParam, CATEGORIES_DATA]);

  const categories = ['All', ...CATEGORIES_DATA.map(c => c.name)];
  const fabrics = ['All', 'Mul Cotton', 'Mul Chanderi', 'Silk Chanderi', 'Georgette', 'Modal Silk'];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category match
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }
      // Fabric match
      if (selectedFabric !== 'All' && product.fabric !== selectedFabric) {
        return false;
      }
      // Search match
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesSub = product.subtitle.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCat = product.category.toLowerCase().includes(query);
        if (!matchesName && !matchesSub && !matchesDesc && !matchesCat) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // recommended
    });
  }, [PRODUCTS, selectedCategory, selectedFabric, searchQuery, sortBy]);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <ScrollReveal className="bg-sky-soft rounded-2xl p-8 sm:p-12 border border-sky-soft relative overflow-hidden text-center sm:text-left">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-cherry text-xs font-bold uppercase tracking-[0.25em]">
            <Sparkles className="w-3.5 h-3.5" />
            Wardrobe Couture Collection
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-stone-900 font-normal">
            {selectedCategory === 'All' ? 'The Complete Collection' : selectedCategory}
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm font-light leading-relaxed">
            Handcrafted in pure Mul Cotton and Chanderi weaves. Every design is finished with subtle zardozi and block prints, tailored for effortless royalty.
          </p>
        </div>
      </ScrollReveal>

      {/* Filter and Control Toolbar */}
      <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search kurtas, dresses, fabric..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-cherry focus:bg-white text-stone-800"
          />
        </div>

        {/* Fabric Filter Pills (Desktop) */}
        <div className="hidden lg:flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-stone-400 font-medium uppercase tracking-wider text-[10px] mr-1">
            Fabric:
          </span>
          {fabrics.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFabric(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedFabric === f
                  ? 'bg-sky-dark text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="lg:hidden flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 px-3.5 py-2 rounded-lg text-xs font-semibold"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-400 font-medium hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-stone-50 border border-stone-200 text-stone-800 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cherry"
            >
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategorySelect(cat)}
            className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 border ${
              selectedCategory === cat
                ? 'bg-cherry text-white border-cherry shadow-md'
                : 'bg-white text-stone-700 border-stone-200 hover:border-cherry/50 hover:bg-stone-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-stone-500 pt-2">
        <span>
          Showing <strong>{filteredProducts.length}</strong> luxurious outfits
        </span>
        {(selectedCategory !== 'All' || selectedFabric !== 'All' || searchQuery !== '') && (
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedFabric('All');
              setSearchQuery('');
              searchParams.delete('category');
              setSearchParams(searchParams);
            }}
            className="text-cherry font-semibold hover:underline"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      ) : (
        <div className="bg-white rounded-2xl p-16 text-center border border-stone-200 max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 bg-sky-soft text-sky-dark rounded-full flex items-center justify-center mx-auto">
            <Filter className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl text-stone-900 font-semibold">No Designs Found</h3>
          <p className="text-stone-500 text-xs font-light">
            We couldn't find any outfits matching your criteria. Try adjusting your search or fabric filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedFabric('All');
              setSearchQuery('');
            }}
            className="bg-cherry text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded-lg hover:bg-cherry-hover transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
