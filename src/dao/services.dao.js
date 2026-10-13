import mongoose from "mongoose";
import ServiceModel from "../models/service.model.js";

class ServicesDao {
  async getAll() {
    const services = await ServiceModel.find();
    return services.map((service) => service.toJSON());
  }

  async getById(id) {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }

    const service = await ServiceModel.findById(id);
    return service ? service.toJSON() : null;
  }

  async create(serviceData) {
    const created = await ServiceModel.create(serviceData);
    return created.toJSON();
  }

  async update(id, updatedService) {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }

    const { id: _ignoredId, _id, ...data } = updatedService;

    const updated = await ServiceModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    return updated ? updated.toJSON() : null;
  }

  async delete(id) {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }

    const deleted = await ServiceModel.findByIdAndDelete(id);
    return deleted ? deleted.toJSON() : null;
  }
}

export default ServicesDao;
