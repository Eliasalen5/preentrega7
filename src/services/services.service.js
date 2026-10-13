import ServicesRepository from "../repositories/services.repository.js";

const servicesRepository = new ServicesRepository();

const requiredFields = [
  "name",
  "description",
  "duration",
  "price",
  "category",
  "available",
];

class ServicesService {
  async getServices(filters = {}) {
    const services = await servicesRepository.getAll();
    const { category, available } = filters;

    let result = services;

    if (category !== undefined) {
      result = result.filter(
        (item) =>
          String(item.category).toLowerCase() === String(category).toLowerCase()
      );
    }

    if (available !== undefined) {
      const availableValue = String(available).toLowerCase() === "true";
      result = result.filter((item) => item.available === availableValue);
    }

    return result;
  }

  async getServiceById(id) {
    return servicesRepository.getById(id);
  }

  async createService(serviceData) {
    if (!serviceData || typeof serviceData !== "object") {
      return null;
    }

    const missingFields = requiredFields.filter(
      (field) => serviceData[field] === undefined || serviceData[field] === null
    );

    if (missingFields.length > 0) {
      return null;
    }

    const newService = {
      name: serviceData.name,
      description: serviceData.description,
      duration: serviceData.duration,
      price: serviceData.price,
      category: serviceData.category,
      available: serviceData.available,
    };

    return servicesRepository.create(newService);
  }

  async updateService(id, updatedData) {
    const existingService = await servicesRepository.getById(id);

    if (!existingService) {
      return null;
    }

    const { id: _ignoredId, ...safeData } = updatedData ?? {};

    const updatedService = {
      ...existingService,
      ...safeData,
      id: existingService.id,
    };

    return servicesRepository.update(id, updatedService);
  }

  async deleteService(id) {
    return servicesRepository.delete(id);
  }
}

export default ServicesService;
