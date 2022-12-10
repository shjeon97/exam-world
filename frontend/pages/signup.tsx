import Link from "next/link";
import React from "react";
import { useQuery } from "react-query";
import { apiGetMe } from "../api/axios";
import { Toast } from "../lib/sweetalert2/toast";
import { useRouter } from "next/router";
import { WEB_TITLE } from "../constant";
import Head from "next/head";
import { SignupForm } from "../components/forms/signup/SignupForm";
import { Policy } from "../components/policies/Policy";
import Image from "next/image";
import titlePic from "../public/title.png";

const Signup = () => {
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
        <title className=" text-gray-800">회원가입 {WEB_TITLE}</title>
      </Head>
      <section className="flex min-h-screen flex-col items-center justify-center text-gray-600 body-font">
        <div className="container mx-auto flex px-5 py-24 lg:flex-row flex-col items-center">
          <div className="lg:flex-grow lg:w-1/2 lg:pr-24 flex flex-col lg:items-start lg:text-left mb-16 lg:mb-0 items-center text-center">
            <Policy />
          </div>
          <div className="lg:max-w-lg dark:text-gray-100 w-full ">
            <h1 className=" font-bold text-4xl cursor-pointer text-center mb-6">
              <Link href="/">
                <Image src={titlePic} alt="title" width={400} height={200} />
              </Link>
            </h1>
            <h1 className="title-font sm:text-3xl text-2xl mb-4 font-medium text-gray-900">
              회원가입
            </h1>
            <SignupForm />
            <small>
              이미 가입하셨나요?
              <Link href="/login">
                <a className="ml-1 text-blue-500 uppercase ">로그인</a>
              </Link>
            </small>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;
