import mongoose from 'mongoose'

const {Schema,model}=mongoose;

const PurchaseSchema = new Schema({
  userId: { 
    type:Schema.Types.ObjectId, ref: 'User' 
    },
  courseId: {
     type: Schema.Types.ObjectId, ref: 'course' 
    },
  paymentId:{
    type:String,
  },

},
{
  timestamps:true
});


const purchaseModel=model('Purchase',PurchaseSchema);

export default purchaseModel