import ServicesService from "../services/services.service.js";
import BookingsService from "../services/bookings.service.js";

const servicesService = new ServicesService();
const bookingsService = new BookingsService();

export const getServicesView = async (req, res) => {
  const services = await servicesService.getServices(req.query);
  res.render("services", { title: "Servicios", services });
};

export const getAvailabilityView = async (_req, res) => {
  const bookings = await bookingsService.getBookings();
  res.render("availability", { title: "Disponibilidad y Reservas", bookings });
};
