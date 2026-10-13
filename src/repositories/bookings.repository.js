import BookingsDao from "../dao/bookings.dao.js";

const bookingsDao = new BookingsDao();

class BookingsRepository {
  getAll() {
    return bookingsDao.getAll();
  }

  create(bookingData) {
    return bookingsDao.create(bookingData);
  }

  getById(id) {
    return bookingsDao.getById(id);
  }

  update(id, updatedBooking) {
    return bookingsDao.update(id, updatedBooking);
  }
}

export default BookingsRepository;
