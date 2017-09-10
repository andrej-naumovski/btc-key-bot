import mongoose, {Schema} from 'mongoose'

let BotSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  sharedSecret: {
    type: String,
    required: true
  }
})

BotSchema.methods.toJSON = function() {
  let obj = this.toObject()
  delete obj.password
  return obj
}

export default mongoose.model('Bot', BotSchema)

