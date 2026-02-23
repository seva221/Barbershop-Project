// src/api.js

// במקום רק '/api'
const BASE_URL = '/api';

/**
 * פונקציית עזר לניהול תגובות מהשרת - מחלצת שגיאות Zod מפורטות
 */
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || 'משהו השתבש בקריאה לשרת');
    // ה-Backend שלך מחזיר מערך של שגיאות ב-data.errors
    error.errors = data.errors || []; 
    throw error;
  }
  return data;
};

// --- AUTHENTICATION ---

// התחברות לקוח
export const login = async (email, password) => {
  const response = await fetch(`${BASE_URL}/auth/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
};

// התחברות בעל עסק
export const loginBusiness = async (email, password) => {
  const response = await fetch(`${BASE_URL}/auth/business/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
};

// הרשמת לקוח
export const register = async (name, email, password) => {
  const response = await fetch(`${BASE_URL}/auth/user/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse(response);
};

// הרשמת עסק
export const registerBusiness = async (businessData) => {
  const response = await fetch(`${BASE_URL}/auth/business/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(businessData), // businessData כולל name, email, password, address, category
  });
  return handleResponse(response);
};

// --- RESOURCES (Businesses, Services, Workers) ---

// קבלת כל העסקים לדף הבית
export const getAllBusinesses = async () => {
  const response = await fetch(`${BASE_URL}/resources/businesses`); // נתיב מלא
  const data = await response.json();
  return data;
};

// קבלת נתוני עסק (שירותים ועובדים)
export const getBusinessData = async (businessId) => {
  const response = await fetch(`${BASE_URL}/resources?businessId=${businessId}`);
  const data = await handleResponse(response);
  return {
    services: data.services || [],
    workers: data.workers || []
  };
};

// עדכון תמונת עסק (דורש טוקן של מנהל עסק)
export const updateBusinessImage = async (businessId, imageUrl, token) => {
  // שים לב לנתיב המעודכן: /auth/business/update/
  const response = await fetch(`${BASE_URL}/auth/business/update/${businessId}`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({ image: imageUrl }),
  });
  return handleResponse(response);
};

// יצירת שירות חדש לעסק (דורש טוקן של מנהל עסק)
export const createService = async (serviceData, token) => {
  const response = await fetch(`${BASE_URL}/resources/services`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(serviceData),
  });
  return handleResponse(response);
};

// --- BOOKING (Appointments) ---

// קבלת כל התורים (ללקוח או למנהל - תלוי בטוקן)
export const getAppointments = async (token) => {
  const response = await fetch(`${BASE_URL}/booking`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return handleResponse(response);
};

// יצירת תור חדש
export const createAppointment = async (appointmentData, token) => {
  const response = await fetch(`${BASE_URL}/booking`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(appointmentData),
  });
  return handleResponse(response);
};

// עדכון/שינוי מועד תור
export const updateAppointment = async (appointmentId, updateData, token) => {
  const response = await fetch(`${BASE_URL}/booking/${appointmentId}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(updateData),
  });
  return handleResponse(response);
};

// ביטול תור
export const deleteAppointment = async (appointmentId, token) => {
  const response = await fetch(`${BASE_URL}/booking/${appointmentId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return handleResponse(response);
};

// יצירת עובד חדש
export const createWorker = async (workerData, token) => {
  const response = await fetch(`${BASE_URL}/resources/workers`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(workerData),
  });
  return handleResponse(response);
};

export const getUser = async (userId, token) => {
  console.log(userId);
  const response = await fetch(`${BASE_URL}/auth/user/${userId}`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
  });
  return handleResponse(response);
};