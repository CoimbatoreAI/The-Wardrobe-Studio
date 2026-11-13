import React from 'react';

export const TermsAndConditions: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans">
      <h1 className="font-cinzel text-3xl sm:text-4xl text-stone-900 font-semibold tracking-wider mb-8 text-center">
        Terms & Conditions
      </h1>
      <div className="prose prose-stone max-w-none text-sm text-stone-700 space-y-6">
        <p><strong>Last Updated: {new Date().getFullYear()}</strong></p>
        
        <h2 className="font-serif text-xl text-stone-900">1. Acceptance of Terms</h2>
        <p>By accessing and using The Wardrobe Studio website, you accept and agree to be bound by the terms and provisions of this agreement. Furthermore, when using our services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
        
        <h2 className="font-serif text-xl text-stone-900">2. Product Information & Pricing</h2>
        <p>We strive to display our products and their colors as accurately as possible. However, the actual colors you see will depend on your monitor. All prices are subject to change without notice. We reserve the right to modify or discontinue a product at any time.</p>
        
        <h2 className="font-serif text-xl text-stone-900">3. Orders and Payments</h2>
        <p>All orders are subject to acceptance and availability. We reserve the right to refuse or cancel an order for any reason. Payment must be received in full before an order is dispatched.</p>
        
        <h2 className="font-serif text-xl text-stone-900">4. Intellectual Property</h2>
        <p>All content included on this site, such as text, graphics, logos, images, and software, is the property of The Wardrobe Studio and protected by international copyright laws.</p>
        
        <h2 className="font-serif text-xl text-stone-900">5. Governing Law</h2>
        <p>These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of Chennai, Tamil Nadu.</p>
      </div>
    </div>
  );
};
