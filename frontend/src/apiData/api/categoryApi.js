import api from "./axiosInstance";


export const categoryApi = {
    //GET all categories (with optional filters)
    getAll: async (params ={}) => {
        const {data} = await api.get("/categories",{params});
        return data.data.categories;
    },

    //GET full nested tree
  getTree: async () => {
    const { data } = await api.get("/categories/tree");
    return data.data.categories;
  },
  
}