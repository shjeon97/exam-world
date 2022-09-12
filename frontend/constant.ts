export const LOCALSTORAGE_TOKEN = "authorization";
export const WEB_TITLE = "Exam World!";
export const JwtToken = () =>
  typeof window !== "undefined" ? localStorage.getItem(LOCALSTORAGE_TOKEN) : "";
