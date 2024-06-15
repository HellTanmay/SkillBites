import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";


export const addAssignments = createAsyncThunk("addAssignments",async ({ c_id, formData }) => {
    try {
      const response = await fetch(
        `http://localhost:4000/addAssignments/${c_id}`,
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
      const response = await fetch(`http://localhost:4000/getAssignments/${id}`, {
        credentials: "include",
      });
      const res = await response.json();
      return res;
    } catch (err) {
      console.log(err);
    }
  });

  export const deleteAssign=createAsyncThunk('deleteAssign',async({courseId,assignId})=>{
    try{
        console.log(courseId)
       const response=await fetch(`http://localhost:4000/deleteAssignment/${courseId}?assignment_id=${assignId}`,
       {credentials:'include',
         method:'DELETE'});
    const res=await response?.json();
        console.log(res)
        return res  
    }catch(err){
       toast.error(err.message)
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