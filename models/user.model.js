import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String },
  profileImageUrl: { type: String, default: null },
  role: { type: String, enum: ["admin", "user", "client"], default: "user" }, //Role based access
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
