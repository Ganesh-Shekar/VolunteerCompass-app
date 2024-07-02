import axios from "axios";
import * as url from "./constantUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigate } from "../NavigationService";

const GOOGLE_API_KEY = "AIzaSyCbD48T0Pl-bcxUa8mkuteYRWO094xcFOc";
const COUNTRY_CODE = "IN";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: url.baseurl,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "lmnop",
    "Access-Control-Allow-Origin": "*",
  },
});

// Add request interceptor for including authorization token
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("jwtToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling 401 errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // Check if the error status is 401 and the request hasn't been retried yet
    if (
      typeof error.response !== "undefined" &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      // Ensure that the original request's URL is not the refreshToken URL
      if (originalRequest.url !== url.refreshToken) {
        originalRequest._retry = true; // Set the retry flag
        try {
          // Attempt to refresh the access token
          const newToken = await refreshAccessToken();
          //console.log("New Token:", newToken);
          // Update the authorization header with the new access token
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          // Retry the original request
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          AsyncStorage.setItem("isLoggedIn", "false");
          AsyncStorage.setItem("token", "");
          AsyncStorage.setItem("user_data", "");
          AsyncStorage.removeItem("refreshToken");
          AsyncStorage.removeItem("jwtToken");
          navigate("Login");
          // If token refresh fails, reject the request
          return Promise.reject(refreshError);
        }
      }
    }
    // For other errors or if the request has already been retried, reject the request
    return Promise.reject(error);
  }
);

// Create a separate Axios instance for the refresh token request
const refreshAxiosInstance = axios.create({
  baseURL: url.baseurl,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "lmnop",
  },
});

const refreshAccessToken = async () => {
  try {
    // Get the refresh token from AsyncStorage
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    // Make a POST request to the /refresh endpoint with the refresh token
    const response = await refreshAxiosInstance.post(url.refreshToken, null, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      const { access_token } = response.data;
      await AsyncStorage.setItem("jwtToken", access_token);
      return access_token;
    } else {
      // If the response status is not 200, log out the user
      AsyncStorage.setItem("isLoggedIn", "false");
      AsyncStorage.setItem("token", "");
      AsyncStorage.setItem("user_data", "");
      AsyncStorage.removeItem("refreshToken");
      AsyncStorage.removeItem("jwtToken");
      navigate("Login");
      //await logoutUser();
      throw new Error("Failed to refresh token");
    }
  } catch (error) {
    throw error;
  }
};

// Function to create a request configuration
async function createRequestConfigInstance(
  mMethod,
  urlEndPoint,
  requestObj = null,
  params = {}
) {
  const config = {
    url: urlEndPoint,
    method: mMethod,
    responseType: "json",
  };

  if (mMethod === "POST") {
    config.data = requestObj;
  } else if (mMethod === "GET") {
    config.params = params;
  }

  return config;
}

// Function to create a request configuration with authorization header
async function createAuthorizedRequestConfigInstance(
  mMethod,
  urlEndPoint,
  requestObj = null,
  params = {}
) {
  const config = await createRequestConfigInstance(
    mMethod,
    urlEndPoint,
    requestObj,
    params
  );
  const token = await AsyncStorage.getItem("jwtToken");
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
}

// Exporting API functions
export const signUpNgo = async (data) => {
  return axiosInstance(
    await createRequestConfigInstance("POST", url.signupNgo, data)
  )
    .then((response) => response.status === 200 && response.data)
    .catch((error) => {
      throw error;
    });
};

export const signUpUser = async (data) => {
  return axiosInstance(
    await createRequestConfigInstance("POST", url.signupUser, data)
  )
    .then((response) => response.status === 200 && response.data)
    .catch((error) => {
      throw error;
    });
};

export const signIn = async (data) => {
  return axiosInstance(
    await createRequestConfigInstance("GET", url.login, null, data)
  )
    .then(async (response) => {
      if (response.status === 200) {
        const { accesstoken, refreshtoken } = response.data.tokens;
        await AsyncStorage.setItem("refreshToken", refreshtoken);
        await AsyncStorage.setItem("jwtToken", accesstoken);
        return response.data;
      }
    })
    .catch((error) => {
      throw error;
    });
};

export const getNgoBasedOnCategory = async (data) => {
  return axiosInstance(
    await createAuthorizedRequestConfigInstance(
      "GET",
      url.getNgoBasedOnCategoryId,
      null,
      data
    )
  )
    .then((response) => response.status === 200 && response.data)
    .catch((error) => {
      throw error;
    });
};

//for searching NGOs based on the city 
export const getCityResults = async (data) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${data}&language=en&types=(cities)&key=${GOOGLE_API_KEY}`,
      {
        params: {
          components: `country:${COUNTRY_CODE}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//for setting the address
export const getAddressResults = async (data) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(data)}&language=en&key=${GOOGLE_API_KEY}`,
      {
        params: {
          components: `country:${COUNTRY_CODE}`,
        },
      }
    );
    console.log("address", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCategories = async () => {
  return axiosInstance(
    await createAuthorizedRequestConfigInstance("GET", url.getAllCategories)
  )
    .then((response) => response.status === 200 && response.data)
    .catch((error) => {
      throw error;
    });
};

export const getNgoInfo = async (ngoId) => {
  return axiosInstance(
    await createAuthorizedRequestConfigInstance(
      "GET",
      url.getNgoDetailsBasedOnNgoId,
      null,
      { ngoId }
    )
  )
    .then((response) => response.status === 200 && response.data)
    .catch((error) => {
      throw error;
    });
};

export const addNgoEvent = async (data) => {
  return axiosInstance(
    await createRequestConfigInstance("POST", url.addEvent, data)
  )
    .then((response) => response.status === 200 && response.data)
    .catch((err) => {
      throw err;
    });
};

export const addVolunteerToEvent = async (userId, ngoId, eventId) => {
  return axiosInstance(
    await createAuthorizedRequestConfigInstance(
      "POST",
      url.addVolunteer,
      {
        user_id: userId,
        ngo_id: ngoId,
        event_id: eventId,
      },
      null
    )
  )
    .then((response) => response.status === 200 && response.data)
    .catch((err) => {
      throw err;
    });
};

export const removeVolunteerFromEvent = async (userId, ngoId, eventId) => {
  return axiosInstance(
    await createAuthorizedRequestConfigInstance(
      "POST",
      url.removeVolunteer,
      {
        user_id: userId,
        ngo_id: ngoId,
        event_id: eventId,
      },
      null
    )
  )
    .then((response) => response.status === 200 && response.data)
    .catch((err) => {
      throw err;
    });
};

export const getAllVolunteersForEvent = async (eventId) => {
  return axiosInstance(
    await createRequestConfigInstance("GET", url.getVolunteerForEvent, null, {
      event_id: eventId,
    })
  )
    .then((response) => response.status === 200 && response.data)
    .catch((err) => {
      throw err;
    });
};

export const getAllEventsVolunteeredByUser = async (userId) => {
  return axiosInstance(
    await createRequestConfigInstance("GET", url.getEventsForUser, null, {
      user_id: userId,
    })
  )
    .then((response) => response.status === 200 && response.data)
    .catch((err) => {
      throw err;
    });
};

export const getAllEventsByNgoId = async (ngo_id) => {
  return axiosInstance(
    await createAuthorizedRequestConfigInstance(
      "GET",
      url.getAllEventsByNgoId,
      null,
      {
        ngo_id,
      }
    )
  )
    .then((response) => response.status === 200 && response.data)
    .catch((err) => {
      throw err;
    });
};

export const getNgoNames = async (query) => {
  return axiosInstance(
    await createAuthorizedRequestConfigInstance("GET", url.getNgoNames, null, {
      query,
    })
  )
    .then((response) => response.status === 200 && response.data)
    .catch((error) => {
      throw error;
    });
};

//check whether the user is registered for a particular event
export const checkUserRegistration = async (userId, ngoId, eventId) => {
  return axiosInstance(
    await createAuthorizedRequestConfigInstance(
      "POST",
      url.checkUserRegistration,
      {
        user_id: userId,
        ngo_id: ngoId,
        event_id: eventId,
      },
      null
    )
  )
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    })
    .catch((error) => {
      throw error;
    });
};

export const logout = async () => {
  return axiosInstance(
    await createAuthorizedRequestConfigInstance("DELETE", url.logout, null, {})
  )
    .then((response) => {
      response.status === 200 && response.data;
      AsyncStorage.removeItem("jwtToken");
      AsyncStorage.removeItem("refreshToken");
    })
    .catch((error) => {
      throw error;
    });
};
