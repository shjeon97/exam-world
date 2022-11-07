import { useEffect, useState } from "react";

export const useInfiniteScroll = (isLoading: boolean) => {
  const [isScrollBottom, setIsScrollBottom] = useState(false);
  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight && isLoading) {
      return setIsScrollBottom(scrollTop + clientHeight >= scrollHeight);
    }
  };

  useEffect(() => {
    // scroll event listener 등록
    window.addEventListener("scroll", handleScroll);
    return () => {
      // scroll event listener 해제
      window.removeEventListener("scroll", handleScroll);
    };
  });
  return isScrollBottom;
};
