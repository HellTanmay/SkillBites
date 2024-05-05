import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState={
  payments:[],
  isLoading:false
}
export const getAllPayments = createAsyncThunk("getAllPayments",async (payment) => {
  let url = "http://localhost:4000/getOrders/";
      if (payment) {
        url += `?payment_id=${payment}`;
      }
    try {
      const response = await fetch(url, {
        credentials: "include",
      });
      const resdata = await response?.json();
      console.log(resdata);
      return resdata;
    } catch (err) {
      console.log(err);
    }
  }
);
export const getPayment = createAsyncThunk("getPayment",async (payment) => {
 
    try {
      const response = await fetch(`http://localhost:4000/getInvoice?payment_id=${payment}`, {
        credentials: "include",
      });
      const resdata = await response?.json();
      console.log(resdata);
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
        console.log(action.payload)
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
        console.log(action.payload)
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