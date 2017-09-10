import mongoose, { Schema } from 'mongoose'

let UserSchema = new Schema({
  steamID: String,
  displayName: String,
  balance: Number,
  imageUrl: String,
  transactions: [{type: Schema.ObjectId, ref: 'Transaction'}]
})

export default mongoose.model('User', UserSchema)