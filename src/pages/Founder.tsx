import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Quote } from 'lucide-react';
import { ScrollReveal, ScaleImageReveal } from '../components/animations/Reveal';

export const Founder: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Editorial Header Banner */}
      <ScrollReveal className="text-center space-y-3 max-w-3xl mx-auto pb-8 border-b border-stone-200">
        <span className="text-cherry text-xs font-bold uppercase tracking-[0.35em] block">
          A Personal Note
        </span>
        <h1 className="font-cinzel text-3xl sm:text-5xl text-stone-900 tracking-wider font-semibold">
          A LETTER FROM THE FOUNDER
        </h1>
        <p className="font-serif italic text-stone-500 text-sm sm:text-base font-light">
          Archana, Founder & Creative Director of The Wardrobe Studio
        </p>
      </ScrollReveal>

      {/* Magazine Layout Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Portrait Frame & Editorial Highlights */}
        <div className="lg:col-span-5 space-y-6">
          <ScaleImageReveal className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-sky-soft aspect-[3/4]">
            <img
              src="/founder.PNG"
              alt="Archana - Founder of The Wardrobe Studio"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span className="text-cherry font-serif italic text-sm block">With Love & Grace</span>
              <h3 className="font-serif text-2xl font-normal">Archana</h3>
              <p className="text-xs text-sky-200 uppercase tracking-widest">
                Founder • The Wardrobe Studio
              </p>
            </div>
          </ScaleImageReveal>

          <ScrollReveal delay={0.2} className="p-6 bg-sky-soft rounded-2xl border border-sky-200 space-y-3 text-xs text-stone-700">
            <h4 className="font-serif font-bold text-sky-dark text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              A Note on Confidence:
            </h4>
            <p className="leading-relaxed font-light">
              "Never wait for permission to celebrate yourself. Don't wait until you lose weight. Don't wait for a festival. Life is happening today."
            </p>
          </ScrollReveal>
        </div>

        {/* Right Column: Editorial Body & Pull Quotes */}
        <ScrollReveal delay={0.4} className="lg:col-span-7 space-y-8 bg-white p-8 sm:p-12 rounded-3xl border border-stone-200 shadow-sm relative">
          <Quote className="w-16 h-16 text-sky-soft absolute top-6 right-6 pointer-events-none" />

          {/* Opening Statement */}
          <div className="space-y-4">
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal leading-tight">
              "You deserve to feel beautiful. Every single day."
            </h2>
            <div className="w-16 h-0.5 bg-cherry" />
          </div>

          {/* Core Letter Body */}
          <div className="space-y-6 font-serif text-base sm:text-lg text-stone-700 leading-relaxed font-light">
            <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-cherry first-letter:float-left first-letter:mr-3">
              If you're reading this, I'd like you to pause for just a moment. Imagine that we're sitting together over a cup of coffee, having a conversation not about fashion, but about you.
            </p>

            <p>
              I don't know your story. I don't know what you've been through. Maybe you're a student chasing your dreams. Maybe you're building a career. Maybe you're a mother who puts everyone else's needs before your own. Maybe you're a woman who has forgotten when she last bought something just for herself.
            </p>

            <p className="font-medium text-stone-900">
              But I want you to know something. You deserve to feel beautiful. Every single day.
            </p>

            <p>
              Not because someone complimented you. Not because there's a wedding to attend. Not because it's Diwali. Simply because you exist.
            </p>

            <p>
              For many years, I believed beautiful clothes were meant for special occasions. Today, I believe something completely different. <strong className="text-cherry font-normal">You are the special occasion.</strong>
            </p>

            <p>
              I've learned that confidence doesn't always begin with big achievements. Sometimes, it begins with the smallest decisions. Choosing yourself. Taking care of yourself. Looking into the mirror and smiling. Wearing something that reminds you of your strength.
            </p>

            <blockquote className="p-6 my-6 bg-sky-soft border-l-4 border-cherry rounded-r-2xl font-serif italic text-lg sm:text-xl text-stone-900">
              "People often say, 'It's just a dress.' I disagree. A dress can change your mood. A beautiful outfit can remind you of the woman you've always wanted to become."
            </blockquote>

            <p>
              Clothes don't change who you are. They help you express the woman who has always been inside you.
            </p>

            <p>
              If there's one thing I hope you remember after visiting The Wardrobe Studio, it's this: Never wait for permission to celebrate yourself. Don't wait until you lose weight. Don't wait until someone appreciates you. Don't wait for a festival. Don't wait for the "right time."
            </p>

            <p className="font-medium text-stone-900">
              Life is happening today.
            </p>

            <p>
              Wear the dress. Take the photograph. Walk with confidence. Smile without hesitation. Celebrate yourself without guilt.
            </p>

            <p>
              And whenever you wear something from The Wardrobe Studio, I hope you don't just see beautiful fabric. I hope you remember that somewhere, another woman believed you deserved to feel confident, elegant, and extraordinary every single day.
            </p>

            <p>
              Thank you for trusting us. Thank you for allowing us to become a small part of your journey.
            </p>

            <p>
              I may not know your name. But I believe in your story. And I hope, in some small way, The Wardrobe Studio becomes part of it.
            </p>
          </div>

          {/* Signature Block */}
          <div className="pt-8 border-t border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-serif italic text-2xl text-stone-900">With love,</p>
              <h4 className="font-serif font-bold text-xl text-cherry mt-1">Archana</h4>
              <p className="text-xs text-stone-400 uppercase tracking-widest mt-0.5">
                Founder, The Wardrobe Studio
              </p>
            </div>

            <Link
              to="/collections"
              className="bg-cherry hover:bg-cherry-hover text-white text-xs font-semibold uppercase tracking-[0.2em] px-6 py-3.5 rounded-full transition-all flex items-center gap-2 shadow-md"
            >
              <span>Explore My Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};
