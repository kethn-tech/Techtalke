import axios from "axios";
import { toast } from "sonner";

const getToken = () => {
  return localStorage.getItem("authToken");
};

const apiClient = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 3 * 60 * 1000,
});

// Store for maintenance mode state
let isInMaintenanceMode = false;
let maintenanceCallbacks = [];

// Function to register callbacks for maintenance mode changes
export const onMaintenanceModeChange = (callback) => {
  maintenanceCallbacks.push(callback);
  // Return unsubscribe function
  return () => {
    maintenanceCallbacks = maintenanceCallbacks.filter(cb => cb !== callback);
  };
};

// Function to trigger maintenance mode
const triggerMaintenanceMode = (isEnabled) => {
  if (isInMaintenanceMode !== isEnabled) {
    isInMaintenanceMode = isEnabled;
    maintenanceCallbacks.forEach(callback => callback(isEnabled));
  }
};

// 🔧 FIX: Enhanced request interceptor - only add Bearer token for non-auth routes
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    
    // Only add Bearer token for non-auth routes since auth routes use cookies
    // Include Bearer token for all requests except login and signup (cookies are used there)
    if (token && !config.url?.includes("/auth/login") && !config.url?.includes("/auth/signup")) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Only log non-auth requests to reduce noise
    if (!config.url?.includes("/auth/userInfo")) {
      console.debug(
        `🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`
      );
    }
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor with maintenance mode handling
apiClient.interceptors.response.use(
  (response) => {
    // Successful responses (2xx)
    if (!response.config.url?.includes("/auth/userInfo")) {
      console.debug(
        `✅ API Success: ${response.config.method?.toUpperCase()} ${
          response.config.url
        }`
      );
    }
    // Check if we were in maintenance mode and now we're getting successful responses
    // Do NOT reset maintenance mode for authentication endpoints
    if (isInMaintenanceMode && !response.config.url?.includes("/auth/")) {
      triggerMaintenanceMode(false);
    }
    return response;
  },
  (error) => {
    const { response, config } = error;
    if (response) {
      const { status, data } = response;
      switch (status) {
        case 401:
          // 🔧 FIX: Handle 401s more gracefully for auth endpoints
          if (config.url?.includes("/auth/userInfo")) {
            // This is expected for logged out users - don't show error
            console.debug("🔒 User not authenticated (normal for logged out users)");
          } else if (config.url?.includes("/auth/login") || config.url?.includes("/auth/signup")) {
            // Login/signup 401s are expected for wrong credentials
            console.debug("🔒 Invalid credentials provided");
          } else {
            // Unexpected 401 during app usage - session expired
            console.warn("🚨 Session expired during app usage");
            // Clear stored authentication data
            localStorage.removeItem("authToken");
            localStorage.removeItem("userInfo");
            // Optional: Redirect to login if not already there
            if (
              typeof window !== "undefined" &&
              !window.location.pathname.includes("/auth")
            ) {
              setTimeout(() => {
                window.location.href = "/auth?message=session-expired";
              }, 1000);
            }
          }
          break;
        case 403:
          console.warn("🚫 Access forbidden (403):", config.url);
          break;
        case 404:
          console.warn("🔍 Resource not found (404):", config.url);
          break;
        case 503:
          // Handle maintenance mode (503 Service Unavailable)
          console.log("🚧 Maintenance mode detected (503):", config.url);
          
          if (data?.maintenanceMode) {
            console.log("🔧 Application is in maintenance mode");
            
            // Don't show toast for auth requests during maintenance
            if (!config.url?.includes("/auth/")) {
              toast.warning("System is under maintenance", {
                description: data.message || "Please check back shortly",
                duration: 5000,
              });
            }
            
            // Trigger maintenance mode state change
            triggerMaintenanceMode(true);
          }
          break;
        case 500:
        case 502:
        case 504:
          console.error("🔥 Server error:", {
            status,
            url: config.url,
            message: data?.message || "Server error",
          });
          
          // Show user-friendly error message
          if (!config.url?.includes("/auth/userInfo")) {
            toast.error("Server error", {
              description: "Please try again in a moment",
            });
          }
          break;
        default:
          console.error("❌ HTTP Error:", {
            status,
            url: config.url,
            message: data?.message || error.message,
          });
      }
    } else if (error.request) {
      // Network error - no response received
      console.error("🌐 Network Error:", {
        url: config?.url,
        message: "No response from server - check connection",
      });
      
      // Show network error to user (but not for auth checks)
      if (!config?.url?.includes("/auth/userInfo")) {
        toast.error("Network error", {
          description: "Please check your internet connection",
        });
      }
    } else {
      // Request setup error
      console.error("⚙️ Request Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Helper function to check if currently in maintenance mode
export const getMaintenanceStatus = () => isInMaintenanceMode;

// Helper function to manually check maintenance status
export const checkMaintenanceStatus = async () => {
  try {
    const res = await apiClient.get('/api/maintenance/status');
    const data = res.data;
    triggerMaintenanceMode(data.maintenanceMode);
    return data;
  } catch (error) {
    console.error('Error checking maintenance status:', error);
    return null;
  }
};

export default apiClient;