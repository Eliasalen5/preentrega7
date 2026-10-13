import BookingsRepository from "../repositories/bookings.repository.js";
import ServicesRepository from "../repositories/services.repository.js";

const bookingsRepository = new BookingsRepository();
const servicesRepository = new ServicesRepository();

const requiredFields = ["clientName", "clientEmail", "date", "time", "status"];

class BookingsService {
  async getBookings() {
    return bookingsRepository.getAll();
  }

  async createBooking(bookingData) {
    if (!bookingData || typeof bookingData !== "object") {
      return null;
    }

    const missingFields = requiredFields.filter(
      (field) =>
        bookingData[field] === undefined ||
        bookingData[field] === null ||
        bookingData[field] === ""
    );

    if (missingFields.length > 0) {
      return null;
    }

    const services = Array.isArray(bookingData.services)
      ? bookingData.services.map((item) => ({
          service: item.service,
          quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
        }))
      : [];

    const newBooking = {
      clientName: bookingData.clientName,
      clientEmail: bookingData.clientEmail,
      date: bookingData.date,
      time: bookingData.time,
      status: bookingData.status,
      services,
    };

    return bookingsRepository.create(newBooking);
  }

  async getBookingById(id) {
    return bookingsRepository.getById(id);
  }

  async addServiceToBooking(bookingId, serviceId) {
    const service = await servicesRepository.getById(serviceId);
    if (!service) {
      return { ok: false, reason: "SERVICE_NOT_FOUND" };
    }

    const booking = await bookingsRepository.getById(bookingId);
    if (!booking) {
      return { ok: false, reason: "BOOKING_NOT_FOUND" };
    }

    const existingService = booking.services.find(
      (item) => String(item.service) === String(serviceId)
    );

    if (existingService) {
      existingService.quantity += 1;
    } else {
      booking.services.push({ service: serviceId, quantity: 1 });
    }

    const updatedBooking = await bookingsRepository.update(bookingId, booking);
    return { ok: true, booking: updatedBooking };
  }
}

export default BookingsService;
