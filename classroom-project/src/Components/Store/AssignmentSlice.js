import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

let BASE_URL="https://skillbites-backend.onrender.com"

export const addAssignments = createAsyncThunk("addAssignments",async ({ c_id, formData }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/addAssignments/${c_id}`,
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
      const response = await fetch(`${BASE_URL}/getAssignments/${id}`, {
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
       const response=await fetch(`${BASE_URL}/deleteAssignment/${courseId}?assignment_id=${assignId}`,
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