const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  image: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  price: {
    type: Number
  }

});

const Car = mongoose.model("Car", carSchema);

module.exports = Car;