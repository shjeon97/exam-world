import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { apiGetMe } from "../api/axios";
import { IUserInput } from "../common/type";
import { LOCAL_STORAGE_TOKEN } from "../constant";
import { Toast } from "../lib/sweetalert2/toast";

export const useMe = () => {
  let router = useRouter();
  useEffect(() => {
    const jwtToken = localStorage.getItem(LOCAL_STORAGE_TOKEN);
    if (!jwtToken) {
      Toast.fire({
        icon: "error",
        title: `유저 정보를 찾지 못하였습니다. 다시 로그인 해주세요.`,
        position: "top-end",
        timer: 3000,
      });
      router.push("/login");
    }
  }, []);

  const { isLoading, data } = useQuery<IUserInput>("me", apiGetMe);

  if (!isLoading && !data) {
    Toast.fire({
      icon: "error",
      title: `유저 정보를 찾지 못하였습니다. 다시 로그인 해주세요.`,
      position: "top-end",
      timer: 3000,
    });
    router.push("/login");
  }

  return { data, isLoading };
};
