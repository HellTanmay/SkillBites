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

  export const submitAssign = createAsyncThunk("submitAssign",async ({ c_id, q_id, formData }) => {
    try {
      const response = await fetch(
        `http://localhost:4000/submitAssign/${c_id}?assignment_id=${q_id}`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );
      const resdata = await response.json();
   console.log(resdata)
      return resdata;
    } catch (err) {
     toast.error(err.message);
    }
  });
 
  // export const getAssignments = createAsyncThunk("getAssignments", async (id) => {
  //   try {
  //     const response = await fetch(`http://localhost:4000/getAssignments/${id}`, {
  //       credentials: "include",
  //     });
  //     const res = await response.json();
  //     console.log(res);
  //     return res;
  //   } catch (err) {
  //     console.log(err);
  //   }
  // })
  
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
export const AssignSlice = createSlice({
  name: "Assignment",
  initialState:{
    assignments:[],
    submissions:[],
    isLoading:false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addAssignments.fulfilled, (action, state) => {
      state.assignments = action?.payload;
    });
    builder.addCase(addAssignments.rejected, (action, state) => {
      console.log("error", action?.payload);
    });
    builder.addCase(submitAssign.fulfilled, (action, state) => {
      state.submissions = action?.payload;
      state.isLoading=false
    });
    builder.addCase(submitAssign.pending, (action, state) => {
     state.isLoading=true
    });
    builder.addCase(submitAssign.rejected, (action, state) => {
      console.log("error", action?.payload);

    });
    // builder.addCase(getAssignments.fulfilled, (action, state) => {
    //     state.assignments=action?.payload;
    //      console.log(action.payload)
    // });
    // builder.addCase(getAssignments.rejected, (action, state) => {
    //     console.log("error", action?.payload);
    // });
  },
});
export default AssignSlice.reducer;
