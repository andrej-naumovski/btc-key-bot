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

export default mongoose.model('Bot', BotSchema)

