// models/Car.js
import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    model: { type: String, required: true },
    brand: { type: String, required: true },
    year: { type: Number, required: true },
    category: { type: String, required: true }, 
    transmission: { type: String, required: true },  
    fuelType: { type: String, required: true },
    seatingCapacity: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Car", carSchema);
