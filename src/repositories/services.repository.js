import ServicesDao from "../dao/services.dao.js";

const servicesDao = new ServicesDao();

class ServicesRepository {
  getAll() {
    return servicesDao.getAll();
  }

  getById(id) {
    return servicesDao.getById(id);
  }

  create(serviceData) {
    return servicesDao.create(serviceData);
  }

  update(id, updatedService) {
    return servicesDao.update(id, updatedService);
  }

  delete(id) {
    return servicesDao.delete(id);
  }
}

export default ServicesRepository;
