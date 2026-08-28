import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const roles = ['user', 'admin', 'developer'];

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^\+91\d{10}$/, 'Phone number must use +91XXXXXXXXXX format']
    },
    passwordHash: {
      type: String,
      required: true,
      select: false
    },
    developerPasswordEncrypted: {
      type: String,
      select: false
    },
    role: {
      type: String,
      enum: roles,
      default: 'user'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    resetPasswordToken: {
      type: String,
      select: false
    },
    resetPasswordExpires: {
      type: Date,
      select: false
    }
  },
  {
    timestamps: true
  }
);

userSchema.virtual('name').get(function getName() {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.methods.setPassword = async function setPassword(password) {
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(password, salt);
};

userSchema.methods.matchPassword = async function matchPassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.set('toJSON', {
  virtuals: true,
  transform(_doc, ret) {
    delete ret.passwordHash;
    delete ret.developerPasswordEncrypted;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpires;
    delete ret.__v;
    return ret;
  }
});

const User = mongoose.model('User', userSchema);

export default User;
