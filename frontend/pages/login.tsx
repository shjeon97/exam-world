import classNames from "classnames";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { apiLogin } from "../common/api/axios";
import { ILoginInput, ILoginOutput } from "../common/type";
import { FormButton } from "../components/form-button";
import { FormError } from "../components/form-error";
import { Toast } from "../lib/sweetalert2/toast";

const Login = () => {
  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<ILoginInput>({ mode: "onChange" });

  const loginMutation = useMutation(apiLogin, {
    onSuccess: (data: ILoginOutput) => {
      if (data.ok) {
        Toast.fire({
          icon: "success",
          title: data.token,
          position: "top-end",
        });
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
  );
};

export default Login;
