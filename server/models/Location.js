import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  state: { type: String, required: true },
  cities: [{ type: String }] // multiple cities per state
}, { timestamps: true });

const Location = mongoose.model('Location', locationSchema);
export default Location;
