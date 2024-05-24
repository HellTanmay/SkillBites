import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState={
  lectures:[],
  loading:false,
}
export const addLecture = createAsyncThunk("addLecture",async ({ c_id, formData }) => {
    try {
      const response = await fetch(`http://localhost:4000/addLecture/${c_id}`, {
        method: "POST",
        body: formData,
        credentials: "include",
      })
  
      const resdata = await response.json();
      console.log(resdata);
      return resdata;
    } catch (err) {
      console.log(err);
    }
  }
);

export const getLectures = createAsyncThunk("getLectures", async (id) => {
  try {
    const response = await fetch(`http://localhost:4000/getLectures/${id}`, {
      credentials: "include",
    });
    const res = await response.json();
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
});

export const updateLecture = createAsyncThunk("updateLecture", async ({courseId,lectureId}) => {
  try {
    const response = await fetch(`http://localhost:4000/updateLecture/${courseId}?lecture_id=${lectureId}`, {
      credentials: "include",
      method:'PATCH',
    });
    const res = await response?.json();
    console.log("43",res);
    return res;
  } catch (err) {
    console.log(err);
  }
});

export const deleteLecture=createAsyncThunk('deleteLecture',async({courseId,lectureId})=>{
  try{
      console.log(courseId,lectureId)
     const response=await fetch(`http://localhost:4000/deleteLecture/${courseId}?lecture_id=${lectureId}`,
     {credentials:'include',
       method:'DELETE'});
  const res=await response?.json();
      console.log(res)
      return res  
  }catch(err){
     toast.error(err.message)
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
 //   builder.addCase(updateLecture.fulfilled, (state,action)=>{
    
    //     const updatedLecture = state.lectures.data&&state?.lectures?.data.map((lecture) =>
    //     lecture._id === action.payload.data?._id ?  { ...lecture, watched:action.payload.data.watched}:lecture
    //     );
    //     state.lectures = { ...state.lectures, data: updatedLecture };
    // })
    // builder.addCase(updateLecture.rejected, (state,action)=>{
    //     console.log("error",action.payload);
    // })