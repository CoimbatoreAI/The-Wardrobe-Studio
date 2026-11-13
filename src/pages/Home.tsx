import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Heart, ShieldCheck, Truck, RefreshCw, Star, Instagram, Mail } from 'lucide-react';
import { BRAND_CONFIG } from '../data/products';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { ScrollReveal, SlowFadeIn, ScaleImageReveal, StaggerContainer, StaggerItem } from '../components/animations/Reveal';

export const Home: React.FC = () => {
  const { products: PRODUCTS, categories: CATEGORIES_DATA } = useStore();
  const bestSellers = PRODUCTS.filter((p) => p.isBestseller).slice(0, 4);
  const [activeTab, setActiveTab] = useState<'Mul Cotton' | 'Mul Chanderi' | 'Silk Chanderi'>('Mul Cotton');
  const festiveProducts = PRODUCTS.filter((p) => p.fabric.includes(activeTab)).slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#182B3B]">
        {/* Hero Background Image with Atmospheric Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=2000"
            alt="The Wardrobe Studio Ethnic Wear Collection"
            className="w-full h-full object-cover object-center opacity-40 scale-105 transition-transform duration-10000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111F2B]/95 via-[#182B3B]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111F2B] via-transparent to-black/30" />
        </div>

        {/* Hero Content Box */}
        <ScrollReveal className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-16">
          <div className="inline-flex items-center gap-2 bg-sky-soft/20 backdrop-blur-md border border-sky-300/30 text-sky-200 px-4 py-1.5 rounded-full text-xs uppercase tracking-[0.25em] font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Ethnic Luxury • Indian Heritage 👆🏻
          </div>

          {/* Main Tamil Proverb Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-wide text-sky-50 mb-6 leading-[1.15] drop-shadow-md">
            "{BRAND_CONFIG.proverbTamil}"
          </h1>

          {/* Sub-headline */}
          <p className="font-serif italic text-lg sm:text-2xl md:text-3xl text-sky-100/90 max-w-3xl mx-auto font-light leading-relaxed mb-10">
            "{BRAND_CONFIG.proverbTranslation}"
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/collections"
              className="w-full sm:w-auto bg-cherry hover:bg-cherry-hover text-white text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-3"
            >
              <span>Shop the Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/about"
              className="w-full sm:w-auto bg-sky-soft/10 hover:bg-sky-soft/20 text-sky-100 border border-sky-300/40 text-xs sm:text-sm uppercase tracking-[0.2em] font-medium px-8 py-4 rounded-full transition-all duration-300 backdrop-blur-sm"
            >
              Our Philosophy
            </Link>
          </div>

          {/* Quick Value Pillars */}
          <StaggerContainer className="mt-16 pt-10 border-t border-sky-800/40 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-xs text-sky-200/80">
              <StaggerItem>
                <span className="block font-serif text-lg font-bold text-white mb-0.5">100% Mul Cotton</span>
                <span className="text-[11px] text-sky-300/70">Breathable Natural Fabrics</span>
              </StaggerItem>
              <StaggerItem>
                <span className="block font-serif text-lg font-bold text-white mb-0.5">Custom Tailored</span>
                <span className="text-[11px] text-sky-300/70">Flattering Size Fittings</span>
              </StaggerItem>
              <StaggerItem>
                <span className="block font-serif text-lg font-bold text-white mb-0.5">Hand Block Prints</span>
                <span className="text-[11px] text-sky-300/70">Heritage Artisan Craft</span>
              </StaggerItem>
              <StaggerItem>
                <span className="block font-serif text-lg font-bold text-white mb-0.5">Direct WhatsApp</span>
                <span className="text-[11px] text-sky-300/70">Instant Order Support</span>
              </StaggerItem>
          </StaggerContainer>
        </ScrollReveal>
      </section>

      {/* CATEGORY SHOWCASE GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-cherry text-xs font-bold uppercase tracking-[0.3em] block mb-2">
            Curated Categories
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
            Designed for Everyday Royalty
          </h2>
          <div className="w-12 h-0.5 bg-cherry mx-auto mt-4" />
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATEGORIES_DATA.map((cat, idx) => (
            <StaggerItem key={cat.name} className={idx === 0 ? 'lg:col-span-2 lg:h-96' : ''}>
              <Link
                to={`/collections?category=${encodeURIComponent(cat.name)}`}
                className={`group relative h-96 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-end p-6 border border-sky-100 h-full w-full block`}
              >
                {/* Category Image */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-900/30 to-transparent" />

                {/* Category Info */}
                <div className="relative z-10 text-white">
                  <span className="bg-sky-soft/90 backdrop-blur-sm text-sky-dark text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-sm mb-2 inline-block">
                    {cat.count}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-medium mb-1 group-hover:text-sky-200 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-stone-300 text-xs font-light line-clamp-2 max-w-md">
                    {cat.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-cherry font-semibold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* THE FESTIVE EDIT: THEMED SPOTLIGHT */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-cherry text-xs font-bold uppercase tracking-[0.3em] block mb-2">
              The Festive Edit
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
              Curated by Fabric
            </h2>
            <div className="w-12 h-0.5 bg-cherry mx-auto mt-4" />
          </ScrollReveal>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-10 overflow-x-auto pb-2 scrollbar-none">
            {['Mul Cotton', 'Mul Chanderi', 'Silk Chanderi'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 border ${
                  activeTab === tab
                    ? 'bg-sky-dark text-white border-sky-dark shadow-md'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-sky-300 hover:text-sky-dark'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {festiveProducts.map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </StaggerContainer>
          
          <div className="text-center mt-10">
            <Link
              to="/collections"
              className="inline-flex items-center gap-2 text-xs text-cherry font-semibold uppercase tracking-widest hover:underline"
            >
              <span>Explore All Festivities</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* HIGHLIGHT SECTION: "You Are The Occasion" */}
      <section className="bg-sky-soft py-20 relative overflow-hidden border-y border-sky-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Overlapping Images Column */}
            <div className="lg:col-span-6 relative">
              <ScaleImageReveal className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white max-w-md mx-auto lg:mx-0">
                <img
                  src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1000"
                  alt="Philosophy - You are the occasion"
                  className="w-full h-[480px] object-cover"
                />
              </ScaleImageReveal>
              <ScaleImageReveal className="hidden sm:block absolute -bottom-8 -right-4 lg:-right-6 z-20 w-60 rounded-xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&q=80&w=800"
                  alt="Subtle details"
                  className="w-full h-56 object-cover"
                />
              </ScaleImageReveal>
            </div>

            {/* Narrative Column */}
            <ScrollReveal className="lg:col-span-6 space-y-6 lg:pl-6">
              <div className="inline-flex items-center gap-2 bg-cherry/10 text-cherry px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                <Heart className="w-3.5 h-3.5 fill-current" />
                Brand Philosophy
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl text-stone-900 leading-tight">
                "You Are The Occasion."
              </h2>

              <p className="text-stone-700 text-sm sm:text-base leading-relaxed font-light">
                Why wait for a wedding, a festival, or a special invite to wear something that makes your heart sing? At <strong>The Wardrobe Studio</strong>, we believe every morning you wake up is an occasion worthy of royal comfort and self-celebration.
              </p>

              <div className="p-5 bg-white rounded-xl border border-sky-300/60 shadow-sm space-y-2">
                <h4 className="font-serif text-lg text-stone-900 font-semibold">
                  Lightweight Mulberry & Chanderi Fabrics
                </h4>
                <p className="text-stone-600 text-xs leading-relaxed font-light">
                  Our garments are engineered for Chennai’s warm coastal breeze—breathable Mul Cotton linings paired with royal Chanderi weaves that move fluidly with your step.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/about"
                  className="bg-cherry hover:bg-cherry-hover text-white text-xs uppercase tracking-widest font-semibold px-6 py-3.5 rounded-lg text-center transition-all shadow-md"
                >
                  Read Our Story
                </Link>
                <Link
                  to="/founder"
                  className="bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 text-xs uppercase tracking-widest font-semibold px-6 py-3.5 rounded-lg text-center transition-all"
                >
                  Letter from Archana
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* BESTSELLERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-stone-200">
          <div>
            <span className="text-cherry text-xs font-bold uppercase tracking-[0.3em] block mb-1">
              Most Loved Pieces
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
              Signature Bestsellers
            </h2>
          </div>
          <Link
            to="/collections"
            className="mt-4 md:mt-0 text-xs text-cherry font-semibold uppercase tracking-widest flex items-center gap-2 hover:underline"
          >
            <span>View All Outfits</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* TRUST PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <StaggerContainer className="bg-white rounded-2xl border border-sky-200 p-8 sm:p-12 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8">
          <StaggerItem className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-sky-soft text-sky-dark flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-semibold text-stone-900 mb-1">
                Complimentary Express Shipping
              </h4>
              <p className="text-xs text-stone-500 font-light leading-relaxed">
                Free shipping across India on all orders above ₹1,999 with real-time tracking updates.
              </p>
            </div>
          </StaggerItem>

          <StaggerItem className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-cherry/10 text-cherry flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-semibold text-stone-900 mb-1">
                Pure Mul & Silk Guarantee
              </h4>
              <p className="text-xs text-stone-500 font-light leading-relaxed">
                100% natural, breathable fabrics sourced directly from authentic handloom clusters.
              </p>
            </div>
          </StaggerItem>

          <StaggerItem className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-semibold text-stone-900 mb-1">
                Seamless WhatsApp Orders
              </h4>
              <p className="text-xs text-stone-500 font-light leading-relaxed">
                No complex payment gateways required. Order directly on WhatsApp with our stylist support.
              </p>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* SHOP THE LOOK / INSTAGRAM GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-cherry text-xs font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2 mb-2">
            <Instagram className="w-4 h-4" />
            Join Our Community
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
            Wardrobe Women in the Wild
          </h2>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            'https://images.unsplash.com/photo-1596455607563-ad6193f76b17?auto=format&fit=crop&q=80&w=600',
            'https://images.unsplash.com/photo-1583391265517-35bbd3ac9047?auto=format&fit=crop&q=80&w=600',
            'https://images.unsplash.com/photo-1610030469446-24835bc451b6?auto=format&fit=crop&q=80&w=600',
            'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&q=80&w=600'
          ].map((img, i) => (
            <StaggerItem key={i}>
              <a href={BRAND_CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="block relative group rounded-2xl overflow-hidden aspect-[4/5] shadow-sm">
                <img src={img} alt="Instagram feature" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Instagram className="w-8 h-8 text-white" />
                </div>
              </a>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-[#1C3347] text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <ScrollReveal>
            <span className="text-cherry text-xs font-bold uppercase tracking-[0.3em]">
              Voices of Wardrobe Women
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-sky-100 font-normal">
              "The feel of the Mul Cotton against the skin is unlike anything else."
            </h2>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left text-xs pt-4">
            <StaggerItem className="bg-[#243E54] p-6 rounded-xl border border-sky-800/50 space-y-3">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-sky-200/90 font-light leading-relaxed italic">
                "Ordered the 3 Piece Chanderi Suit for my sister's baby shower in Chennai. The fitting was absolute perfection, and placing the order over WhatsApp was so effortless!"
              </p>
              <div className="text-white font-serif font-semibold text-sm pt-2">
                — Priyadarshini R., Chennai
              </div>
            </StaggerItem>

            <StaggerItem className="bg-[#243E54] p-6 rounded-xl border border-sky-800/50 space-y-3">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-sky-200/90 font-light leading-relaxed italic">
                "Finding elegant ethnic wear in size XXL that doesn't feel baggy is so hard. The Wardrobe Studio's Plus Size line fits like custom couture."
              </p>
              <div className="text-white font-serif font-semibold text-sm pt-2">
                — Meenakshi S., Bangalore
              </div>
            </StaggerItem>

            <StaggerItem className="bg-[#243E54] p-6 rounded-xl border border-sky-800/50 space-y-3">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-sky-200/90 font-light leading-relaxed italic">
                "The tagline 'You are the occasion' resonated so deeply with me. I wear their Mul Cotton tunics to work and feel so regal every single day."
              </p>
              <div className="text-white font-serif font-semibold text-sm pt-2">
                — Dr. Anitha V., Coimbatore
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="bg-sky-soft py-20 border-t border-sky-200">
        <ScrollReveal className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-cherry">
            <Mail className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
            Sign Up and Save
          </h2>
          <p className="text-stone-600 text-sm sm:text-base font-light max-w-lg mx-auto">
            Be part of our journey—stories, style, and the soul of handloom in your inbox.
          </p>
          <form className="max-w-md mx-auto mt-8 relative" onSubmit={(e) => { e.preventDefault(); alert("Thanks for subscribing!"); }}>
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="w-full pl-6 pr-32 py-4 bg-white border border-sky-200 rounded-full text-sm focus:outline-none focus:border-cherry shadow-sm text-stone-800"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 bg-cherry hover:bg-cherry-hover text-white px-6 rounded-full text-xs font-semibold uppercase tracking-wider transition-all"
            >
              Subscribe
            </button>
          </form>
        </ScrollReveal>
      </section>
    </div>
  );
};
