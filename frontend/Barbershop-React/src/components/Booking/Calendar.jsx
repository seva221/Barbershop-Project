import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar({ selectedDate, onDateSelect }) {
  // Initialize with current date
  const [currentDate, setCurrentDate] = useState(new Date());

  // Helper to get days in month
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Helper to get day of week for the 1st of the month
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const changeMonth = (increment) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    const dateStr = new Date(selectedDate).toDateString();
    const currentStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
    return dateStr === currentStr;
  };

  const renderDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    // Empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
        // Simple logic to disable past dates (optional)
        const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
        const today = new Date();
        today.setHours(0,0,0,0);
        const isPast = checkDate < today;

      days.push(
        <button
          key={i}
          disabled={isPast}
          onClick={() => onDateSelect(checkDate.toISOString().split('T')[0])}
          className={`
            h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all
            ${isSelected(i) 
              ? 'bg-amber-600 text-white shadow-lg scale-110' 
              : isPast 
                ? 'text-slate-300 cursor-not-allowed' 
                : 'hover:bg-slate-200 text-slate-700'
            }
            ${isToday(i) && !isSelected(i) ? 'border border-amber-600 text-amber-600' : ''}
          `}
        >
          {i}
        </button>
      );
    }
    return days;
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 max-w-sm mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-slate-100 rounded-full">
          <ChevronLeft size={20} />
        </button>
        <h4 className="font-bold text-lg text-slate-800">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h4>
        <button onClick={() => changeMonth(1)} className="p-1 hover:bg-slate-100 rounded-full">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 mb-2 text-center">
        {DAYS.map(day => (
          <span key={day} className="text-xs font-bold text-slate-400 uppercase">{day}</span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 justify-items-center">
        {renderDays()}
      </div>
    </div>
  );
}