// --- MOCK DATABASE (הנתונים) ---
const MOCK_DB = {
  businesses: [
    { 
      id: "b1", 
      name: "Royal Cuts TLV", 
      address: "דיזנגוף 100, תל אביב", 
      category: "Barbershop", 
      rating: 4.9, 
      image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=400" 
    },
    { 
      id: "b2", 
      name: "Glamour Spa", 
      address: "רוטשילד 45, תל אביב", 
      category: "Spa", 
      rating: 4.8, 
      image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80&w=400" 
    }
  ],
  services: {
    "b1": [
      { id: 1, name: "תספורת גבר", price: 80, duration: 30 },
      { id: 2, name: "עיצוב זקן", price: 50, duration: 20 },
      { id: 3, name: "טיפול מלכותי", price: 150, duration: 60 }
    ],
    "b2": [
      { id: 4, name: "מניקור", price: 120, duration: 45 },
      { id: 5, name: "עיסוי", price: 350, duration: 60 }
    ]
  },
  workers: {
    "b1": [
      { id: 1, name: "דניאל", role: "Master Barber", image: "https://randomuser.me/api/portraits/men/32.jpg" },
      { id: 2, name: "יוסי", role: "Stylist", image: "https://randomuser.me/api/portraits/men/45.jpg" }
    ],
    "b2": [
      { id: 3, name: "שרה", role: "Nail Artist", image: "https://randomuser.me/api/portraits/women/44.jpg" },
      { id: 4, name: "נועה", role: "Masseuse", image: "https://randomuser.me/api/portraits/women/68.jpg" }
    ]
  },
  appointments: [
    { id: 101, businessId: "b1", customerName: "אורח", serviceId: 1, workerId: 1, date: "2023-12-05", time: "10:00", status: "approved" },
    { id: 102, businessId: "b1", customerName: "רן דן", serviceId: 3, workerId: 2, date: "2023-12-05", time: "11:00", status: "pending" }
  ]
};

// --- API FUNCTIONS (הפונקציות שמדמות שרת) ---

// התחברות (מדומה)
export const login = (email) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (email === 'admin@demo.com') {
        resolve({ name: 'מנהל', email, role: 'admin', businessId: 'b1' });
      } else {
        resolve({ name: 'אורח', email, role: 'customer' });
      }
    }, 800);
  });
};

// קבלת נתונים לעסק ספציפי
export const getBusinessData = (businessId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        info: MOCK_DB.businesses.find(b => b.id === businessId),
        services: MOCK_DB.services[businessId],
        workers: MOCK_DB.workers[businessId],
        appointments: MOCK_DB.appointments.filter(a => a.businessId === businessId)
      });
    }, 500);
  });
};

// קבלת כל העסקים (לדף הבית)
export const getAllBusinesses = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_DB.businesses);
    }, 300);
  });
};

// ביצוע הזמנה
export const createAppointment = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newAppt = { id: Date.now(), status: 'pending', ...data };
      MOCK_DB.appointments.push(newAppt);
      resolve({ success: true, appointment: newAppt });
    }, 1000);
  });
};