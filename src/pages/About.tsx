import React from 'react';
import { Target, Compass } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../components/animations/Reveal';

export const About: React.FC = () => {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Banner */}
      <section className="bg-sky-soft py-20 sm:py-32 border-b border-sky-200 relative overflow-hidden">
        <ScrollReveal className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <span className="text-cherry text-xs font-bold uppercase tracking-[0.3em] block">
            The Wardrobe Studio
          </span>
          <h1 className="font-serif text-5xl sm:text-7xl text-stone-900 font-normal leading-tight" style={{ fontFamily: '"Playfair Display", Lora, Georgia, serif, system-ui' }}>
            "ஆள் பாதி, ஆடை பாதி."
          </h1>
        </ScrollReveal>
      </section>

      {/* Intro Text */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-8">
        <ScrollReveal>
          <p className="font-serif text-2xl sm:text-3xl text-stone-800 leading-relaxed font-light italic">
            For generations, this Tamil proverb has carried a beautiful truth. The way we dress is not about showing off. It's about how we feel.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.2} className="space-y-4 text-stone-600 leading-relaxed font-light text-lg">
          <p>
            Before we speak a single word, our presence introduces us. The confidence in our walk, the smile on our face, the way we carry ourselves, our clothing quietly becomes a part of our story.
          </p>
          <p className="font-medium text-stone-900 text-xl pt-4">
            At The Wardrobe Studio, we don't just believe in beautiful clothes. We believe in the beautiful feeling they create.
          </p>
        </ScrollReveal>
      </section>

      {/* Origins - Card */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="bg-white rounded-[2rem] p-8 sm:p-16 border border-sky-100 shadow-xl relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-stone-700 font-light leading-relaxed">
            <p>
              My story began in a loving, close knit family where everything was chosen with purpose. We weren't the kind of family that bought clothes every month or for every outing. New dresses were usually bought for festivals like Diwali or Pongal, or for a truly special occasion. Not because we couldn't buy them, but because that was how we were brought up.
            </p>
            <p>
              As a little girl, I accepted it. But deep inside, I always wondered...
            </p>
          </div>
          <blockquote className="border-l-4 border-cherry pl-8 py-4 font-serif text-2xl italic text-stone-800 bg-[#FFF0F2] rounded-r-2xl h-full flex flex-col justify-center">
            "Why buy another dress if there isn't an occasion?" 
            <span className="block text-sm font-sans not-italic text-stone-500 mt-4 uppercase tracking-widest">That was the thought we grew up with.</span>
          </blockquote>
        </ScrollReveal>
      </section>

      {/* The Realization - Split Text */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <ScrollReveal className="space-y-8">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-3xl text-stone-900">Building Confidence</h2>
            <div className="w-12 h-0.5 bg-cherry mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 text-stone-700 font-light leading-relaxed">
            <p>
              Growing up, I wasn't a very confident girl. I often compared myself with others and wished I looked more stylish and well presented. Over time, I realised that confidence isn't something we are born with, it is something we build.
            </p>
            <p>
              Taking care of myself, learning how to dress well, and expressing my personality through clothing slowly transformed the way I saw myself. Every outfit became more than clothing; it became a step towards becoming the woman I wanted to be.
            </p>
            <p className="md:col-span-2 text-xl font-serif text-center text-cherry py-8 border-y border-stone-200 mt-4">
              Why should confidence have a date on the calendar? Why should happiness be reserved only for festivals?
            </p>
            <p>
              As I grew older, I discovered something every woman understands. A new outfit doesn't just change your appearance. It changes your mood. It changes your confidence. It changes the way you carry yourself. Sometimes, it changes your entire day.
            </p>
            <p>
              Only a woman truly knows the quiet happiness of wearing something that makes her pause in front of the mirror and smile. It isn't about impressing the world. It's about feeling good within yourself.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* The Core Message */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <ScrollReveal className="bg-sky-dark text-white p-10 sm:p-16 rounded-[2rem] space-y-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cherry/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
          
          <h3 className="text-3xl sm:text-4xl font-serif relative z-10">Because every day is a special day when you are living your life.</h3>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-12 text-sky-100 font-light relative z-10 my-8">
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cherry"></div> You don't need a wedding invitation</span>
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cherry"></div> You don't need a festival</span>
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cherry"></div> You don't need a family function</span>
          </div>
          
          <p className="text-4xl sm:text-5xl font-serif text-white pt-4 border-t border-white/20 inline-block px-12 relative z-10">You are the occasion.</p>
        </ScrollReveal>
      </section>

      {/* The Brand Promise */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <ScrollReveal className="lg:col-span-5 space-y-6">
             <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 leading-tight">
               Thoughtfully Curated for You.
             </h2>
             <p className="text-stone-700 font-light leading-relaxed">
               That thought became The Wardrobe Studio. We created this brand for women who believe they deserve to feel beautiful on a Monday morning just as much as they do on Diwali. For women who celebrate themselves. For women who don't want to wear what everyone else is wearing. For women who appreciate comfort without compromising elegance.
             </p>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2} className="lg:col-span-7 bg-[#FAF8F5] p-8 sm:p-12 rounded-3xl border border-stone-200">
            <p className="text-stone-700 font-light leading-relaxed mb-8">
              Every collection at The Wardrobe Studio is thoughtfully curated, not because we want to fill shelves, but because we want every woman to discover something that feels uniquely hers. From breathable Mul Cotton and Mul Chanderi fabrics to elegant two piece and three piece kurta sets, timeless dresses, and beautiful plus size collections, every piece is selected with love, comfort and individuality in mind.
            </p>
            <p className="font-serif italic text-xl text-cherry border-l-2 border-cherry pl-6">
              "Fashion is not about having the most clothes. It's about owning pieces that make you feel confident every single time you wear them."
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* The Conclusion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <ScrollReveal className="text-center space-y-8">
          <p className="text-stone-700 font-light leading-relaxed">
            Looking back today, I realise I wasn't searching for better clothes, I was searching for confidence. The woman I have become today was built through growth, self-belief, and the courage to express myself. If clothing played even a small part in helping me become the best version of myself, I believe it can do the same for countless other women.
          </p>
          
          <div className="py-12">
            <p className="text-sm uppercase tracking-[0.2em] font-bold text-sky-dark mb-8">That is the promise behind The Wardrobe Studio.</p>
            <h3 className="font-serif text-2xl sm:text-3xl text-stone-900 mb-6">A woman should never wait for an occasion to celebrate herself.</h3>
            
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-stone-700 font-medium">
              <span className="bg-white px-6 py-3 rounded-full shadow-sm border border-stone-100">She deserves to feel confident.</span>
              <span className="bg-white px-6 py-3 rounded-full shadow-sm border border-stone-100">She deserves to feel beautiful.</span>
              <span className="bg-white px-6 py-3 rounded-full shadow-sm border border-stone-100">She deserves to feel comfortable.</span>
              <span className="bg-white px-6 py-3 rounded-full shadow-sm border border-stone-100">She deserves to feel unique.</span>
            </div>
            
            <p className="font-serif text-4xl text-cherry mt-12">Every single day.</p>
          </div>
          
          <p className="font-serif text-xl sm:text-2xl text-stone-800 pt-8 border-t border-stone-200">
            Welcome to The Wardrobe Studio. A place where every outfit is chosen with purpose, every collection is thoughtfully curated, and every woman is reminded that the most beautiful thing she can wear is confidence.
          </p>
        </ScrollReveal>
      </section>

      {/* Visually Distinct Mission and Vision Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Our Mission */}
          <StaggerItem className="bg-sky-dark text-white p-8 sm:p-12 rounded-3xl space-y-6 relative overflow-hidden shadow-xl border border-sky-900 h-full block">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
            <div className="w-12 h-12 rounded-2xl bg-cherry text-white flex items-center justify-center shadow-md relative z-10">
              <Target className="w-6 h-6" />
            </div>
            <span className="text-cherry text-xs uppercase tracking-[0.25em] font-bold block relative z-10">
              Our Path Forward
            </span>
            <h3 className="font-serif text-3xl font-normal text-sky-100 relative z-10">Our Mission</h3>
            <div className="space-y-4 text-sky-100 text-sm font-light leading-relaxed relative z-10">
              <p>
                Our mission is to take The Wardrobe Studio to every woman, one step at a time.
              </p>
              <p>
                We will grow with purpose, expanding city by city, community by community, and store by store, making thoughtfully curated fashion accessible to women across India and, one day, across the world.
              </p>
              <p>
                Our goal is not simply to open more stores, but to build meaningful connections with women everywhere. Every new Wardrobe Studio is a promise that another woman will discover confidence, comfort, and the joy of expressing herself.
              </p>
              <p>
                We are committed to creating a destination where every woman, regardless of her age, size, or lifestyle, can find clothing that makes her feel unique, valued, and beautiful every single day.
              </p>
            </div>
          </StaggerItem>

          {/* Our Vision */}
          <StaggerItem className="bg-sky-soft text-stone-900 p-8 sm:p-12 rounded-3xl space-y-6 relative overflow-hidden shadow-xl border border-sky-200 h-full block">
            <div className="w-12 h-12 rounded-2xl bg-cherry text-white flex items-center justify-center shadow-md">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-cherry text-xs uppercase tracking-[0.25em] font-bold block">
              Our Dream
            </span>
            <h3 className="font-serif text-3xl font-normal text-stone-900">Our Vision</h3>
            <div className="space-y-4 text-stone-700 text-sm font-light leading-relaxed">
              <p>
                Our vision is to build one of the world's most admired women's fashion brands, one that inspires generations of women to believe in themselves.
              </p>
              <p>
                We dream of a future where The Wardrobe Studio becomes more than a fashion label. We want it to become a symbol of confidence, individuality, and self worth.
              </p>
              <blockquote className="font-serif italic text-cherry">
                "If she could build this dream, I can build mine too."
              </blockquote>
              <p>
                We want women to proudly wear The Wardrobe Studio not just because it is beautiful, but because it represents confidence, elegance, and the courage to be themselves. We envision thousands of Wardrobe Studio stores touching millions of women's lives, becoming a trusted name that women choose with pride and recommend with love.
              </p>
              <p className="font-medium text-stone-900">
                Our greatest success will not be measured only by the number of stores we build, but by the number of women who feel more confident because of us.
              </p>
              <p className="font-serif text-lg text-sky-dark">
                Because our dream is bigger than fashion. Our dream is to become a part of every woman's journey, every wardrobe, and every story.
              </p>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </section>
    </div>
  );
};
