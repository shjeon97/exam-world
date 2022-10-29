export const LOCAL_STORAGE_TOKEN = "authorization";
export const WEB_TITLE = "Exam World!";

export const JwtToken = () =>
  typeof window !== "undefined"
    ? localStorage.getItem(LOCAL_STORAGE_TOKEN)
    : "";
// 기본 게시물 페이지 번호
export const Page = 1;
// 기본 게시물 개수
export const PageSize = 5;
