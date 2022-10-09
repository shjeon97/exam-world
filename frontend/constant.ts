export const LOCAL_STORAGE_TOKEN = "authorization";
export const WEB_TITLE = "Exam World!";
export const JwtToken = () =>
  typeof window !== "undefined"
    ? localStorage.getItem(LOCAL_STORAGE_TOKEN)
    : "";
