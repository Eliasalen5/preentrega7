import { createServer } from "http";
import { Server } from "socket.io";
import config from "./config/env.config.js";
import { connectDB } from "./config/db.config.js";
import app from "./app.js";

const startServer = async () => {
  await connectDB();

  const httpServer = createServer(app);
  const io = new Server(httpServer);

  app.set("io", io);

  io.on("connection", (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });
  });

  httpServer.listen(config.port, () => {
    console.log(
      `Servidor escuchando en http://localhost:${config.port} (entorno: ${config.nodeEnv})`
    );
  });
};

startServer();
