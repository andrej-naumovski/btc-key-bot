import mongoose, {Schema} from 'mongoose'

let WithdrawalSchema = new Schema({
  user: {type: Schema.ObjectId, ref: 'User'},
  amount: Number
  date: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Withdrawal', WithdrawalSchema)
