import React from 'react';

export const ShippingAndDelivery: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans">
      <h1 className="font-cinzel text-3xl sm:text-4xl text-stone-900 font-semibold tracking-wider mb-8 text-center">
        Shipping & Delivery
      </h1>
      <div className="prose prose-stone max-w-none text-sm text-stone-700 space-y-6">
        <p><strong>Committed to Delivering Excellence</strong></p>
        
        <h2 className="font-serif text-xl text-stone-900">Processing Time</h2>
        <p>All orders are processed within 1-2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.</p>
        
        <h2 className="font-serif text-xl text-stone-900">Domestic Shipping Rates and Estimates</h2>
        <p>We offer complimentary express shipping on all domestic orders above ₹1,999. For orders below this amount, standard shipping charges apply and will be calculated at checkout. Deliveries generally take 3-7 business days.</p>
        
        <h2 className="font-serif text-xl text-stone-900">International Shipping</h2>
        <p>We offer international shipping to select countries. Shipping charges for your order will be calculated and displayed at checkout. Please note that your order may be subject to import duties and taxes, which are incurred once a shipment reaches your destination country.</p>
        
        <h2 className="font-serif text-xl text-stone-900">How do I check the status of my order?</h2>
        <p>When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 48 hours for the tracking information to become available.</p>
      </div>
    </div>
  );
};
