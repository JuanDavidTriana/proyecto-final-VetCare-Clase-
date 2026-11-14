import mongoose from 'mongoose';
import { ALL_ROLES, ROLES } from '../../utils/roles.js';
import { hashPassword, verifyPassword } from '../../config/auth.js';

const userSchema = new mongoose.Schema(
  {
    name: {
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
      required: false,
      minlength: 8,
      maxlength: 128, // Permite almacenar hash de Argon2id sin truncar
      select: false,  // La contraseña nunca se incluye en consultas por defecto
    },
    role: {
      type: String,
      enum: ALL_ROLES,
      default: ROLES.CLIENT,
    },
    phone: {
      type: String,
      trim: true,
    },
    document: {
      type: String,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  },
);

// Índice compuesto corregido para búsquedas de personal y estado
userSchema.index({ role: 1, active: 1 });

userSchema.pre('save', async function () {
  if (this.isModified('password') && this.password) {
    const isHashed =
      this.password.startsWith('$argon2') ||
      this.password.startsWith('$2a$') ||
      this.password.startsWith('$2b$') ||
      this.password.startsWith('$2y$');

    if (!isHashed) {
      this.password = await hashPassword(this.password);
    }
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return verifyPassword({ password: candidatePassword, hash: this.password });
};

export const User = mongoose.model('User', userSchema);
