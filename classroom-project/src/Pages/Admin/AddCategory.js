import React, { useEffect, useState } from 'react'
import Layout from '../../Components/Layout/Layout'
import { RiCloseFill } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { addCategory, deleteCategory, fetchCategory } from '../../Components/Store/CategorySlice'
import { toast } from 'react-hot-toast'

const AddCategory = () => {
    const [category,setCategory]=useState('')
    const dispatch=useDispatch()
    useEffect(()=>{
        dispatch(fetchCategory())
    },[])
    
    async function add(e){
       e.preventDefault()
        const res=await dispatch(addCategory(category))
        if(res?.payload?.success){
            setCategory('')
            dispatch(fetchCategory())
            toast.success('Category inserted',{position:'top-center'})
        }
        toast.error(res?.payload?.message)
    }
    async function deleteCat(id){
      if(window.confirm('Do you realyy want to delete this category')){
        const res= await dispatch(deleteCategory(id))
        if(res?.payload?.success){
            toast.success(res?.payload?.data)
            dispatch(fetchCategory())
        }
        toast.error(res?.payload?.message)
      }
        console.log(id)
    }
    const categories=useSelector((state)=>state.Categories.category.data)
  return (
   <Layout hideFooter >
    <div className='dashboard'>
    <div className='addCategory'>
        <h1>Add Categories</h1>
        <hr className=''/>
        <div className=' d-flex gap-3 justify-content-center'style={{flex:'1 0',width:'100%',flexWrap:'wrap'}}>
        <input className='edit-text'placeholder='insert category...'type='text'
        required value={category}
        onChange={(e)=>setCategory(e.target.value)}></input>
        
        <button onClick={add}>Add</button>
        </div>
    </div>
    <div className='categories'>
        <h3>Categories</h3>
        <hr/>
        <div className='category-items'>
           {categories?.map(category=>
                <li key={category._id}>
                    {category.name}
                    <span style={{margin:'5px',color:'red',fontSize:'13pt'}}>
                        <RiCloseFill className='delete-Cat' onClick={()=>deleteCat(category._id)}/></span>
                </li>
            )}

        </div>
    </div>
    </div>
   </Layout>
  )
}

export default AddCategory
