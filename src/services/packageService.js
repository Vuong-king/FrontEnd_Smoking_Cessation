import api from '../api';

const PackageService = {
  getAllPackages: async () => {
    const response = await api.get('/packages');
    return response.data.packages;
  },
    getPackageById: async (id) => {
    const response = await api.get(`/packages/${id}`);
    return response.data;
  },
};

export default PackageService; 