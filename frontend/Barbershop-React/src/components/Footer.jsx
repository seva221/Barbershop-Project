import React from 'react';
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand Section */}
        <div>
          <h3 className="text-white text-lg font-bold mb-4">THE BARBERSHOP</h3>
          <p className="mb-4 text-sm leading-relaxed">
            Premium grooming services for the modern gentleman. 
            Precision cuts, hot towel shaves, and a relaxing atmosphere.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-amber-500 transition-colors"><Instagram size={20} /></a>
            <a href="#" className="hover:text-amber-500 transition-colors"><Facebook size={20} /></a>
            <a href="#" className="hover:text-amber-500 transition-colors"><Twitter size={20} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white text-lg font-bold mb-4">Hours</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span>Mon - Fri:</span> <span className="text-white">9am - 8pm</span></li>
            <li className="flex justify-between"><span>Saturday:</span> <span className="text-white">10am - 6pm</span></li>
            <li className="flex justify-between"><span>Sunday:</span> <span className="text-amber-600">Closed</span></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white text-lg font-bold mb-4">Find Us</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-amber-600 mt-1" />
              <span>123 Grooming Blvd, Suite 100<br/>New York, NY 10012</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-amber-600" />
              <span>(555) 123-4567</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-amber-600" />
              <span>booking@thebarbershop.com</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-12 pt-8 border-t border-slate-900 text-xs">
        &copy; {new Date().getFullYear()} The Barbershop Project. All rights reserved.
      </div>
    </footer>
  );
}