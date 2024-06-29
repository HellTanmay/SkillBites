import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth } from "./fetchRequest";

// let BASE_URL="https://skillbites-backend.onrender.com"
let BASE_URL="http://localhost:4000"


export const addAssignments = createAsyncThunk("addAssignments",async ({ c_id, formData }) => {
    try {
      const response = await fetchWithAuth(
        `/addAssignments/${c_id}`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );
      const resdata = await response.json();
      return resdata;
    } catch (err) {
     throw err;
    }
  });


export const fetchAssignments = createAsyncThunk("fetchAssignments", async (id) => {
    try {
      const response = await fetchWithAuth(`/getAssignments/${id}`, {
        credentials: "include",
      });
      const res = await response.json();
      return res;
    } catch (err) {
      console.log(err);
      throw err
    }
  });

  export const deleteAssign=createAsyncThunk('deleteAssign',async({courseId,assignId})=>{
    try{
        console.log(courseId)
       const response=await fetchWithAuth(`/deleteAssignment/${courseId}?assignment_id=${assignId}`,
       {credentials:'include',
         method:'DELETE'});
    const res=await response?.json();
        return res  
    }catch(err){
      throw err
    }
   });

  export const AssignmentSlice = createSlice({
    name: "Assignments",
    initialState:{
        Assignments:[],
        loading:false
    },
    extraReducers: (builder) => {
      builder.addCase(fetchAssignments.fulfilled, (state, action) => {
        state.Assignments=action.payload
        state.loading=false 
      });
      builder.addCase(fetchAssignments.pending, (state, action) => {
        state.loading=true 
      });
      builder.addCase(fetchAssignments.rejected, (state, action) => {
        state.loading=false 
        console.log('error',action.payload)
      });
    }
})
export default AssignmentSlice.reducer;