import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { FormError } from "../components/forms/FormError";
import classnames from "classnames";
import { useMutation, useQuery } from "react-query";
import { ICoreOutput, IRegisterUserInput } from "../common/type";
import { apiGetMe, apiRegisterUser } from "../api/axios";
import { Toast } from "../lib/sweetalert2/toast";
import { FormButton } from "../components/forms/FormButton";
import { useRouter } from "next/router";
import { WEB_TITLE } from "../constant";
import Head from "next/head";
import { RegisterForm } from "../components/forms/register/RegisterForm";

const Register = () => {
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
      <div className=" bg-white">
        <div className="flex flex-col items-center justify-center h-screen p-6">
          <div className=" w-10/12 mx-auto md:w-96">
            <h1 className="mb-2 font-medium text-2xl">회원가입</h1>
            <RegisterForm />s
            <small>
              이미 가입하셨나요?
              <Link href="/login">
                <a className="ml-1 text-blue-500 uppercase ">로그인</a>
              </Link>
            </small>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
