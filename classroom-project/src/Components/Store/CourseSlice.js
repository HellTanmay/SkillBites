import { createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import { toast } from "react-toastify";


export const fetchCourse=createAsyncThunk('fetchCourse',async(category)=>{
 try{
    let url=`http://localhost:4000/course`
    if(category){
        url+=`?optio=${category}`
    }
     console.log(url)
    const response=await fetch(url,{credentials:'include'});
    return response?.json();

 }catch(err){
    console.log(err)
 }
});
export const approved=createAsyncThunk('approved',async({c_id,status})=>{
    try{

        console.log(c_id)
        console.log(status)
       const response=await fetch(`http://localhost:4000/admin/course`,{
        credentials:'include',
        method:'PUT',
        headers:{
        'Content-Type':'application/json',
        },
        body:JSON.stringify({c_id,status})
    });
       const data=await response.json();
       console.log(data)
       return data
   
    }catch(err){
       console.log(err)
    }
   });

export const fetchMyCourse=createAsyncThunk('fetchMyCourse',async()=>{
    try{
       const response=await fetch(`http://localhost:4000/myCourse`,{credentials:'include'});
    const res=await response.json();

        return res
       
    }catch(err){
       console.log(err)
    }
   });

   export const deleteCourse=createAsyncThunk('deleteCourse',async(courseId)=>{
    try{
        console.log(courseId)
       const response=await fetch(`http://localhost:4000/deleteCourse?courseId=${courseId}`,
       {credentials:'include',
         method:'DELETE'});
    const res=await response?.json();
        console.log(res)
        return res  
    }catch(err){
       toast.error(err.message)
    }
   });

   
export const fetchPerformance=createAsyncThunk('fetchPerformance',async(id)=>{
    try{
       const response=await fetch(`http://localhost:4000/performanceStats/${id}`,{credentials:'include'});
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
        MycourseData:[],
        performanceStats:{},
        loading:false,
    },
    extraReducers:(builder)=>{
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
