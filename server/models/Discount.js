import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },  // Unique discount code
  discountType: { type: String, enum: ["fixed", "percentage"], required: true }, // Fixed ₹ or percentage
  value: { type: Number, required: true }, // Discount amount
  expirationDate: { type: Date }, // Expiry date
  minPurchase: { type: Number, default: 0 }, // Minimum order amount to apply discount
  maxDiscount: { type: Number, default: null } // Maximum discount for percentage-based discounts
});

const Discount = mongoose.model("Discount", discountSchema);
export default Discount;