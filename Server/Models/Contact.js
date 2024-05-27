import mongoose from 'mongoose'

const {Schema,model}=mongoose;

const ContactSchema = new Schema({
    name: { 
        type:String,
        required:true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          "Please fill a valid email address",
        ],
      },
    message:{
        type:String,
        required:true,
    }
},
{
  timestamps:true,
});


const contactModel=model('Contact',ContactSchema);

export default contactModel