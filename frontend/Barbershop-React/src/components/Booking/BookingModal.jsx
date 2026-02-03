import React, { useState } from 'react';
import { X, User, Calendar as CalendarIcon, Clock, CheckCircle } from 'lucide-react';
import Calendar from './Calendar';
import BarberCard from '../BarberCard';

const BARBERS = [
  { id: 1, name: 'Alex', specialty: 'Fades' },
  { id: 2, name: 'Sarah', specialty: 'Styling' },
  { id: 3, name: 'Mike', specialty: 'Beards' }
];

const TIME_SLOTS = ['10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:30 PM'];

export default function BookingModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    barber: null,
    date: '',
    time: null
  });

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const updateData = (key, value) => {
    setBookingData((prev) => ({ ...prev, [key]: value }));
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2"><User size={24} /> Select Barber</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BARBERS.map((barber) => (
                <BarberCard
                  key={barber.id}
                  name={barber.name}
                  specialty={barber.specialty}
                  // Pass 'image' here if you have URLs in the BARBERS array
                  isSelected={bookingData.barber?.id === barber.id}
                  onSelect={() => { 
                    updateData('barber', barber); 
                    // Optional: Auto-advance after selection, or let them click 'Next'
                    // For now, let's auto-advance for smoother UX
                    handleNext(); 
                  }}
                />
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2"><CalendarIcon size={24} /> Select Date</h3>
            
            <div className="py-2">
              <Calendar 
                selectedDate={bookingData.date}
                onDateSelect={(date) => updateData('date', date)}
              />
            </div>

            <div className="flex flex-col gap-2">
               <p className="text-center text-sm text-slate-500 min-h-[1.25rem]">
                 {bookingData.date 
                   ? `Selected: ${new Date(bookingData.date).toDateString()}` 
                   : 'Please select a date above'}
               </p>
               <button 
                 disabled={!bookingData.date}
                 onClick={handleNext}
                 className="w-full bg-slate-900 text-white py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors font-medium"
               >
                 Confirm Date
               </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2"><Clock size={24} /> Select Time</h3>
            <div className="grid grid-cols-2 gap-3">
              {TIME_SLOTS.map((time) => (
                <button
                  key={time}
                  onClick={() => { updateData('time', time); handleNext(); }}
                  className={`
                    p-3 border rounded-lg transition-all
                    ${bookingData.time === time 
                      ? 'bg-amber-600 text-white border-amber-600' 
                      : 'hover:bg-slate-900 hover:text-white border-slate-200'
                    }
                  `}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="text-center py-8 space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="w-20 h-20 text-green-500 animate-bounce" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Booking Confirmed!</h3>
            
            <div className="bg-slate-50 p-6 rounded-xl text-left border border-slate-100 shadow-sm">
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2 border-slate-200">
                  <span className="text-slate-500">Service</span>
                  <span className="font-bold text-slate-800">Haircut (Default)</span>
                </div>
                <div className="flex justify-between border-b pb-2 border-slate-200">
                  <span className="text-slate-500">Barber</span>
                  <span className="font-bold text-slate-800">{bookingData.barber?.name}</span>
                </div>
                <div className="flex justify-between border-b pb-2 border-slate-200">
                  <span className="text-slate-500">Date</span>
                  <span className="font-bold text-slate-800">{bookingData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Time</span>
                  <span className="font-bold text-slate-800">{bookingData.time}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-bold transition-colors shadow-lg shadow-amber-600/20"
            >
              Done
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b flex justify-between items-center bg-slate-50 shrink-0">
          <h2 className="font-bold text-lg text-slate-700">Book Appointment</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            <X size={20}/>
          </button>
        </div>
        
        {/* Scrollable Content Area */}
        <div className="p-6 overflow-y-auto">
          {/* Progress Bar */}
          {step < 4 && (
            <div className="flex gap-2 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= step ? 'bg-amber-600' : 'bg-slate-200'}`}></div>
              ))}
            </div>
          )}
          
          {renderStep()}
        </div>

        {/* Modal Footer (Back Button) */}
        {step > 1 && step < 4 && (
          <div className="p-4 border-t bg-slate-50 shrink-0">
            <button 
              onClick={handleBack} 
              className="text-sm font-medium text-slate-500 hover:text-slate-800 hover:underline transition-all"
            >
              &larr; Back to previous step
            </button>
          </div>
        )}
      </div>
    </div>
  );
}