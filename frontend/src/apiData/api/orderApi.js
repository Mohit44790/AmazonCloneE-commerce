import api from "./axiosInstance";

export const orderApi = {
  getAll:       async (params={})  => { const {data} = await api.get("/orders", {params}); return data; },
  getById:      async (id)          => { const {data} = await api.get(`/orders/${id}`); return data.data.order; },
  getMyOrders:  async ()            => { const {data} = await api.get("/orders/my"); return data.data.orders; },
  updateStatus: async (id, status)  => { const {data} = await api.patch(`/orders/${id}/status`, {status}); return data.data.order; },
  cancel:       async (id)          => { const {data} = await api.patch(`/orders/${id}/cancel`); return data.data.order; },
  create:       async (payload)     => { const {data} = await api.post("/orders", payload); return data.data.order; },
};