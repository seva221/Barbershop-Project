import React, { useState } from 'react';
import { Scissors, Calendar, Clock, Instagram, Facebook, MapPin, Phone } from 'lucide-react';
import BookingModal from './components/Booking/BookingModal';

// Placeholder components for Header/Footer to keep App.jsx clean
const Header = ({ onBookNow }) => (
  <nav className="flex justify-between items-center p-6 bg-slate-900 text-white">
    <h1 className="text-2xl font-bold tracking-tighter">THE BARBERSHOP</h1>
    <button 
      onClick={onBookNow} 
      className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-md transition-colors"
    >
      Book Now
    </button>
  </nav>
);

const ServiceCard = ({ title, price, Icon }) => (
  <div className="bg-slate-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
    <div className="mx-auto bg-slate-200 w-12 h-12 rounded-full flex items-center justify-center mb-4">
      <Icon className="text-slate-800" size={24} />
    </div>
    <h3 className="font-bold text-lg mb-2">{title}</h3>
    <p className="text-amber-600 font-semibold">{price}</p>
  </div>
);

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="min-h-screen font-sans text-slate-900">
      <Header onBookNow={() => setIsBookingOpen(true)} />

      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center bg-slate-900 text-white text-center px-4">
        {/* Background image overlay would go here */}
        <div className="absolute inset-0 bg-black/50 z-0"></div> 
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-5xl font-extrabold mb-6 leading-tight">Precision Cuts.<br/>Classic Style.</h2>
          <p className="text-lg text-slate-300 mb-8">Experience the best grooming service in town.</p>
          <button 
            onClick={() => setIsBookingOpen(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white text-lg px-8 py-3 rounded-md font-semibold transition-transform hover:scale-105"
          >
            Book Your Appointment
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ServiceCard title="Classic Haircut" price="$35" Icon={Scissors} />
          <ServiceCard title="Beard Trim & Shape" price="$25" Icon={Scissors} />
          <ServiceCard title="Full Styling" price="$50" Icon={Scissors} />
        </div>
      </section>

      {/* Gallery Section */}
      <section className="bg-slate-100 py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Recent Cuts</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="aspect-square bg-slate-300 rounded-md animate-pulse">
              {/* Replace with <img src=... /> */}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-4">
            <Instagram className="hover:text-white cursor-pointer" />
            <Facebook className="hover:text-white cursor-pointer" />
          </div>
          <div className="flex flex-col items-center gap-2">
             <div className="flex items-center gap-2"><MapPin size={16} /> 123 Barber Street, City</div>
             <div className="flex items-center gap-2"><Phone size={16} /> (555) 123-4567</div>
          </div>
          <p className="text-sm">© 2024 The Barbershop Project</p>
        </div>
      </footer>

      {/* Booking Modal */}
      {isBookingOpen && (
        <BookingModal onClose={() => setIsBookingOpen(false)} />
      )}
    </div>
  );
}