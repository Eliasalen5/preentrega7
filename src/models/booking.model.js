import mongoose from "mongoose";

const bookingServiceSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    quantity: { type: Number, default: 1, min: 1 },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: { type: String, required: true },
    services: [bookingServiceSchema],
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  }
);

const BookingModel = mongoose.model("Booking", bookingSchema);

export default BookingModel;
