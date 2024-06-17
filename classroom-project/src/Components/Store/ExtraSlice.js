import { createSlice, createAsyncThunk} from "@reduxjs/toolkit"

let BASE_URL="https://skillbites-backend.onrender.com"

export const AddContact=createAsyncThunk('AddContact',async(formData)=>{
 try{
    const response=await fetch(`${BASE_URL}/contact`,{
        method:'POST',
        body:JSON.stringify(formData),
        headers:{
            'Content-Type':'application/json'
        }
    });
    const data=response.json();
    return data
 }catch(err){
    console.log(err)
 }
});

export const fetchContact=createAsyncThunk('fetchContact',async()=>{
    try{
       const response=await fetch(`${BASE_URL}/getContacts`,{credentials:'include'});
       const data=response.json();
       return data
    }catch(err){
       console.log(err)
    }
   });

export const fetchStats=createAsyncThunk('fetchStats',async()=>{
    try{
       const response=await fetch(`${BASE_URL}/stats`,{credentials:'include'});
       const data=response.json();
       return data
    }catch(err){
       console.log(err)
    }
   });

export const extraSlice =createSlice ({
    name:'Extras',
    initialState:{
        contact:[],
        stats:{},
        loading:false,
    },
    extraReducers:(builder)=>{
        builder.addCase(AddContact.fulfilled, (state,action)=>{
            state.contact=action.payload;
        }) 
        builder.addCase(AddContact.rejected, (state,action)=>{
            console.log("error",action.payload);
        })
        builder.addCase(fetchContact.fulfilled, (state,action)=>{
            state.contact=action.payload;
            state.loading=false
        })
        builder.addCase(fetchContact.pending, (state,action)=>{
            state.loading=true
        })
        builder.addCase(fetchContact.rejected, (state,action)=>{
            console.log("error",action.payload);
            state.loading=false
        })
        builder.addCase(fetchStats.fulfilled, (state,action)=>{
            state.stats=action.payload;
            state.loading=false
        })
        builder.addCase(fetchStats.pending, (state,action)=>{
            state.loading=true
        })
        builder.addCase(fetchStats.rejected, (state,action)=>{
            console.log("error",action.payload);
            state.loading=false
        })
    }})

    export default extraSlice.reducer;