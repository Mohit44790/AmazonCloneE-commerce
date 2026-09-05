// api/orderApi.js
import api from "./axiosInstance";

export const orderApi = {
  // ── Customer ──────────────────────────────────────────────
  create: async (payload) => {
    const { data } = await api.post("/orders", payload);
    return data.data.order;
  },

  getMyOrders: async (params = {}) => {
    const { data } = await api.get("/orders/my-orders", { params });
    return data;
  },

  getMyOrderById: async (id) => {
    const { data } = await api.get(`/orders/my-orders/${id}`);
    return data.data.order;
  },

  trackByOrderNumber: async (orderNumber) => {
    const { data } = await api.get(`/orders/track/${orderNumber}`);
    return data.data.order;
  },

  cancel: async (id, reason = "") => {
    const { data } = await api.patch(`/orders/${id}/cancel`, { reason });
    return data.data.order;
  },

  requestReturn: async (id, reason) => {
    const { data } = await api.patch(`/orders/${id}/return`, { reason });
    return data.data.order;
  },

  verifyRazorpayPayment: async (payload) => {
    // payload: { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature }
    const { data } = await api.post("/orders/verify-payment/razorpay", payload);
    return data.data.order;
  },

  // ── Seller ────────────────────────────────────────────────
  getSellerOrders: async (params = {}) => {
    const { data } = await api.get("/orders/seller/orders", { params });
    return data;
  },

  updateItemStatus: async (orderId, itemId, payload) => {
    // payload: { status, trackingNumber, trackingUrl, shippingCarrier, sellerNote }
    const { data } = await api.patch(`/orders/${orderId}/items/${itemId}/status`, payload);
    return data.data.order;
  },

  // ── Admin ─────────────────────────────────────────────────
  getAll: async (params = {}) => {
    const { data } = await api.get("/orders", { params });
    return data;
  },

  getById: async (id) => {
    const { data } = await api.get(`/orders/${id}`);
    return data.data.order;
  },

  getStats: async () => {
    const { data } = await api.get("/orders/stats");
    return data.data;
  },

  updateStatus: async (id, payload) => {
    // payload: { status, message, trackingNumber, trackingUrl, shippingCarrier }
    const { data } = await api.patch(`/orders/${id}/status`, payload);
    return data.data.order;
  },

  updatePaymentStatus: async (id, payload) => {
    // payload: { paymentStatus, transactionId, gateway }
    const { data } = await api.patch(`/orders/${id}/payment-status`, payload);
    return data.data.order;
  },
};