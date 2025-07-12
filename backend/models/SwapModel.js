import mongoose from 'mongoose'

const swapSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Requester (user) is required']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner (user) is required']
  },
  itemRequested: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: [true, 'Requested item is required']
  },
  itemOffered: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    default: null
  },
  pointsUsed: {
    type: Number,
    default: 0,
    min: [0, 'Points used cannot be negative']
  },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'shipped', 'completed', 'declined'],
    default: 'requested'
  }
}, {
  timestamps: true
});

const SwapModel = mongoose.model("Swap", swapSchema);
export default SwapModel;
