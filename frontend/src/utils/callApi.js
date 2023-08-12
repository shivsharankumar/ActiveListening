/**
 * The above function is a helper function for making API calls using Axios in JavaScript, including
 * handling CSRF token and logging the response.
 * @returns The function `callAPI` returns the data received from the API call.
 */
import Axios from "axios";
import { API_HOST } from "./constants";
let csrfToken = null;

Axios.defaults.withCredentials = true;
Axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
Axios.defaults.xsrfCookieName = "csrftoken";
async function getCsrfToken() {
  const response = await Axios.get(`${API_HOST}/csrf/`, {});
  csrfToken = response.csrfToken;
  return csrfToken;
}

export default async function callAPI(method, route, body, signal) {
  let response;
  if (method === "POST") {
    try {
      Axios.defaults.headers.common["X-CSRFTOKEN"] = await getCsrfToken();
      response = await Axios.post(`${API_HOST}/${route}`, body);

      console.log(response);
    } catch (error) {
      response = { data: { msg: "fail" } };
    }
  } else if (method === "GET") {
    response = await Axios.get(`${API_HOST}/${route}`, {
      signal,
    });
    console.log(response);
  }

  const data = await response.data;
  return data;
}
