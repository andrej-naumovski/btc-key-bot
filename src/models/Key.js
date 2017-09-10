import mongoose, {Schema} from 'mongoose'

let KeySchema = new Schema({
  name: {type: String, unique: true},
  sellPrice: Number,
  buyPrice: Number,
  image: String
})

export default mongoose.model('Key', KeySchema)