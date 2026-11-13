import React from 'react';

export const FAQ: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans">
      <h1 className="font-cinzel text-3xl sm:text-4xl text-stone-900 font-semibold tracking-wider mb-8 text-center">
        Frequently Asked Questions
      </h1>
      <div className="prose prose-stone max-w-none text-sm text-stone-700 space-y-6">
        <h2 className="font-serif text-xl text-stone-900">1. What materials do you use?</h2>
        <p>We source only the finest fabrics including pure silk, premium cotton, and rich velvet. Each material is handpicked to ensure durability, comfort, and an elegant drape.</p>
        
        <h2 className="font-serif text-xl text-stone-900">2. How long does shipping take?</h2>
        <p>Standard shipping within the country typically takes 3-7 business days. Express shipping options are available at checkout. International shipping times vary by destination.</p>
        
        <h2 className="font-serif text-xl text-stone-900">3. Do you offer custom sizing?</h2>
        <p>Yes, we offer bespoke tailoring for select collections. Please reach out to our stylist via WhatsApp or our Contact Us page for more details on custom orders.</p>
        
        <h2 className="font-serif text-xl text-stone-900">4. How should I care for my garments?</h2>
        <p>We recommend dry cleaning for all our embroidered and silk garments to maintain their pristine condition. For cotton pieces, a gentle hand wash in cold water is advised.</p>
      </div>
    </div>
  );
};
