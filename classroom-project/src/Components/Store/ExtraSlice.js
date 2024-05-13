import { createSlice, createAsyncThunk} from "@reduxjs/toolkit"

export const AddContact=createAsyncThunk('AddContact',async(formData)=>{
 try{
    const response=await fetch(`http://localhost:4000/contact`,{
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
       const response=await fetch(`http://localhost:4000/getContacts`,{credentials:'include'});
       const data=response.json();
       return data
    }catch(err){
       console.log(err)
    }
   });

export const fetchStats=createAsyncThunk('fetchStats',async()=>{
    try{
       const response=await fetch(`http://localhost:4000/stats`,{credentials:'include'});
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
        })
        builder.addCase(fetchContact.rejected, (state,action)=>{
            console.log("error",action.payload);
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