import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';

// const BASE_URL = 'https://skillbites-backend.onrender.com';
const BASE_URL='http://localhost:4000'


const refreshToken = async () => {
  try {
    const response = await fetch(`${BASE_URL}/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

export const fetchWithAuth = async (url, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      credentials: 'include',
    });

    if (response.status === 401) {
      const refreshed = await refreshToken();
      if (refreshed) {
        return fetch(`${BASE_URL}${url}`, {
          ...options,
          credentials: 'include',
        });
      }
    }
    return response;
  
  } catch (error) {
    throw error;
  }
};