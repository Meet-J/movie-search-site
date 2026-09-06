import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    poster_path: { type: String },
    vote_average: { type: Number },
    release_date: { type: String },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    watchlist: [movieSchema],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;
