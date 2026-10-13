/* Conexión con el servidor Socket.io (el script /socket.io/socket.io.js expone `io`) */
const socket = io();

const serviceCard = (service) => {
  const availability = service.available
    ? '<span class="badge available">Disponible</span>'
    : '<span class="badge unavailable">No disponible</span>';

  return `
    <article class="card" id="service-${service.id}" data-id="${service.id}">
      <h3>${service.name}</h3>
      <p class="description">${service.description}</p>
      <ul class="meta">
        <li>Duración: ${service.duration} min</li>
        <li>Precio: $${service.price}</li>
        <li>Categoría: ${service.category}</li>
        <li>Disponibilidad: ${availability}</li>
      </ul>
    </article>`;
};

const bookingCard = (booking) => {
  const services = (booking.services || [])
    .map((item) => {
      const name =
        item.service && item.service.name ? item.service.name : item.service;
      return `<li>${name} x ${item.quantity}</li>`;
    })
    .join("");

  return `
    <article class="card booking-card" id="booking-${booking.id}" data-id="${booking.id}">
      <h3>${booking.clientName}</h3>
      <p class="description">${booking.clientEmail}</p>
      <ul class="meta">
        <li>Fecha: ${booking.date}</li>
        <li>Hora: ${booking.time}</li>
        <li>Estado: ${booking.status}</li>
      </ul>
      <p class="services-title">Servicios reservados:</p>
      <ul class="meta">${services || "<li>Sin servicios</li>"}</ul>
    </article>`;
};

/* Eventos que escucha el cliente */
socket.on("service:created", (service) => {
  const list = document.getElementById("services-list");
  if (!list) return;

  const empty = document.getElementById("empty-services");
  if (empty) empty.remove();

  list.insertAdjacentHTML("beforeend", serviceCard(service));
});

socket.on("service:updated", (service) => {
  const card = document.getElementById(`service-${service.id}`);
  if (card) card.outerHTML = serviceCard(service);
});

socket.on("service:deleted", ({ id }) => {
  const card = document.getElementById(`service-${id}`);
  if (card) card.remove();
});

socket.on("booking:created", (booking) => {
  const list = document.getElementById("bookings-list");
  if (!list) return;

  const empty = document.getElementById("empty-bookings");
  if (empty) empty.remove();

  list.insertAdjacentHTML("beforeend", bookingCard(booking));
});

/* Acciones que disparan eventos reales del sistema */
const createServiceBtn = document.getElementById("create-service-btn");
if (createServiceBtn) {
  createServiceBtn.addEventListener("click", async () => {
    await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `Servicio ${new Date().toLocaleTimeString("es-AR")}`,
        description: "Servicio creado desde la vista en tiempo real",
        duration: 30,
        price: 1000,
        category: "general",
        available: true,
      }),
    });
  });
}

const createBookingBtn = document.getElementById("create-booking-btn");
if (createBookingBtn) {
  createBookingBtn.addEventListener("click", async () => {
    await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientName: `Cliente ${new Date().toLocaleTimeString("es-AR")}`,
        clientEmail: "cliente@example.com",
        date: new Date().toISOString().slice(0, 10),
        time: new Date().toTimeString().slice(0, 5),
        status: "pending",
      }),
    });
  });
}
