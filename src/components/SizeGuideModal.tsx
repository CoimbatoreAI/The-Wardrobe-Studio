import React from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sizeChart = [
    { size: 'S', bust: '36"', waist: '32"', hip: '40"', shoulder: '14.5"', length: '46"' },
    { size: 'M', bust: '38"', waist: '34"', hip: '42"', shoulder: '15.0"', length: '46"' },
    { size: 'L', bust: '40"', waist: '36"', hip: '44"', shoulder: '15.5"', length: '47"' },
    { size: 'XL', bust: '42"', waist: '38"', hip: '46"', shoulder: '16.0"', length: '47"' },
    { size: 'XXL', bust: '44"', waist: '40"', hip: '48"', shoulder: '16.5"', length: '48"' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-sky-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-800 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-cherry mb-2">
          <Ruler className="w-5 h-5" />
          <span className="text-xs uppercase tracking-[0.2em] font-semibold">Fit & Measurement</span>
        </div>

        <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">
          Standard Size Guide (Inches)
        </h3>
        <p className="text-xs text-stone-500 mb-6 font-light">
          All measurements mentioned below are garment measurements in inches. Our Mul Cottons & Chanderi silhouettes are designed with a relaxed, flattering ease.
        </p>

        {/* Chart Table */}
        <div className="overflow-x-auto rounded-xl border border-stone-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1C3347] text-sky-100 font-cinzel text-[11px] tracking-wider uppercase">
              <tr>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Bust</th>
                <th className="py-3 px-4">Waist</th>
                <th className="py-3 px-4">Hip</th>
                <th className="py-3 px-4">Shoulder</th>
                <th className="py-3 px-4">Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {sizeChart.map((row) => (
                <tr key={row.size} className="hover:bg-sky-50/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-cherry">{row.size}</td>
                  <td className="py-3 px-4">{row.bust}</td>
                  <td className="py-3 px-4">{row.waist}</td>
                  <td className="py-3 px-4">{row.hip}</td>
                  <td className="py-3 px-4">{row.shoulder}</td>
                  <td className="py-3 px-4">{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 bg-sky-soft p-4 rounded-xl border border-sky-300/60 text-xs text-stone-700 space-y-1">
          <h4 className="font-semibold text-sky-dark text-xs mb-1">💡 Custom Tailoring Assistance:</h4>
          <p>
            Between sizes or need custom length adjustments? Connect directly with our Chennai studio master tailor on WhatsApp (<strong>8300687857</strong>) for complimentary size consultation.
          </p>
        </div>
      </div>
    </div>
  );
};
