import Axios, { AxiosError } from "axios";
import { SingletonRouter } from "next/router";

const defaultConfig = { baseURL: "/api" };
const defaultTwitchConfig = { baseURL: "https://api.twitch.tv" };

export function createJwtAxios(router: SingletonRouter, authToken: string) {
  const newAxios = Axios.create(defaultConfig);

  newAxios.interceptors.request.use(function (request) {
    request.headers = {
      Authorization: `Bearer ${authToken}`,
    };

    return request;
  });

  newAxios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error: AxiosError) {
      console.log("auth error response", error);

      if (error.response?.status === 401) {
        router.push("/logged-out");
      }
    }
  );

  return newAxios;
}

export function createTwitchAxios(
  router: SingletonRouter,
  twitchToken: string
) {
  const newAxios = Axios.create(defaultTwitchConfig);

  newAxios.interceptors.request.use(function (request) {
    request.headers = {
      Authorization: `Bearer ${twitchToken}`,
      "Client-ID": process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID || "",
    };
    return request;
  });

  newAxios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error: AxiosError) {
      console.log("twitch error response", error);
      if (error.response?.status === 401) {
        router.push("/logged-out");
      }
    }
  );

  return newAxios;
}
