export const LOCALSTORAGE_TOKEN = "authorization";

export const JwtToken = () =>
  typeof window !== "undefined" ? localStorage.getItem(LOCALSTORAGE_TOKEN) : "";
