import React from 'react';
import { BRAND_CONFIG } from '../data/products';
import { Phone, Mail, MapPin } from 'lucide-react';

export const ContactUs: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans">
      <h1 className="font-cinzel text-3xl sm:text-4xl text-stone-900 font-semibold tracking-wider mb-8 text-center">
        Contact Us
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="font-serif text-2xl text-stone-900 mb-6">Get in Touch</h2>
          <p className="text-stone-600 mb-8 text-sm leading-relaxed">
            We'd love to hear from you. Whether you have a question about our collections, need styling advice, or require assistance with an order, our dedicated team is here to help.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-sky-soft flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-sky-dark" />
              </div>
              <div>
                <h3 className="font-semibold text-stone-900">Phone & WhatsApp</h3>
                <p className="text-stone-600 text-sm mt-1">{BRAND_CONFIG.phone}</p>
                <p className="text-stone-500 text-xs mt-1">Available Mon-Sat, 10am to 7pm</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-sky-soft flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-sky-dark" />
              </div>
              <div>
                <h3 className="font-semibold text-stone-900">Email</h3>
                <p className="text-stone-600 text-sm mt-1">hello@thewardrobestudio.com</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-sky-soft flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-sky-dark" />
              </div>
              <div>
                <h3 className="font-semibold text-stone-900">Studio Location</h3>
                <p className="text-stone-600 text-sm mt-1">
                  123 Heritage Marg,<br />
                  Fashion District, New Delhi<br />
                  110001, India
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-stone-100">
          <h2 className="font-serif text-2xl text-stone-900 mb-6">Send a Message</h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
              <input type="text" id="name" className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-cherry focus:border-cherry outline-none transition-all text-sm" placeholder="Your Name" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
              <input type="email" id="email" className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-cherry focus:border-cherry outline-none transition-all text-sm" placeholder="your@email.com" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-1">Message</label>
              <textarea id="message" rows={4} className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-cherry focus:border-cherry outline-none transition-all text-sm resize-none" placeholder="How can we help you?"></textarea>
            </div>
            <button type="submit" className="w-full bg-cherry hover:bg-cherry-hover text-white py-3 rounded-lg text-sm font-semibold tracking-wider uppercase transition-colors shadow-sm">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
