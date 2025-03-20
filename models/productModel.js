import mongoose from 'mongoose';

// Define the schema for the book model
const bookSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId
  id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  published_year: {
    type: Number,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  image_link: {
    type: String,
    required: true
  },
  pdf_link: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

// Create the model from the schema
export default mongoose.model('Books', bookSchema);
