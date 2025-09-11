import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, default: "" },
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  profilePicture: { type: String, default: null },
  role: { type: String, enum: ["admin", "user", "customer"], default: "user" }, 
  loginAttempts: { type: Number, default: 0 },
  lockoutExpiry: { type: Date },
  userId: { type: Number, required: true },
}, { timestamps: true });

// Hash password before saving
// This hook is commented out because we're handling password hashing in the controllers
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });

//module.exports = mongoose.model('User', userSchema);
export default mongoose.model('User', userSchema)
