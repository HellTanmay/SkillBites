import { createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import { toast } from "react-hot-toast";
import { fetchWithAuth } from "./fetchRequest";


const isNetworkError = (error) => {
  return (
    error.message === 'Failed to fetch' ||
    error.message.includes('NetworkError') ||
    error.message.includes('ECONNREFUSED') ||
    error.message.includes('ECONNRESET') ||
    error.message.includes('ENOTFOUND') ||
    error.message.includes('ETIMEDOUT')
  );
};
export const registerUser = createAsyncThunk("registerUser",async (formData) => {
    
    try {
      toast.loading('Signing up...')
      const response = await fetchWithAuth(`/Signup`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json',
          },
        credentials: "include",
      });
      const resdata = await response.json();
      toast.dismiss()
      return resdata;
    } catch (err) {
      console.log(err);
    }
  }
);

export const verifyEmail = createAsyncThunk("verifyEmail",async ({email,otp}) => {  
  try {
    toast.loading('verifying email...')
    const response = await fetchWithAuth(`/verifyEmail`, {
      method: "POST",
      body: JSON.stringify({email,otp}),
      headers: {
          'Content-Type': 'application/json',
        },
      credentials: "include",
    });
    const resdata = await response.json();
    toast.dismiss()
    return resdata;
  } catch (err) {
    console.log(err);
  }
}
);

export const resendOtp = createAsyncThunk("resendOtp",async (email) => {  
  try {
    const response = await fetchWithAuth(`/resend-otp`, {
      method: "POST",
      body: JSON.stringify({email}),
      headers: {
          'Content-Type': 'application/json',
        },
      credentials: "include",
    });
    const resdata = await response.json();
    return resdata;
  } catch (err) {
    console.log(err);
  }
}
);

export const LoginUser = createAsyncThunk("Login",async ({email,password}) => {  
  try {
    const response = await fetchWithAuth(`/Login`, {
      method: "POST",
      body: JSON.stringify({email,password}),
      headers: {
          'Content-Type': 'application/json',
        },
      credentials: "include",
    });
    const resdata = await response.json();
  console.log(resdata)
    return resdata;
  } catch (err) {
    toast.error('Network error')
  }
}
);

export const LoggedIn=createAsyncThunk('LoggedIn',async()=>{
  try {
    const response=await fetchWithAuth(`/verify`,{
      credentials:'include',
    });
    const data=await response.json();
    if(!response.ok){
      throw new Error(data.message)
    }
    return data
  } catch (error) {
    if(isNetworkError(error)){
      toast.error('Network error')
    }
    throw error
  }
})

export const fetchUser=createAsyncThunk('fetchUser',async(userId)=>{
    try{
       const response=await fetchWithAuth(`/profile`,
       {credentials:'include'});
      const data=await response.json();
      return data
    }catch(err){
       console.log(err) 
    }
   });

   export const fetchUserProfile=createAsyncThunk('fetchUserProfile',async(userId)=>{
    try{
       const response=await fetchWithAuth(`/userProfile?userId=${userId}`,
       {credentials:'include'});
      const data=await response.json();
      return data
    }catch(err){
       console.log(err)
       throw err
    }
   });

   export const fetchAllUsers=createAsyncThunk('fetchAllUsers',async()=>{
    try{
       const response=await fetchWithAuth(`/fetchAllUsers`,
       {credentials:'include'});
      const data=await response.json();
      return data
      
    }catch(err){
       console.log(err)
       throw err
    }
   });

   export const updateUser = createAsyncThunk("updateUser", async (formData) => {
    try {
      console.log(formData)
      const response = await fetchWithAuth(`/profile/edit`, {
        credentials: "include",
        method:'PUT',
        body:formData
      });
      const res = await response?.json();
      console.log(res)

      return res;
    } catch (err) {
      console.log(err);
    }
  });
   
   export const LoggedOut=createAsyncThunk('LoggedOut',async()=>{
    try{
       const response=await fetchWithAuth(`/logout`,
       {method:'POST',
        credentials:'include',
       });
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
        isLoggedIn:localStorage.getItem('isLoggedIn')||false,
        role:localStorage.getItem('role')||null,
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
        builder.addCase(LoggedIn.fulfilled,(state,action)=>{
          console.log(action.payload)
          state.isLoggedIn=action.payload?true:false;
          state.role=action.payload?.role
          
          localStorage.setItem('role',state.role)
          state.loading=false
        })
        builder.addCase(LoggedIn.pending,(state,action)=>{
          state.loading=true
          })
        builder.addCase(LoggedIn.rejected,(state,action)=>{
        console.log("ERROR",action.payload)
        state.loading=false
        })
        builder.addCase(LoginUser.fulfilled,(state,action)=>{
          console.log(action.payload)
          state.isLoggedIn=action.payload?.success===true?true:false;
          state.role=action.payload?.role
          localStorage.setItem('isLoggedIn',action.payload.success===true?true:false)
          localStorage.setItem('role',state.role)
          state.loading=false
        })
        builder.addCase(LoginUser.pending,(state,action)=>{
          state.loading=true
          })
        builder.addCase(LoginUser.rejected,(state,action)=>{
        console.log("ERROR",action.payload)
        state.loading=false
        })
        builder.addCase(LoggedOut.fulfilled,(state,action)=>{
          localStorage.clear()
        state.isLoggedIn=false;
        state.role='';
        state.loading=false
        })
        builder.addCase(LoggedOut.pending,(state,action)=>{
          state.loading=true
          })
          builder.addCase(LoggedOut.rejected,(state,action)=>{
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