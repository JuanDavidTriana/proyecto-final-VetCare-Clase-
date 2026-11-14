import mongoose from 'mongoose';

export const STATUS = ['scheduled', 'done', 'cancelled'];

export const SLOT_DURATION = 30; // in minutes

const appointmentSchema = new mongoose.Schema(
  {
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: true,
    },
    vet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: STATUS,
      default: 'scheduled',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

appointmentSchema.index({ vet: 1, date: 1 });
appointmentSchema.index({ pet: 1, date: -1 });

export const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
