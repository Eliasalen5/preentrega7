import ServicesService from "../services/services.service.js";

const servicesService = new ServicesService();

export const getServices = async (req, res) => {
  const services = await servicesService.getServices(req.query);
  res.status(200).json(services);
};

export const getServiceById = async (req, res) => {
  const { sid } = req.params;
  const service = await servicesService.getServiceById(sid);

  if (!service) {
    return res
      .status(404)
      .json({ error: `No existe un servicio con id ${sid}` });
  }

  res.status(200).json(service);
};

export const createService = async (req, res) => {
  const createdService = await servicesService.createService(req.body);

  if (!createdService) {
    return res.status(400).json({
      error:
        "Faltan campos obligatorios (name, description, duration, price, category, available)",
    });
  }

  req.app.get("io")?.emit("service:created", createdService);
  res.status(201).json(createdService);
};

export const updateService = async (req, res) => {
  const { sid } = req.params;
  const updatedService = await servicesService.updateService(sid, req.body);

  if (!updatedService) {
    return res
      .status(404)
      .json({ error: `No existe un servicio con id ${sid}` });
  }

  req.app.get("io")?.emit("service:updated", updatedService);
  res.status(200).json(updatedService);
};

export const deleteService = async (req, res) => {
  const { sid } = req.params;
  const deletedService = await servicesService.deleteService(sid);

  if (!deletedService) {
    return res
      .status(404)
      .json({ error: `No existe un servicio con id ${sid}` });
  }

  req.app.get("io")?.emit("service:deleted", { id: deletedService.id });
  res.status(200).json(deletedService);
};
