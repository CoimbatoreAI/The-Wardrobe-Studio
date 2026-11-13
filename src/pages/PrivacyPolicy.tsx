import React from 'react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans">
      <h1 className="font-cinzel text-3xl sm:text-4xl text-stone-900 font-semibold tracking-wider mb-8 text-center">
        Privacy Policy
      </h1>
      <div className="prose prose-stone max-w-none text-sm text-stone-700 space-y-6">
        <p><strong>Last Updated: {new Date().getFullYear()}</strong></p>
        
        <h2 className="font-serif text-xl text-stone-900">1. Information We Collect</h2>
        <p>At The Wardrobe Studio, we collect personal information that you provide to us directly when you make a purchase, sign up for our newsletter, or contact our customer support. This may include your name, email address, phone number, shipping and billing addresses, and payment details.</p>
        
        <h2 className="font-serif text-xl text-stone-900">2. How We Use Your Information</h2>
        <p>We use your information to process transactions, deliver your orders, communicate with you regarding your purchases, and send you promotional offers if you have opted in. Your data helps us personalize your shopping experience and improve our services.</p>
        
        <h2 className="font-serif text-xl text-stone-900">3. Data Protection</h2>
        <p>We implement a variety of security measures to maintain the safety of your personal information. Your personal data is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems.</p>
        
        <h2 className="font-serif text-xl text-stone-900">4. Third-Party Disclosure</h2>
        <p>We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties without your consent, except for trusted third parties who assist us in operating our website and conducting our business (e.g., payment gateways, shipping partners).</p>
        
        <h2 className="font-serif text-xl text-stone-900">5. Your Consent</h2>
        <p>By using our site, you consent to our website's privacy policy.</p>
      </div>
    </div>
  );
};
