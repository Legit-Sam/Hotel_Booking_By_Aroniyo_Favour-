const roomSchema = new mongoose.Schema({
  type: { type: String, required: true },
  price: { type: Number, required: true },
  available: { type: Boolean, default: true }
});