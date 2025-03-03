import React, { useState } from "react";
import { AuthContext } from "./authContext";
import { API } from "@/api/api";

const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null)
    
    API.interceptors.response.use(
        (response) => response,
        async (error) => {
          console.log(error.response
          );
          if (error.response?.status === 403 && error.response?.data.refresh) {
            try {
                // Call refresh token API
                const refreshRes = await axios.get(
                    "http://localhost:4000/api/refreshToken",
                    {
                        withCredentials: true,
                    }
                );

              setAccessToken(refreshRes.data.accessToken)
              // Update token & retry  failed request
              error.config.headers.Authorization = `Bearer ${refreshRes.data.accessToken}`;
              return axios(error.config);
            } catch (refreshError) {
              console.error("Session expired, login again.");
            }
          }
          return Promise.reject(error);
        }
      );
    
    return <AuthContext.Provider value={{user,setUser,accessToken,setAccessToken}}>
        { children }
    </AuthContext.Provider>
};

export default AuthContextProvider;
