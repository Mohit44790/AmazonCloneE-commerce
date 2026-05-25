import api from "./axiosInstance";
 
export const authApi = {
  // Login — server sets httpOnly refresh token cookie
  login: async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    window.__ACCESS_TOKEN__ = data.accessToken; // store in memory only
    return data.user;
  },
}