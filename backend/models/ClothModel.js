import mongoose from 'mongoose'


const itemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner (user) is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    maxlength: [200, 'Title cannot be longer than 200 characters'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot be longer than 2000 characters'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    maxlength: [100, 'Category cannot be longer than 100 characters']
  },
  type: {
    type: String,
    trim: true,
    maxlength: [100, 'Type cannot be longer than 100 characters']
  },
  size: {
    type: String,
    trim: true,
    maxlength: [50, 'Size cannot be longer than 50 characters']
  },
  condition: {
    type: String,
    trim: true,
    maxlength: [50, 'Condition cannot be longer than 50 characters']
  },
  status: {
    type: String,
    enum: ['available', 'exchanged'],
    default: 'available'
  },
  views:{
    type:Number,
    default:0,
  },
  point:{
    type: Number,
    min: 0,
    required:true
  },
  images: {
    type: [String],
    required:true
  }
}, {
  timestamps: true
});


const ItemModel = mongoose.model("Item", itemSchema);
export default ItemModel;
