// api/productApi.js
import api from "./axiosInstance";
 
export const productApi = {
  // GET all products (with filters/pagination)
  getAll: async (params = {}) => {
    const { data } = await api.get("/products", { params });
    return data; // { success, pagination, data: { products } }
  },

  // GET single product by id or slug
  getById:async (id) =>{
    const {data} = await api.get(`/products/${id}`);
    return data.data;
  },

  // GET seller's own products'
  getMyProduct:async (params = {}) =>{
    const {data} = await api.get("/products/my-products",{params});
    return data;
  },

  // GET product stats
  getStats: async() =>{
    const {data} = await api.get("/products/stats");
    return data.data;
  },

   // SEARCH suggestions (autocomplete)
   searchSuggestions: async (q) =>{
    const {data} = await api.get("/products/search/suggestions",{params:{q}});
    return data.data.suggestions;
   },

   // CREATE product (multipart/form-data for images)
     create: async (formData) => {
        const {data} = await api.post("/products",formData,{
            headers:{
                "Content-Type":"multipart/form-data"
            },
        });
        return data.data.product;
     },

       // UPDATE product
       update:async (id,formData) => {
        const {data} = await api.put(`/products/${id}` ,formData,{
          headers:{"Content-Type" :"multipart/form-data"},
        });
        return data.data.product;
       },

        // DELETE product
        delete: async (id) => {
          const {data} = await api.delete(`/products/${id}`);
          return data;
        },
          // APPROVE product (admin)
  approve: async (id, payload) => {
    const { data } = await api.patch(`/products/${id}/approve`, payload);
    return data.data.product;
  },


     
}