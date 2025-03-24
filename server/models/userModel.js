import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  addresses: [
    {
      type: { type: String, enum: ['home', 'work', 'other'], required: true },
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
  ],
  role: { type: String, enum: ['coach', 'student'], default: 'student' },
  passwordHash: { type: String, required: true },
  verifyOTP: { type: String, default: '' },
  verifyOTPExpiresAt: { type: Date },
  isVerified: { type: Boolean, default: false },
  resetOTP: { type: String, default: '' },
  resetOTPExpiresAt: { type: Date },
});

const userModel = mongoose.models.user || mongoose.model('User', userSchema);

export default userModel;
