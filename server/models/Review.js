const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String }
}, { timestamps: true });