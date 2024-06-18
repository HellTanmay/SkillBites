import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

let BASE_URL="https://skillbites-backend.onrender.com"
// let BASE_URL="http://localhost:4000"

const initialState={
  lectures:[],
  loading:false,
}
export const addLecture = createAsyncThunk("addLecture",async ({ c_id, formData }) => {
    try {
      const response = await fetch(`${BASE_URL}/addLecture/${c_id}`, {
        method: "POST",
        body: formData,
        credentials: "include",
      })
  
      const resdata = await response.json();
      return resdata;
    } catch (err) {
      console.log(err);
    }
  }
);

export const getLectures = createAsyncThunk("getLectures", async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/getLectures/${id}`, {
      credentials: "include",
    });
    const res = await response.json();
    return res;
  } catch (err) {
    console.log(err);
  }
});

export const updateLecture = createAsyncThunk("updateLecture", async ({courseId,lectureId}) => {
  try {
    const response = await fetch(`${BASE_URL}/updateLecture/${courseId}?lecture_id=${lectureId}`, {
      credentials: "include",
      method:'PATCH',
    });
    const res = await response?.json();
    return res;
  } catch (err) {
    console.log(err);
  }
});

export const deleteLecture=createAsyncThunk('deleteLecture',async({courseId,lectureId})=>{
  try{
toast.loading('deleting...')
     const response=await fetch(`${BASE_URL}/deleteLecture/${courseId}?lecture_id=${lectureId}`,
     {credentials:'include',
       method:'DELETE'});
  const res=await response?.json();
  toast.dismiss()
      return res  
  }catch(err){
    console.log(err)
  }
 });

export const RecordSlice = createSlice({
  name: "lecture",
  initialState,
  reducers:{},
  extraReducers: (builder) => {
    builder.addCase(addLecture.fulfilled, (state, action) => {
      state.loading=false 
    });
    builder.addCase(addLecture.pending, (state, action) => {
      state.loading=true 
    });
    builder.addCase(addLecture.rejected, (state, action) => {
      console.log("error", action?.payload);
      state.loading=false
    });
    builder.addCase(getLectures.fulfilled, (state, action) => {
        state.lectures=action?.payload;
        state.loading=false
      });
      builder.addCase(getLectures.pending, (state, action) => {
        state.lectures=action?.payload;
        state.loading=true
      });
      builder.addCase(getLectures.rejected, (state, action) => {
        console.log("error", action?.payload);
        state.loading=false
      });
  },
});

export default RecordSlice.reducer;
