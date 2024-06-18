import { createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import { toast } from "react-hot-toast";

let BASE_URL="https://skillbites-backend.onrender.com"
// let BASE_URL="http://localhost:4000"

export const createCourse = createAsyncThunk("createCourse",async (data) => {
              try {
                const response = await fetch(`${BASE_URL}/createCourse`, {
                  method: "POST",
                  body: data,
                  credentials: "include",
                 
                });
                
                if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(errorData.message || 'Failed to create course');
                }
          
                const resData = await response.json();
                return resData
    } catch (err) {
      console.log(err);
    }
  }
);

export const fetchCourse=createAsyncThunk('fetchCourse',async(category)=>{
 try{
    let url=`${BASE_URL}/fetchCourses`
    if(category){
        url+=`?optio=${category}`
    }
    const response=await fetch(url,{credentials:'include'});
    return response?.json();

 }catch(err){
    console.log(err)
 }
});

export const fetchCourseById=createAsyncThunk('fetchCourseById',async(id)=>{
    try{
       const response=await fetch(`${BASE_URL}/course/${id}`,
        {credentials:'include'});
    const res=await response.json();
        return res     
    }catch(err){
       console.log(err)
       throw err
    }
   });

export const approved=createAsyncThunk('approved',async({c_id,status})=>{
    try{

        console.log(c_id)
        console.log(status)
       const response=await fetch(`${BASE_URL}/admin/course`,{
        credentials:'include',
        method:'PUT',
        headers:{
        'Content-Type':'application/json',
        },
        body:JSON.stringify({c_id,status})
    });
       const data=await response.json();
       return data
   
    }catch(err){
       console.log(err)
    }
   });

export const fetchMyCourse=createAsyncThunk('fetchMyCourse',async()=>{
    try{
       const response=await fetch(`${BASE_URL}/myCourse`,{credentials:'include'});
    const res=await response.json();

        return res
       
    }catch(err){
       console.log(err)
    }
   });

   export const deleteCourse=createAsyncThunk('deleteCourse',async(courseId)=>{
    try{
        console.log(courseId)
       const response=await fetch(`${BASE_URL}/deleteCourse?courseId=${courseId}`,
       {credentials:'include',
         method:'DELETE'});
    const res=await response?.json();
        return res  
    }catch(err){
       toast.error(err.message)
    }
   });

   
export const fetchPerformance=createAsyncThunk('fetchPerformance',async(id)=>{
    try{
       const response=await fetch(`${BASE_URL}/performanceStats/${id}`,{credentials:'include'});
    const res=await response.json();

        return res
       
    }catch(err){
       console.log(err)
    }
   });

   export const fetchContents=createAsyncThunk('fetchContents',async(id)=>{
    try{
       const response=await fetch(`${BASE_URL}/courseContents/${id}`,{credentials:'include'});
    const res=await response.json();

        return res
       
    }catch(err){
       console.log(err)
    }
   });

export const CourseSlice =createSlice ({
    name:'Course',
    initialState:{
        courseData:[],
        courseDesc:{},
        MycourseData:[],
        performanceStats:{},
        courseContents:{},
        loading:false,
    },
    extraReducers:(builder)=>{
          builder.addCase(createCourse.fulfilled, (state,action)=>{
            state.courseData=action.payload;
            state.loading=false
        })
        builder.addCase(createCourse.pending, (state,action)=>{
          state.loading=true
        })
        builder.addCase(createCourse.rejected, (state,action)=>{
            console.log("error",action.payload);
            state.loading=false
        })
        builder.addCase(fetchCourse.fulfilled, (state,action)=>{
            state.courseData=action.payload;
            state.loading=false
        })
        builder.addCase(fetchCourse.pending, (state,action)=>{
          state.loading=true
        })
        builder.addCase(fetchCourse.rejected, (state,action)=>{
            console.log("error",action.payload);
            state.loading=false
        })
          builder.addCase(fetchCourseById.fulfilled, (state,action)=>{
            state.courseDesc=action.payload;
            state.loading=false
        })
        builder.addCase(fetchCourseById.pending, (state,action)=>{
          state.loading=true
        })
        builder.addCase(fetchCourseById.rejected, (state,action)=>{
            console.log("error",action.payload);
            state.loading=false
        })
        builder.addCase(fetchMyCourse.fulfilled, (state,action)=>{
            state.MycourseData=action.payload;
            state.loading=false
        })
        builder.addCase(fetchMyCourse.pending, (state,action)=>{
            state.loading=true
        })
        builder.addCase(fetchMyCourse.rejected, (state,action)=>{
            console.log("error",action.payload);
            state.loading=false
        })
        builder.addCase(fetchContents.fulfilled, (state,action)=>{
            state.courseContents=action.payload;
            state.loading=false
        })
        builder.addCase(fetchContents.pending, (state,action)=>{
            state.loading=true
        })
        builder.addCase(fetchContents.rejected, (state,action)=>{
            console.log("error",action.payload);
            state.loading=false
        })
        builder.addCase(approved.fulfilled, (state,action)=>{
            const updatedCourse = state.courseData.data&&state.courseData.data.map((course) =>
            course._id === action.payload.data?._id ?  { ...course, status: action.payload.data.status}:course
            );
            state.courseData = { ...state.courseData, data: updatedCourse };
        })
        builder.addCase(approved.rejected, (state,action)=>{
            console.log("error",action.payload);
        })
        builder.addCase(fetchPerformance.fulfilled, (state,action)=>{
            state.performanceStats=action.payload;
            state.loading=false
        })
        builder.addCase(fetchPerformance.pending, (state,action)=>{
            state.loading=true
        })
        builder.addCase(fetchPerformance.rejected, (state,action)=>{
            console.log("error",action.payload);
            state.loading=false
        })
    }

})
export default CourseSlice.reducer;
