import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import { apiGetMe } from "../api/axios";
import { LoginForm } from "../components/forms/login/LoginForm";
import { WEB_TITLE } from "../constant";
import { Toast } from "../lib/sweetalert2/toast";
import titlePic from "../public/title.png";

const Login = () => {
  let router = useRouter();
  useQuery("me", apiGetMe, {
    onSuccess: (data) => {
      if (data) {
        Toast.fire({
          icon: "success",
          title: `${data.nickname}님 방문을 환영합니다.`,
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
        <title className=" text-gray-700">로그인 {WEB_TITLE}</title>
      </Head>
      <div className=" dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center h-screen p-6">
          <div className=" w-10/12 mx-auto md:w-96">
            <h1 className=" font-bold dark:text-gray-100 text-gray-700 text-3xl cursor-pointer text-center">
              <Link href="/">
                <Image src={titlePic} alt="title" />
              </Link>
            </h1>
            <br />
            <h1 className="mb-2 font-medium text-2xl">로그인</h1>
            <LoginForm />
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
