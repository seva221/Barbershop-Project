import React from 'react';
import { Star } from 'lucide-react';

export default function BarberCard({ name, specialty, image, onSelect, isSelected }) {
  return (
    <div 
      onClick={onSelect}
      className={`
        relative group overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300
        ${onSelect ? 'cursor-pointer hover:shadow-xl' : ''}
        ${isSelected ? 'ring-4 ring-amber-600 scale-105' : 'hover:-translate-y-1'}
      `}
    >
      {/* Image Container */}
      <div className="h-64 w-full bg-slate-200 overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-600">
            <span className="text-4xl font-bold opacity-20">IMG</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 text-center">
        <h3 className="font-bold text-xl text-slate-800">{name}</h3>
        <p className="text-amber-600 font-medium text-sm uppercase tracking-wide mb-3">{specialty}</p>
        
        <div className="flex justify-center gap-1 text-amber-500 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill="currentColor" />
          ))}
        </div>

        {onSelect && (
          <button className={`
            w-full py-2 rounded-lg font-semibold text-sm transition-colors
            ${isSelected ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white'}
          `}>
            {isSelected ? 'Selected' : 'Choose Barber'}
          </button>
        )}
      </div>
    </div>
  );
}