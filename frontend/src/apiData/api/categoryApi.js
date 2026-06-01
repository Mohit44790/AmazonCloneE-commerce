// api/categoryApi.js
import api from "./axiosInstance";

export const categoryApi = {
  // GET all categories (with optional filters)
  getAll: async (params = {}) => {
    const { data } = await api.get("/categories", { params });
    return data.data.categories;
  },

  // GET full nested tree
  getTree: async () => {
    const { data } = await api.get("/categories/tree");
    return data.data.categories;
  },

  // GET featured categories
  getFeatured: async () => {
    const { data } = await api.get("/categories/featured");
    return data.data.categories;
  },

  // GET menu categories (for navbar)
  getMenu: async () => {
    const { data } = await api.get("/categories/menu");
    return data.data.categories;
  },

  // GET home categories
  getHome: async () => {
    const { data } = await api.get("/categories/home");
    return data.data.categories;
  },

  // GET categories by type
  getByType: async (type) => {
    const { data } = await api.get(`/categories/type/${type}`);
    return data.data.categories;
  },

  // GET single category by slug or id
  getBySlug: async (slug) => {
    const { data } = await api.get(`/categories/${slug}`);
    return data.data.category;
  },

  // GET breadcrumb
  getBreadcrumb: async (slug) => {
    const { data } = await api.get(`/categories/${slug}/breadcrumb`);
    return data.data.breadcrumb;
  },

  // CREATE category (admin) — supports image upload
  create: async (formData) => {
    const { data } = await api.post("/categories", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data.category;
  },

  // UPDATE category (admin)
  update: async (id, formData) => {
    const { data } = await api.put(`/categories/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data.category;
  },

  // DELETE category (admin)
  delete: async (id) => {
    const { data } = await api.delete(`/categories/${id}`);
    return data;
  },

  // SEED categories (admin, run once)
  seed: async () => {
    const { data } = await api.post("/categories/seed");
    return data;
  },

  // UPDATE product counts
  updateProductCount: async () => {
    const { data } = await api.patch("/categories/update-product-count");
    return data;
  },
};