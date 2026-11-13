import React from 'react';

export const ReturnPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans">
      <h1 className="font-cinzel text-3xl sm:text-4xl text-stone-900 font-semibold tracking-wider mb-8 text-center">
        Return, Refund & Exchange Policy
      </h1>
      <div className="prose prose-stone max-w-none text-sm text-stone-700 space-y-6">
        <p>At The Wardrobe Studio, we maintain strict quality standards. Please read this policy carefully before placing your order.</p>
        
        <h2 className="font-serif text-xl text-stone-900">1. No Cash on Delivery</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>We accept prepaid orders only.</li>
          <li>Cash on Delivery (COD) is not available.</li>
        </ul>
        
        <h2 className="font-serif text-xl text-stone-900">2. No Returns</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>All sales are final.</li>
          <li>We do not accept returns for reasons such as change of mind, incorrect size selection, colour preference, or personal dislike.</li>
        </ul>
        
        <h2 className="font-serif text-xl text-stone-900">3. No Exchanges</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>We do not offer product exchanges.</li>
          <li>Customers are requested to review the size chart, product description, and images carefully before placing an order.</li>
        </ul>
        
        <h2 className="font-serif text-xl text-stone-900">4. Opening Video is Mandatory</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>If you receive a damaged, defective, missing, or incorrect product, you must record a clear, continuous, unedited opening video from the moment the sealed package is opened.</li>
          <li>Claims submitted without a complete opening video will not be accepted.</li>
        </ul>
        
        <h2 className="font-serif text-xl text-stone-900">5. Reporting an Issue</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Any issue must be reported within 24 hours of delivery.</li>
          <li>Please provide:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Order number</li>
              <li>Clear opening video</li>
              <li>Product photographs</li>
              <li>Description of the issue</li>
            </ul>
          </li>
        </ul>
        
        <h2 className="font-serif text-xl text-stone-900">6. Refund Eligibility</h2>
        <p>Refunds or replacements will be considered only if:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>The wrong product was shipped by us.</li>
          <li>The product arrived damaged due to a verified shipping issue.</li>
          <li>The claim is supported by a valid opening video and approved after verification.</li>
        </ul>
        
        <h2 className="font-serif text-xl text-stone-900">7. Colour & Craftsmanship Variations</h2>
        <p>Minor variations in colour, embroidery, print placement, fabric texture, or handcrafted details are natural and shall not be considered defects.</p>
        
        <h2 className="font-serif text-xl text-stone-900">8. Order Cancellation</h2>
        <p>Once an order has been placed and confirmed, it cannot be cancelled, modified, or refunded.</p>
        
        <h2 className="font-serif text-xl text-stone-900">9. Final Decision</h2>
        <p>The Wardrobe Studio reserves the right to make the final decision regarding all claims after verification of the submitted evidence.</p>
      </div>
    </div>
  );
};
