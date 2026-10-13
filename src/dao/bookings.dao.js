import mongoose from "mongoose";
import BookingModel from "../models/booking.model.js";

class BookingsDao {
  async getAll() {
    const bookings = await BookingModel.find().populate(
      "services.service",
      "name"
    );
    return bookings.map((booking) => booking.toJSON());
  }

  async create(bookingData) {
    const created = await BookingModel.create(bookingData);
    return created.toJSON();
  }

  async getById(id) {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }

    const booking = await BookingModel.findById(id);
    return booking ? booking.toJSON() : null;
  }

  async update(id, updatedBooking) {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }

    const { id: _ignoredId, _id, ...data } = updatedBooking;

    const updated = await BookingModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    return updated ? updated.toJSON() : null;
  }
}

export default BookingsDao;
