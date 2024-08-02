import { CapacitorHttp } from "@capacitor/core";
import { getCookie } from "./$cookies";

const formatlink = (str) => (str.startsWith("/") ? str : "/" + str);

export const $http = async (
  url,
  options = {
    method: "GET",
    headers: {},
    params: {},
  }
) => {
  try {
    const response = await CapacitorHttp.request({
      url,
      ...options,
    });

    // Check for HTTP error status codes
    if (response.status >= 400) {
      const error = new Error(
        `HTTP error! Status: ${response.status} :${response.data.message}`
      );
      error.response = response;
      throw error;
    }

    return response; // Return the response to be handled in the then/catch blocks
  } catch (error) {
    throw error; // Re-throw the error to be handled in the catch block
  }
};

export const $api = async (
  url,
  options = {
    method: "GET",
    headers: {},
    params: {},
  }
) => {
  const token = getCookie("token");
  try {
    const response = await CapacitorHttp.request({
      url: "http://127.0.0.1:8000/api" + formatlink(url),
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    // Check for HTTP error status codes
    if (response.status >= 400) {
      const error = new Error(
        `HTTP error! Status: ${response.status} : ${response.data.message}`
      );
      error.response = response;
      throw error;
    }

    return response; // Return the response to be handled in the then/catch blocks
  } catch (error) {
    throw error; // Re-throw the error to be handled in the catch block
  }
};
