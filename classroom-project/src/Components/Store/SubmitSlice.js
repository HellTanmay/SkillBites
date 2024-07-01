import { createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import { toast } from "react-hot-toast";
import { fetchWithAuth } from "./fetchRequest";

const initialState={
    submissions:[],
    isLoading:false,
 };


 export const submitAssign = createAsyncThunk("submitAssign",async ({ c_id, q_id, formData }) => {
    try {
      const response = await fetchWithAuth(
        `/submitAssign/${c_id}?assignment_id=${q_id}`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );
      const resdata = await response.json();
      return resdata;
    } catch (err) {
     console.log(err)
    }
  });

export const getSubmission=createAsyncThunk('getSubmission',async({c_id,q_id})=>{
    try{
       const response=await fetchWithAuth(`/assignments/${c_id}?assignment_id=${q_id} `,
       {credentials:'include'});
      const data=await response.json();
      return data
      
    }catch(err){
       console.log(err)
       throw err
    }
   });

   export const UpdateSubmission=createAsyncThunk('UpdateSubmission',async({c_id,q_id,sub_id,status})=>{
    try{
       const response=await fetchWithAuth(`/UpdateSubmission/${c_id}?assignment_id=${q_id} `,
       {method:'PUT',
        credentials:'include',
        headers:{
          'Content-Type':'application/json'  
        },
        body:JSON.stringify({sub_id,status})
    });
    const data=await response.json();
    return data
    }catch(err){
       console.log(err)
       throw err
    }
   });

   export const SubmitSlice =createSlice ({
    name:'Course',
    initialState,
    extraReducers:(builder)=>{
        builder.addCase(getSubmission.fulfilled, (state,action)=>{
            state.submissions=action.payload;
            state.isLoading=false
        })
        builder.addCase(getSubmission.pending, (state,action)=>{
            state.isLoading=true
        })
        builder.addCase(getSubmission.rejected, (state,action)=>{
            console.log("error",action.payload);
            state.isLoading=false
        })
        builder.addCase(UpdateSubmission.fulfilled, (state,action)=>{
           const updatedSubmissions = state.submissions.data.map((submission) =>
            submission._id === action.payload.data._id ?  { ...submission, status: action.payload.data.status, marks: action.payload.data.marks }:submission
            );
            state.submissions = { ...state.submissions, data: updatedSubmissions };
            state.isLoading=false
        })
        builder.addCase(UpdateSubmission.rejected, (state,action)=>{
            console.log("Error",action.payload);
            state.isLoading=false
        })
    }
})
export default SubmitSlice.reducer;