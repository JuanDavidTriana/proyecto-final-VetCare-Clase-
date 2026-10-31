import mongoose from 'mongoose';

export const SPECIES = ['dog', 'cat', 'bird', 'rabbit', 'other'];

const petSchema = new mongoose.Schema(
  {
    name:{ type: String, required: true, trim: true },
    species: { type: String, enum: SPECIES, required: true },
    breed: { type: String, trim: true },
    sex: { type: String, enum: ['M', 'F'], required: true },
    birthDate: Date,
    weightKg: { type: Number, min: 0 },
    // Tutor del animal, referencia al modelo User
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    notes: { type: String, trim: true}
  },
  {
    timestamps: true,
    toJSON: {
        transform(_doc, ret) {
           ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
  }
);

petSchema.index({ owner: 1});
petSchema.index({ name: 1 });

export const Pet = mongoose.model('Pet', petSchema);
