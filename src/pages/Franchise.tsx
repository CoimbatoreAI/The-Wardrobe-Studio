import React, { useState } from 'react';
import { Send, CheckCircle2, Phone, Mail, MapPin, Building2, TrendingUp, Sparkles } from 'lucide-react';
import { BRAND_CONFIG } from '../data/products';
import { FranchiseEnquiry } from '../types';

export const Franchise: React.FC = () => {
  const [formData, setFormData] = useState<FranchiseEnquiry>({
    name: '',
    phone: '',
    email: '',
    city: '',
    experience: 'Fashion / Retail Retailer',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.city) {
      alert('Please complete your Name, Phone Number, and City.');
      return;
    }

    // Prepare WhatsApp proposal text
    const text = `*FRANCHISE / PARTNERSHIP ENQUIRY*\n` +
      `-------------------------------------\n` +
      `*Name:* ${formData.name}\n` +
      `*Phone:* ${formData.phone}\n` +
      `*Email:* ${formData.email}\n` +
      `*Proposed City:* ${formData.city}\n` +
      `*Background:* ${formData.experience}\n` +
      `*Message:* ${formData.message}\n` +
      `-------------------------------------`;

    window.open(`https://wa.me/${BRAND_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
    setIsSubmitted(true);
  };

  return (
    <div className="bg-sky-soft min-h-[85vh] py-12 sm:py-20 border-y border-sky-soft">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Banner */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-cherry text-xs font-bold uppercase tracking-[0.3em] block">
            Business & Store Partnership
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-stone-900">
            Franchise & Studio Partnership Enquiry
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm font-light leading-relaxed">
            Partner with Chennai's premier everyday luxury ethnic wear brand. Bring <strong>The Wardrobe Studio</strong> boutique experience to your city.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Why Partner Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-sky-200/80 shadow-md space-y-6">
              <h3 className="font-serif text-2xl font-semibold text-stone-900 border-b border-stone-100 pb-3">
                Why Partner With Us?
              </h3>

              <div className="space-y-4 text-xs text-stone-700">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cherry/10 text-cherry flex items-center justify-center shrink-0 mt-0.5">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900 text-sm">High-Margin Ethnic Segment</h4>
                    <p className="font-light text-stone-500 leading-relaxed">
                      Daily luxury Mul Cotton and Chanderi kurtas enjoy round-the-year high repeat purchase rates.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-soft text-sky-dark flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900 text-sm">Bespoke Store Architecture</h4>
                    <p className="font-light text-stone-500 leading-relaxed">
                      Complete support for studio layout, visual merchandising, and inventory curation tailored to your region.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900 text-sm">Inclusive Plus Size Demand</h4>
                    <p className="font-light text-stone-500 leading-relaxed">
                      Access to our proprietary plus-size pattern database that drives strong customer loyalty.
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Contacts */}
              <div className="pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-cherry shrink-0" />
                  <span>Franchise Desk: +91 {BRAND_CONFIG.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cherry shrink-0" />
                  <span>partnerships@thewardrobestudio.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sleek Form with Sky Blue Background Context */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-sky-200 shadow-xl space-y-6">
            <div>
              <h3 className="font-serif text-2xl font-medium text-stone-900">
                Submit Your Franchise Proposal
              </h3>
              <p className="text-stone-500 text-xs font-light mt-1">
                Please fill in your details below. Our management team will contact you within 24 hours.
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-8 bg-emerald-50 rounded-2xl text-center space-y-4 border border-emerald-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-serif text-xl font-bold text-stone-900">Enquiry Submitted!</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Thank you, {formData.name}. Your proposal for <strong>{formData.city}</strong> has been opened on WhatsApp and sent to our executive team.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-cherry focus:bg-white text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 8300687857"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-cherry focus:bg-white text-stone-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. rajesh@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-cherry focus:bg-white text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-1">
                      Proposed City / Location *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Coimbatore, Madurai, Hyderabad"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-cherry focus:bg-white text-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-1">
                    Your Retail / Business Experience
                  </label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-cherry focus:bg-white text-stone-900"
                  >
                    <option value="Fashion / Apparel Retailer">Fashion / Apparel Retailer</option>
                    <option value="Existing Boutique Owner">Existing Boutique Owner</option>
                    <option value="First-Time Entrepreneur">First-Time Entrepreneur</option>
                    <option value="Investor / Multi-Brand Outlet">Investor / Multi-Brand Outlet</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-1">
                    Message / Proposal Details
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your proposed store space or investment timeline..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-cherry focus:bg-white text-stone-900"
                  />
                </div>

                {/* Cherry Red Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-cherry hover:bg-cherry-hover text-white py-4 rounded-xl font-semibold text-xs uppercase tracking-[0.2em] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Franchise Request</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
