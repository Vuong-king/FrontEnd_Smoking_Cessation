import api from '../api';

const PackageService = {
  // POST /api/packages - Create Package
  createPackage: async (packageData) => {
    try {
      const response = await api.post("/packages", packageData);
      return response.data;
    } catch (error) {
      console.error("Error creating package:", error);
      throw error;
    }
  },

  // GET /api/packages - Get All Package
  getAllPackages: async () => {
    const response = await api.get('/packages/admin/all');
    return response.data.packages;
  },

  // GET /api/packages/:id - Get Package By Id
  getPackageById: async (id) => {
    try {
      const response = await api.get(`/packages/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching package ${id}:`, error);
      throw error;
    }
  },

  // PUT /api/packages/:id - Update Package
  updatePackage: async (id, packageData) => {
    try {
      const response = await api.put(`/packages/${id}`, packageData);
      return response.data;
    } catch (error) {
      console.error(`Error updating package ${id}:`, error);
      throw error;
    }
  },

  // DELETE /api/packages/:id - Delete Package
  deletePackage: async (id) => {
    try {
      const response = await api.delete(`/packages/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting package ${id}:`, error);
      throw error;
    }
  },

  // PATCH /api/packages/:id/active - Toggle is_active
  toggleActive: async (id, isActive) => {
    try {
      const response = await api.patch(`/packages/${id}/active`, { is_active: isActive });
      return response.data;
    } catch (error) {
      console.error(`Error toggling active for package ${id}:`, error);
      throw error;
    }
  },
};

export default PackageService;