import mongoose, {Schema} from 'mongoose'

let TransactionSchema = new Schema({
  user: {type: Schema.ObjectId, ref: 'User'},
  keys: [{type: Schema.ObjectId, ref: 'Key'}],
  date: {
    type: Date,
    default: Date.now
  },
  transactionType: {
    type: String,
    enum: ['SELL', 'BUY']
  }
})

export default mongoose.models('Transaction', TransactionSchema)