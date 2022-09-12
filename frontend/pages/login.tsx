import classNames from "classnames";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { apiLogin, apiGetMe } from "../common/api/axios";
import { ILoginInput, ILoginOutput } from "../common/type";
import { FormButton } from "../components/form-button";
import { FormError } from "../components/form-error";
import { LOCALSTORAGE_TOKEN, WEB_TITLE } from "../constant";
import { Toast } from "../lib/sweetalert2/toast";

const Login = () => {
  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<ILoginInput>({ mode: "onChange" });
  let router = useRouter();
  const queryClient = useQueryClient();
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

  const loginMutation = useMutation(apiLogin, {
    onSuccess: (data: ILoginOutput) => {
      if (data.ok && data.token) {
        localStorage.setItem(LOCALSTORAGE_TOKEN, data.token);
        queryClient.invalidateQueries("me");
      }
    },
  });

  const registerOption = {
    email: { required: "사용할 이메일 입력해 주세요." },
    password: { required: "사용할 비밀번호를 입력해 주세요." },
  };

  const onSubmit = () => {
    if (!loginMutation.isLoading) {
      const signupUser = getValues();
      loginMutation.mutate(signupUser);
    }
  };

  return (
    <>
      <Head>
        <title className=" text-gray-800">로그인 {WEB_TITLE}</title>
      </Head>
      <div className=" bg-white">
        <div className="flex flex-col items-center justify-center h-screen p-6">
          <div className=" w-10/12 mx-auto md:w-96">
            <h1 className="mb-2 font-medium text-2xl">로그인</h1>
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <input
                  type={"email"}
                  className={classNames(`form-input`, {
                    "border-red-500 focus:border-red-500 focus:outline-red-500":
                      errors.email,
                  })}
                  {...register("email", registerOption.email)}
                  placeholder="이메일"
                />

                <input
                  type={"password"}
                  className={classNames(`form-input`, {
                    "border-red-500 focus:border-red-500 focus:outline-red-500":
                      errors.password,
                  })}
                  {...register("password", registerOption.password)}
                  placeholder="비밀번호"
                />

                {Object.values(errors).length > 0 &&
                  Object.values(errors).map((error, key) => {
                    return (
                      <div key={`form_error_${key}`}>
                        <FormError errorMessage={error.message} />
                        <br />
                      </div>
                    );
                  })}
                <FormButton
                  canClick={isValid}
                  loading={loginMutation.isLoading}
                  actionText={"로그인"}
                />
                {loginMutation?.data?.error && (
                  <FormError errorMessage={loginMutation.data.error} />
                )}
              </form>

              <small>
                아직 아이디가 없나요?
                <Link href="/signup">
                  <a className="ml-1 text-blue-500 uppercase ">회원가입</a>
                </Link>
              </small>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
