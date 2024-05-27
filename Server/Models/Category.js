import mongoose from 'mongoose'

const {Schema,model}=mongoose;

const CategorySchema = new Schema({
    name: {
      type:String,
      required:[true,'Category is required'],
    },
  
},
{
  timestamps:true,
});


const categoryModel=model('Categories',CategorySchema);

export default categoryModel