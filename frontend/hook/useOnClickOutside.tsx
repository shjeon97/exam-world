import { useEffect } from "react";

export const useOnClickOutside = (ref: any, handler: any) => {
  const handleClick = (event: any) => {
    if (ref.current && !ref.current.contains(event.target)) {
      handler(event);
    }
    handler(event);
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
};
