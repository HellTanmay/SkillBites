import { createSlice, createAsyncThunk} from "@reduxjs/toolkit"


export const fetchUser=createAsyncThunk('fetchUser',async(userId)=>{
    try{
       const response=await fetch('http://localhost:4000/profile',
       {credentials:'include',
    body:userId});
      const data=await response.json();
      return data
      
    }catch(err){
       console.log(err)
       throw err
    }
   });

   export const fetchAllUsers=createAsyncThunk('fetchAllUsers',async()=>{
    try{
       const response=await fetch('http://localhost:4000/fetchAllUsers',
       {credentials:'include'});
      const data=await response.json();
      return data
      
    }catch(err){
       console.log(err)
       throw err
    }
   });

   export const UserSlice=createSlice({
    name:'user',
    initialState:{
        userData:{},
        loading:false,
        allLoading:false,
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchUser.fulfilled,(state,action)=>{
            state.userData=action.payload;
            state.loading=false
        })
        builder.addCase(fetchUser.pending,(state,action)=>{
            state.loading=true
        })
        builder.addCase(fetchUser.rejected,(state,action)=>{
            console.log("error",action.payload);
            state.loading=false
        })
        builder.addCase(fetchAllUsers.fulfilled,(state,action)=>{
            state.userData=action.payload;
            state.allLoading=false
        })
        builder.addCase(fetchAllUsers.pending,(state,action)=>{
            state.allLoading=true
        })
        
        builder.addCase(fetchAllUsers.rejected,(state,action)=>{
            console.log("error",action.payload);
            state.allLoading=false
        })
        
    }

})
export default UserSlice.reducer;