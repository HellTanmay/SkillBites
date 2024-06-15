import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";


export const addQuiz = createAsyncThunk("addQuiz",async ({ c_id, formData }) => {
    try {
      const response = await fetch(`http://localhost:4000/AddQuizz/${c_id}`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const resdata = await response.json();
      console.log(resdata);
      return resdata;
    } catch (err) {
      console.log(err);
    }
  }
);

export const DisplayQuizz = createAsyncThunk("DisplayQuiz", async (id) => {
  try {
    const response = await fetch(`http://localhost:4000/DisplayQuizz/${id}`, {
      credentials: "include",
    });
    const res = await response.json();
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
});

export const getQuiz = createAsyncThunk("getQuiz", async ({id,quizz_id}) => {
  try {
    const response = await fetch(`http://localhost:4000/getQuiz/${id}?quizz_id=${quizz_id}`, {
      credentials: "include",
    });
    const res = await response.json();
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
});

export const deleteQuizz=createAsyncThunk('deleteQuizz',async({c_id,quizz_id})=>{
  try{
    console.log(c_id, quizz_id)
     const response=await fetch(`http://localhost:4000/deleteQuiz/${c_id}?quizz_id=${quizz_id}`,
     {credentials:'include',
       method:'DELETE'});
  const res=await response?.json();
      console.log(res)
      return res  
  }catch(err){
     toast.error(err.message)
  }
 });

 export const submitQuiz = createAsyncThunk("submitQuiz",async ({ c_id,quizz_id,answers }) => {
  try {
    console.log(answers)
    const response = await fetch(`http://localhost:4000/AnswerSubmit/${c_id}?quizz_id=${quizz_id}`, {
      method: "POST",
      body:JSON.stringify(answers),
      headers:{
      'Content-Type':'application/json',
      },
      credentials: "include",
    });
    const resdata = await response.json();
    console.log(resdata);
    return resdata;
  } catch (err) {
    console.log(err);
  }
}
);
export const getQuizSubmission = createAsyncThunk("getQuizSubmission", async ({id,quizz_id}) => {
  try {
    const response = await fetch(`http://localhost:4000/getQuizSubmission/${id}?quizz_id=${quizz_id}`, {
      credentials: "include",
    });
    const res = await response.json();
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
});

export const getAllSubmissions = createAsyncThunk("getAllSubmissions", async ({id,quizz_id}) => {
  try {
    const response = await fetch(`http://localhost:4000/getAllSubmissions/${id}?quizz_id=${quizz_id}`, {
      credentials: "include",
    });
    const res = await response.json();
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
});

export const QuizzSlice = createSlice({
    name: "quizz",
    initialState:{
        quizzes:[],
        question:[],
        result:[],
        AllResult:[],
        loading:false,
        allLoading:false,
        resLoad:false
    },
    reducers:{},
    extraReducers: (builder) => {
   
      builder.addCase(DisplayQuizz.fulfilled, (state, action) => {
        state.quizzes=action?.payload;
        state.loading=false
      });
      builder.addCase(DisplayQuizz.pending, (state, action) => {
        state.loading=true
      });
      builder.addCase(DisplayQuizz.rejected, (state, action) => {
        console.log('error',action.payload)
        state.loading=false
      });
      builder.addCase(getQuizSubmission.fulfilled, (state, action) => {
        state.result=action?.payload;
        state.loading=false
      });
      builder.addCase(getQuizSubmission.pending, (state, action) => {
        state.loading=true
      });
      builder.addCase(getQuizSubmission.rejected, (state, action) => {
        console.log('error',action.payload)
        state.loading=false
      });
      builder.addCase(getQuiz.fulfilled, (state, action) => {
        state.question=action?.payload;
        state.loading=false
      });
      builder.addCase(getQuiz.pending, (state, action) => {
        state.loading=true
      });
      builder.addCase(getQuiz.rejected, (state, action) => {
        console.log('error',action.payload)
        state.loading=false
      });
      builder.addCase(getAllSubmissions.fulfilled, (state, action) => {
        state.AllResult=action?.payload;
        state.allLoading=false
      });
      builder.addCase(getAllSubmissions.pending, (state, action) => {
        state.allLoading=true
      });
      builder.addCase(getAllSubmissions.rejected, (state, action) => {
        console.log('error',action.payload)
        state.allLoading=false
      });
      
      
    }
})
export default QuizzSlice.reducer;