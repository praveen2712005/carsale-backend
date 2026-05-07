const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    userId: String,

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
      },
    ],

    totalAmount: Number,

    status: {
      type: String,
      default: "Booked",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);