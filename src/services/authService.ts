import api from "@/lib/api";

// Signup function
export const signup = async (userData: any) => {
  try {
    const response = await api.post("/api/auth/register", userData); 
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Signup failed" };
  }
};

// Login function
export const login = async (credentials: any) => {
  try {
    const response = await api.post("/api/auth/login", credentials); 
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Login failed" };
  }
};
