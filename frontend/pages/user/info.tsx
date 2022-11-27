import Head from "next/head";
import React from "react";
import { UserInfoForm } from "../../components/forms/user/info/UserInfoForm";
import { WEB_TITLE } from "../../constant";
import { useMe } from "../../hooks/useMe";

const Info = () => {
  const { isLoading, data } = useMe();

  return (
    <>
      <Head>
        <title className=" text-gray-600">내 정보 {WEB_TITLE}</title>
      </Head>
      {!isLoading && data && (
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
