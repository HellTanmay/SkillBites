import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth } from "./fetchRequest";

const initialState={
  payments:[],
  isLoading:false
}

export const createPayment = createAsyncThunk("createPayment",async ({id, amount,currency} ) => {
  try {
    const response = await fetchWithAuth(`/order/${id}`, {
      method: "POST",
      body: JSON.stringify({
        amount:amount*100,
        currency,
      }),
      headers:{
        "Content-Type":"application/json",
      },
      credentials: "include",
    });
    const resdata = await response.json();
    return resdata;
  } catch (err) {
    console.log(err);
  }
}
);

export const validatePayment = createAsyncThunk("validatePayment",async ({id, body} ) => {
  try {
    const response = await fetchWithAuth(`/order/validate/${id}`, {
      method: "POST",
      body: JSON.stringify(body),
      headers:{
        "Content-Type":"application/json",
      },
      credentials: "include",
    });
    const resdata = await response.json();
    return resdata;
  } catch (err) {
    console.log(err);
  }
}
);

export const getAllPayments = createAsyncThunk("getAllPayments",async (payment) => {
  let url = `/getOrders/`;
      if (payment) {
        url += `?payment_id=${payment}`;
      }
    try {
      const response = await fetchWithAuth(url, {
        credentials: "include",
      });
      const resdata = await response?.json();
      return resdata;
    } catch (err) {
      console.log(err);
    }
  }
);
export const getPayment = createAsyncThunk("getPayment",async (payment) => {
 
    try {
      const response = await fetchWithAuth(`/getInvoice?payment_id=${payment}`, {
        credentials: "include",
      });
      const resdata = await response?.json();
      return resdata;
    } catch (err) {
      console.log(err);
    }
  }
);


export const PaymentSlice = createSlice({
    name: "Payments",
    initialState,
    reducers:{},
    extraReducers: (builder) => {
      builder.addCase(getAllPayments.fulfilled, (state, action) => {
        state.payments=action?.payload;  
        state.isLoading=false
      });
      builder.addCase(getAllPayments.pending, (state, action) => {
        state.isLoading=true
      });
      builder.addCase(getAllPayments.rejected, (state, action) => {
        console.log("error", action?.payload);
        state.isLoading=false
      });
      builder.addCase(getPayment.fulfilled, (state, action) => {
        state.payments=action?.payload;  
        state.isLoading=false
      });
      builder.addCase(getPayment.pending, (state, action) => {
        state.isLoading=true
      });
      builder.addCase(getPayment.rejected, (state, action) => {
        console.log("error", action?.payload);
        state.isLoading=false
      });
    }
})

export default PaymentSlice.reducer