import BookingsService from "../services/bookings.service.js";

const bookingsService = new BookingsService();

export const createBooking = async (req, res) => {
  const createdBooking = await bookingsService.createBooking(req.body);

  if (!createdBooking) {
    return res.status(400).json({
      error:
        "Faltan campos obligatorios (clientName, clientEmail, date, time, status)",
    });
  }

  req.app.get("io")?.emit("booking:created", createdBooking);
  res.status(201).json(createdBooking);
};

export const getBookingById = async (req, res) => {
  const { bid } = req.params;
  const booking = await bookingsService.getBookingById(bid);

  if (!booking) {
    return res
      .status(404)
      .json({ error: `No existe una reserva con id ${bid}` });
  }

  res.status(200).json(booking);
};

export const addServiceToBooking = async (req, res) => {
  const { bid, sid } = req.params;
  const result = await bookingsService.addServiceToBooking(bid, sid);

  if (!result.ok) {
    if (result.reason === "SERVICE_NOT_FOUND") {
      return res
        .status(404)
        .json({ error: `No existe un servicio con id ${sid}` });
    }

    return res
      .status(404)
      .json({ error: `No existe una reserva con id ${bid}` });
  }

  req.app.get("io")?.emit("booking:updated", result.booking);
  res.status(200).json(result.booking);
};
