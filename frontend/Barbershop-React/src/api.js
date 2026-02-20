// src/api.js

const BASE_URL = '/api';

/**
 * פונקציית עזר משופרת לניהול תגובות מהשרת
 * יודעת לחלץ גם הודעת שגיאה כללית וגם את רשימת השגיאות של Zod
 */
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || 'משהו השתבש בקריאה לשרת');
    error.errors = data.errors || []; // שומר את פירוט השגיאות מה-Backend
    throw error;
  }
  return data;
};

// --- AUTHENTICATION ---

export const login = async (email, password) => {
  const response = await fetch(`${BASE_URL}/auth/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
};

export const register = async (name, email, password) => {
  const response = await fetch(`${BASE_URL}/auth/user/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse(response);
};

export const registerBusiness = async (businessData) => {
  const response = await fetch(`${BASE_URL}/auth/business/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(businessData),
  });
  return handleResponse(response);
};

// --- RESOURCES ---

export const getAllBusinesses = async () => {
  const response = await fetch(`${BASE_URL}/resources/businesses`);
  return handleResponse(response);
};

export const getBusinessData = async (businessId) => {
  const response = await fetch(`${BASE_URL}/resources?businessId=${businessId}`);
  const data = await handleResponse(response);
  return {
    services: data.services || [],
    workers: data.workers || []
  };
};

// --- BOOKING ---

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