// src/api/axios.js
import axios from "axios";
import { useMemo } from "react";

const useAxios = (authTokens) => {
  return useMemo(() => {
    return axios.create({
      baseURL: "http://localhost:8000",
      headers: {
        Authorization: authTokens ? `Bearer ${authTokens.access}` : undefined,
      },
    });
  }, [authTokens?.access]);
};

export default useAxios;
