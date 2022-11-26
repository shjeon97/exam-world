import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import { apiGetMe } from "../../api/axios";
import { IUserInput } from "../../common/type";
import { UserInfoForm } from "../../components/forms/user/info/UserInfoForm";
import { WEB_TITLE } from "../../constant";
import { Toast } from "../../lib/sweetalert2/toast";

const Info = () => {
  const { isLoading: meIsLoading, data: meData } = useQuery<IUserInput>(
    "me",
    apiGetMe
  );
  let router = useRouter();

  if (!meIsLoading && !meData) {
    Toast.fire({
      icon: "error",
      title: `유저 정보를 찾지 못하였습니다. 다시 로그인 해주세요.`,
      position: "top-end",
      timer: 3000,
    });
    router.push("/login");
  }

  return (
    <>
      <Head>
        <title className=" text-gray-600">내 정보 {WEB_TITLE}</title>
      </Head>
      {!meIsLoading && meData && (
        <>
          <div className="p-10  m-5 h-screen">
            <div className="flex flex-col items-center">
              <h1 className="mb-2 font-medium text-2xl ">내 정보</h1>
              <div>
                <UserInfoForm />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Info;
