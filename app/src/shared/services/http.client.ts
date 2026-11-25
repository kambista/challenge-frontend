import { create } from "axios";

export const apiClient = create({
  baseURL: "https://api.kambista.com/v1",
  timeout: 15_000,
  headers: {
    Accept: "application/json",
  },
});
