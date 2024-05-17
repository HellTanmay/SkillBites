import { createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import { toast } from "react-toastify";

export const addCategory=createAsyncThunk('addCategory',async(category)=>{
 try{
    console.log(category)
    const response=await fetch(`http://localhost:4000/addCategories`,{
        method:'POST',
        body:JSON.stringify({ category }),
        headers: {
            'Content-Type': 'application/json', // Set content type to JSON
          },
        credentials:'include',
    });
    const data=response.json()
    return data
 }catch(err){
    console.log(err)
 }
});

export const fetchCategory=createAsyncThunk('fetchCategory',async()=>{
    try{
       const response=await fetch(`http://localhost:4000/getCategories`,{credentials:'include'});
       const data=response.json();
       return data
    }catch(err){
       console.log(err)
    }
   });

   export const deleteCategory=createAsyncThunk('deleteCategory',async(categoryId)=>{
    try{
        console.log(categoryId)
       const response=await fetch(`http://localhost:4000/deleteCategory?categoryId=${categoryId}`,
       {credentials:'include',
         method:'DELETE'});
    const res=await response?.json();
        console.log(res)
        return res  
    }catch(err){
       toast.error(err.message)
    }
   });

   export const CategorySlice =createSlice ({
    name:'Categories',
    initialState:{
        category:{},
        loading:false,
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchCategory.fulfilled, (state,action)=>{
            state.category=action.payload; 
        })
        builder.addCase(fetchCategory.rejected, (state,action)=>{
            console.log("error",action.payload);
        })
    }
   })

   export default CategorySlice.reducer;