import { createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import { toast } from "react-hot-toast";

let BASE_URL="https://skillbites-backend.onrender.com"

export const addCategory=createAsyncThunk('addCategory',async(category)=>{
 try{
    console.log(category)
    const response=await fetch(`${BASE_URL}/addCategories`,{
        method:'POST',
        body:JSON.stringify({ category }),
        headers: {
            'Content-Type': 'application/json',
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
       const response=await fetch(`${BASE_URL}/getCategories`,{credentials:'include'});
       const data=response.json();
       return data
    }catch(err){
       console.log(err)
    }
   });

   export const deleteCategory=createAsyncThunk('deleteCategory',async(categoryId)=>{
    try{
        console.log(categoryId)
       const response=await fetch(`${BASE_URL}/deleteCategory?categoryId=${categoryId}`,
       {credentials:'include',
         method:'DELETE'});
    const res=await response?.json();
        return res  
    }catch(err){
       throw err
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