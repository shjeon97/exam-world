import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import { apiGetMe } from "../api/axios";
import { LgoinForm } from "../components/forms/login/LoginForm";
import { WEB_TITLE } from "../constant";
import { Toast } from "../lib/sweetalert2/toast";

const Login = () => {
  let router = useRouter();
  useQuery("me", apiGetMe, {
    onSuccess: (data) => {
      if (data) {
        Toast.fire({
          icon: "success",
          title: `${data.name}님 방문을 환영합니다.`,
          position: "top-end",
          timer: 1200,
        });
        router.push("/");
      }
    },
  });

  return (
    <>
      <Head>
        <title className=" text-gray-800">로그인 {WEB_TITLE}</title>
      </Head>
      <div className=" bg-white">
        <div className="flex flex-col items-center justify-center h-screen p-6">
          <div className=" w-10/12 mx-auto md:w-96">
            <h1 className="mb-2 font-medium text-2xl">로그인</h1>
            <LgoinForm />
            <small>
              아직 아이디가 없나요?
              <Link href="/signup">
                <a className="ml-1 text-blue-500 uppercase ">회원가입</a>
              </Link>
            </small>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
