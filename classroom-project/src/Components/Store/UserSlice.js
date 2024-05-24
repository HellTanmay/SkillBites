import { createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import { toast } from "react-toastify";

export const registerUser = createAsyncThunk("registerUser",async (formData) => {
    
    try {
      const response = await fetch(`http://localhost:4000/Signup`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json',
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

export const verifyEmail = createAsyncThunk("verifyEmail",async ({email,otp}) => {  
  try {
    const response = await fetch(`http://localhost:4000/verifyEmail`, {
      method: "POST",
      body: JSON.stringify({email,otp}),
      headers: {
          'Content-Type': 'application/json',
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

export const resendOtp = createAsyncThunk("resendOtp",async ({user_id,email}) => {  
  try {
    const response = await fetch(`http://localhost:4000/resend-otp`, {
      method: "POST",
      body: JSON.stringify({user_id,email}),
      headers: {
          'Content-Type': 'application/json',
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

export const LoginUser = createAsyncThunk("Login",async ({email,password}) => {  
  try {
    const response = await fetch(`http://localhost:4000/Login`, {
      method: "POST",
      body: JSON.stringify({email,password}),
      headers: {
          'Content-Type': 'application/json',
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